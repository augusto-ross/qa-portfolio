import { test, expect } from '../fixtures/auth.fixture';

test.describe('Visual regression', () => {
  test('inventory page matches baseline snapshot', async ({ page, loggedInPage }) => {
    // loggedInPage fixture has already navigated and logged in
    await expect(page).toHaveScreenshot('inventory-baseline.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
