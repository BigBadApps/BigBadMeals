# BigBadMeals — progress snapshot

This file is the **handoff anchor** when work pauses: what is true in the repo, what was verified, and what to do next.

_Last updated: 2026-04-29._

## Product shape

- **Stack:** React 19 + Vite (client), Express (`server.ts` / `build/server.js`), Firebase client auth + Firestore rules, Gemini via `/api/ai/*`.
- **Local run:** repo root `npm install` → `npm run dev` → **http://localhost:3000** (or `PORT`). See [`README.md`](../README.md).
- **Package name:** `bigbad-meals` (`package.json`).

## Verified recently

- `npm run typecheck`, `npm run build`
- Playwright: `npm run test:e2e:smoke` and full `npm run test:e2e` (in-memory DB + mocked AI in CI config)
- Firebase diagnostics: `src/lib/firebaseTest.ts` reads **`users/{uid}`** only when signed in (matches `firestore.rules`); no startup probe on `test/*`.

## Shipping & automation

- **GitHub:** repo moved to org **`BigBadApps`** (`BigBadApps/BigBadMeals`). CI (`build`, `e2e`), squash auto-merge for allowlisted PR author login (`bigbadmn-sys`), `pr-publish.sh` / `--wait`, PR CI notify (see [`AGENTS.md`](../AGENTS.md)).
- **Cursor:** `.cursor/sandbox.json` (network allow + shared build cache); agent notes in `AGENTS.md`.
- **Deploy (Cloud Run):** `Dockerfile`, `.dockerignore`, `.gcloudignore` + `npm run deploy:cloudrun`.
  - **Live URL:** `https://bigbad-meals-2d4qqtkkza-uc.a.run.app`
  - **Verify:** `curl -fsSL https://bigbad-meals-2d4qqtkkza-uc.a.run.app/api/health` and confirm a fresh `latestReadyRevisionName` (see `docs/runbooks/cloud-run.md`).

## Next session (suggested order)

1. **Confirm Firebase domains** — Authentication → Authorized domains → ensure the Cloud Run host is present (and keep `localhost` for dev).
2. **Smoke on iPhone** — open the Cloud Run URL in Safari; exercise sign-in and main tabs.
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
