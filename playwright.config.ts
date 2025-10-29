import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Determine which environment to load
const environment = process.env.ENV || 'qa'; // Default to qa
const envFile = `.env.${environment}`;
const envPath = path.resolve(__dirname, 'env', envFile);

// Load environment-specific file
if (fs.existsSync(envPath)) {
  console.log(`🔧 Loading environment config from: env/${envFile}`);
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) { // Only set if not already set
      process.env[m[1]] = m[2];
    }
  }
} else {
  // Fallback to default .env if environment-specific file doesn't exist
  const defaultEnvPath = path.resolve(__dirname, 'env', '.env');
  if (fs.existsSync(defaultEnvPath)) {
    console.log('🔧 Loading default env/.env file');
    const lines = fs.readFileSync(defaultEnvPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2];
      }
    }
  }
}

// Ensure BASE_URL is set as fallback
if (!process.env.BASE_URL) {
  process.env.BASE_URL = 'https://www.google.com';
  console.log('🔧 Using fallback BASE_URL: https://www.google.com');
}

console.log(`🌍 Environment: ${environment}`);
console.log(`🔗 BASE_URL: ${process.env.BASE_URL}`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  
  // Output directories (standardized at root level)
  outputDir: './test-results',
  reporter: process.env.CI ? [['html'], ['github']] : [['html'], ['list']],
  
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\/(e2e\/specs|content-validations|interactions)\/.*\.spec\.ts$/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*\/(e2e\/specs|content-validations|interactions)\/.*\.spec\.ts$/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*\/(e2e\/specs|content-validations|interactions)\/.*\.spec\.ts$/,
    },

    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: /.*\/mobile\/.*\.spec\.ts$/,
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: /.*\/mobile\/.*\.spec\.ts$/,
    },

    // Smoke tests only (for quick validation)
    {
      name: 'smoke-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\/smoke\/.*\.spec\.ts$/,
    },
  ],

  // Global test timeout
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
});