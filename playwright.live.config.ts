import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL:
      process.env.LIVE_BASE_URL ||
      "https://invoice-handoff-sheet.sociobot.in",
    browserName: "chromium",
    headless: true,
  },
});
