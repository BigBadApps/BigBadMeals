# BigBadMeals — progress snapshot

This file is the **handoff anchor** when work pauses: what is true in the repo, what was verified, and what to do next.

_Last updated: 2026-04-28 (paused — save progress)._

## Product shape

- **Stack:** React 19 + Vite (client), Express (`server.ts` / `build/server.js`), Firebase client auth + Firestore rules, Gemini via `/api/ai/*`.
- **Local run:** repo root `npm install` → `npm run dev` → **http://localhost:3000** (or `PORT`). See [`README.md`](../README.md).
- **Package name:** `bigbad-meals` (`package.json`).

## Verified recently

- `npm run typecheck`, `npm run build`
- Playwright: `npm run test:e2e:smoke` and full `npm run test:e2e` (in-memory DB + mocked AI in CI config)
- Firebase diagnostics: `src/lib/firebaseTest.ts` reads **`users/{uid}`** only when signed in (matches `firestore.rules`); no startup probe on `test/*`.

## Shipping & automation

- **GitHub:** CI (`build`, `e2e`), squash auto-merge for PR author `bigbadmn-sys`, `pr-publish.sh` / `--wait`, PR CI notify (see [`AGENTS.md`](../AGENTS.md)).
- **Cursor:** `.cursor/sandbox.json` (network allow + shared build cache); agent notes in `AGENTS.md`.
- **Deploy (documented, not run for you):** `Dockerfile`, `.dockerignore`, `.gcloudignore` + **Cloud Run** steps in [`README.md`](../README.md) (same product family as AI Studio → Cloud Run). **You** still run `gcloud` with your project and secrets.

## Next session (suggested order)

1. **Deploy to Cloud Run** — follow README “Deploy to Google Cloud Run”; create Secret Manager `gemini-api-key`; deploy image; copy **Service URL**.
2. **Firebase** — Authentication → Authorized domains → add your **`*.run.app`** host (and keep `localhost` for dev).
3. **iPhone** — Open the Cloud Run HTTPS URL in Safari; exercise sign-in and main tabs.
4. **Optional:** `REQUIRE_AI_AUTH=true` on the Cloud Run service for production AI routes; tune rate limits / memory.

## Quick regression commands

```bash
npm run typecheck && npm run build && npm run test:e2e:smoke
```

## Known gaps / decisions later

- Production **requires** `GEMINI_API_KEY` (`server/config.ts` throws in production if missing).
- Vite bundle size warning (>500 kB) — optional code-splitting.
- PR CI notify may not comment if auto-merge completes before the notify job (race); use `gh pr view` / `pr-status.sh` as truth.
