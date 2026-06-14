/**
 * Checkout flow tests — covers the complete purchase path and required-field validation.
 *
 * A beforeEach hook adds an item to the cart and navigates to the info-entry step
 * so each test starts at the same point. Tests cover the happy path through to
 * order confirmation, two required-field errors, and the order total display.
 */
import { test, expect } from '../fixtures/auth.fixture';
import { CartPage } from '../page-objects/cart.page';
import { CheckoutPage } from '../page-objects/checkout.page';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page, loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.goToCart();
    const cart = new CartPage(page);
    await cart.checkout();
  });

  // End-to-end purchase: fill info → review → finish. Confirmation header is the signal the order was accepted.
  test('completes a full purchase successfully', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('Jane', 'Doe', '12345');
    await checkout.continue();
    await checkout.finish();
    const header = await checkout.getConfirmationHeader();
    expect(header).toContain('Thank you for your order');
  });

  // Empty first name must block navigation to the order overview with a field-specific error message.
  test('missing first name shows validation error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('', 'Doe', '12345');
    await checkout.continue();
    const error = await checkout.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  // Empty postal code must identify the specific missing field so the user knows exactly what to fix.
  test('missing postal code shows validation error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('Jane', 'Doe', '');
    await checkout.continue();
    const error = await checkout.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  // Order total must be visible on the review page before the user commits to the purchase.
  test('order total is displayed on overview page', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('Jane', 'Doe', '12345');
    await checkout.continue();
    const total = await checkout.getOrderTotal();
    expect(total).toMatch(/Total: \$/);
  });
});
