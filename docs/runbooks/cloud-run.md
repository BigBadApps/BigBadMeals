# Cloud Run deploy runbook (BigBadMeals)

## Goal

Deploy BigBadMeals to a public HTTPS URL (Cloud Run) so it can be opened from mobile (iPhone Safari).

## Preconditions

- `gcloud` installed and authenticated: `gcloud auth login`
- Project set: `gcloud config set project <YOUR_GCP_PROJECT_ID>`
- Billing enabled for the project

macOS note: if `gcloud` errors while creating its virtualenv (Python/expat issues), run:

```bash
export CLOUDSDK_PYTHON=/usr/bin/python3
gcloud config virtualenv create
```

Enable APIs (one-time):

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com
```

## Secrets

Create `gemini-api-key` (one-time):

```bash
printf '%s' "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
```

If it already exists:

```bash
printf '%s' "YOUR_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
```

If Cloud Run cannot access the secret, grant `roles/secretmanager.secretAccessor` to the Cloud Run service account (see Cloud Run docs on secrets).

## Deploy

Recommended (script):

```bash
REGION=us-central1 SERVICE=bigbad-meals bash scripts/deploy-cloudrun.sh
```

## After deploy

1. Copy the Cloud Run **service URL** printed by the script.
2. In Firebase Console:
   - Authentication → Settings → **Authorized domains**
   - Add the Cloud Run host (e.g. `your-service-xxxxx-uc.a.run.app`)
3. Open the Cloud Run URL on iPhone Safari.

## Production hardening (optional)

- Set `REQUIRE_AI_AUTH=true` on the Cloud Run service to require Firebase ID tokens for `/api/ai/*`.
- Tune rate limits: `AI_RATE_LIMIT_WINDOW_MS`, `AI_RATE_LIMIT_PER_MINUTE`.
- Consider setting minimum instances to reduce cold start if you care about first-load latency.

