// Test fixtures for page objects and utilities
import { test as base, Page } from '@playwright/test';
import { BasePage, GooglePage } from './pages';
import { TestUtils } from '../helpers/test-utils';

type TestFixtures = {
  basePage: BasePage;
  googlePage: GooglePage;
  testUtils: typeof TestUtils;
};

export const test = base.extend<TestFixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  googlePage: async ({ page }, use) => {
    const googlePage = new GooglePage(page);
    await use(googlePage);
  },

  testUtils: async ({}, use) => {
    await use(TestUtils);
  },
});

export { expect } from '@playwright/test';