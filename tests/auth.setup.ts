import { test as setup } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

const envPath = path.join(__dirname, "../utils/env/.env");
dotenv.config({ 
  path: envPath, 
  override: true,
  debug: false 
});

const authFile = path.join(__dirname, "../playwright/.auth/user.json");
const environment = process.env.ENV?.toUpperCase() || process.env.DEFAULT_ENV?.toUpperCase() || 'PROD';

setup("authenticate", async ({ page }) => {
  if (environment === "STG") {
    console.log("STG environment detected, setting up authentication.");
    const baseUrl = process.env.STG_BASE_URL;
    if (!baseUrl) {
      throw new Error("STG_BASE_URL is not defined. Check your environment variables.");
    }
    
    await page.goto(baseUrl);

    const acceptCookies = page.getByRole('button', { name: 'Accept Cookies' });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
    await page.context().storageState({ path: authFile });
  } else {
    console.log("Production environment detected, skipping authentication setup.");
    // Create empty auth file for PROD
    await page.context().storageState({ path: authFile });
  }
});