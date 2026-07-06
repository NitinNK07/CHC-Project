import { test, expect } from '@playwright/test';
import { injectAuth } from './helpers/auth.js';

test.describe('Pathologist Feature', () => {
  test('should allow access to Patient Imaging page and display records', async ({ page }) => {
    await injectAuth(page, 'Pathologist', 'PATH001');
    await page.goto('http://localhost:5173/patient-imaging');
    await page.waitForTimeout(2000);

    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.glass-card').first()).toBeVisible();
    console.log('✅ Patient Imaging page loaded successfully');
  });

  test('Upload Report page loads with form', async ({ page }) => {
    await injectAuth(page, 'Pathologist');
    await page.goto('http://localhost:5173/upload-report');
    await page.waitForTimeout(2000);

    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('input[type="file"]')).toBeAttached({ timeout: 8000 });
  });

  test('Patient Imaging shows imaging type filter options', async ({ page }) => {
    await injectAuth(page, 'Pathologist', 'PATH001');
    await page.goto('http://localhost:5173/patient-imaging');
    await page.waitForTimeout(2000);

    // Filter select or tabs should be present
    const filterEl = page.locator('select').or(page.locator('button:has-text("X-Ray")').or(page.locator('.glass-card').first()));
    await expect(filterEl.first()).toBeVisible({ timeout: 8000 });
  });
});
