/**
 * Inventory page tests — validates product listing, sorting, navigation, and cart integration.
 *
 * All tests start with a pre-authenticated session via the loggedInPage fixture.
 * Sorting tests verify that user interactions change the displayed order correctly;
 * the cart badge test confirms the header counter updates in real time after adding an item.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Inventory', () => {
  // Default sort must be alphabetical so users see a predictable listing on first load.
  test('products are sorted A-Z by default', async ({ loggedInPage }) => {
    const names = await loggedInPage.getSortedProductNames();
    expect(names).toEqual([...names].sort());
  });

  // Z-A must produce the exact reverse of A-Z order, not an arbitrary reorder.
  test('sorting Z-A reverses the product list', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('za');
    const names = await loggedInPage.getSortedProductNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  // Product name on the listing must match the detail page — a mismatch signals a routing or data-binding bug.
  test('clicking a product opens its detail page', async ({ page, loggedInPage }) => {
    const firstName = (await loggedInPage.getSortedProductNames())[0];
    await loggedInPage.openProductByIndex(0);
    const detailName = await loggedInPage.getProductDetailName();
    expect(detailName).toBe(firstName);
  });

  // Cart badge must update immediately after adding an item, providing real-time feedback without a reload.
  test('adding a product updates the cart badge', async ({ loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    const count = await loggedInPage.getCartCount();
    expect(count).toBe('1');
  });
});
