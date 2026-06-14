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

  test('completes a full purchase successfully', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('Jane', 'Doe', '12345');
    await checkout.continue();
    await checkout.finish();
    const header = await checkout.getConfirmationHeader();
    expect(header).toContain('Thank you for your order');
  });

  test('missing first name shows validation error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('', 'Doe', '12345');
    await checkout.continue();
    const error = await checkout.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('missing postal code shows validation error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('Jane', 'Doe', '');
    await checkout.continue();
    const error = await checkout.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  test('order total is displayed on overview page', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('Jane', 'Doe', '12345');
    await checkout.continue();
    const total = await checkout.getOrderTotal();
    expect(total).toMatch(/Total: \$/);
  });
});
