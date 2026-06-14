/**
 * Cart feature tests — validates item persistence, removal, and cross-navigation state.
 *
 * Tests perform full user flows (add → navigate → verify) to ensure cart state is
 * maintained by the application, not just held in memory during a single page visit.
 */
import { test, expect } from '../fixtures/auth.fixture';
import { CartPage } from '../page-objects/cart.page';

test.describe('Cart', () => {
  // An item added from inventory must appear in the cart by name, confirming the correct product is stored.
  test('added product appears in cart', async ({ page, loggedInPage }) => {
    const names = await loggedInPage.getSortedProductNames();
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.goToCart();
    const cart = new CartPage(page);
    const cartItems = await cart.getItemNames();
    expect(cartItems).toContain(names[0]);
  });

  // Removing the only item must leave the cart at 0 — ensuring no ghost entries remain after removal.
  test('removing an item from cart empties it', async ({ page, loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.goToCart();
    const cart = new CartPage(page);
    await cart.removeByIndex(0);
    const count = await cart.getItemCount();
    expect(count).toBe(0);
  });

  // Returning to inventory from the cart must keep the badge count intact, verifying session-level persistence.
  test('cart persists across navigation', async ({ page, loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.goToCart();
    const cart = new CartPage(page);
    await cart.continueShopping();
    const badge = await loggedInPage.getCartCount();
    expect(badge).toBe('1');
  });
});
