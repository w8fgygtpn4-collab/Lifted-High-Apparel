import {test,expect} from '@playwright/test';
test('collections, product options and persistent cart',async({page})=>{
 await page.goto('/');await expect(page.locator('h1')).toContainText('LIFTED');
 await page.getByRole('link',{name:'SHOP THE COLLECTION',exact:true}).click();
 await expect(page.locator('.product-card')).toHaveCount(8);
 await page.getByRole('button',{name:'ROOTED',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(3);
 await page.locator('.product-card').first().click();
 await page.getByRole('button',{name:'L',exact:true}).click();await page.selectOption('#color','Bone');
 await page.getByRole('button',{name:'Increase quantity',exact:true}).click();
 await page.getByRole('button',{name:'ADD TO BAG'}).click();
 await expect(page.getByRole('dialog',{name:'Shopping bag'})).toContainText('Bone · L');
 await expect(page.locator('.cart-bottom')).toContainText('$68');
 await page.getByRole('button',{name:'Close shopping bag'}).click();await page.reload();
 await page.getByRole('button',{name:'Open shopping bag, 2 items'}).click();
 await expect(page.locator('.cart-item')).toHaveCount(1);
 await page.getByRole('button',{name:'Decrease Rooted Heavyweight Tee quantity'}).click();
 await expect(page.locator('.cart-bottom')).toContainText('$34');
});
test('search, collection pages, signup and responsive layout',async({page},testInfo)=>{
 await page.goto('/');await page.getByRole('button',{name:'Search products'}).click();
 await page.getByPlaceholder('Search tees, layers, collections…').fill('made new');
 await expect(page.locator('.search-results a')).toHaveCount(1);await page.keyboard.press('Escape');
 for(const slug of ['rooted','mountains','made-new']){await page.goto('/'+slug);await expect(page.locator('.product-card').first()).toBeVisible();}
 await page.goto('/our-story');await expect(page.locator('h1')).toContainText('Faith goes');
 await page.getByRole('textbox',{name:'Email address'}).fill('test@example.com');await page.getByRole('button',{name:'Join the email list'}).click();await expect(page.getByRole('status')).toContainText('local preview list');
 await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 if(testInfo.project.name==='mobile'){await page.getByRole('button',{name:'Open navigation'}).click();await expect(page.getByRole('dialog',{name:'Navigation'})).toBeVisible();await page.keyboard.press('Escape');}
 await page.locator('img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
 await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0));
 await page.screenshot({path:`/tmp/lha-${testInfo.project.name}.png`,fullPage:true});
});
