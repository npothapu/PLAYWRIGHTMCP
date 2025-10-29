// Centralized test utilities for better maintainability
import { Page } from '@playwright/test';

export interface EnvironmentConfig {
  environment: string;
  baseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isQA: boolean;
}

export class TestUtils {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  static async takeScreenshot(page: Page, name: string) {
    const timestamp = Date.now();
    const fileName = `${name}-${timestamp}.png`;
    await page.screenshot({ 
      path: `test-results/${fileName}`,
      fullPage: false 
    });
    return fileName;
  }

  static getEnvironmentConfig(): EnvironmentConfig {
    const env = process.env.ENV || 'qa';
    const baseUrl = process.env.BASE_URL || 'https://www.google.com';
    
    return {
      environment: env,
      baseUrl,
      isProduction: env === 'prod',
      isDevelopment: env === 'dev',
      isQA: env === 'qa'
    };
  }

  static async handleEnvironmentSpecificActions(page: Page) {
    const config = this.getEnvironmentConfig();
    
    if (config.baseUrl.includes('google.com')) {
      // Handle Google-specific consent/cookie dialogs
      await this.handleGoogleConsent(page);
    } else if (config.baseUrl.includes('microsoft.com')) {
      // Handle Microsoft-specific dialogs
      await this.handleMicrosoftConsent(page);
    } else if (config.baseUrl.includes('vml.com')) {
      // Handle VML-specific dialogs
      await this.handleVMLConsent(page);
    }
  }

  static async handleConsentDialogs(page: Page) {
    const candidates = [
      /^accept all$/i, 
      /^i agree$/i, 
      /^agree$/i, 
      /^accept$/i,
      /^accept cookies$/i,
      /^accept all cookies$/i
    ];
    
    for (const rx of candidates) {
      const btn = page.getByRole('button', { name: rx });
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        return true;
      }
    }
    
    // Check in frames as well
    for (const frame of page.frames()) {
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

  private static async handleGoogleConsent(page: Page) {
    const candidates = [/^accept all$/i, /^i agree$/i, /^agree$/i, /^accept$/i];
    for (const rx of candidates) {
      const btn = page.getByRole('button', { name: rx });
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        break;
      }
    }
  }

  private static async handleMicrosoftConsent(page: Page) {
    // Microsoft-specific consent handling
    const acceptBtn = page.getByRole('button', { name: /accept/i });
    if (await acceptBtn.isVisible().catch(() => false)) {
      await acceptBtn.click();
    }
  }

  private static async handleVMLConsent(page: Page) {
    // VML-specific consent handling
    const acceptBtn = page.getByRole('button', { name: /accept|agree/i });
    if (await acceptBtn.isVisible().catch(() => false)) {
      await acceptBtn.click();
    }
  }

  static async logEnvironmentInfo() {
    const config = this.getEnvironmentConfig();
    console.log(`🌍 Environment: ${config.environment}`);
    console.log(`🔗 Base URL: ${config.baseUrl}`);
    return config;
  }

  static async verifyBasicPageElements(page: Page) {
    // Basic checks that work on any website
    const body = page.locator('body');
    const title = await page.title();
    
    return {
      hasBody: await body.isVisible(),
      title,
      url: page.url(),
      titleLength: title.length
    };
  }

  static generateTestId() {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}