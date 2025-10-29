// Page Object Model for better maintainability
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async goto(url?: string) {
    const baseUrl = process.env.BASE_URL || 'https://www.google.com';
    const targetUrl = url || baseUrl;
    const response = await this.page.goto(targetUrl);
    await expect(response?.ok()).toBeTruthy();
    return response;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async acceptCookieConsent() {
    const candidates = [/^accept all$/i, /^i agree$/i, /^agree$/i, /^accept$/i];
    for (const rx of candidates) {
      const btn = this.page.getByRole('button', { name: rx });
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        return true;
      }
    }
    
    // Check in frames as well
    for (const frame of this.page.frames()) {
      for (const rx of candidates) {
        const fb = frame.getByRole('button', { name: rx });
        if (await fb.isVisible().catch(() => false)) {
          await fb.click();
          return true;
        }
      }
    }
    return false;
  }

  async takeScreenshot(name: string) {
    const timestamp = Date.now();
    const fileName = `${name}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: `test-results/${fileName}`,
      fullPage: false 
    });
    return fileName;
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async verifyBasicPageStructure() {
    await expect(this.page.locator('body')).toBeVisible();
    const title = await this.getPageTitle();
    expect(title.length).toBeGreaterThan(0);
    return title;
  }
}

export class GooglePage extends BasePage {
  readonly searchBox: Locator;
  readonly gmailLink: Locator;
  readonly imagesLink: Locator;
  readonly appMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.getByRole('textbox', { name: /search/i }).first();
    this.gmailLink = page.getByRole('link', { name: /^gmail$/i });
    this.imagesLink = page.getByRole('link', { name: /^images$/i });
    this.appMenuButton = page.getByRole('button', { name: /google apps|apps/i });
  }

  async search(query: string) {
    await this.searchBox.fill(query);
    await this.searchBox.press('Enter');
    await this.waitForPageLoad();
  }

  async verifyGoogleElements() {
    await expect(this.page).toHaveURL(/google\./);
    
    // Try multiple ways to find search element
    const searchElements = [
      this.searchBox,
      this.page.getByRole('search').first(),
      this.page.locator('input[name="q"]'),
      this.page.locator('textarea[name="q"]')
    ];
    
    let searchFound = false;
    for (const element of searchElements) {
      if (await element.isVisible().catch(() => false)) {
        searchFound = true;
        break;
      }
    }
    
    expect(searchFound).toBeTruthy();
    return searchFound;
  }

  async clickGmail() {
    if (await this.gmailLink.isVisible().catch(() => false)) {
      await this.gmailLink.click();
      await expect(this.page).toHaveURL(/mail\.google\.|accounts\.google\.|workspace\.google\./);
      return true;
    }
    return false;
  }

  async clickImages() {
    if (await this.imagesLink.isVisible().catch(() => false)) {
      await this.imagesLink.click();
      await expect(this.page).toHaveURL(/images\.google\.|\/imghp\b/);
      return true;
    }
    return false;
  }
}

export class GenericWebsitePage extends BasePage {
  readonly navigation: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = page.locator('header, nav, .header, .navigation').first();
    this.header = page.locator('h1, .hero, .banner').first();
  }

  async verifyNavigationExists() {
    const isVisible = await this.navigation.isVisible().catch(() => false);
    if (isVisible) {
      await expect(this.navigation).toBeVisible();
    }
    return isVisible;
  }

  async verifyPageStructure() {
    const title = await this.verifyBasicPageStructure();
    const hasNavigation = await this.verifyNavigationExists();
    
    return {
      title,
      hasNavigation,
      url: this.page.url()
    };
  }
}