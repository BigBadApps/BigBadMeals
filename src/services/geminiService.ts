import { Recipe, UserProfile, MealPlan } from "../types";

type ApiErrorResponse = {
  code?: string;
  message?: string;
  requestId?: string;
};

async function fetchAI<T>(endpoint: string, body: any): Promise<T> {
  const response = await fetch(`/api/ai/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // ignore parse errors and fall back to status text
    }

    const requestId =
      response.headers.get("x-request-id") ||
      errorData?.requestId ||
      undefined;

    const message =
      errorData?.message ||
      `AI request failed with status ${response.status}${requestId ? ` (requestId: ${requestId})` : ""}`;

    throw new Error(message);
  }

  return response.json();
}

export async function extractRecipeFromUrl(url: string): Promise<Partial<Recipe>> {
  return fetchAI<Partial<Recipe>>('extract-url', { url });
}

export async function extractRecipeFromText(text: string): Promise<Partial<Recipe>> {
  return fetchAI<Partial<Recipe>>('extract-text', { text });
}

export async function extractRecipeFromImage(base64Image: string, mimeType: string = "image/jpeg"): Promise<Partial<Recipe>> {
  const base64Data = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;
    
  return fetchAI<Partial<Recipe>>('extract-image', { image: base64Data, mimeType });
}

export async function generateWeeklyMealPlan(
  userProfile: UserProfile,
  availableRecipes: Recipe[],
  startDate: string
): Promise<Partial<MealPlan>> {
  const recipesBrief = availableRecipes.map(r => ({ 
    id: r.id, 
    title: r.title, 
    category: r.category 
  }));

  return fetchAI<Partial<MealPlan>>('meal-plan', { 
    userProfile, 
    availableRecipes: recipesBrief, 
    startDate 
  });
}
