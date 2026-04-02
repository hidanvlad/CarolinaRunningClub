import { test, expect } from '@playwright/test';

test.describe('Silver Challenge: Orchestrated Scenarios', () => {

    test('Scenario A: User adds a run and verifies cookie monitoring', async ({ page }) => {
        await page.goto('/dashboard');

        // Fill out the form
        await page.getByPlaceholder('Run Name').fill('Silver Marathon');
        await page.locator('input[type="date"]').fill('2025-05-20');

        await page.getByRole('button', { name: /Add Run/i }).click();

        // 1. Verify run appears specifically in the TABLE (Strictness fix)
        // We look for the text inside the table body to avoid confusion with the banner
        await expect(page.locator('tbody').getByText('Silver Marathon')).toBeVisible();

        // 2. Verify Cookie Monitoring message (Silver Requirement)
        // We look specifically for the banner notification
        await expect(page.locator('text=Recent Activity')).toBeVisible();
        await expect(page.locator('text=Added new run: Silver Marathon')).toBeVisible();
    });

    test('Scenario B: Master-Detail Navigation', async ({ page }) => {
        await page.goto('/dashboard');

        // Click the first link in the table
        const firstRun = page.locator('td').first();
        await firstRun.click();

        // Verify URL change and Detail Page content
        await expect(page).toHaveURL(/\/run\/\d+/);
        await expect(page.getByRole('button', { name: /Back/i })).toBeVisible();

        await page.getByRole('button', { name: /Back/i }).click();
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('Scenario C: Validation Blocking', async ({ page }) => {
        await page.goto('/dashboard');

        // Try to add a run with only 2 characters
        await page.getByPlaceholder('Run Name').fill('Go');
        await page.getByRole('button', { name: /Add Run/i }).click();

        // Verify the specific error message from your Dashboard.jsx
        await expect(page.getByText(/Run name must be at least 3 characters/i)).toBeVisible();
    });
});