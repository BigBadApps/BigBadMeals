import { test, expect } from '@playwright/test';

test('imports a recipe from text with AI mocked', async ({ page }) => {
  await page.route('**/api/ai/extract-text', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        title: 'Test Chili',
        description: 'A simple chili recipe.',
        ingredients: [
          { name: 'Beans', amount: '1', unit: 'can' },
          { name: 'Tomatoes', amount: '1', unit: 'can' },
        ],
        instructions: ['Open cans', 'Simmer 10 minutes'],
        prepTime: 5,
        cookTime: 10,
        servings: 2,
      }),
    });
  });

  await page.goto('/');
  await page.getByTestId('nav-recipes').click();
  await expect(page.getByText('Recipe Vault')).toBeVisible();

  await page.getByRole('button', { name: 'Add New' }).click();
  await page.getByTestId('recipes-import-text').fill('Beans + tomatoes; simmer.');
  await page.getByTestId('recipes-import-submit').click();

  await expect(page.getByText('Test Chili')).toBeVisible();
});

