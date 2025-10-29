import { test, expect } from '@playwright/test';
import { BasePage, GooglePage } from '../../fixtures/pages';
import { TestUtils } from '../../helpers/test-utils';

const tags = { tag: ["@webtest", "@smoke", "@navigation"] } as { tag: string[] };

test.describe('Website Navigation', () => {
  
  test('should navigate to main page and verify core elements', tags, async ({ page }) => {
    const config = TestUtils.getEnvironmentConfig();
    const basePage = new BasePage(page);
    
    await basePage.goto();
    await TestUtils.waitForPageLoad(page);
    await TestUtils.handleEnvironmentSpecificActions(page);

    // Environment-specific validations
    if (config.isQA && config.baseUrl.includes('google.com')) {
      const googlePage = new GooglePage(page);
      await googlePage.verifyGoogleElements();
      await expect(page).toHaveURL(/google\./);
    } else {
      // Generic validations for other environments
      await expect(page.locator('body')).toBeVisible();
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    }

    await TestUtils.takeScreenshot(page, `navigation-${config.environment}`);
  });
});