import { test, expect } from '../fixtures/auth.fixture';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard_user can log in successfully', async ({ page, loginPage }) => {
    await loginPage.loginAs('standard_user');
    await expect(page).toHaveURL('/inventory.html');
  });

  test('locked_out_user sees error message', async ({ loginPage }) => {
    await loginPage.loginAs('locked_out_user');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('invalid credentials show error', async ({ loginPage }) => {
    await loginPage.loginAs('not_a_user', 'wrong_pass');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('empty username shows error', async ({ loginPage }) => {
    await loginPage.loginAs('', 'secret_sauce');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });
});
