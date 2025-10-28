import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Determine which environment to load
const environment = process.env.ENV || 'qa'; // Default to qa
const envFile = `.env.${environment}`;
const envPath = path.resolve(__dirname, envFile);

// Load environment-specific file
if (fs.existsSync(envPath)) {
  console.log(`Loading environment config from: ${envFile}`);
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) { // Only set if not already set
      process.env[m[1]] = m[2];
    }
  }
} else {
  // Fallback to default .env if environment-specific file doesn't exist
  const defaultEnvPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(defaultEnvPath)) {
    console.log('Loading default .env file');
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
  console.log('Using fallback BASE_URL: https://www.google.com');
}

console.log(`Environment: ${environment}`);
console.log(`BASE_URL: ${process.env.BASE_URL}`);

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'line',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'iPhone 13', use: { ...devices['iPhone 13'] } },
  ],
});
