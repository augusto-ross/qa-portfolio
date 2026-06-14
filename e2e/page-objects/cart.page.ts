import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async removeByIndex(index: number) {
    const buttons = this.page.locator('[data-test^="remove"]');
    await buttons.nth(index).click();
  }

  async getItemCount(): Promise<number> {
    return this.page.locator('.cart_item').count();
  }

  async checkout() {
    await this.page.click('[data-test="checkout"]');
  }

  async continueShopping() {
    await this.page.click('[data-test="continue-shopping"]');
  }
}
