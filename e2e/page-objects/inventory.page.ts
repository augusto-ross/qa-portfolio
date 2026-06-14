import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async getSortedProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.selectOption('.product_sort_container', option);
  }

  async addToCartByIndex(index: number) {
    const buttons = this.page.locator('[data-test^="add-to-cart"]');
    await buttons.nth(index).click();
  }

  async getCartCount(): Promise<string> {
    return this.page.locator('.shopping_cart_badge').innerText();
  }

  async goToCart() {
    await this.page.click('.shopping_cart_link');
  }

  async openProductByIndex(index: number) {
    const items = this.page.locator('.inventory_item_name');
    await items.nth(index).click();
  }

  async getProductDetailName(): Promise<string> {
    return this.page.locator('.inventory_details_name').innerText();
  }
}
