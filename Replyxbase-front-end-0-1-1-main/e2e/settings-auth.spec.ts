import { test, expect } from '@playwright/test';

// Use authenticated state
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Settings Page (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/dashboard/settings');
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('should display user profile information', async ({ page }) => {
    await page.getByRole('button', { name: /profile/i }).click();
    await page.waitForTimeout(1000);
    
    // Check if user data is loaded
    const nameInput = page.locator('input[type="text"]').first();
    const nameValue = await nameInput.inputValue();
    expect(nameValue).toBeTruthy();
    
    const emailInput = page.locator('input[type="email"]');
    const emailValue = await emailInput.inputValue();
    expect(emailValue).toContain('@');
  });

  test('should display organization information', async ({ page }) => {
    await page.getByRole('button', { name: /organization/i }).click();
    await page.waitForTimeout(1000);
    
    // Check if organization data is loaded
    const orgNameInput = page.locator('input[type="text"]').first();
    const orgName = await orgNameInput.inputValue();
    expect(orgName).toBeTruthy();
  });

  test('should display team members', async ({ page }) => {
    await page.getByRole('button', { name: /team/i }).click();
    await page.waitForTimeout(2000);
    
    // Check if members table has content
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check if at least one member row exists (or empty state)
    const hasMembers = await page.locator('tbody tr').count() > 0;
    const hasEmptyState = await page.getByText(/no members/i).isVisible().catch(() => false);
    
    expect(hasMembers || hasEmptyState).toBe(true);
  });

  test('should load billing information', async ({ page }) => {
    await page.getByRole('button', { name: /billing/i }).click();
    await page.waitForTimeout(2000);
    
    // Check if billing section loads
    const hasPlan = await page.getByText(/upgrade plan|current plan/i).isVisible().catch(() => false);
    const noPlan = await page.getByText(/no active plan/i).isVisible().catch(() => false);
    
    expect(hasPlan || noPlan).toBe(true);
  });
});

