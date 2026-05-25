import { test, expect } from '@playwright/test';

test('landing page renders and can navigate to login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Carolina|Running|Vite/i);
  await page.getByText(/login/i).first().click();
  await expect(page).toHaveURL(/\/login/);
});
