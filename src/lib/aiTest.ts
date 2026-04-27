import { extractRecipeFromText } from "../services/geminiService";

export async function testAiIntegration() {
  console.log("Starting AI Integration Test...");
  try {
    const testText = "Quick Pasta: Boil water, add 200g spaghetti. In another pan, mix 2 tbsp pesto and 1/4 cup cream. Combine and serve.";
    const recipe = await extractRecipeFromText(testText);
    
    console.log("AI Response received:", recipe);
    
    if (recipe.title && recipe.ingredients && recipe.ingredients.length > 0) {
      console.log("Test Passed: AI successfully extracted recipe structure.");
      return { success: true, data: recipe };
    } else {
      console.error("Test Failed: AI response missing required fields.");
      return { success: false, error: "Missing required fields in AI response" };
    }
  } catch (error) {
    console.error("Test Failed: AI integration error", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
