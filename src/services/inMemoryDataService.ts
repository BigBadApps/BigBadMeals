import { GroceryList, MealPlan, Recipe, UserProfile } from '../types';

type UserStore = {
  profile: UserProfile | null;
  recipes: Map<string, Recipe>;
  mealPlans: Map<string, MealPlan>;
  groceryLists: Map<string, GroceryList>;
};

const stores = new Map<string, UserStore>();

function getStore(uid: string): UserStore {
  let s = stores.get(uid);
  if (!s) {
    s = {
      profile: null,
      recipes: new Map(),
      mealPlans: new Map(),
      groceryLists: new Map(),
    };
    stores.set(uid, s);
  }
  return s;
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function descByIso(a: string, b: string) {
  return b.localeCompare(a);
}

export const inMemoryDataService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    return getStore(uid).profile;
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    getStore(profile.uid).profile = profile;
  },

  async getRecipes(userId: string): Promise<Recipe[]> {
    const s = getStore(userId);
    return Array.from(s.recipes.values()).sort((a, b) => descByIso(a.createdAt, b.createdAt));
  },

  async addRecipe(userId: string, recipe: Omit<Recipe, 'id'>): Promise<string> {
    const id = makeId('recipe');
    const full: Recipe = { ...recipe, id };
    getStore(userId).recipes.set(id, full);
    return id;
  },

  async updateRecipe(userId: string, recipeId: string, updates: Partial<Recipe>): Promise<void> {
    const s = getStore(userId);
    const existing = s.recipes.get(recipeId);
    if (!existing) return;
    s.recipes.set(recipeId, { ...existing, ...updates, id: recipeId });
  },

  async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    getStore(userId).recipes.delete(recipeId);
  },

  async getMealPlans(userId: string): Promise<MealPlan[]> {
    const s = getStore(userId);
    return Array.from(s.mealPlans.values()).sort((a, b) => descByIso(a.startDate, b.startDate));
  },

  async addMealPlan(userId: string, plan: Omit<MealPlan, 'id'>): Promise<string> {
    const id = makeId('mealPlan');
    const full: MealPlan = { ...plan, id };
    getStore(userId).mealPlans.set(id, full);
    return id;
  },

  async updateMealPlan(userId: string, planId: string, updates: Partial<MealPlan>): Promise<void> {
    const s = getStore(userId);
    const existing = s.mealPlans.get(planId);
    if (!existing) return;
    s.mealPlans.set(planId, { ...existing, ...updates, id: planId });
  },

  async getGroceryLists(userId: string): Promise<GroceryList[]> {
    const s = getStore(userId);
    return Array.from(s.groceryLists.values()).sort((a, b) => descByIso(a.createdAt, b.createdAt));
  },

  async addGroceryList(userId: string, list: Omit<GroceryList, 'id'>): Promise<string> {
    const id = makeId('groceryList');
    const full: GroceryList = { ...list, id };
    getStore(userId).groceryLists.set(id, full);
    return id;
  },

  async updateGroceryList(userId: string, listId: string, updates: Partial<GroceryList>): Promise<void> {
    const s = getStore(userId);
    const existing = s.groceryLists.get(listId);
    if (!existing) return;
    s.groceryLists.set(listId, { ...existing, ...updates, id: listId });
  },

  async deleteGroceryList(userId: string, listId: string): Promise<void> {
    getStore(userId).groceryLists.delete(listId);
  },
};

