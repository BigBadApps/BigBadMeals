import { test, expect } from '@playwright/test';

test('app boots and health endpoint responds', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
});

test('can navigate between main tabs without auth', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Welcome,', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'Recipes' }).click();
  await expect(page.getByText('Recipe Vault')).toBeVisible();

  await page.getByRole('button', { name: 'Meal Prep' }).click();
  await expect(page.getByText('Meal Planner')).toBeVisible();

  await page.getByRole('button', { name: 'Cart' }).click();
  await expect(page.getByText('Kitchen Stock')).toBeVisible();

  await page.getByRole('button', { name: 'Me', exact: true }).click();
  await expect(page.getByText('Family Kitchen')).toBeVisible();
});

