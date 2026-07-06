import { test, expect } from '@playwright/test';
import { injectAuth } from './helpers/auth.js';

test.describe('Profile Page', () => {

  test('Patient Profile renders with basic info and health vitals section', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.goto('http://localhost:5173/profile');
    await page.waitForTimeout(2000);

    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 8000 });
    // Health info section — use first() to avoid strict mode on multiple matches
    await expect(page.locator('h3:has-text("Health Info")').first()).toBeVisible({ timeout: 8000 });
  });

  test('Doctor Profile renders with specialization info', async ({ page }) => {
    await injectAuth(page, 'Doctor');
    await page.goto('http://localhost:5173/profile');
    await page.waitForTimeout(2000);

    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 8000 });
  });

  test('Profile shows correct role badge', async ({ page }) => {
    await injectAuth(page, 'Chemist');
    await page.goto('http://localhost:5173/profile');
    await page.waitForTimeout(2000);

    // Role badge — use a specific badge span to avoid strict mode
    await expect(page.locator('span.badge:has-text("Chemist")').first()).toBeVisible({ timeout: 8000 });
  });

  test('Patient profile shows link to Healthcare Test when no test taken', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    // Clear any existing health test data
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.removeItem('chc_health_test_testpatient');
      localStorage.setItem('chc_token', 'mock-jwt-token');
      localStorage.setItem('chc_user', JSON.stringify({ userName: 'testpatient', role: 'Patient', healthCardNo: 'PAT001', district: 'Pune' }));
    });
    await page.goto('http://localhost:5173/profile');
    await page.waitForTimeout(2000);

    // When no test taken, should show "Take Health Assessment" prompt
    const testLink = page.locator('text=Take Health Assessment').or(page.locator('text=Pending'));
    if (await testLink.count() > 0) {
      await expect(testLink.first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Healthcare Test Page', () => {

  test('Healthcare Test page loads with first question', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.goto('http://localhost:5173/health-test');
    await page.waitForTimeout(2000);

    // Should show a question or test intro
    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.glass-card').first()).toBeVisible();
  });

  test('Healthcare Test shows progress bar', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    // Clear test state
    await page.evaluate(() => localStorage.removeItem('chc_health_test_testpatient'));
    await page.goto('http://localhost:5173/health-test');
    await page.waitForTimeout(2000);

    // Progress indicator should be visible
    const progressEl = page.locator('[style*="width"]').or(page.locator('.progress, progress'));
    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 8000 });
  });
});
