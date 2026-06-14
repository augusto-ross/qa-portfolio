import { test, expect } from '../fixtures/auth.fixture';

test.describe('Inventory', () => {
  test('products are sorted A-Z by default', async ({ loggedInPage }) => {
    const names = await loggedInPage.getSortedProductNames();
    expect(names).toEqual([...names].sort());
  });

  test('sorting Z-A reverses the product list', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('za');
    const names = await loggedInPage.getSortedProductNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('clicking a product opens its detail page', async ({ page, loggedInPage }) => {
    const firstName = (await loggedInPage.getSortedProductNames())[0];
    await loggedInPage.openProductByIndex(0);
    const detailName = await loggedInPage.getProductDetailName();
    expect(detailName).toBe(firstName);
  });

  test('adding a product updates the cart badge', async ({ loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    const count = await loggedInPage.getCartCount();
    expect(count).toBe('1');
  });
});
