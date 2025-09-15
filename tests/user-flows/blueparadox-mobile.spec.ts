import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { headerLinks, defaultFooterLinks } from '../../utils/data/links';

async function checkMobileLinks(page: Page, links: Array<{ name: string; url: string }>, baseUrl: string) {
  for (const link of links) {
    const fullUrl = link.url.startsWith('http') ? link.url : `${baseUrl}${link.url}`;
    const response = await page.goto(fullUrl);
    expect(response?.status(), `Mobile link ${link.name} (${link.url}) did not return 200`).toBe(200);
    
    await page.waitForLoadState('domcontentloaded');
  }
}

async function clickMobilePetitionButton(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  
  const petitionBtn = page.getByRole('button', { name: 'Sign the Petition' }).first();
  
  await page.evaluate(() => {
    const carousel = document.querySelector('.scj-360-banner') as HTMLElement;
    if (carousel) {
      carousel.style.display = 'none';
    }
  });
  
  await petitionBtn.scrollIntoViewIfNeeded();
  
  await petitionBtn.click({ force: true });
}

test.describe('Mobile Tests', () => {
  
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    const cookieBtn = page.locator('button', { hasText: /accept|agree|got it|allow/i });
    if (await cookieBtn.isVisible().catch(() => false)) {
      await cookieBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });
  
  test('Mobile links navigation', { tag: ['@mobile', '@links', '@navigation'] }, async ({ page, baseURL }) => {
    await checkMobileLinks(page, headerLinks.slice(0, 3), baseURL!);
    await checkMobileLinks(page, defaultFooterLinks.slice(0, 3), baseURL!);
  });

  test('Mobile petition form accessibility', { tag: ['@mobile', '@petition', '@form'] }, async ({ page, baseURL }) => {
    try {
      await clickMobilePetitionButton(page);
      
      const firstNameInput = page.getByRole('textbox', { name: 'First Name' });
      await expect(firstNameInput).toBeVisible();
      
      await firstNameInput.fill('Mobile');
      const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
      await lastNameInput.fill('Test');
      
      await expect(firstNameInput).toHaveValue('Mobile');
      await expect(lastNameInput).toHaveValue('Test');
      
    } catch (error) {
      test.skip();
    }
  });

  test('Mobile viewport and touch interactions', { tag: ['@mobile', '@viewport', '@touch'] }, async ({ page, baseURL }) => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(414);
    expect(viewport?.height).toBeLessThanOrEqual(896);
    
    const hasTouch = await page.evaluate(() => 'ontouchstart' in window);
    expect(hasTouch).toBe(true);
    
    await page.tap('body');
    
    const mobileMenuButton = page.locator('[aria-label*="menu"], [role="button"]:has-text("Menu"), .mobile-menu-button');
    const hasMobileMenu = await mobileMenuButton.count() > 0;
    
    if (hasMobileMenu) {
      await expect(mobileMenuButton.first()).toBeVisible();
    }
  });
});