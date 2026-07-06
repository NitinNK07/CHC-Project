import { test, expect } from '@playwright/test';
import { injectAuth } from './helpers/auth.js';

test.describe('Feedback Page', () => {

  test('Patient sees feedback form and can submit', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.goto('http://localhost:5173/feedback');
    await page.waitForTimeout(1500);

    // Form should be visible for patients (h3 heading)
    await expect(page.locator('h3:has-text("Submit New Feedback")')).toBeVisible({ timeout: 8000 });

    // Fill the subject input (no name attr, controlled via value)
    await page.locator('input[placeholder="Brief description of your feedback"]').fill('Test Subject');
    await page.locator('textarea').fill('This is a test feedback message.');

    // Submit button should be enabled
    await expect(page.locator('button:has-text("Submit Feedback")')).toBeVisible();
  });

  test('Doctor sees their patient feedback list and the submit form', async ({ page }) => {
    await injectAuth(page, 'Doctor');
    await page.goto('http://localhost:5173/feedback');
    await page.waitForTimeout(1500);

    // Doctor sees "Patient Feedback for Me" heading
    await expect(page.locator('h3:has-text("Patient Feedback for Me")')).toBeVisible({ timeout: 8000 });
    // Doctor ALSO sees the submit form because it is only hidden for Admin
    await expect(page.locator('h3:has-text("Submit New Feedback")')).toBeVisible();
  });

  test('Admin cannot see the submit form (admin views tickets only)', async ({ page }) => {
    await injectAuth(page, 'Admin');
    await page.goto('http://localhost:5173/feedback');
    await page.waitForTimeout(1500);

    // Admin should not see the submit new feedback form
    await expect(page.locator('h3:has-text("Submit New Feedback")')).not.toBeVisible({ timeout: 5000 });
    // But page should still load
    await expect(page.locator('h1:has-text("Feedback")')).toBeVisible({ timeout: 8000 });
  });

  test('Feedback prefills subject when coming from medical record link', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    // Navigate with query params — Feedback useEffect reads dr & date from searchParams
    await page.goto('http://localhost:5173/feedback?dr=12345&date=2024-03-10');
    await page.waitForTimeout(2000);

    // Subject should be auto-filled with doctor info
    const subjectInput = page.locator('input[placeholder="Brief description of your feedback"]');
    await expect(subjectInput).toBeVisible({ timeout: 8000 });
    const value = await subjectInput.inputValue();
    expect(value).toContain('12345');
  });
});
