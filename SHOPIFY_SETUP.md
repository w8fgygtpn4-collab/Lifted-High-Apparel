# Connect Lifted High to Shopify

Store: `y26tvi-rw.myshopify.com`

The website remains on Netlify. Shopify supplies published products, variant prices, availability, and secure checkout. Printify connects to Shopify for fulfillment, not directly to this website.

## Shopify

1. Install Shopify's official **Headless** sales channel: https://apps.shopify.com/headless
2. Open Headless and create a storefront for Lifted High's Netlify website.
3. Under that storefront's Storefront API settings, enable product/collection reading and cart/checkout access. Use the **public Storefront API access token** for this browser-based website. Never use a Shopify Admin API token or a private Storefront token.
4. Publish your Printify products to Shopify, then make the products active and available to the Headless sales channel/storefront. Publishing only to Online Store is insufficient.
5. For collection navigation, create Shopify collections with handles `rooted`, `mountains`, and `made-new`. Add the appropriate products and make the collections available to the Headless channel. Other published products still appear in Shop all without being assigned to one of these brand collections.
6. Configure Shopify payments, shipping rates, policies, and Printify order approval/fulfillment settings before accepting orders. This code does not configure those services.

## Netlify

In your site's **Project configuration → Environment variables**, add:

| Key | Value |
| --- | --- |
| `VITE_SHOPIFY_STORE_DOMAIN` | `y26tvi-rw.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | The **public** token from the Headless storefront |

Apply them to the production **build** context. Vite embeds these values at build time; a public Storefront token is designed for the browser, and is visible to customers. Never paste an Admin or private token here or in chat.

Then trigger a new production deploy from the Deploys page. Adding variables does not change an existing build. No webhook is required for catalog updates: each page load fetches the current published Shopify catalog.

## Verify the live connection

- Open Shop all and confirm your actual product names, photos, prices, and options appear.
- Check each brand collection and one product with several sizes/colors.
- Select an available variant, add it to the bag, and confirm its price and quantity.
- Select an unavailable variant and confirm Add to Bag is disabled.
- Click Secure Checkout and confirm the exact variant and quantity appear at Shopify's checkout. Stop before payment unless deliberately placing a Shopify test order.
- Separately verify shipping, tax, payment configuration, policies, and Printify fulfillment before accepting customer orders.

If no products appear, check publication to the Headless channel first. If the shop displays “We’ll be right back,” check the domain, public token, API permissions, and redeploy after fixing build variables. Configured API failures never show sample products.

## Development and limitations

Copy `.env.example` to ignored `.env.local` and enter the same public configuration there for local integration. Restart Vite after changes. Do not commit credentials.

`npm test` tests the preview storefront without Shopify variables. `npm run test:shopify` starts a separate Vite server and exercises simulated Shopify responses: live product/variant rendering, sold-out controls, persisted variant cart, checkout payloads, and API errors. These tests do not establish access to the actual merchant store.

The small launch catalog supports up to 100 published products and 100 variants per product (the launch is expected to have 8–10 products). The local bag stores Shopify variant IDs; Shopify validates the final order and prices when creating checkout. Quantity is not reserved while browsing. Customer accounts and email marketing are not connected by this integration.

Live-store validation is pending Storefront credentials and network access in the cloud development environment. Netlify configuration and deployment must be confirmed separately.
