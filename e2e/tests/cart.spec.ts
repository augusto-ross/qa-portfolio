import { test, expect } from '../fixtures/auth.fixture';
import { CartPage } from '../page-objects/cart.page';

test.describe('Cart', () => {
  test('added product appears in cart', async ({ page, loggedInPage }) => {
    const names = await loggedInPage.getSortedProductNames();
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.goToCart();
    const cart = new CartPage(page);
    const cartItems = await cart.getItemNames();
    expect(cartItems).toContain(names[0]);
  });

  test('removing an item from cart empties it', async ({ page, loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.goToCart();
    const cart = new CartPage(page);
    await cart.removeByIndex(0);
    const count = await cart.getItemCount();
    expect(count).toBe(0);
  });

  test('cart persists across navigation', async ({ page, loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.goToCart();
    const cart = new CartPage(page);
    await cart.continueShopping();
    const badge = await loggedInPage.getCartCount();
    expect(badge).toBe('1');
  });
});
