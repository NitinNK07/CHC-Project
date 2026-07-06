import { test, expect } from '@playwright/test';

// Helper: bypass login by injecting auth directly into localStorage
async function injectAuth(page, role = 'Doctor') {
  await page.goto('http://localhost:5173/login');
  await page.evaluate((role) => {
    localStorage.setItem('chc_token', 'mock-jwt-token');
    localStorage.setItem('chc_user', JSON.stringify({
      userName: 'testuser',
      role: role,
      healthCardNo: 'TEST001',
      district: 'TestDistrict'
    }));
  }, role);
}

test.describe('AI Chatbot Feature', () => {
  test('should render the chatbot FAB on dashboard and allow toggling', async ({ page }) => {
    // Mock all backend calls to prevent 503 errors
    await page.route('http://localhost:8081/**', async route => {
      const url = route.request().url();

      if (url.includes('/api/chat/history')) {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
      if (url.includes('/api/chat') && route.request().method() === 'POST') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'Hello! How can I help?' }) });
      }
      // Default: abort any other API calls gracefully
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    // Inject auth into localStorage and navigate to dashboard
    await injectAuth(page, 'Doctor');
    await page.goto('http://localhost:5173/dashboard');

    // Wait for dashboard to settle
    await page.waitForTimeout(2000);

    // Check chatbot FAB is present
    const chatbotFab = page.locator('.chatbot-fab');
    await expect(chatbotFab).toBeVisible({ timeout: 10000 });

    // Open the chatbot using force click (handles any overlay issues)
    await chatbotFab.click({ force: true });
    // Wait for chatbot window to appear
    const chatbotWindow = page.locator('.chatbot-window');
    await expect(chatbotWindow).toBeVisible({ timeout: 8000 });

    // Verify title
    await expect(page.locator('.chatbot-title')).toContainText('AI Health Assistant');

    // Send a message
    await page.locator('.chatbot-input input').fill('Hello AI');
    await page.keyboard.press('Enter');

    // Verify user message appears
    await expect(page.locator('.chatbot-message-wrapper.user').last()).toContainText('Hello AI', { timeout: 5000 });
  });
});
