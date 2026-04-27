#!/usr/bin/env bash
# Push the current branch to origin, open a PR to main if missing, print confirmation + agent handoff.
# With --wait: poll GitHub until PR is merged, checks fail, closed without merge, or timeout.
set -euo pipefail

WAIT=0
WAIT_TIMEOUT_SEC="${PR_WAIT_TIMEOUT_SEC:-900}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --wait)
      WAIT=1
      shift
      ;;
    --wait-timeout=*)
      WAIT_TIMEOUT_SEC="${1#*=}"
      shift
      ;;
    -h | --help)
      echo "usage: pr-publish.sh [--wait] [--wait-timeout=SECONDS]"
      echo "  --wait                 Poll until merged, failed checks, or timeout (${PR_WAIT_TIMEOUT_SEC:-900}s default; override with PR_WAIT_TIMEOUT_SEC)"
      echo "  --wait-timeout=N      Max seconds to wait (default ${PR_WAIT_TIMEOUT_SEC:-900})"
      exit 0
      ;;
    *)
      echo "error: unknown argument: $1 (try --help)" >&2
      exit 1
      ;;
  esac
done

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
echo "After CI, GitHub Actions may add a comment on the PR (workflow: PR CI notify)."
echo "--------------------------------------------------"

if [[ "$WAIT" -ne 1 ]]; then
  exit 0
fi

echo ""
echo "==> --wait: polling PR #$PR_NUM (timeout ${WAIT_TIMEOUT_SEC}s)"
START_TS=$(date +%s)
poll_checks_failed() {
  local out
  out=$(mktemp)
  gh pr checks "$PR_NUM" >"$out" 2>&1 || true
  if awk '{print $2}' "$out" | grep -qx fail; then
    rm -f "$out"
    return 0
  fi
  rm -f "$out"
  return 1
}

while true; do
  now=$(date +%s)
  elapsed=$((now - START_TS))
  if ((elapsed > WAIT_TIMEOUT_SEC)); then
    echo "PR_WAIT_RESULT=timeout after ${WAIT_TIMEOUT_SEC}s"
    echo "==> Last snapshot:"
    bash scripts/pr-status.sh "$PR_NUM" || true
    exit 2
  fi

  S=$(gh pr view "$PR_NUM" --json state --jq .state)
  M=$(gh pr view "$PR_NUM" --json mergedAt --jq '.mergedAt // empty')

  if [[ "$S" == "MERGED" ]]; then
    echo "PR_WAIT_RESULT=merged"
    echo ""
    echo "==> Recommended next step (sync local default branch):"
    echo "    git fetch origin $BASE && git checkout $BASE && git pull origin $BASE"
    echo "==> Then: delete local feature branch if you are done (optional):"
    echo "    git branch -d $BRANCH   # only if merged and no longer needed"
    exit 0
  fi

  if [[ "$S" == "CLOSED" ]]; then
    if [[ -z "$M" ]]; then
      echo "PR_WAIT_RESULT=closed_without_merge"
      bash scripts/pr-status.sh "$PR_NUM" || true
      exit 1
    fi
  fi

  if poll_checks_failed; then
    echo "PR_WAIT_RESULT=checks_failed"
    echo "==> Failing checks:"
    gh pr checks "$PR_NUM" || true
    echo "==> Recommended next step: open the failing job logs, fix, commit, and re-run: npm run pr:publish:wait"
    exit 1
  fi

  # gh pr checks: exit 0 = all green; 8 = pending/in progress
  set +e
  gh pr checks "$PR_NUM" >/dev/null 2>&1
  CHK=$?
  set -e

  if [[ "$CHK" -eq 0 ]] && [[ "$S" == "OPEN" ]]; then
    echo "   [${elapsed}s] checks green; waiting for merge queue / auto-merge…"
  elif [[ "$CHK" -eq 8 ]]; then
    echo "   [${elapsed}s] checks pending or in progress…"
  else
    echo "   [${elapsed}s] state=$S gh_pr_checks_exit=$CHK (continuing to poll)…"
  fi

  sleep 15
done
