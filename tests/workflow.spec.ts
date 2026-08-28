import { test, expect } from "@playwright/test";

test("a freelancer can create a handoff and add delivery and follow-up records", async ({
  page,
}) => {
  await page.goto("/demo?demo=1");
  await page.getByRole("button", { name: "Start for real" }).click();
  await page.getByRole("button", { name: "Create handoff" }).click();
  await page.getByLabel("Project name").fill("Harbor launch notes");
  await page.getByLabel("Client or company").fill("Harbor Works");
  await page.getByLabel("Invoice identifier").fill("HW-17");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.getByRole("heading", { name: "Harbor launch notes" }),
  ).toBeVisible();
  await page.getByLabel("Delivered item").fill("Final launch notes");
  await page.getByLabel("Delivered on").fill("2026-08-28");
  await page.getByRole("button", { name: "Add delivery record" }).click();
  await expect(page.getByText("Final launch notes")).toBeVisible();
  await page.getByLabel("Date").last().fill("2026-08-28");
  await page
    .getByLabel("What you sent or asked")
    .fill("Asked for payment timing.");
  await page.getByRole("button", { name: "Add follow-up" }).click();
  await expect(page.getByText("Asked for payment timing.")).toBeVisible();
});
