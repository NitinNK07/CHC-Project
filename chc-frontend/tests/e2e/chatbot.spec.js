import { test, expect } from '@playwright/test';

test.describe('AI Chatbot Feature', () => {
  test('should render the chatbot FAB on the dashboard and allow toggling', async ({ page }) => {
    // Navigate to local environment (assuming dev server runs on localhost:5173)
    await page.goto('http://localhost:5173/login');
    
    // Login as a user (replace with valid credentials if testing actual functionality)
    // We can also test just the presence of the component if mocked or if the button renders.
    // For this e2e, let's just make sure we hit the dashboard
    
    // Assuming we have a test user
    await page.fill('input[placeholder="Username or Email"]', 'testuser');
    await page.fill('input[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL('**/dashboard');

    // Ensure the FAB is present
    const chatbotFab = page.locator('.chatbot-fab');
    await expect(chatbotFab).toBeVisible();

    // Click the FAB to open the chatbot
    await chatbotFab.click();

    // Check if Chatbot window opens
    const chatbotWindow = page.locator('.chatbot-window');
    await expect(chatbotWindow).toBeVisible();

    // Check for the AI Health Assistant title
    await expect(page.locator('.chatbot-title')).toContainText('AI Health Assistant');

    // Type a message
    const input = page.locator('.chatbot-input input');
    await input.fill('Hello AI');
    await page.click('.chatbot-input button');

    // Verify the message appears in the chat
    await expect(page.locator('.chatbot-message-text').last()).toContainText('Hello AI');
  });
});
