export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export type GroceryCategory =
  | 'Bakery'
  | 'Beverages'
  | 'Canned & Jarred'
  | 'Condiments & Spices'
  | 'Dairy & Eggs'
  | 'Frozen'
  | 'Meat & Seafood'
  | 'Pantry'
  | 'Produce'
  | 'Snacks'
  | 'Supplies'
  | 'Other';

export interface CleanIngredient {
  /** Display name suitable for shopping list */
  name: string;
  amount: string;
  unit: string;
  category: GroceryCategory;
  /** Optional normalization key for de-duping */
  key?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type RecipeTag = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'appetizer' | 'drink' | 'main';

export interface Recipe {
  id?: string;
  ownerId: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  /**
   * Ingredients normalized for shopping lists (generated on import).
   * Optional for backward compatibility with older saved recipes.
   */
  cleanIngredients?: CleanIngredient[];
  instructions: string[];
  nutritionalInfo?: NutritionalInfo;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  /** Multi-tag assignment used for sorting/filtering */
  tags?: RecipeTag[];
  isFavorite?: boolean;
  sourceUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface FamilyMember {
  name: string;
  role: string;
  preferences: string[];
  allergies: string[];
}

export interface UserPreferences {
  cuisines: string[];
  dietaryRestrictions: string[];
  budgetLimit: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  familyMembers: FamilyMember[];
  globalPreferences: UserPreferences;
  inventory: { name: string; quantity: number; unit: string }[];
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /** Party Plan support: multiple meals per slot + sub-role */
  slot?: 'main' | 'appetizer' | 'drink' | 'side' | 'dessert' | 'snack';
  recipeId: string;
  recipeTitle: string;
}

export interface DayPlan {
  date: string;
  meals: Meal[];
}

export interface MealPlan {
  id?: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  /**
   * Weekly extras not tied to a specific day/meal (typed items or URL-derived items).
   * Optional for backward compatibility.
   */
  snacksAndSupplies?: CleanIngredient[];
}

export interface GroceryItem {
  name: string;
  amount: string;
  unit: string;
  checked: boolean;
  category: GroceryCategory | string;
  estimatedPrice?: number;
}

export interface GroceryList {
  id?: string;
  ownerId: string;
  mealPlanId: string;
  items: GroceryItem[];
  totalEstimatedCost: number;
  createdAt: string;
}
