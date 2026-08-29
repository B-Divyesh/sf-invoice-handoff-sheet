import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("@claim:csv-export exports the demo follow-up log as CSV", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await expect(
    page.getByRole("heading", { name: "Moonbeam Studio website launch" }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export follow-up CSV" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("MB-042-follow-ups.csv");
  const path = await file.path();
  const csv = await readFile(path!, "utf8");
  expect(csv).toContain('"Date","Method","Note","Outcome","Invoice","Client"');
  expect(csv).toContain('"MB-042","Moonbeam Studio"');
});

test("@claim:shareable-html downloads a complete standalone handoff page", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download shareable HTML" }).click();
  const file = await download;
  const html = await readFile((await file.path())!, "utf8");
  expect(file.suggestedFilename()).toBe("MB-042-handoff.html");
  expect(html).toContain("Moonbeam Studio website launch");
  expect(html).toContain("Final responsive site delivered");
});

test("@claim:offline-reload opens the sample sheet offline after one visit", async ({
  page,
  context,
}) => {
  await page.goto("/demo?demo=1");
  await expect(
    page.getByText("Sample data. Nothing is saved to your real sheets."),
  ).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Moonbeam Studio website launch" }),
  ).toBeVisible();
});

test("@claim:local-storage keeps demo data out of real storage across browser history", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await expect(page.getByLabel("Demo controls")).toBeVisible();
  await page.getByRole("link", { name: "Privacy" }).first().click();
  await expect(page).toHaveTitle("Privacy — Invoice Handoff Sheet");
  await page.goBack();
  await expect(page).toHaveTitle("Demo — Invoice Handoff Sheet");
  await expect(page.getByLabel("Demo controls")).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  const storage = await page.evaluate(() => ({
    demo: localStorage.getItem("demo:invoice-handoff-sheet:sheets"),
    real: localStorage.getItem("invoice-handoff-sheet:sheets"),
  }));
  expect(storage.demo).toContain("Moonbeam Studio website launch");
  expect(storage.real).toBeNull();
});

test("@claim:private-demo makes no third-party requests while using the demo", async ({
  page,
}) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("/demo?demo=1");
  await page.getByRole("button", { name: "Add follow-up" }).click();
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
});

test("@claim:no-runtime-tracking loads landing and demo without analytics or runtime CDNs", async ({
  browser,
}) => {
  for (const path of ["/", "/demo?demo=1"]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const requested = new Set<string>();
    page.on("request", (request) => requested.add(new URL(request.url()).origin));
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect([...requested]).toEqual(["http://127.0.0.1:4173"]);
    const loadedUrls = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement | HTMLImageElement>(
        "script[src], link[rel='stylesheet'][href], link[rel='modulepreload'][href], img[src]",
      )]
        .map((element) => {
          if (element instanceof HTMLLinkElement) return element.href;
          return element.src;
        })
        .filter(Boolean),
    );
    const pageOrigin = new URL(page.url()).origin;
    expect(loadedUrls.every((url) => new URL(url).origin === pageOrigin)).toBeTruthy();
    await context.close();
  }
});

test("@claim:local-first-real saves a real handoff locally without third-party requests", async ({
  page,
}) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("/app");
  await page.getByRole("button", { name: "Create handoff" }).click();
  await page.getByLabel("Project name").fill("Local proof project");
  await page.getByLabel("Client or company").fill("Northwind Workshop");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toHaveText("Changes saved.");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Local proof project" }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("invoice-handoff-sheet:sheets") || "[]"),
  );
  expect(saved).toHaveLength(1);
  expect(saved[0].project).toBe("Local proof project");
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
});

test("@claim:unlimited-handoffs saves multiple handoffs without account or payment controls", async ({
  page,
}) => {
  await page.goto("/app");
  for (const [project, client] of [
    ["First handoff", "Atlas Studio"],
    ["Second handoff", "Birch Works"],
  ]) {
    await page.getByRole("button", { name: "Create handoff" }).click();
    await page.getByLabel("Project name").fill(project);
    await page.getByLabel("Client or company").fill(client);
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.getByRole("link", { name: "All handoffs" }).click();
  }
  await expect(page.getByText("First handoff")).toBeVisible();
  await expect(page.getByText("Second handoff")).toBeVisible();
  const savedCount = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("invoice-handoff-sheet:sheets") || "[]")
        .length,
  );
  expect(savedCount).toBe(2);
  await page.goto("/");
  await expect(
    page.getByText("Save as many handoffs as you need."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /buy|checkout|sign in|log in/i }),
  ).toHaveCount(0);
});

test("@claim:delete-handoff removes only the confirmed real handoff and can undo it", async ({
  page,
}) => {
  await page.goto("/app");
  for (const [project, client] of [
    ["Delete me", "Cedar Studio"],
    ["Keep me", "Juniper Works"],
  ]) {
    await page.getByRole("button", { name: "Create handoff" }).click();
    await page.getByLabel("Project name").fill(project);
    await page.getByLabel("Client or company").fill(client);
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.getByRole("link", { name: "All handoffs" }).click();
  }
  await page.getByRole("button", { name: "Delete me" }).click();
  await page.getByRole("button", { name: "Delete handoff" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete handoff" })
    .click();
  await expect(page.getByRole("status")).toHaveText(
    "Handoff deleted. You can undo this removal.",
  );
  await expect(page.getByText("Delete me", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Keep me", { exact: true })).toBeVisible();
  let saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("invoice-handoff-sheet:sheets") || "[]"),
  );
  expect(saved.map((sheet: { project: string }) => sheet.project)).toEqual([
    "Keep me",
  ]);
  await page.getByRole("button", { name: "Undo removal" }).click();
  await expect(page.getByText("Delete me", { exact: true })).toBeVisible();
  await expect(page.getByText("Keep me", { exact: true })).toBeVisible();
  saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("invoice-handoff-sheet:sheets") || "[]"),
  );
  expect(saved.map((sheet: { project: string }) => sheet.project)).toEqual([
    "Delete me",
    "Keep me",
  ]);
});

test("@claim:safe-proof-links rejects unsafe links and strips unsafe legacy links from HTML export", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  const title = page.getByLabel("Delivered item");
  const date = page.getByLabel("Delivered on");
  const proof = page.getByLabel("Proof link");
  await title.fill("Security review");
  await date.fill("2026-08-28");
  await proof.fill("javascript:alert(document.domain)");
  await page.getByRole("button", { name: "Add delivery record" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Use a full link starting with http:// or https://.",
  );
  expect(
    await page.evaluate(() =>
      localStorage.getItem("demo:invoice-handoff-sheet:sheets"),
    ),
  ).not.toContain("javascript:");

  await proof.fill("not a valid URL");
  await page.getByRole("button", { name: "Add delivery record" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Use a full link starting with http:// or https://.",
  );

  await page.evaluate(() => {
    const key = "demo:invoice-handoff-sheet:sheets";
    const records = JSON.parse(localStorage.getItem(key) || "[]");
    records[0].milestones[0].evidence = "javascript:alert(document.domain)";
    localStorage.setItem(key, JSON.stringify(records));
  });
  await page.reload();
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download shareable HTML" }).click();
  const html = await readFile((await (await download).path())!, "utf8");
  expect(html).not.toContain('href="javascript:');
  expect(html).not.toContain("alert(document.domain)");
});
