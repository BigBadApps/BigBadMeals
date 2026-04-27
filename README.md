# BigBadMeals

Meal and grocery planning app: **React 19 + Vite**, **Express** server (dev middleware + production static + `/api/*`), optional **Firebase** auth, **Gemini** for AI recipe flows.

## Requirements

- **Node.js** 22+ (CI uses 24; match CI locally if you can)

## Quick start

1. **Install:** `npm install`
2. **Env:** copy [`.env.example`](.env.example) to `.env.local` and set at least **`GEMINI_API_KEY`** (or `API_KEY` / `GOOGLE_API_KEY` — see `server/config.ts`). For local-only play without calling Gemini, you can leave it empty in development; the server logs a warning.
3. **Run:** `npm run dev` → app on **http://127.0.0.1:3000** (override with **`PORT`**).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite + Express via `tsx server.ts` |
| `npm run build` | Production client (`dist/`) + server (`build/`) |
| `npm run start` | Run compiled server (`node build/server.js`) after `build` |
| `npm run typecheck` | TypeScript check (also `npm run lint`) |
| `npm run test:e2e:smoke` | Playwright smoke subset (matches CI) |
| `npm run test:e2e` | Full Playwright suite |
| `npm run pr:publish` / `pr:publish:wait` / `pr:status` | GitHub PR helpers — see [`AGENTS.md`](AGENTS.md) |

## Testing

Playwright starts **`npm run build && npm start`** with in-memory DB and mocked AI routes where needed (see `playwright.config.ts` and `tests/e2e/`).

```bash
npm run test:e2e:smoke   # fast gate (~3 tests)
npm run test:e2e         # full suite
```

## Coding standards (BigBad)

This repo adopts **BigBadCodingStandards**.

- Agent entrypoint: [`AGENTS.md`](AGENTS.md) (GitHub PR automation, Cursor autonomy notes)
- Vendored standards: `docs/coding-standards/`

## Repository

https://github.com/bigbadmn-sys/BigBadMeals
