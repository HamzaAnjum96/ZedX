import { defineConfig, devices } from '@playwright/test';

// Serves docs/ under /ZedX/ exactly as GitHub Pages will (tools/serve.mjs).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4173/ZedX/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node tools/serve.mjs --port 4173',
    url: 'http://localhost:4173/ZedX/',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
});
