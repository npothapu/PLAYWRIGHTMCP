import { test, expect } from '@playwright/test';

const tags = { tag: ["@webtest", "@smoke", "@generic"] } as { tag: string[] };

const maybeAcceptConsent = async (page: import('@playwright/test').Page) => {
  const candidates = [/^accept all$/i, /^i agree$/i, /^agree$/i, /^accept$/i, /^reject all$/i];
  for (const rx of candidates) {
    const btn = page.getByRole('button', { name: rx });
    if (await btn.isVisible().catch(() => false)) { await btn.click(); return; }
  }
  for (const frame of page.frames()) {
    for (const rx of candidates) {
      const fb = frame.getByRole('button', { name: rx });
      if (await fb.isVisible().catch(() => false)) { await fb.click(); return; }
    }
  }
};

test('website loads and is accessible', tags, async ({ page }) => {
  const base = process.env.BASE_URL || 'https://www.google.com';
  const environment = process.env.ENV || 'qa';
  
  expect(base).toBeTruthy();
  console.log(`Testing ${environment} environment: ${base}`);

  // Navigate to the base URL
  const response = await page.goto(base);
  expect(response?.ok()).toBeTruthy();

  // Handle any consent dialogs
  await maybeAcceptConsent(page);

  // Check that the page has a title
  const title = await page.title();
  expect(title).toBeTruthy();
  expect(title.length).toBeGreaterThan(0);
  console.log(`Page title: ${title}`);

  // Check that the page has loaded completely
  await page.waitForLoadState('networkidle');

  // Verify basic page structure exists
  const body = page.locator('body');
  await expect(body).toBeVisible();

  // Check for basic meta elements (optional check)
  const viewport = page.locator('meta[name="viewport"]');
  const hasViewport = await viewport.count() > 0;
  if (hasViewport) {
    console.log('Viewport meta tag found');
  } else {
    console.log('No viewport meta tag found (not required)');
  }

  // Environment-specific validations
  if (base.includes('google.com')) {
    // Google-specific checks - be more flexible
    const searchElements = [
      page.getByRole('textbox', { name: /search/i }).first(),
      page.getByRole('search').first(),
      page.locator('input[name="q"]'),
      page.locator('textarea[name="q"]')
    ];
    
    let searchFound = false;
    for (const element of searchElements) {
      if (await element.isVisible().catch(() => false)) {
        console.log('Google search element found');
        searchFound = true;
        break;
      }
    }
    
    if (!searchFound) {
      console.log('Warning: No search element found on Google page');
    }
  } else if (base.includes('vml.com')) {
    // VML-specific checks
    const navElements = page.locator('header, nav, .header, .navigation').first();
    if (await navElements.isVisible().catch(() => false)) {
      console.log('VML navigation found');
    } else {
      console.log('Warning: No navigation found on VML page');
    }
  } else if (base.includes('microsoft.com')) {
    // Microsoft-specific checks
    const navElements = page.locator('header, nav, .header, .navigation').first();
    if (await navElements.isVisible().catch(() => false)) {
      console.log('Microsoft navigation found');
    } else {
      console.log('Warning: No navigation found on Microsoft page');
    }
  }

  // Take a screenshot for visual verification
  await page.screenshot({ 
    path: `test-results/smoke-${environment}-${Date.now()}.png`,
    fullPage: false 
  });
});