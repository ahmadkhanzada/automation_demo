import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    // Deterministic viewport for consistent screenshots
    viewport: { width: 1280, height: 720 },
    // Disable animations for stable screenshots
    reducedMotion: 'reduce',
  },
  expect: {
    timeout: 10000,
    // Configure screenshot comparison
    toHaveScreenshot: {
      mode: 'css',
      animations: 'disabled',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'cd .. && npm run dev',
    port: 5173,
    timeout: 120000,
    reuseExistingServer: true,
  },
});
