import { test, expect } from '../fixtures/auth.fixture';

test.describe('Visual regression', () => {
  test('inventory page matches baseline snapshot', async ({ page, loggedInPage }) => {
    // Snapshots are platform-specific (OS affects rendering); run locally only.
    // For cross-platform visual CI, a dedicated service (Percy, Chromatic) is needed.
    test.skip(!!process.env.CI, 'Visual snapshots are platform-specific; skipped in CI');
    await expect(page).toHaveScreenshot('inventory-baseline.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
