import {test,expect} from '@playwright/test';
const variants=[{id:'gid://shopify/ProductVariant/1',title:'M / Forest',availableForSale:true,selectedOptions:[{name:'Size',value:'M'},{name:'Color',value:'Forest'}],price:{amount:'34.50',currencyCode:'USD'},image:null},{id:'gid://shopify/ProductVariant/2',title:'L / Forest',availableForSale:true,selectedOptions:[{name:'Size',value:'L'},{name:'Color',value:'Forest'}],price:{amount:'36.50',currencyCode:'USD'},image:null},{id:'gid://shopify/ProductVariant/3',title:'M / Bone',availableForSale:false,selectedOptions:[{name:'Size',value:'M'},{name:'Color',value:'Bone'}],price:{amount:'34.50',currencyCode:'USD'},image:null}];
const product={id:'gid://shopify/Product/1',handle:'real-rooted-tee',title:'Real Rooted Tee',description:'Actual Shopify description.',availableForSale:true,images:{nodes:[{url:'/images/forest.webp',altText:'Actual product photograph'},{url:'/images/lake.webp',altText:'Second product photograph'}]},collections:{nodes:[{handle:'rooted',title:'Rooted'}]},options:[{name:'Size',values:['M','L']},{name:'Color',values:['Forest','Bone']}],variants:{nodes:variants}};
async function mockCatalog(page,onCheckout){await page.route('https://y26tvi-rw.myshopify.com/api/**',async route=>{const payload=route.request().postDataJSON();if(payload.query.includes('mutation Checkout')){onCheckout?.(payload);await route.fulfill({json:{data:{cartCreate:{cart:{id:'gid://shopify/Cart/1',checkoutUrl:'https://y26tvi-rw.myshopify.com/checkouts/test'},userErrors:[]}}}})}else await route.fulfill({json:{data:{products:{nodes:[product],pageInfo:{hasNextPage:false}},shop:{name:'LHA'}}}})});}
test('real catalog, variant price, sold-out controls and Shopify checkout',async({page})=>{
 let checkout;
 await mockCatalog(page,payload=>checkout=payload);
 await page.route('https://y26tvi-rw.myshopify.com/checkouts/test',route=>route.fulfill({contentType:'text/html',body:'<h1>Shopify checkout</h1>'}));
 await page.goto('/rooted');await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('.product-card')).toContainText('$34.50');
 await page.locator('.product-card').click();await expect(page.getByText('Actual Shopify description.')).toBeVisible();
 await page.selectOption('#option-Color','Bone');await expect(page.getByRole('button',{name:'SOLD OUT'})).toBeDisabled();
 await page.selectOption('#option-Size','L');await expect(page.getByRole('button',{name:'UNAVAILABLE COMBINATION'})).toBeDisabled();
 await page.selectOption('#option-Color','Forest');await expect(page.locator('.price')).toHaveText('$36.50');
 await page.getByRole('button',{name:'Show product image 2'}).click();await expect(page.locator('.detail-image img')).toHaveAttribute('alt','Second product photograph');
 await page.getByRole('button',{name:'Increase quantity',exact:true}).click();await page.getByRole('button',{name:'ADD TO BAG'}).click();await expect(page.locator('.cart-bottom')).toContainText('$73.00');
 await page.getByRole('button',{name:'Close shopping bag'}).click();await page.reload();await page.getByRole('button',{name:'Open shopping bag, 2 items'}).click();
 await page.getByRole('button',{name:'SECURE CHECKOUT'}).click();await expect(page.getByRole('heading',{name:'Shopify checkout'})).toBeVisible();
 expect(checkout.variables.input.lines).toEqual([{merchandiseId:variants[1].id,quantity:2}]);
});
test('catalog failures show an error rather than selling preview merchandise',async({page})=>{
 await page.route('https://y26tvi-rw.myshopify.com/api/**',route=>route.fulfill({status:401,json:{errors:[{message:'Unauthorized'}]}}));await page.goto('/shop');await expect(page.getByRole('heading',{name:'We’ll be right back.'})).toBeVisible();await expect(page.locator('.product-card')).toHaveCount(0);
});
test('checkout errors keep the bag and show a retry message',async({page})=>{
 await mockCatalog(page);await page.goto('/products/real-rooted-tee');await page.getByRole('button',{name:'ADD TO BAG'}).click();
 await page.route('https://y26tvi-rw.myshopify.com/api/**',route=>route.fulfill({json:{data:{cartCreate:{cart:null,userErrors:[{message:'Variant unavailable',field:['input','lines']}]}}}}));
 await page.getByRole('button',{name:'SECURE CHECKOUT'}).click();await expect(page.getByRole('alert')).toContainText('Your bag is saved');await expect(page.locator('.cart-item')).toHaveCount(1);await expect(page.getByRole('button',{name:'SECURE CHECKOUT'})).toBeEnabled();
});
