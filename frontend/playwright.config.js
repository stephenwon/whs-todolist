// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Use environment variables or default to localhost
const PORT = process.env.PORT || 5173;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

module.exports = defineConfig({
  testDir: '../test/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../test/e2e/playwright-report' }],
    ['json', { outputFile: '../test/e2e/test-results.json' }]
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'] 
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});