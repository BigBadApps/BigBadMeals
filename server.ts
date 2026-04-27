import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of Gemini
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING },
          unit: { type: Type.STRING },
        },
        required: ["name", "amount", "unit"]
      }
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    nutritionalInfo: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
      }
    },
    prepTime: { type: Type.NUMBER },
    cookTime: { type: Type.NUMBER },
    servings: { type: Type.NUMBER },
  },
  required: ["title", "ingredients", "instructions"]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json({ limit: '20mb' }));

  // AI API routes
  app.post("/api/ai/extract-url", async (req, res) => {
    try {
      const { url } = req.body;
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Extract the full recipe from this URL: ${url}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: RECIPE_SCHEMA
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("[AI Server Error]:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/extract-text", async (req, res) => {
    try {
      const { text } = req.body;
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Extract recipe details from this text into structured JSON: ${text}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: RECIPE_SCHEMA
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("[AI Server Error]:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/extract-image", async (req, res) => {
    try {
      const { image, mimeType } = req.body;
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: {
          parts: [
            { text: "Transcribe and extract the full recipe from this image." },
            { inlineData: { data: image, mimeType: mimeType || "image/jpeg" } }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: RECIPE_SCHEMA
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("[AI Server Error]:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/meal-plan", async (req, res) => {
    try {
      const { userProfile, availableRecipes, startDate } = req.body;
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Generate a 7-day meal plan starting from ${startDate}. 
        User Profile: ${JSON.stringify(userProfile)}
        Available Recipes: ${JSON.stringify(availableRecipes)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    meals: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          type: { type: Type.STRING },
                          recipeTitle: { type: Type.STRING },
                          recipeId: { type: Type.STRING },
                        },
                        required: ["type", "recipeTitle"]
                      }
                    }
                  },
                  required: ["date", "meals"]
                }
              }
            },
            required: ["days"]
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("[AI Server Error]:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Starting in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Starting in production mode...");
    const distPath = path.resolve(process.cwd(), "dist");
    
    // Serve static assets
    app.use(express.static(distPath, { index: false }));
    
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
    if (key) {
      console.log(`[Server] AI Key found (Length: ${key.length})`);
    } else {
      console.warn(`[Server] WARNING: No AI Key found in environment variables.`);
    }
  });
}

startServer().catch(err => {
  console.error("[Server] Failed to start:", err);
  process.exit(1);
});
