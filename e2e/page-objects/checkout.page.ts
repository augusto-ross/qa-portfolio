import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.page.fill('[data-test="firstName"]', firstName);
    await this.page.fill('[data-test="lastName"]', lastName);
    await this.page.fill('[data-test="postalCode"]', postalCode);
  }

  async continue() {
    await this.page.click('[data-test="continue"]');
  }

  async finish() {
    await this.page.click('[data-test="finish"]');
  }

  async getConfirmationHeader(): Promise<string> {
    return this.page.locator('.complete-header').innerText();
  }

  async getErrorMessage(): Promise<string> {
    return this.page.locator('[data-test="error"]').innerText();
  }

  async getOrderTotal(): Promise<string> {
    return this.page.locator('.summary_total_label').innerText();
  }
}
