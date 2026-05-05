import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  if (!baseURL || typeof storageState !== 'string') {
    throw new Error('Playwright config must set use.baseURL and use.storageState for global setup');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);

  // Prefer the deterministic login button, but fall back to seeding auth state
  // directly so setup stays stable even if the login screen does not render.
  const e2eLoginButton = page.getByTestId('e2e-login');
  const buttonVisible = await e2eLoginButton
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (buttonVisible) {
    await e2eLoginButton.click();
  } else {
    await page.evaluate(() => {
      window.localStorage.setItem(
        'bigbad.e2eUser',
        JSON.stringify({
          uid: 'e2e-user',
          email: 'e2e@example.com',
          displayName: 'E2E User',
        })
      );
    });
    await page.reload();
  }

  await page.context().storageState({ path: storageState });
  await browser.close();
}

export default globalSetup;

