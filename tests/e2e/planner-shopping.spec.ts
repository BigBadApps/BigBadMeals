import { test, expect } from '@playwright/test';

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

test('generates a meal plan (mocked) and syncs shopping list', async ({ page }) => {
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

  await page.route('**/api/ai/meal-plan', async (route) => {
    const req = route.request();
    const body = req.postDataJSON() as { startDate?: string };
    const startDate = body?.startDate || new Date().toISOString().slice(0, 10);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        days: Array.from({ length: 7 }, (_, i) => ({
          date: addDaysIso(startDate, i),
          meals: [
            {
              type: 'dinner',
              recipeTitle: 'Test Chili',
              recipeId: 'nonexistent-id',
            },
          ],
        })),
      }),
    });
  });

  await page.goto('/');

  // Seed a recipe in the in-memory DB via the UI import flow.
  await page.getByTestId('nav-recipes').click();
  await page.getByRole('button', { name: 'Add New' }).click();
  await page.getByTestId('recipes-import-text').fill('Beans + tomatoes; simmer.');
  await page.getByTestId('recipes-import-submit').click();
  await expect(page.getByText('Test Chili')).toBeVisible();

  // Generate the plan (AI mocked).
  await page.getByTestId('nav-planner').click();
  await page.getByTestId('planner-generate').click();
  await expect(page.getByText('Test Chili').first()).toBeVisible();

  // Sync shopping list from latest plan.
  await page.getByTestId('nav-shopping').click();
  await page.getByTestId('shopping-sync-plan').click();
  await expect(page.getByText('Beans')).toBeVisible();
});

