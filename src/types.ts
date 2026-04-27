export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id?: string;
  ownerId: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionalInfo?: NutritionalInfo;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
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
}

export interface GroceryItem {
  name: string;
  amount: string;
  unit: string;
  checked: boolean;
  category: string;
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
