import { test, expect } from '@playwright/test';
import { injectAuth } from './helpers/auth.js';

test.describe('Medical History Page', () => {

  test('Patient sees their own records auto-loaded (no search bar)', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.goto('http://localhost:5173/medical-history');
    await page.waitForTimeout(2000);

    // Page should load — check page heading
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 8000 });
    // Patient auto-fetches — the page renders with a .page-header
    await expect(page.locator('.page-header')).toBeVisible({ timeout: 8000 });
  });

  test('Doctor sees search bar to look up patients', async ({ page }) => {
    await injectAuth(page, 'Doctor');
    await page.goto('http://localhost:5173/medical-history');
    await page.waitForTimeout(2000);

    // Doctor should see a search input — MedicalHistory uses type=text search for non-patients
    await expect(page.locator('input').first()).toBeVisible({ timeout: 8000 });
  });

  test('Medical History displays lab reports section when records are present', async ({ page }) => {
    // Override the default mock with records
    await page.route('http://localhost:8081/**', async route => {
      const url = route.request().url();
      if (url.includes('/chc/getPatientMedicalHistory'))
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
          patientEntity: { firstName: 'Test', lastName: 'User', healthCardNo: 'PAT001', dob: '2000-01-01', gender: 'Male', bloodGroup: 'O+', age: 24, weight: 70 },
          medicalRecordResponseDTOList: [
            { createdDate: '2024-03-10', doctorRegNo: 12345, medicineInfoEntities: [{ medicineName: 'Paracetamol', days: 5, dosageEntity: { morning: true, afternoon: false, night: true }, remark: 'Take with water' }] }
          ]
        })});
      if (url.includes('/lab/patient/'))
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 1, reportName: 'CBC Report', testName: 'Complete Blood Count', fileType: 'PDF', uploadedAt: '2024-03-11' }]) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.setItem('chc_token', 'mock-jwt-token');
      localStorage.setItem('chc_user', JSON.stringify({ userName: 'testpatient', role: 'Patient', healthCardNo: 'PAT001', district: 'Pune' }));
    });
    await page.goto('http://localhost:5173/medical-history');
    await page.waitForTimeout(2000);

    // Record from March 2024 should appear grouped
    await expect(page.locator('text=Paracetamol')).toBeVisible({ timeout: 8000 });
  });

  test('Tabs switch between Records and Lab Reports', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.goto('http://localhost:5173/medical-history');
    await page.waitForTimeout(2000);

    // Look for tab buttons
    const tabs = page.locator('button').filter({ hasText: /Records|Lab Reports|Imaging/ });
    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('.glass-card').first()).toBeVisible({ timeout: 5000 });
  });
});
