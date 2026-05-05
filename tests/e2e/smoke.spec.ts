import { test, expect } from '@playwright/test';

test('app boots and health endpoint responds @smoke', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
});

test('can navigate between main tabs without auth @smoke', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Welcome,', { exact: false })).toBeVisible();

  await page.getByTestId('nav-recipes').click();
  await expect(page.getByText('Recipe Vault')).toBeVisible();

  await page.getByTestId('nav-planner').click();
  await expect(page.getByText('Meal Plan')).toBeVisible();

  await page.getByTestId('nav-shopping').click();
  await expect(page.getByText('Shopping')).toBeVisible();

  await page.getByTestId('nav-profile').click();
  await expect(page.getByText('Family Kitchen')).toBeVisible();
});

