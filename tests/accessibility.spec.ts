import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('demo sheet has no serious or critical axe findings', async ({ page }) => {
  await page.goto('/demo?demo=1');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
  expect(serious).toEqual([]);
});
