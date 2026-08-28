import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const colorScheme of ["light", "dark"] as const) {
  for (const entry of [
    {
      name: "landing desktop",
      path: "/",
      viewport: { width: 1280, height: 900 },
    },
    {
      name: "landing mobile",
      path: "/",
      viewport: { width: 390, height: 844 },
    },
    {
      name: "demo desktop",
      path: "/demo?demo=1",
      viewport: { width: 1280, height: 900 },
    },
    {
      name: "demo mobile",
      path: "/demo?demo=1",
      viewport: { width: 390, height: 844 },
    },
  ]) {
    test(`${entry.name} has no serious or critical axe findings in ${colorScheme} mode`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        colorScheme,
        viewport: entry.viewport,
      });
      const page = await context.newPage();
      await page.goto(entry.path);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (item) => item.impact === "serious" || item.impact === "critical",
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
      await context.close();
    });
  }
}
