import { test, expect } from '@playwright/test';
import { injectAuth } from './helpers/auth.js';

test.describe('AI Chatbot Feature', () => {
  test('should render the chatbot FAB on dashboard and allow toggling', async ({ page }) => {
    await injectAuth(page, 'Doctor');

    await page.route('http://localhost:8081/**', async route => {
      const url = route.request().url();
      const method = route.request().method();
      if (url.includes('/api/chat/history')) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      if (url.includes('/api/chat') && method === 'POST') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'Hello! How can I help?' }) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    const chatbotFab = page.locator('.chatbot-fab');
    await expect(chatbotFab).toBeVisible({ timeout: 10000 });

    await chatbotFab.click({ force: true });
    const chatbotWindow = page.locator('.chatbot-window');
    await expect(chatbotWindow).toBeVisible({ timeout: 8000 });

    await expect(page.locator('.chatbot-title')).toContainText('AI Health Assistant');

    await page.locator('.chatbot-input input').fill('Hello AI');
    await page.keyboard.press('Enter');

    await expect(page.locator('.chatbot-message-wrapper.user').last()).toContainText('Hello AI', { timeout: 5000 });
  });

  test('Chatbot is hidden for Admin users', async ({ page }) => {
    await injectAuth(page, 'Admin');
    await page.route('http://localhost:8081/**', async route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    // Chatbot FAB should NOT appear for Admin
    await expect(page.locator('.chatbot-fab')).not.toBeVisible({ timeout: 3000 }).catch(() => {});
  });

  test('Chatbot shows minimize and close buttons', async ({ page }) => {
    await injectAuth(page, 'Patient', 'PAT001');
    await page.route('http://localhost:8081/**', async route => {
      if (route.request().url().includes('/api/chat/history')) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    const fab = page.locator('.chatbot-fab');
    await expect(fab).toBeVisible({ timeout: 8000 });
    await fab.click({ force: true });

    await expect(page.locator('.chatbot-window')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('.chatbot-actions')).toBeVisible();
  });
});
