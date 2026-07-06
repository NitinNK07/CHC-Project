import { test, expect } from '@playwright/test';
import { injectAuth } from './helpers/auth.js';

test.describe('Create Record Page (Doctor)', () => {

  test('Create Record page loads with patient search', async ({ page }) => {
    await injectAuth(page, 'Doctor');
    await page.goto('http://localhost:5173/create-record');
    await page.waitForTimeout(2000);

    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 8000 });
    // Should have a patient search/health card input
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('Create Record shows medicine form fields', async ({ page }) => {
    await injectAuth(page, 'Doctor');
    await page.goto('http://localhost:5173/create-record');
    await page.waitForTimeout(2000);

    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Verify Prescription Page (Chemist)', () => {

  test('Verify Prescription page loads for Chemist', async ({ page }) => {
    await injectAuth(page, 'Chemist');
    await page.goto('http://localhost:5173/verify-prescription');
    await page.waitForTimeout(2000);

    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.glass-card').first()).toBeVisible();
  });

  test('Verify Prescription has search input', async ({ page }) => {
    await injectAuth(page, 'Chemist');
    await page.goto('http://localhost:5173/verify-prescription');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input').first();
    await expect(searchInput).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Upload Report Page (Pathologist)', () => {

  test('Upload Report page loads for Pathologist', async ({ page }) => {
    await injectAuth(page, 'Pathologist');
    await page.goto('http://localhost:5173/upload-report');
    await page.waitForTimeout(2000);

    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.glass-card').first()).toBeVisible();
  });

  test('Upload Report has a file input', async ({ page }) => {
    await injectAuth(page, 'Pathologist');
    await page.goto('http://localhost:5173/upload-report');
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached({ timeout: 8000 });
  });
});

test.describe('Admin Panel Page (Admin)', () => {

  async function setupAdminPage(page) {
    // Override injectAuth mock with all admin-specific endpoints
    await page.route('http://localhost:8081/**', async route => {
      const url = route.request().url();
      if (url.includes('/admin/stats'))
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ totalRegistered: 42, doctors: 10, chemists: 5, patients: 25, teamMembers: 2, openFeedback: 3, resolvedFeedback: 7 }) });
      if (url.includes('/admin/users'))
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      if (url.includes('/admin/district-stats'))
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      if (url.includes('/admin/role-stats'))
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      if (url.includes('/admin/feedbacks'))
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.setItem('chc_token', 'mock-jwt-token');
      localStorage.setItem('chc_user', JSON.stringify({ userName: 'testadmin', role: 'Admin', healthCardNo: null, district: 'Pune' }));
    });
    await page.goto('http://localhost:5173/admin-panel');
    // Wait for loading spinner to disappear
    await page.waitForTimeout(3000);
  }

  test('Admin Panel renders stats and user management', async ({ page }) => {
    await setupAdminPage(page);
    // The admin panel renders a dashboard with tabs
    await expect(page.locator('.dashboard-main')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 8000 });
  });

  test('Admin Panel shows total registered users from API', async ({ page }) => {
    await setupAdminPage(page);
    // Stats section shows totalRegistered: 42
    await expect(page.locator('text=42')).toBeVisible({ timeout: 8000 });
  });
});
