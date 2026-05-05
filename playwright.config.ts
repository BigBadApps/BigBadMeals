import { defineConfig, devices } from '@playwright/test';

const PLAYWRIGHT_PORT = Number(process.env.PLAYWRIGHT_PORT ?? '3000');
const PLAYWRIGHT_BASE_URL = `http://127.0.0.1:${PLAYWRIGHT_PORT}`;
// Vite env vars must be present during `vite build` so they are baked into `dist/`.
// Do not set NODE_ENV=development for `npm start`: the server uses Vite middleware in dev
// and ignores the prebuilt client bundle, which breaks E2E flags and storageState login.
const PLAYWRIGHT_CLIENT_BUILD_ENV =
  'VITE_DISABLE_AUTH=false VITE_E2E_AUTH=true VITE_USE_INMEMORY_DB=true';
const PLAYWRIGHT_SERVER_START_ENV = `NODE_ENV=production REQUIRE_AI_AUTH=false PORT=${PLAYWRIGHT_PORT}`;
// Production server startup requires a non-empty Gemini key; smoke tests mock /api/ai/* and do not call Google.
const PLAYWRIGHT_GEMINI_KEY = process.env.GEMINI_API_KEY || 'ci-e2e-placeholder-not-used';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  globalSetup: './tests/e2e/global-setup.ts',
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html']],
  use: {
    baseURL: PLAYWRIGHT_BASE_URL,
    storageState: 'playwright/.auth/state.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `${PLAYWRIGHT_CLIENT_BUILD_ENV} npm run build && ${PLAYWRIGHT_SERVER_START_ENV} npm start`,
    url: `${PLAYWRIGHT_BASE_URL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      GEMINI_API_KEY: PLAYWRIGHT_GEMINI_KEY,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

