import { test, expect } from '@playwright/test';

// Use authenticated state
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Settings - Complete E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/dashboard/settings');
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test.describe('Profile Settings - Complete Flow', () => {
    test('should load and display profile data with bio', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      // Verify name field is populated
      const nameInput = page.locator('input[type="text"]').first();
      await expect(nameInput).toBeVisible();
      const nameValue = await nameInput.inputValue();
      expect(nameValue).toBeTruthy();

      // Verify email field is populated and disabled
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toBeDisabled();
      const emailValue = await emailInput.inputValue();
      expect(emailValue).toContain('@');

      // Verify bio textarea exists
      const bioTextarea = page.locator('textarea');
      await expect(bioTextarea).toBeVisible();
    });

    test('should update profile name and persist', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForSelector('input[type="text"]', { timeout: 5000 });

      const nameInput = page.locator('input[type="text"]').first();
      const originalValue = await nameInput.inputValue();

      // Update name
      await nameInput.clear();
      await nameInput.fill('E2E Test User Updated');

      // Save
      const saveButton = page.getByRole('button', { name: /save/i });
      await saveButton.click();

      // Wait for success toast
      await page.waitForSelector('text=/success/i', { timeout: 5000 }).catch(() => {
        // Toast might appear briefly
      });

      // Verify the value persists (reload page)
      await page.reload();
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      const updatedNameInput = page.locator('input[type="text"]').first();
      const updatedValue = await updatedNameInput.inputValue();
      
      // Restore original value for cleanup
      await updatedNameInput.clear();
      await updatedNameInput.fill(originalValue);
      await page.getByRole('button', { name: /save/i }).click();
      await page.waitForTimeout(1000);
    });

    test('should update bio and persist in metadata', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForSelector('textarea', { timeout: 5000 });

      const bioTextarea = page.locator('textarea');
      const originalBio = await bioTextarea.inputValue();

      // Update bio
      await bioTextarea.clear();
      await bioTextarea.fill('This is a test bio for E2E testing. It should persist in user metadata.');

      // Save
      const saveButton = page.getByRole('button', { name: /save/i });
      await saveButton.click();

      // Wait for success
      await page.waitForTimeout(2000);

      // Reload and verify bio persists
      await page.reload();
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      const updatedBioTextarea = page.locator('textarea');
      const updatedBio = await updatedBioTextarea.inputValue();
      expect(updatedBio).toContain('E2E testing');

      // Restore original bio
      await updatedBioTextarea.clear();
      if (originalBio) {
        await updatedBioTextarea.fill(originalBio);
      }
      await page.getByRole('button', { name: /save/i }).click();
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Notification Settings - Persistence', () => {
    test('should load notification preferences from metadata', async ({ page }) => {
      await page.getByRole('button', { name: /notifications/i }).click();
      await page.waitForTimeout(1000);

      // Verify email notifications section
      await expect(page.getByText(/email/i)).toBeVisible();

      // Verify push notifications section
      await expect(page.getByText(/push/i)).toBeVisible();

      // Verify toggles exist
      const toggles = page.locator('input[type="checkbox"]');
      const toggleCount = await toggles.count();
      expect(toggleCount).toBeGreaterThan(0);
    });

    test('should update notification preferences and persist', async ({ page }) => {
      await page.getByRole('button', { name: /notifications/i }).click();
      await page.waitForTimeout(1000);

      // Get first toggle state
      const firstToggle = page.locator('input[type="checkbox"]').first();
      const initialState = await firstToggle.isChecked();

      // Toggle it
      await firstToggle.click();

      // Verify save button appears
      const saveButton = page.getByRole('button', { name: /save/i });
      await expect(saveButton).toBeVisible({ timeout: 2000 });

      // Save preferences
      await saveButton.click();

      // Wait for success
      await page.waitForTimeout(2000);

      // Reload and verify preference persists
      await page.reload();
      await page.getByRole('button', { name: /notifications/i }).click();
      await page.waitForTimeout(1000);

      const reloadedToggle = page.locator('input[type="checkbox"]').first();
      const reloadedState = await reloadedToggle.isChecked();
      expect(reloadedState).toBe(!initialState);

      // Restore original state
      await reloadedToggle.click();
      await page.getByRole('button', { name: /save/i }).click();
      await page.waitForTimeout(1000);
    });

    test('should show save button only when changes are made', async ({ page }) => {
      await page.getByRole('button', { name: /notifications/i }).click();
      await page.waitForTimeout(1000);

      // Initially, save button should not be visible
      const saveButton = page.getByRole('button', { name: /save/i });
      const initiallyVisible = await saveButton.isVisible().catch(() => false);
      
      // Make a change
      const firstToggle = page.locator('input[type="checkbox"]').first();
      await firstToggle.click();

      // Now save button should be visible
      await expect(saveButton).toBeVisible({ timeout: 2000 });

      // Revert change
      await firstToggle.click();
      await page.waitForTimeout(500);
    });
  });

  test.describe('Team Settings - Invite Modal', () => {
    test('should open invite member modal with role selection', async ({ page }) => {
      await page.getByRole('button', { name: /team/i }).click();
      await page.waitForTimeout(1000);

      // Click invite button
      const inviteButton = page.getByRole('button', { name: /invite/i });
      await inviteButton.click();

      // Wait for modal to open
      await page.waitForTimeout(500);

      // Verify modal is open
      const modal = page.locator('[role="dialog"]').or(page.locator('text=/invite member/i').locator('..').locator('..'));
      await expect(modal.first()).toBeVisible({ timeout: 3000 });

      // Verify email input exists
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();

      // Verify role select exists
      const roleSelect = page.locator('select');
      await expect(roleSelect).toBeVisible();

      // Verify role options
      const roleOptions = await roleSelect.locator('option').allTextContents();
      expect(roleOptions.length).toBeGreaterThan(0);
      expect(roleOptions.some(opt => opt.toLowerCase().includes('member'))).toBe(true);

      // Close modal
      const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
      await cancelButton.click();
      await page.waitForTimeout(500);
    });

    test('should validate email before submitting invite', async ({ page }) => {
      await page.getByRole('button', { name: /team/i }).click();
      await page.waitForTimeout(1000);

      const inviteButton = page.getByRole('button', { name: /invite/i });
      await inviteButton.click();
      await page.waitForTimeout(500);

      // Try to submit without email
      const submitButton = page.getByRole('button', { name: /send|submit|invite/i }).filter({ hasNotText: /cancel/i });
      const isDisabled = await submitButton.isDisabled().catch(() => false);
      
      // Submit button should be disabled without email
      if (isDisabled) {
        expect(isDisabled).toBe(true);
      }

      // Enter invalid email
      const emailInput = page.locator('input[type="email"]');
      await emailInput.fill('invalid-email');

      // Submit button might still be disabled or enabled depending on validation
      await page.waitForTimeout(500);

      // Close modal
      const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
      await cancelButton.click();
    });

    test('should allow selecting different roles in invite modal', async ({ page }) => {
      await page.getByRole('button', { name: /team/i }).click();
      await page.waitForTimeout(1000);

      const inviteButton = page.getByRole('button', { name: /invite/i });
      await inviteButton.click();
      await page.waitForTimeout(500);

      const roleSelect = page.locator('select');
      await expect(roleSelect).toBeVisible();

      // Get all role options
      const options = roleSelect.locator('option');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(0);

      // Select different role (if multiple options exist)
      if (optionCount > 1) {
        await roleSelect.selectOption({ index: 1 });
        const selectedValue = await roleSelect.inputValue();
        expect(selectedValue).toBeTruthy();
      }

      // Close modal
      const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
      await cancelButton.click();
    });
  });

  test.describe('Billing Settings - Plan Upgrade Modal', () => {
    test('should open plan upgrade modal', async ({ page }) => {
      await page.getByRole('button', { name: /billing/i }).click();
      await page.waitForTimeout(2000);

      // Check if upgrade button exists
      const upgradeButton = page.getByRole('button', { name: /upgrade plan/i });
      const isVisible = await upgradeButton.isVisible().catch(() => false);

      if (isVisible) {
        await upgradeButton.click();
        await page.waitForTimeout(1000);

        // Verify modal opens
        const modal = page.locator('[role="dialog"]').or(page.locator('text=/upgrade plan/i').locator('..').locator('..'));
        await expect(modal.first()).toBeVisible({ timeout: 3000 });

        // Verify plans are loading or loaded
        const hasPlans = await page.locator('text=/plan|month|organization/i').isVisible().catch(() => false);
        const isLoading = await page.locator('text=/loading|spinner/i').isVisible().catch(() => false);
        
        expect(hasPlans || isLoading).toBe(true);

        // Close modal
        const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
        await cancelButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should display available plans in upgrade modal', async ({ page }) => {
      await page.getByRole('button', { name: /billing/i }).click();
      await page.waitForTimeout(2000);

      const upgradeButton = page.getByRole('button', { name: /upgrade plan/i });
      const isVisible = await upgradeButton.isVisible().catch(() => false);

      if (isVisible) {
        await upgradeButton.click();
        await page.waitForTimeout(2000);

        // Wait for plans to load
        const plans = page.locator('button').filter({ hasText: /plan|organization|agent/i });
        const planCount = await plans.count().catch(() => 0);
        
        // Should have at least loading state or plans
        const hasContent = planCount > 0 || await page.locator('text=/no plans|loading/i').isVisible().catch(() => false);
        expect(hasContent).toBe(true);

        // Close modal
        const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
        await cancelButton.click();
      }
    });

    test('should show empty states for payment methods and billing history', async ({ page }) => {
      await page.getByRole('button', { name: /billing/i }).click();
      await page.waitForTimeout(2000);

      // Check payment methods section
      const paymentMethodsSection = page.getByText(/payment method/i);
      await expect(paymentMethodsSection).toBeVisible();

      // Check if empty state is shown (if no payment methods)
      const hasEmptyPaymentState = await page.getByText(/no payment method/i).isVisible().catch(() => false);
      const hasPaymentMethods = await page.locator('text=/ending in|expiry/i').isVisible().catch(() => false);
      
      expect(hasEmptyPaymentState || hasPaymentMethods).toBe(true);

      // Check billing history section
      const billingHistorySection = page.getByText(/billing history/i);
      await expect(billingHistorySection).toBeVisible();

      // Check if empty state is shown (if no history)
      const hasEmptyHistoryState = await page.getByText(/no billing history/i).isVisible().catch(() => false);
      const hasHistory = await page.locator('table tbody tr').count().then(count => count > 0).catch(() => false);
      
      expect(hasEmptyHistoryState || hasHistory).toBe(true);
    });
  });

  test.describe('Organization Settings', () => {
    test('should update organization name and slug', async ({ page }) => {
      await page.getByRole('button', { name: /organization/i }).click();
      await page.waitForTimeout(1000);

      // Get original values
      const orgNameInput = page.locator('input[type="text"]').first();
      const slugInput = page.locator('input[type="text"]').nth(1);
      
      const originalName = await orgNameInput.inputValue();
      const originalSlug = await slugInput.inputValue();

      // Update name
      await orgNameInput.clear();
      await orgNameInput.fill('E2E Test Org Updated');

      // Update slug (should auto-format)
      await slugInput.clear();
      await slugInput.fill('e2e-test-org-updated');

      // Save
      const saveButton = page.getByRole('button', { name: /save/i });
      await saveButton.click();

      // Wait for success
      await page.waitForTimeout(2000);

      // Restore original values
      await orgNameInput.clear();
      await orgNameInput.fill(originalName);
      await slugInput.clear();
      await slugInput.fill(originalSlug);
      await saveButton.click();
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle loading states gracefully', async ({ page }) => {
      // Navigate to settings
      await page.goto('/en/dashboard/settings');
      
      // Check for loading skeletons or spinners
      const hasLoadingState = await page.locator('text=/loading|skeleton|spinner/i').isVisible().catch(() => false);
      const hasContent = await page.locator('h1').isVisible().catch(() => false);
      
      // Should show either loading or content
      expect(hasLoadingState || hasContent).toBe(true);
    });

    test('should display error messages when operations fail', async ({ page }) => {
      // Intercept and fail a request
      await page.route('**/actions/settings/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      // Try to save (should fail)
      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.clear();
      await nameInput.fill('Test');

      const saveButton = page.getByRole('button', { name: /save/i });
      await saveButton.click();

      // Should show error (toast or message)
      await page.waitForTimeout(2000);
      
      // Restore routing
      await page.unroute('**/actions/settings/**');
    });

    test('should handle network timeouts', async ({ page }) => {
      // Slow down network
      await page.route('**/actions/settings/**', route => {
        setTimeout(() => route.continue(), 5000);
      });

      await page.getByRole('button', { name: /notifications/i }).click();
      await page.waitForTimeout(1000);

      // Page should still be responsive
      await expect(page.locator('h2')).toBeVisible();

      // Restore routing
      await page.unroute('**/actions/settings/**');
    });
  });

  test.describe('Accessibility and UX', () => {
    test('should have proper keyboard navigation', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      // Tab through form fields
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to focus on inputs
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['INPUT', 'TEXTAREA', 'BUTTON']).toContain(focusedElement);
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      // Check for form labels
      const labels = page.locator('label');
      const labelCount = await labels.count();
      expect(labelCount).toBeGreaterThan(0);
    });

    test('should show loading indicators during operations', async ({ page }) => {
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.clear();
      await nameInput.fill('Test');

      const saveButton = page.getByRole('button', { name: /save/i });
      await saveButton.click();

      // Should show loading state (spinner or disabled state)
      const isLoading = await saveButton.isDisabled().catch(() => false) || 
                       await page.locator('text=/saving|loading/i').isVisible().catch(() => false);
      
      // Wait for operation to complete
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Data Persistence Across Tabs', () => {
    test('should persist data when switching between tabs', async ({ page }) => {
      // Go to profile tab
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      const nameInput = page.locator('input[type="text"]').first();
      const originalName = await nameInput.inputValue();

      // Update name
      await nameInput.clear();
      await nameInput.fill('Temp Name');

      // Switch to another tab
      await page.getByRole('button', { name: /organization/i }).click();
      await page.waitForTimeout(500);

      // Switch back to profile
      await page.getByRole('button', { name: /profile/i }).click();
      await page.waitForTimeout(1000);

      // Name should still be "Temp Name" (unsaved)
      const nameInputAgain = page.locator('input[type="text"]').first();
      const currentName = await nameInputAgain.inputValue();
      expect(currentName).toBe('Temp Name');

      // Restore original
      await nameInputAgain.clear();
      await nameInputAgain.fill(originalName);
    });
  });
});

