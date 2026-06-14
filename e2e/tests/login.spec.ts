/**
 * Login feature tests — covers the full authentication surface of SauceDemo.
 *
 * Validates the happy path (successful login + redirect), account-level blocking
 * (locked_out_user), credential mismatch, and empty-field validation. Each case
 * produces a distinct user-visible error, so they are tested independently.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // Valid credentials must redirect to inventory, confirming the auth session is established.
  test('standard_user can log in successfully', async ({ page, loginPage }) => {
    await loginPage.loginAs('standard_user');
    await expect(page).toHaveURL('/inventory.html');
  });

  // A locked account must be blocked at the login gate with an explicit message, not silently redirected.
  test('locked_out_user sees error message', async ({ loginPage }) => {
    await loginPage.loginAs('locked_out_user');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  // Wrong password must surface a credential-specific message so users know the issue isn't a system error.
  test('invalid credentials show error', async ({ loginPage }) => {
    await loginPage.loginAs('not_a_user', 'wrong_pass');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  // Empty username must be caught with a field-specific validation message before any auth request is made.
  test('empty username shows error', async ({ loginPage }) => {
    await loginPage.loginAs('', 'secret_sauce');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });
});
