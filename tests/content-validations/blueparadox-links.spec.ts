import { test, expect, type Page } from '@playwright/test';
import { headerLinks, footerLinks, defaultFooterLinks } from '../../utils/data/links';

async function checkLinks(page: Page, links: Array<{ name: string; url: string }>, baseUrl: string): Promise<void> {
  for (const link of links) {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanLinkUrl = link.url.startsWith('/') ? link.url : `/${link.url}`;
    const fullUrl = link.url.startsWith('http') ? link.url : `${cleanBaseUrl}${cleanLinkUrl}`;
    
    const isExternalLink = fullUrl.startsWith('http') && !fullUrl.includes(cleanBaseUrl.replace(/https?:\/\//, ''));
    
    if (isExternalLink) {
      continue;
    }
    
    await test.step(`Checking link: ${link.name}`, async () => {
      const response = await page.goto(fullUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      
      expect(response?.status(), `Link "${link.name}" at ${fullUrl} should return 200`).toBe(200);
    });
  }
}

test.describe('Blue Paradox Links Validation', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    const cookieBtn = page.getByRole('button', { name: /accept|agree|got it|allow/i });
    if (await cookieBtn.isVisible().catch(() => false)) {
      await cookieBtn.click();
    }
  });

  test('Check all header links for 200 status', { 
    tag: ['@links', '@navigation', '@header', '@desktop'] 
  }, async ({ page, baseURL }) => {
    await checkLinks(page, headerLinks, baseURL!);
  });

  test('Check footer links for US region', { 
    tag: ['@links', '@navigation', '@footer', '@desktop'] 
  }, async ({ page, baseURL }) => {
    await checkLinks(page, defaultFooterLinks, baseURL!);
  });

  test('Check footer links for France region', { 
    tag: ['@links', '@navigation', '@footer', '@desktop', '@france'] 
  }, async ({ page, baseURL }) => {
    await checkLinks(page, footerLinks['France (FR)'], baseURL!);
  });

  test('Check footer links for Great Britain region', { 
    tag: ['@links', '@navigation', '@footer', '@desktop', '@gb'] 
  }, async ({ page, baseURL }) => {
    await checkLinks(page, footerLinks['Great Britain (EN)'], baseURL!);
  });

  test('Check footer links for all regions', { 
    tag: ['@links', '@navigation', '@footer', '@comprehensive', '@desktop'] 
  }, async ({ page, baseURL }) => {
    const regions = Object.keys(footerLinks) as Array<keyof typeof footerLinks>;
    
    for (const region of regions) {
      await test.step(`Validating footer links for ${region}`, async () => {
        await checkLinks(page, footerLinks[region], baseURL!);
      });
    }
  });

  test('Validate page accessibility', { 
    tag: ['@accessibility', '@content', '@desktop'] 
  }, async ({ page }) => {
    await expect(page).toHaveTitle(/Blue Paradox/i);
    
    const navigation = page.getByRole('navigation').first();
    await expect(navigation).toBeVisible();
    
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible();
  });
});
