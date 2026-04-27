import { test, expect } from '@playwright/test';

test('shows a user-friendly error when AI extract-text fails', async ({ page }) => {
  await page.route('**/api/ai/extract-text', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'AI_UPSTREAM_ERROR',
        message: 'Upstream error (test)',
        requestId: 'req_test_123',
      }),
    });
  });

  await page.goto('/');
  await page.getByTestId('nav-recipes').click();
  await expect(page.getByText('Recipe Vault')).toBeVisible();

  await page.getByRole('button', { name: 'Add New' }).click();
  await page.getByTestId('recipes-import-text').fill('This will fail.');
  await page.getByTestId('recipes-import-submit').click();

  await expect(page.getByText('Failed to extract recipe from text')).toBeVisible();
});

