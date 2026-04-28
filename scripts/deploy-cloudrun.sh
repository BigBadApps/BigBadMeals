#!/usr/bin/env bash
# Deploy BigBadMeals to Google Cloud Run using Cloud Build + Secret Manager.
#
# Prereqs:
# - gcloud installed + authenticated: `gcloud auth login`
# - project selected: `gcloud config set project <id>`
# - APIs enabled: run, artifactregistry, cloudbuild, secretmanager
# - secret exists (recommended): gemini-api-key
#
# Usage:
#   bash scripts/deploy-cloudrun.sh
#   REGION=us-central1 SERVICE=bigbad-meals bash scripts/deploy-cloudrun.sh
#
set -euo pipefail

if ! command -v gcloud >/dev/null 2>&1; then
  echo "error: gcloud is required. Install: https://cloud.google.com/sdk/docs/install" >&2
  exit 1
fi

# gcloud requires Python >= 3.10. On some macOS versions, Homebrew Python may
# fail to import `pyexpat` unless we point it at Homebrew's keg-only expat.
# We prefer a supported Homebrew Python if available; otherwise fall back.
if [[ -z "${CLOUDSDK_PYTHON:-}" ]]; then
  if [[ -x "/opt/homebrew/bin/python3.12" ]]; then
    # Ensure expat is discoverable for pyexpat.
    if [[ -d "/opt/homebrew/opt/expat/lib" ]]; then
      export DYLD_LIBRARY_PATH="/opt/homebrew/opt/expat/lib${DYLD_LIBRARY_PATH:+:$DYLD_LIBRARY_PATH}"
    fi
    export CLOUDSDK_PYTHON="/opt/homebrew/bin/python3.12"
  elif [[ -x "/usr/bin/python3" ]]; then
    export CLOUDSDK_PYTHON="/usr/bin/python3"
  fi
fi

PROJECT="$(gcloud config get-value project 2>/dev/null || true)"
if [[ -z "${PROJECT}" || "${PROJECT}" == "(unset)" ]]; then
  echo "error: no gcloud project configured. Run: gcloud config set project <YOUR_GCP_PROJECT_ID>" >&2
  exit 1
fi

REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-bigbad-meals}"

# Use Cloud Run's default source-deploy repo to keep setup minimal.
IMAGE_TAG="$(date +%Y%m%d%H%M%S)"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT}/cloud-run-source-deploy/${SERVICE}:${IMAGE_TAG}"

echo "==> Project: ${PROJECT}"
echo "==> Region:  ${REGION}"
echo "==> Service: ${SERVICE}"
echo "==> Image:   ${IMAGE}"

echo "==> Ensuring required APIs are enabled"
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com

echo "==> Ensuring Secret Manager secret exists: gemini-api-key"
if ! gcloud secrets describe gemini-api-key >/dev/null 2>&1; then
  echo "error: Secret Manager secret 'gemini-api-key' does not exist." >&2
  echo "Create it with:" >&2
  echo "  printf '%s' \"YOUR_GEMINI_API_KEY\" | gcloud secrets create gemini-api-key --data-file=-" >&2
  exit 1
fi

echo "==> Building with Cloud Build"
gcloud builds submit --tag "${IMAGE}" .

echo "==> Deploying to Cloud Run"
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port=8080 \
  --set-secrets=GEMINI_API_KEY=gemini-api-key:latest

echo ""
echo "==> Deployed. Service details:"
gcloud run services describe "${SERVICE}" --region "${REGION}" --format='value(status.url)'

echo ""
echo "Next:"
echo "- Add the Cloud Run hostname to Firebase → Authentication → Authorized domains"
echo "- (Optional) require auth for /api/ai/* by setting REQUIRE_AI_AUTH=true on the service"

