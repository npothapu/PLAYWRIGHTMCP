
import { test, expect } from '@playwright/test';
import { petitionTestCases } from '../../utils/data/petitionTestCases';

test.describe('Blue Paradox Petition Form', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    const cookieBtn = page.locator('button', { hasText: /accept|agree|got it|allow/i });
    if (await cookieBtn.isVisible().catch(() => false)) {
      await cookieBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  for (const tc of petitionTestCases) {
    test(tc.description, { 
      tag: ['@petition', '@form', '@validation', '@desktop']
    }, async ({ page }) => {
      const petitionBtn = page.getByRole('button', { name: 'Sign the Petition' }).first();
      await petitionBtn.click();

      const firstNameInput = page.getByRole('textbox', { name: 'First Name' });
      const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const zipInput = page.getByRole('textbox', { name: 'Zip Code' });
      const updatesCheckbox = page.getByRole('checkbox', { name: /updates and communications/i });
      
      await expect(firstNameInput).toBeVisible();
      await expect(lastNameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(zipInput).toBeVisible();
      await expect(updatesCheckbox).toBeVisible();

      await firstNameInput.fill(tc.fields.firstName);
      await lastNameInput.fill(tc.fields.lastName);
      await emailInput.fill(tc.fields.email);
      await zipInput.fill(tc.fields.zipCode);
      
      if (tc.fields.updatesOptIn) {
        await updatesCheckbox.check();
      } else {
        await updatesCheckbox.uncheck();
      }

      const submitBtn = page.getByRole('button', { name: 'Sign the Petition' }).last();
      await submitBtn.click();

      if (tc.expectErrors && tc.expectErrors.length > 0) {
        await expect(firstNameInput).toBeVisible();
      }
      
      if (tc.expectSuccess) {
        const successMessage = page.getByText('Thank you for supporting EPR legislation!', { exact: false });
        await expect(successMessage).toBeVisible();
      }
    });
  }
});