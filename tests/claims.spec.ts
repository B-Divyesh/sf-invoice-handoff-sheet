import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('@claim:csv-export exports the demo follow-up log as CSV', async ({ page }) => {
  await page.goto('/demo?demo=1');
  await expect(page.getByRole('heading', { name: 'Moonbeam Studio website launch' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export follow-up CSV' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('MB-042-follow-ups.csv');
  const path = await file.path();
  const csv = await readFile(path!, 'utf8');
  expect(csv).toContain('"Date","Method","Note","Outcome","Invoice","Client"');
  expect(csv).toContain('"MB-042","Moonbeam Studio"');
});

test('@claim:shareable-html downloads a complete standalone handoff page', async ({ page }) => {
  await page.goto('/demo?demo=1');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download shareable HTML' }).click();
  const file = await download;
  const html = await readFile((await file.path())!, 'utf8');
  expect(file.suggestedFilename()).toBe('MB-042-handoff.html');
  expect(html).toContain('Moonbeam Studio website launch');
  expect(html).toContain('Final responsive site delivered');
});

test('@claim:offline-reload opens the sample sheet offline after one visit', async ({ page, context }) => {
  await page.goto('/demo?demo=1');
  await expect(page.getByText('Sample data. Nothing is saved to your real sheets.')).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Moonbeam Studio website launch' })).toBeVisible();
});

test('@claim:local-storage keeps demo data out of real storage', async ({ page }) => {
  await page.goto('/demo?demo=1');
  await expect(page.getByLabel('Demo controls')).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('demo:invoice-handoff-sheet:sheets');
  expect(keys).not.toContain('invoice-handoff-sheet:sheets');
});

test('@claim:private-demo makes no third-party requests while using the demo', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/demo?demo=1');
  await page.getByRole('button', { name: 'Add follow-up' }).click();
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});
