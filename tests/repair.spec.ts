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

test("adding a delivery preserves all valid unsaved handoff fields", async ({
  page,
}) => {
  await page.goto("/app");
  await page.getByRole("button", { name: "Create handoff" }).click();
  await page.getByLabel("Project name").fill("Northstar redesign");
  await page.getByLabel("Client or company").fill("Northstar Co.");
  await page.getByLabel("Client email").fill("billing@northstar.test");
  await page.getByLabel("Invoice identifier").fill("NS-009");
  await page.getByLabel("Amount due").fill("0");
  await page.getByLabel("Currency code").fill("EUR");
  await page.getByLabel("Delivered item").fill("Final design files");
  await page.getByLabel("Delivered on").fill("2026-08-28");
  await page
    .getByLabel("Proof link")
    .fill("https://example.test/northstar/final-files");
  await page.getByRole("button", { name: "Add delivery record" }).click();

  await expect(page.getByLabel("Project name")).toHaveValue("Northstar redesign");
  await expect(page.getByLabel("Client or company")).toHaveValue("Northstar Co.");
  await expect(page.getByLabel("Client email")).toHaveValue(
    "billing@northstar.test",
  );
  await expect(page.getByLabel("Invoice identifier")).toHaveValue("NS-009");
  await expect(page.getByLabel("Amount due")).toHaveValue("0");
  await expect(page.getByLabel("Currency code")).toHaveValue("EUR");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("invoice-handoff-sheet:sheets") || "[]"),
  );
  expect(saved[0]).toMatchObject({
    project: "Northstar redesign",
    client: "Northstar Co.",
    clientEmail: "billing@northstar.test",
    invoiceId: "NS-009",
    amount: "0",
    currency: "EUR",
  });
  expect(saved[0].milestones).toHaveLength(1);

  await page.getByLabel("Invoice identifier").fill("NS-010");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download shareable HTML" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("NS-010-handoff.html");
  const html = await readFile((await file.path())!, "utf8");
  expect(html).toContain("NS-010");
  await expect(page.getByLabel("Invoice identifier")).toHaveValue("NS-010");
});

test("record actions keep keyboard focus and removals can be undone", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await page.getByLabel("Delivered item").fill("Keyboard handoff");
  await page.getByLabel("Delivered on").fill("2026-08-28");
  const add = page.getByRole("button", { name: "Add delivery record" });
  await add.focus();
  await page.keyboard.press("Enter");
  const added = page.locator('[data-milestone-id]').filter({ hasText: "Keyboard handoff" });
  await expect(added).toBeFocused();

  const milestones = page.locator('[data-milestone-id]');
  const before = await milestones.count();
  await milestones.first().getByRole("button", { name: "Remove milestone" }).click();
  await expect(page.getByRole("button", { name: "Undo removal" })).toBeFocused();
  await expect(milestones).toHaveCount(before - 1);
  await page.keyboard.press("Enter");
  await expect(milestones).toHaveCount(before);
  await expect(page.getByText("Final responsive site delivered")).toBeVisible();
});

test("sample delivery proof pages are shipped and landing facts include privacy, offline, and price", async ({
  page,
  request,
}) => {
  for (const path of [
    "/sample-proofs/moonbeam-final-preview.html",
    "/sample-proofs/moonbeam-handover-files.html",
  ]) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
  }
  await page.goto("/");
  await expect(page.getByText("Saved in this browser")).toBeVisible();
  await expect(page.getByText("Works offline after first visit")).toBeVisible();
  await expect(page.getByText("Free to use", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "For freelancers and small agencies who need delivery proof, invoice details, and follow-ups in one record.",
    ),
  ).toBeVisible();
  await expect(page.getByText("HANDOFF SHEET CONTENTS", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Handoff sheet contents." }),
  ).toBeVisible();
});

test("cumulative review copy stays concrete and removes unsupported wording", async ({
  page,
}) => {
  const readme = await readFile("README.md", "utf8");
  for (const removed of [
    "calm record",
    "ONE PAGE. NO PORTAL.",
    "client-shareable",
    "free local-first tool",
    "does not process payments",
    "collect debts",
    "remain in browser local storage",
  ]) {
    expect(readme).not.toContain(removed);
  }
  await page.goto("/");
  const copy = await page.locator("main").innerText();
  for (const removed of [
    "calm record",
    "ONE PAGE. NO PORTAL.",
    "Show the whole handoff.",
    "Export a clean record",
    "does not process payments",
  ]) {
    expect(copy).not.toContain(removed);
  }
});

test("@claim:demo-navigation preserves saved edits until Reset demo is selected", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await page.getByLabel("Project name").fill("Saved demo navigation edit");
  await page.getByRole("button", { name: "Save changes" }).click();

  await page.locator("header").getByRole("link", { name: "Demo" }).click();
  await expect(page).toHaveURL(/\/demo\?demo=1$/);
  await expect(
    page.getByRole("heading", { name: "Saved demo navigation edit" }),
  ).toBeVisible();

  await page.locator("header .wordmark").click();
  await expect(
    page.getByRole("heading", { name: "Record work before chasing payment." }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Open the sample sheet/ }).click();
  await expect(page).toHaveURL(/\/demo\?demo=1$/);
  await expect(
    page.getByRole("heading", { name: "Saved demo navigation edit" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("demo:invoice-handoff-sheet:sheets"),
    ),
  ).toContain("Saved demo navigation edit");

  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(
    page.getByRole("heading", { name: "Moonbeam Studio website launch" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("demo:invoice-handoff-sheet:sheets"),
    ),
  ).not.toContain("Saved demo navigation edit");
});

test("whole-handoff deletion asks for confirmation, supports Escape, and restores focus", async ({
  page,
}) => {
  await page.goto("/app");
  await page.getByRole("button", { name: "Create handoff" }).click();
  await page.getByLabel("Project name").fill("Focus-safe deletion");
  await page.getByLabel("Client or company").fill("Orchid Studio");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: "Delete handoff" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete handoff" }).last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Delete handoff" })).toBeFocused();
});

test("every visible mobile interactive target is at least 44px in both dimensions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/demo?demo=1", "/app", "/privacy", "/terms", "/404.html"]) {
    await page.goto(path);
    const undersized = await page
      .locator(
        'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"]',
      )
      .evaluateAll((elements) =>
        elements.flatMap((element) => {
          const style = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            box.width === 0 ||
            box.height === 0 ||
            (element as HTMLInputElement).disabled
          ) {
            return [];
          }
          if (box.width >= 44 && box.height >= 44) return [];
          return [{
            name:
              element.getAttribute("aria-label") ||
              element.textContent?.trim().replace(/\s+/g, " ") ||
              element.getAttribute("name") ||
              element.tagName,
            width: Number(box.width.toFixed(1)),
            height: Number(box.height.toFixed(1)),
          }];
        }),
      );
    expect(undersized, `${path}: ${JSON.stringify(undersized)}`).toEqual([]);
  }
});

test("mobile task and navigation text is at least 17px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const textSelector = [
    "header nav a",
    ".demo-banner span",
    ".demo-banner button",
    "main p",
    "main li",
    "main a",
    "main button",
    "main label",
    "main legend",
    "main th",
    "main td",
    "main small",
    "main input",
    "main textarea",
    "main select",
    "footer p",
    "footer nav a",
    "footer nav span",
    "footer small",
  ].join(", ");

  for (const path of ["/", "/demo?demo=1", "/app", "/privacy", "/terms", "/404.html"]) {
    await page.goto(path);
    const undersized = await page.locator(textSelector).evaluateAll((elements) =>
      elements.flatMap((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          box.width === 0 ||
          box.height === 0
        ) {
          return [];
        }
        const fontSize = Number.parseFloat(style.fontSize);
        if (fontSize >= 17) return [];
        return [{
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
          fontSize,
        }];
      }),
    );
    expect(undersized, `${path}: ${JSON.stringify(undersized)}`).toEqual([]);
  }
});

test("mobile routes fit the viewport and keep the sample action on the first screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/demo?demo=1", "/privacy", "/terms", "/404.html"]) {
    await page.goto(path);
    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth,
    }));
    expect(widths.page, path).toBeLessThanOrEqual(widths.viewport);
  }
  await page.goto("/");
  const sampleAction = await page
    .getByRole("link", { name: "Try it with sample data" })
    .boundingBox();
  expect(sampleAction?.y).toBeGreaterThanOrEqual(0);
  expect((sampleAction?.y || 0) + (sampleAction?.height || 0)).toBeLessThanOrEqual(844);
});

test("desktop first screen keeps the sample action fully visible at 1280 by 720", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const sampleAction = await page
    .getByRole("link", { name: "Try it with sample data" })
    .boundingBox();
  expect(sampleAction).not.toBeNull();
  expect(sampleAction!.y).toBeGreaterThanOrEqual(0);
  expect(sampleAction!.y + sampleAction!.height).toBeLessThanOrEqual(720);
});

test("due labels use local calendar days and singular grammar across time zones", async ({
  browser,
}) => {
  const verify = async (
    timezoneId: string,
    time: string,
    dueOn: string,
    expected: string,
  ) => {
    const context = await browser.newContext({ timezoneId });
    const page = await context.newPage();
    await page.clock.install({ time: new Date(time) });
    await page.goto("/app");
    await page.getByRole("button", { name: "Create handoff" }).click();
    await page.getByLabel("Project name").fill("Local calendar check");
    await page.getByLabel("Client or company").fill("Time Zone Studio");
    await page.getByLabel("Due date").fill(dueOn);
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.locator(".due-callout")).toContainText(expected);
    await context.close();
  };

  await verify(
    "America/Los_Angeles",
    "2026-08-30T02:00:00.000Z",
    "2026-08-29",
    "Due today",
  );
  await verify(
    "Pacific/Kiritimati",
    "2026-08-28T12:00:00.000Z",
    "2026-08-29",
    "Due today",
  );
  await verify(
    "America/Los_Angeles",
    "2026-08-30T02:00:00.000Z",
    "2026-08-28",
    "1 day overdue",
  );
  await verify(
    "America/Los_Angeles",
    "2026-08-30T02:00:00.000Z",
    "2026-08-30",
    "Due in 1 day",
  );
});

test("required fields are visibly explained and use native required semantics", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await expect(
    page.getByText("Required fields. All other fields are optional."),
  ).toBeVisible();
  for (const name of [
    "project",
    "client",
    "milestone-title",
    "milestone-date",
    "followup-date",
    "followup-note",
  ]) {
    const field = page.locator(`[name="${name}"]`);
    await expect(field).toHaveAttribute("required", "");
    await expect(field).toHaveAttribute("aria-describedby", /required-fields/);
  }

  await page.getByRole("button", { name: "Add follow-up" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Add a date and what you sent, then try again.",
  );
});

test("public routes have one h1 and route-specific titles and social metadata", async ({ page }) => {
  const routes = [
    ["/", "Invoice Handoff Sheet — Delivery and payment record", "Record delivered work, invoice details, and follow-ups in one handoff sheet you can share with a client."],
    ["/demo?demo=1", "Demo — Invoice Handoff Sheet", "Explore a sample handoff with delivery proof, invoice details, payment instructions, and follow-ups."],
    ["/app", "Your handoffs — Invoice Handoff Sheet", "Create and save delivery, invoice, and follow-up records in this browser."],
    ["/privacy", "Privacy — Invoice Handoff Sheet", "Handoff details stay in this browser. The app has no analytics."],
    ["/terms", "Terms — Invoice Handoff Sheet", "Terms for using Invoice Handoff Sheet to record delivery, invoice, and follow-up details."],
  ];
  for (const [path, title, description] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://invoice-handoff-sheet.sociobot.in${new URL(path, "https://invoice-handoff-sheet.sociobot.in").pathname}`,
    );
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

test("static deployment routes known pages and returns the complete accessible shell for unknown 404s", async ({ page }) => {
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
  expect(html).toContain('<main id="main" tabindex="-1">');
  expect(html).toContain("<h1>This sheet page is not here.</h1>");
  expect(html).not.toContain("<style>");
  expect(html).toContain('name="description"');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('property="og:title"');
  expect(html).toContain('name="twitter:card"');
  await page.goto("/404.html");
  await expect(page.getByRole("link", { name: "Skip to sheet" })).toHaveAttribute("href", "#main");
  await expect(page.locator("header").getByRole("link", { name: "Demo" })).toHaveAttribute("href", "/demo?demo=1");
  await expect(page.locator("header").getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
  await expect(page.locator("header").getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  await expect(page.locator("footer").getByRole("link", { name: "Privacy" })).toBeVisible();
  await expect(page.locator("footer").getByRole("link", { name: "Terms" })).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  const serviceWorker = await readFile("public/sw.js", "utf8");
  expect(serviceWorker).toContain("invoice-handoff-v3");
  expect(serviceWorker).toContain("caches.delete(name)");
  expect(serviceWorker).toContain("event.request.mode === 'navigate'");
});
