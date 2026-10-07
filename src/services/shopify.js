/** Public Storefront API only. Never use a Shopify Admin API token here. */
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
export const shopifyConfigured = Boolean(domain && token);
export async function storefront(query, variables = {}) {
  if (!shopifyConfigured) throw new Error('Shopify connection is not configured.');
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain)) throw new Error('Invalid Shopify store domain.');
  const response = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: 'POST',
    signal: AbortSignal.timeout(15000),
    headers: {'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token},
    body: JSON.stringify({query, variables}),
  });
  if (!response.ok) throw new Error(`Shopify request failed (${response.status}).`);
  const result = await response.json();
  if (result.errors?.length) throw new Error(result.errors.map(error => error.message).join('; '));
  return result.data;
}
const productFields = `id handle title description descriptionHtml availableForSale
  images(first: 20) { nodes { url altText width height } }
  options { name values }
  collections(first: 10) { nodes { handle title } }
  variants(first: 100) { pageInfo { hasNextPage } nodes { id title availableForSale selectedOptions { name value } price { amount currencyCode } image { url altText } } }`;
export async function fetchShopifyProducts() {
  const result = await storefront(`query Catalog { products(first: 100) { nodes { ${productFields} } pageInfo { hasNextPage } } shop { name } }`);
  if (result.products.pageInfo.hasNextPage) throw new Error('Catalog exceeds the current 100-product integration limit.');
  return result.products.nodes;
}
export async function createCheckout(lines) {
  if (!lines.length || lines.some(line => !line.merchandiseId || !Number.isInteger(line.quantity) || line.quantity < 1)) throw new Error('Choose valid product options before checkout.');
  const result = await storefront(`mutation Checkout($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl } userErrors { field message } } }`, {input: {lines}});
  if (result.cartCreate.userErrors.length) throw new Error(result.cartCreate.userErrors.map(error => error.message).join('; '));
  if (!result.cartCreate.cart?.checkoutUrl) throw new Error('Shopify did not return a checkout URL.');
  const url = new URL(result.cartCreate.cart.checkoutUrl);
  if (url.protocol !== 'https:') throw new Error('Shopify returned an invalid checkout URL.');
  return result.cartCreate.cart;
}
export function normalizeProduct(product) {
  if (product.variants.pageInfo?.hasNextPage) throw new Error(`Product ${product.handle} exceeds the supported variant limit.`);
  const variants = product.variants.nodes;
  const first = variants.find(variant => variant.availableForSale) || variants[0];
  if (!first) throw new Error(`Product ${product.handle} has no variants.`);
  const known = ['rooted', 'mountains', 'made-new'];
  const memberships = product.collections.nodes.map(collection => collection.handle).filter(handle => known.includes(handle));
  return {
    id: product.handle, shopifyId: product.id, live: true, name: product.title,
    description: product.description, images: product.images.nodes,
    price: Number(first.price.amount), currency: first.price.currencyCode,
    collection: memberships[0] || 'shop', memberships,
    color: first.selectedOptions.find(option => /colou?r/i.test(option.name))?.value || '',
    options: product.options, variants, available: product.availableForSale,
  };
}
