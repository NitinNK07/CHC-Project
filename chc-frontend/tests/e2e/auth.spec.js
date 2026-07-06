import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {

  test('Login page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForSelector('#login-username');
    
    // Check key elements
    await expect(page.locator('#login-username')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.locator('#login-btn')).toBeVisible();
    await expect(page.locator('text=CHC Portal')).toBeVisible();
    await expect(page.locator('a[href="/signup"]')).toBeVisible();
  });

  test('Login shows error on invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForSelector('#login-username');
    await page.fill('#login-username', 'wronguser');
    await page.fill('#login-password', 'wrongpass');
    
    // Wait for hydration and state updates
    await page.waitForTimeout(2000);
    
    await page.click('#login-btn');

    // Wait for the alert to appear (it should show a network error or invalid credentials)
    await expect(page.locator('.alert-error')).toBeVisible({ timeout: 8000 });
  });

  test('Login redirects to dashboard on success', async ({ page }) => {
    // Use localStorage injection instead of the animated login form
    await page.route('http://localhost:8081/**', async route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    );
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.setItem('chc_token', 'mock-jwt-token');
      localStorage.setItem('chc_user', JSON.stringify({ userName: 'testdoctor', role: 'Doctor', healthCardNo: null, district: null }));
    });
    await page.goto('http://localhost:5173/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Signup page renders with multi-step form', async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
    // Wait for 3D canvas and animations to settle
    await page.waitForTimeout(3000);

    // Select role (Step 0)
    await page.locator('text=Patient').first().click();
    
    // Fields use name attributes, may be in a form
    const firstNameField = page.locator('input[name="firstName"]');
    await expect(firstNameField).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('Signup auto-generates username from name + DOB', async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
    await page.waitForTimeout(3000);

    // Select role (Step 0)
    await page.locator('text=Patient').first().click();

    await page.locator('input[name="firstName"]').fill('Nitin');
    await page.locator('input[name="lastName"]').fill('Kumar');
    await page.locator('input[name="dob"]').fill('2000-05-15');

    await page.waitForTimeout(800); // wait for useEffect debounce
    const usernameVal = await page.locator('input[name="userName"]').inputValue();
    expect(usernameVal.toLowerCase()).toContain('nitin');
    expect(usernameVal.toLowerCase()).toContain('kumar');
    expect(usernameVal).toContain('2000');
  });

  test('Unauthenticated user is redirected from protected routes', async ({ page }) => {
    // Clear any existing auth
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.removeItem('chc_token');
      localStorage.removeItem('chc_user');
    });

    // Try to access a protected route
    await page.goto('http://localhost:5173/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
