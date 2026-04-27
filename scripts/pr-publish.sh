#!/usr/bin/env bash
# Push the current branch to origin, open a PR to main if missing, print confirmation + agent handoff.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: GitHub CLI (gh) is required. Install: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "error: gh is not authenticated. Run: gh auth login"
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" == "main" ]]; then
  echo "error: refusing to open a PR from main. Create a branch first."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "warning: working tree is not clean. Commit or stash before publishing." >&2
fi

REMOTE="${PR_REMOTE:-origin}"
BASE="${PR_BASE:-main}"

echo "==> Pushing $BRANCH to $REMOTE"
git push -u "$REMOTE" "$BRANCH"

EXISTING="$(gh pr list --head "$BRANCH" --state open --json number --jq '.[0].number // empty')"
if [[ -z "$EXISTING" ]]; then
  echo "==> No open PR for this branch; creating one (base: $BASE)"
  if ! gh pr create --base "$BASE" --head "$BRANCH" --fill 2>/dev/null; then
    TITLE="${PR_TITLE:-${BRANCH}}"
    BODY="${PR_BODY:-Opened via scripts/pr-publish.sh}"
    gh pr create --base "$BASE" --head "$BRANCH" --title "$TITLE" --body "$BODY"
  fi
else
  echo "==> Open PR already exists: #$EXISTING"
fi

PR_NUM="$(gh pr list --head "$BRANCH" --state open --json number --jq '.[0].number // empty')"
if [[ -z "$PR_NUM" ]]; then
  echo "error: could not resolve PR number after push/create."
  exit 1
fi

URL="$(gh pr view "$PR_NUM" --json url --jq .url)"
echo ""
echo "Confirmed on GitHub: $URL (#$PR_NUM)"
echo ""
echo "-------- Agent handoff (paste into chat) --------"
echo "PR #$PR_NUM was pushed. Poll status with:"
echo "  cd \"$(pwd)\" && bash scripts/pr-status.sh $PR_NUM"
echo "Or:"
echo "  gh pr view $PR_NUM --json state,mergedAt,statusCheckRollup,autoMergeRequest,url"
echo ""
echo "After CI, GitHub Actions will add a comment on the PR (workflow: PR CI notify)."
echo "--------------------------------------------------"
