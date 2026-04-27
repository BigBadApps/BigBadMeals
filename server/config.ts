export type ServerConfig = {
  port: number;
  env: "production" | "development" | "test";
  requireAiAuth: boolean;
  aiRateLimit: {
    windowMs: number;
    limit: number;
  };
  geminiApiKey?: string;
};

function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value == null || value.trim() === "") return defaultValue;
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return defaultValue;
}

function parseIntStrict(value: string | undefined, defaultValue: number): number {
  if (value == null || value.trim() === "") return defaultValue;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

export function loadServerConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const nodeEnv =
    env.NODE_ENV === "production" || env.NODE_ENV === "test" ? env.NODE_ENV : "development";

  const geminiApiKey = env.GEMINI_API_KEY || env.API_KEY || env.GOOGLE_API_KEY || undefined;
  const requireAiAuth = parseBool(env.REQUIRE_AI_AUTH, false);

  const cfg: ServerConfig = {
    env: nodeEnv,
    port: parseIntStrict(env.PORT, 3000),
    requireAiAuth,
    aiRateLimit: {
      windowMs: parseIntStrict(env.AI_RATE_LIMIT_WINDOW_MS, 60_000),
      limit: parseIntStrict(env.AI_RATE_LIMIT_PER_MINUTE, 30),
    },
    geminiApiKey,
  };

  // Fail fast in production if critical secrets are missing.
  if (cfg.env === "production" && !cfg.geminiApiKey) {
    throw new Error("Missing required env var: GEMINI_API_KEY");
  }

  return cfg;
}

