import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

// Load environment variables quietly (suppress dotenv promotional messages)
dotenv.config({ 
  path: "./utils/env/.env", 
  override: true,
  debug: false 
});

// Get environment from ENV variable or default to what's in .env file
const environment = process.env.ENV?.toUpperCase() || process.env.DEFAULT_ENV?.toUpperCase() || 'PROD';

console.log(`🔧 Running tests in: ${environment} environment`);

let baseUrl: string = '';
let userid: string = '';
let pwd: string = '';
let httpCredentials: { username: string; password: string } | undefined = undefined;

switch (environment) {
  case 'STG':
    baseUrl = process.env.STG_BASE_URL ?? '';
    userid = process.env.STG_UID ?? '';
    pwd = process.env.STG_PWD ?? '';
    httpCredentials = { username: userid, password: pwd };
    break;
  case 'PROD':
    baseUrl = process.env.PROD_BASE_URL ?? '';
    httpCredentials = undefined; // No basic auth for PROD
    break;
  default:
    throw new Error(`Unknown environment: ${environment}. Supported: STG, PROD`);
}

if (!baseUrl) {
  throw new Error(`No URL configured for environment '${environment}'. Please check the .env file.`);
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 8,
  reporter: process.env.DOCKER ? "blob" : "html",
  use: {
    baseURL: baseUrl,
    ...(httpCredentials && { httpCredentials }),
    screenshot: 'only-on-failure',
    trace: "on-first-retry",
  },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\/(content-validations|interactions)\/.*\.spec\.ts$/,
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\/(content-validations|interactions)\/.*\.spec\.ts$/,
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\/(content-validations|interactions)\/.*\.spec\.ts$/,
    },
    {
      name: 'iphone-12',
      use: {
        ...devices['iPhone 12'],
        browserName: 'webkit',
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\/user-flows\/.*mobile\.spec\.ts$/,
    },
    {
      name: 'pixel-7',
      use: {
        ...devices['Pixel 7'],
        browserName: 'chromium',
        hasTouch: true,
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\/user-flows\/.*mobile\.spec\.ts$/,
    },
  ],
});
