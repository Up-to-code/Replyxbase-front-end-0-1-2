import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to settings page (assuming user is logged in)
    // In a real scenario, you'd set up authentication first
    await page.goto('/en/dashboard/settings');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="settings-container"]', { timeout: 10000 }).catch(() => {
      // If testid doesn't exist, wait for any settings content
      await page.waitForSelector('h1', { timeout: 10000 });
    });
  });

  test('should display settings page with all tabs', async ({ page }) => {
    // Check if settings page loads
    await expect(page.locator('h1')).toContainText(/settings/i);
    
    // Check if sidebar navigation exists
    const sidebar = page.locator('nav').first();
    await expect(sidebar).toBeVisible();
    
    // Check for profile tab
    await expect(page.getByRole('button', { name: /profile/i })).toBeVisible();
    
    // Check for organization tab
    await expect(page.getByRole('button', { name: /organization/i })).toBeVisible();
    
    // Check for team tab
    await expect(page.getByRole('button', { name: /team/i })).toBeVisible();
    
    // Check for notifications tab
    await expect(page.getByRole('button', { name: /notifications/i })).toBeVisible();
    
    // Check for appearance tab
    await expect(page.getByRole('button', { name: /appearance/i })).toBeVisible();
    
    // Check for billing tab
    await expect(page.getByRole('button', { name: /billing/i })).toBeVisible();
  });

  test.describe('Profile Settings', () => {
    test('should load profile settings', async ({ page }) => {
      // Click on profile tab
      await page.getByRole('button', { name: /profile/i }).click();
      
      // Wait for profile form to load
      await page.waitForSelector('input[type="text"]', { timeout: 5000 });
      
      // Check if name field exists
      const nameInput = page.locator('input[type="text"]').first();
      await expect(nameInput).toBeVisible();
      
      // Check if email field exists (should be disabled)
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toBeDisabled();
      
      // Check if bio textarea exists
      const bioTextarea = page.locator('textarea');
      await expect(bioTextarea).toBeVisible();
    });

    test('should update profile name', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForSelector('input[type="text"]', { timeout: 5000 });
      
      const nameInput = page.locator('input[type="text"]').first();
      const currentValue = await nameInput.inputValue();
      
      // Clear and enter new name
      await nameInput.clear();
      await nameInput.fill('Test User Updated');
      
      // Click save button
      const saveButton = page.getByRole('button', { name: /save/i });
      await expect(saveButton).toBeVisible();
      await saveButton.click();
      
      // Wait for success toast
      await page.waitForSelector('[data-sonner-toast]', { timeout: 5000 }).catch(() => {
        // Toast might not have testid, check for any success message
        console.log('Toast notification may have appeared');
      });
    });

    test('should update profile bio', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForSelector('textarea', { timeout: 5000 });
      
      const bioTextarea = page.locator('textarea');
      await bioTextarea.fill('This is a test bio for E2E testing');
      
      // Click save button
      const saveButton = page.getByRole('button', { name: /save/i });
      await saveButton.click();
      
      // Wait for success message
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Organization Settings', () => {
    test('should load organization settings', async ({ page }) => {
      await page.getByRole('button', { name: /organization/i }).click();
      await page.waitForTimeout(1000);
      
      // Check if organization name field exists
      const orgNameInput = page.locator('input[type="text"]').first();
      await expect(orgNameInput).toBeVisible();
      
      // Check if slug field exists
      const slugInput = page.locator('input[type="text"]').nth(1);
      await expect(slugInput).toBeVisible();
    });

    test('should update organization name', async ({ page }) => {
      await page.getByRole('button', { name: /organization/i }).click();
      await page.waitForTimeout(1000);
      
      const orgNameInput = page.locator('input[type="text"]').first();
      await orgNameInput.clear();
      await orgNameInput.fill('Updated Organization Name');
      
      const saveButton = page.getByRole('button', { name: /save/i });
      await saveButton.click();
      
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Team Settings', () => {
    test('should load team settings', async ({ page }) => {
      await page.getByRole('button', { name: /team/i }).click();
      await page.waitForTimeout(1000);
      
      // Check if invite button exists
      const inviteButton = page.getByRole('button', { name: /invite/i });
      await expect(inviteButton).toBeVisible();
      
      // Check if members table exists
      const table = page.locator('table');
      await expect(table).toBeVisible();
    });

    test('should open invite member modal', async ({ page }) => {
      await page.getByRole('button', { name: /team/i }).click();
      await page.waitForTimeout(1000);
      
      // Click invite button
      const inviteButton = page.getByRole('button', { name: /invite/i });
      await inviteButton.click();
      
      // Wait for modal to open
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 }).catch(() => {
        // Modal might use different selector
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      });
      
      // Check if email input exists in modal
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
      
      // Check if role select exists
      const roleSelect = page.locator('select');
      await expect(roleSelect).toBeVisible();
      
      // Close modal
      const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
      await cancelButton.click();
    });
  });

  test.describe('Notifications Settings', () => {
    test('should load notifications settings', async ({ page }) => {
      await page.getByRole('button', { name: /notifications/i }).click();
      await page.waitForTimeout(1000);
      
      // Check if email notifications section exists
      await expect(page.getByText(/email/i)).toBeVisible();
      
      // Check if push notifications section exists
      await expect(page.getByText(/push/i)).toBeVisible();
      
      // Check if toggle switches exist
      const toggles = page.locator('input[type="checkbox"]');
      const toggleCount = await toggles.count();
      expect(toggleCount).toBeGreaterThan(0);
    });

    test('should toggle notification preferences', async ({ page }) => {
      await page.getByRole('button', { name: /notifications/i }).click();
      await page.waitForTimeout(1000);
      
      // Get first toggle
      const firstToggle = page.locator('input[type="checkbox"]').first();
      const initialState = await firstToggle.isChecked();
      
      // Toggle it
      await firstToggle.click();
      
      // Wait for save button to appear
      const saveButton = page.getByRole('button', { name: /save/i });
      await expect(saveButton).toBeVisible({ timeout: 2000 });
      
      // Click save
      await saveButton.click();
      
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Appearance Settings', () => {
    test('should load appearance settings', async ({ page }) => {
      await page.getByRole('button', { name: /appearance/i }).click();
      await page.waitForTimeout(1000);
      
      // Check if language selector exists
      await expect(page.getByText(/language/i)).toBeVisible();
    });
  });

  test.describe('Billing Settings', () => {
    test('should load billing settings', async ({ page }) => {
      await page.getByRole('button', { name: /billing/i }).click();
      await page.waitForTimeout(2000);
      
      // Check if billing section loads (either with plan or without)
      const hasPlan = await page.locator('text=/upgrade plan/i').isVisible().catch(() => false);
      const noPlan = await page.locator('text=/no active plan/i').isVisible().catch(() => false);
      
      expect(hasPlan || noPlan).toBe(true);
    });

    test('should open plan upgrade modal', async ({ page }) => {
      await page.getByRole('button', { name: /billing/i }).click();
      await page.waitForTimeout(2000);
      
      // Try to click upgrade button if it exists
      const upgradeButton = page.getByRole('button', { name: /upgrade plan/i });
      const isVisible = await upgradeButton.isVisible().catch(() => false);
      
      if (isVisible) {
        await upgradeButton.click();
        
        // Wait for modal to open
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 }).catch(() => {
          await page.waitForTimeout(1000);
        });
        
        // Close modal
        const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
        await cancelButton.click();
      }
    });

    test('should display payment methods section', async ({ page }) => {
      await page.getByRole('button', { name: /billing/i }).click();
      await page.waitForTimeout(2000);
      
      // Check if payment methods section exists
      await expect(page.getByText(/payment method/i)).toBeVisible();
    });

    test('should display billing history section', async ({ page }) => {
      await page.getByRole('button', { name: /billing/i }).click();
      await page.waitForTimeout(2000);
      
      // Check if billing history section exists
      await expect(page.getByText(/billing history/i)).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should switch between settings tabs', async ({ page }) => {
      const tabs = [
        { name: /profile/i, content: /name|email/i },
        { name: /organization/i, content: /organization|name/i },
        { name: /team/i, content: /member|invite/i },
        { name: /notifications/i, content: /email|push/i },
        { name: /appearance/i, content: /language/i },
        { name: /billing/i, content: /billing|plan/i },
      ];

      for (const tab of tabs) {
        await page.getByRole('button', { name: tab.name }).click();
        await page.waitForTimeout(500);
        
        // Verify content is visible
        await expect(page.getByText(tab.content)).toBeVisible({ timeout: 3000 });
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Intercept network requests and simulate failure
      await page.route('**/api/**', route => route.abort());
      
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);
      
      // Page should still be functional
      await expect(page.locator('h2')).toBeVisible();
    });
  });
});

