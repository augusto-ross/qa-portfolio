import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async loginAs(username: string, password = 'secret_sauce') {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  async getErrorMessage(): Promise<string> {
    return this.page.locator('[data-test="error"]').innerText();
  }
}
