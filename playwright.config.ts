import { defineConfig } from "@playwright/test";

// ponytail: single project (Chromium), no CI matrix — this suite exists to
// guard the homepage perf fixes (lazy video, static CTA image, logo
// rendering), not to be a full cross-browser regression suite.
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
