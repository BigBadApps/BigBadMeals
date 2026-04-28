# BigBadMeals

Meal and grocery planning app: **React 19 + Vite**, **Express** server (dev middleware + production static + `/api/*`), optional **Firebase** auth, **Gemini** for AI recipe flows.

## Current status (handoff)

When work pauses, read **[`docs/STATUS.md`](docs/STATUS.md)** for the latest snapshot: what is done, what is next, and how to re-verify.

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

## Deploy to Google Cloud Run (same stack as AI Studio)

Google **AI Studio** “Deploy app” sends code to **Google Cloud Run** (managed HTTPS, scales to zero). This repo is the same shape: **one container** runs `node build/server.js`, serves **`dist/`**, and exposes **`/api/*`**.

### What you get

- Public **https://…run.app** URL you can open on **iPhone Safari**
- **Gemini** via `GEMINI_API_KEY` (use **Secret Manager**, not env literals in the image)
- **Firebase Auth** works once you add the Cloud Run hostname under **Authentication → Settings → Authorized domains** (e.g. `your-service-xxxxx-uc.a.run.app`)

### One-time: tools & APIs

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud`).
2. Pick a **GCP project** with billing enabled (can match the Firebase `projectId` in `firebase-applet-config.json`, or any project—Firebase Admin still verifies tokens for that Firebase project).
3. Enable APIs (example):

   ```bash
   gcloud config set project YOUR_GCP_PROJECT_ID
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com
   ```

### Store the Gemini API key (production)

```bash
printf '%s' "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
```

If the secret already exists, add a new version instead:

```bash
printf '%s' "YOUR_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
```

### Build and deploy (Dockerfile in repo root)

Replace region / names as you like:

```bash
export REGION=us-central1
export SERVICE=bigbad-meals
export IMAGE="${REGION}-docker.pkg.dev/$(gcloud config get-value project)/cloud-run-source-deploy/${SERVICE}:$(date +%Y%m%d%H%M)"

gcloud builds submit --tag "${IMAGE}" .

gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port=8080 \
  --set-secrets=GEMINI_API_KEY=gemini-api-key:latest
```

`gcloud` will prompt to enable Artifact Registry on first use. If **Secret Manager** access is denied, grant the **Cloud Run default service account** the role **Secret Manager Secret Accessor** on `gemini-api-key` (see [Cloud Run secrets](https://cloud.google.com/run/docs/configuring/secrets)).

### After deploy

1. Note the **Service URL** from the deploy output.
2. **Firebase Console** → Authentication → Settings → **Authorized domains** → add your **`*.run.app`** host (or the exact hostname).
3. Optional: set **`REQUIRE_AI_AUTH=true`** on the service if you want `/api/ai/*` to require a Firebase ID token in production.

### Optional: deploy again from AI Studio

If you still have the original app in **AI Studio**, its **Deploy** flow can target **Cloud Run** on a chosen project. That path is best for **stock** AI Studio exports; for this GitHub repo, **`gcloud builds submit` + `gcloud run deploy`** (above) is the repeatable source of truth.

## Firebase (local sign-in)

If you see **`auth/unauthorized-domain`** or OAuth messages about **localhost** not being authorized:

1. Open [Firebase Console](https://console.firebase.google.com/) → your project (`firebase-applet-config.json` → `projectId`).
2. **Authentication** → **Settings** → **Authorized domains**.
3. Add **`localhost`** (and **`127.0.0.1`** if you use that origin).

Until then, Google sign-in from `http://localhost:3000` will not complete. **Profile → Run System Check** verifies Firestore only after you are signed in (it reads `users/{yourUid}`, which matches `firestore.rules`).

## Coding standards (BigBad)

This repo adopts **BigBadCodingStandards**.

- Agent entrypoint: [`AGENTS.md`](AGENTS.md) (GitHub PR automation, Cursor autonomy notes)
- Vendored standards: `docs/coding-standards/`

## Repository

https://github.com/bigbadmn-sys/BigBadMeals
