import { test, expect } from '@playwright/test';
import { injectAuth } from './helpers/auth.js';

test.describe('Dashboard - All Roles', () => {

  test('Patient Dashboard renders with quick action buttons', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    // Header/greeting should be visible
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });

    // Quick action cards should exist
    await expect(page.locator('.glass-card').first()).toBeVisible();
  });

  test('Doctor Dashboard renders with doctor-specific actions', async ({ page }) => {
    await injectAuth(page, 'Doctor');
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
    // Doctor actions: Create Record, Medical History, Feedback
    await expect(page.locator('text=Dr.')).toBeVisible();
  });

  test('Chemist Dashboard renders correctly', async ({ page }) => {
    await injectAuth(page, 'Chemist');
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 8000 });
  });

  test('Pathologist Dashboard renders correctly', async ({ page }) => {
    await injectAuth(page, 'Pathologist');
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 8000 });
  });

  test('Admin Dashboard renders correctly', async ({ page }) => {
    await injectAuth(page, 'Admin');
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 8000 });
  });

  test('Patient Dashboard quick action - View Records navigates correctly', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    // Find and click a link to medical history
    const link = page.locator('a[href="/medical-history"]').first();
    if (await link.count() > 0) {
      await link.click();
      await expect(page).toHaveURL(/\/medical-history/, { timeout: 5000 });
    }
  });
});
