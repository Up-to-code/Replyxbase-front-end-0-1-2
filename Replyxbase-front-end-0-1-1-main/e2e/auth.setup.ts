import { test as setup, expect } from '@playwright/test';

/**
 * Authentication setup for E2E tests
 * This file handles login before running tests
 */
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/en/login');
  
  // Wait for login form
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  
  // Fill in login credentials
  // NOTE: Update these with your test user credentials
  const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
  const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123';
  
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  
  // Submit login form
  await page.click('button[type="submit"]');
  
  // Wait for successful login (redirect to dashboard)
  await page.waitForURL('**/dashboard/**', { timeout: 10000 });
  
  // Verify we're logged in by checking for user menu or dashboard content
  await expect(page.locator('body')).toContainText(/dashboard|settings|profile/i, { timeout: 10000 });
  
  // Save authenticated state
  await page.context().storageState({ path: authFile });
});

