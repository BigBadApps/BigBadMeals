import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  if (!baseURL || typeof storageState !== 'string') {
    throw new Error('Playwright config must set use.baseURL and use.storageState for global setup');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);

  // In E2E auth mode, the sign-in screen exposes a deterministic login button.
  await page.getByTestId('e2e-login').click();

  await page.context().storageState({ path: storageState });
  await browser.close();
}

export default globalSetup;

