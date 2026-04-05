/* eslint-disable no-undef */
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests-e2e',
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:5175',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5175',
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],cdcd
});