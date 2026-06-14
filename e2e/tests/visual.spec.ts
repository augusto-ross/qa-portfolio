/**
 * Visual regression tests — pixel-level snapshot comparison for the inventory page.
 *
 * Compares the current rendering against a stored baseline with up to 2% pixel
 * difference allowed. Skipped in CI because OS-level font and anti-aliasing differences
 * produce false positives; use a dedicated service (Percy, Chromatic) for cross-platform visual CI.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Visual regression', () => {
  // Baseline must match within 2% — larger diffs indicate unintended layout or style changes.
  test('inventory page matches baseline snapshot', async ({ page, loggedInPage }) => {
    // Snapshots are platform-specific (OS affects rendering); run locally only.
    // For cross-platform visual CI, a dedicated service (Percy, Chromatic) is needed.
    test.skip(!!process.env.CI, 'Visual snapshots are platform-specific; skipped in CI');
    await expect(page).toHaveScreenshot('inventory-baseline.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
