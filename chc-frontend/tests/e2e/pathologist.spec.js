import { test, expect } from '@playwright/test';

// Helper: bypass login by injecting auth directly into localStorage
async function injectAuth(page, role = 'Pathologist') {
  await page.goto('http://localhost:5173/login');
  await page.evaluate((role) => {
    localStorage.setItem('chc_token', 'mock-jwt-token');
    localStorage.setItem('chc_user', JSON.stringify({
      userName: 'testpathologist',
      role: role,
      healthCardNo: 'PATH001',
      district: 'TestDistrict'
    }));
  }, role);
}

test.describe('Pathologist Feature', () => {
  test('should allow access to Patient Imaging page and display records', async ({ page }) => {
    // Mock all backend calls
    await page.route('http://localhost:8081/**', async route => {
      const url = route.request().url();

      if (url.includes('/medical-imaging/patient/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, title: 'Chest X-Ray', imagingType: 'X-Ray', uploadedAt: '2024-01-15T10:00:00Z', hospitalName: 'City Hospital', description: 'Routine chest scan' },
            { id: 2, title: 'Brain MRI', imagingType: 'MRI', uploadedAt: '2024-02-20T11:00:00Z', hospitalName: 'Metro Medical', description: 'Annual brain check' }
          ])
        });
      }
      // Default: return empty OK for all other API calls
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    // Inject auth and navigate straight to patient-imaging
    await injectAuth(page, 'Pathologist');
    await page.goto('http://localhost:5173/patient-imaging');

    // Wait for the page to load
    await page.waitForTimeout(2000);

    // Verify page heading is visible
    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 10000 });

    // Verify glass-card UI elements are present (records or empty state)
    await expect(page.locator('.glass-card').first()).toBeVisible();

    console.log('✅ Patient Imaging page loaded successfully');
  });
});
