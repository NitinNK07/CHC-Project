import { test, expect } from '@playwright/test';

test.describe('Pathologist Feature', () => {
  test('should allow access to Patient Imaging', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Login as a pathologist or patient (depends on app logic, but let's test routing)
    await page.fill('input[placeholder="Username or Email"]', 'pathologist');
    await page.fill('input[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL('**/dashboard');

    // Navigate to Patient Imaging
    await page.goto('http://localhost:5173/patient-imaging');

    // Ensure page loads
    await expect(page.locator('h1, h2, h3').filter({ hasText: 'Patient Imaging' })).toBeVisible();
    
    // Verify the grid or list of records is present
    await expect(page.locator('.glass-card').first()).toBeVisible();
  });
});
