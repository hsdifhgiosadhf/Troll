import { defineConfig, devices } from "@playwright/test";

const CONG_MAY_CHU = 4173;
const DIA_CHI_GOC = `http://127.0.0.1:${CONG_MAY_CHU}`;
const SO_TIEN_TRINH = 4;
const HAN_CHO_MAY_CHU_MS = 120_000;

export default defineConfig({
  testDir: "./kiemthu-e2e",
  testMatch: "**/*.kiemthu.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  workers: SO_TIEN_TRINH,
  reporter: [["list"]],
  use: {
    baseURL: DIA_CHI_GOC,
    headless: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `node node_modules/vite/bin/vite.js build && node node_modules/vite/bin/vite.js preview --port ${CONG_MAY_CHU} --host 127.0.0.1 --strictPort`,
    url: DIA_CHI_GOC,
    reuseExistingServer: !process.env["CI"],
    timeout: HAN_CHO_MAY_CHU_MS,
  },
});
