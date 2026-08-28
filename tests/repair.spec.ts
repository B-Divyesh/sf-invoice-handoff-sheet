import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("negative amounts are rejected with announced guidance and are not saved", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await page.getByLabel("Amount due").fill("-50");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Amount due cannot be negative. Enter zero or a positive amount.",
  );
  const savedAmount = await page.evaluate(
    () =>
      JSON.parse(
        localStorage.getItem("demo:invoice-handoff-sheet:sheets") || "[]",
      )[0].amount,
  );
  expect(savedAmount).toBe("2400.00");
});

test("delivery and follow-up actions announce their current success", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toHaveText("Changes saved.");
  await page.getByLabel("Delivered item").fill("Final accessibility notes");
  await page.getByLabel("Delivered on").fill("2026-08-28");
  await page.getByLabel("Proof link").fill("https://example.com/final-notes");
  await page.getByRole("button", { name: "Add delivery record" }).click();
  await expect(page.getByRole("status")).toHaveText("Delivery record added.");
  await page.getByLabel("Date").last().fill("2026-08-28");
  await page
    .getByLabel("What you sent or asked")
    .fill("Shared the final notes.");
  await page.getByRole("button", { name: "Add follow-up" }).click();
  await expect(page.getByRole("status")).toHaveText("Follow-up added.");
});

test("required mobile controls have 44px touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo?demo=1");
  const controls = page.locator(
    ".site-header nav a, .demo-banner button, footer nav a",
  );
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const box = await controls.nth(index).boundingBox();
    expect(
      box?.height,
      (await controls.nth(index).textContent()) || "",
    ).toBeGreaterThanOrEqual(44);
  }
});

test("public routes have one h1 and route-specific titles", async ({ page }) => {
  const routes = [
    ["/", "Invoice Handoff Sheet — Delivery and payment record"],
    ["/demo?demo=1", "Demo — Invoice Handoff Sheet"],
    ["/privacy", "Privacy — Invoice Handoff Sheet"],
    ["/terms", "Terms — Invoice Handoff Sheet"],
  ];
  for (const [path, title] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
  }
});

test("keyboard navigation exposes the skip link and focuses route headings", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to sheet" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("link", { name: "Privacy" }).first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});

test("reduced motion removes animations and transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo?demo=1");
  const moving = await page.locator("*").evaluateAll((elements) =>
    elements
      .filter((element) => {
        const style = getComputedStyle(element);
        return (
          style.animationDuration !== "0s" || style.transitionDuration !== "0s"
        );
      })
      .map((element) => element.tagName),
  );
  expect(moving).toEqual([]);
});

test("static deployment routes known pages and returns the designed document for unknown 404s", async () => {
  const config = JSON.parse(
    await readFile("public/staticwebapp.config.json", "utf8"),
  );
  expect(config.navigationFallback).toBeUndefined();
  expect(
    config.routes
      .filter((route: { rewrite?: string }) => route.rewrite)
      .map((route: { route: string }) => route.route),
  ).toEqual(["/demo", "/app", "/privacy", "/terms"]);
  expect(config.responseOverrides["404"]).toEqual({
    rewrite: "/404.html",
    statusCode: 404,
  });
  expect(config.globalHeaders).toMatchObject({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  expect(config.globalHeaders["Content-Security-Policy"]).toContain(
    "connect-src 'self'",
  );
  const html = await readFile("public/404.html", "utf8");
  expect(html).toContain("<main>");
  expect(html).toContain("<h1>This sheet page is not here.</h1>");
  expect(html).not.toContain("<style>");
  const serviceWorker = await readFile("public/sw.js", "utf8");
  expect(serviceWorker).toContain("invoice-handoff-v2");
  expect(serviceWorker).toContain("caches.delete(name)");
  expect(serviceWorker).toContain("event.request.mode === 'navigate'");
});
