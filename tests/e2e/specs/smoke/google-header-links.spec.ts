import { test, expect } from '@playwright/test';

const tags = { tag: ["@webtest", "@google", "@header"] } as { tag: string[] };

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

test('google header links navigate', tags, async ({ page }) => {
  const base = process.env.BASE_URL || 'https://www.google.com';
  const environment = process.env.ENV || 'qa';
  
  expect(base).toBeTruthy();

  // Skip this test if not running against Google
  if (!base.includes('google.com')) {
    test.skip(true, `Skipping Google-specific test for environment: ${environment} (${base})`);
    return;
  }

  const isMobile = test.info().project.name.toLowerCase().includes('iphone');

  const response = await page.goto(base!);
  expect(response?.ok()).toBeTruthy();

  await maybeAcceptConsent(page);

  await expect(page).toHaveURL(/google\./);
  await expect(page.getByRole('textbox', { name: /search|search query|search input/i }))
    .toBeVisible({ timeout: 5000 })
    .catch(async () => { await expect(page.getByRole('search')).toBeVisible(); });

  const gmail = page.getByRole('link', { name: /^gmail$/i });
  const images = page.getByRole('link', { name: /^images$/i });

  if (isMobile) {
    const appMenuButton = page.getByRole('button', { name: /google apps|apps/i });
    if (await appMenuButton.isVisible().catch(() => false)) { await appMenuButton.click(); }
  }

  if (await gmail.isVisible().catch(() => false)) {
    const gmailHref = await gmail.getAttribute('href');
    expect(gmailHref).toBeTruthy();
    await gmail.click();
    await expect(page).toHaveURL(/mail\.google\.|accounts\.google\.|workspace\.google\./);
    await page.goBack();
    await expect(page).toHaveURL(/google\./);
  }

  await maybeAcceptConsent(page);

  if (!(await images.isVisible().catch(() => false))) {
    const appMenuButton2 = page.getByRole('button', { name: /google apps|apps/i });
    if (await appMenuButton2.isVisible().catch(() => false)) { await appMenuButton2.click(); }
  }

  if (await images.isVisible().catch(() => false)) {
    const imagesHref = await images.getAttribute('href');
    expect(imagesHref).toBeTruthy();

    let canClick = true;
    try {
      await images.click({ trial: true, timeout: 5000 });
    } catch {
      canClick = false;
    }

    if (canClick && !isMobile) {
      await images.click();
      await expect(page).toHaveURL(/images\.google\.|\/imghp\b|accounts\.google\./);
    } else {
      const imgUrl = new URL('/imghp', base!).toString();
      await page.goto(imgUrl);
      await expect(page).toHaveURL(/images\.google\.|\/imghp\b/);
    }
  }
});
