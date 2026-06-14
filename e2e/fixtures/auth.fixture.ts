import { test as base } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { InventoryPage } from '../page-objects/inventory.page';

type AuthFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  loggedInPage: InventoryPage;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('standard_user');
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
