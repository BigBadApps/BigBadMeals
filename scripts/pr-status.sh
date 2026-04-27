#!/usr/bin/env bash
# Print PR state + checks + auto-merge in one JSON blob (for humans and agents).
set -euo pipefail

if [[ "${1:-}" == "" ]]; then
  echo "usage: pr-status.sh <pr-number>" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh is required" >&2
  exit 1
fi

gh pr view "$1" --json \
  number,url,state,title,isDraft,mergedAt,mergeable,mergeStateStatus,headRefName,baseRefName,author,statusCheckRollup,autoMergeRequest
