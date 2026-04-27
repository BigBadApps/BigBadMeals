#!/usr/bin/env bash
set -euo pipefail

# Bumps docs/coding-standards submodule to a specific tag/commit in many repos.
#
# Usage:
#   tools/bump-standards-submodule.sh /abs/path/to/REPOS.txt v1.2.3
#
# REPOS.txt format:
#   One absolute repo path per line.
#   Blank lines and lines starting with # are ignored.
#
# Behavior:
# - Fetches tags in the submodule
# - Checks out the requested ref inside the submodule
# - Stages the submodule pointer change in the parent repo
# - Leaves committing/PR creation to you (intentional safety)

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 /absolute/path/to/REPOS.txt <tag-or-commit>" >&2
  exit 1
fi

list="$1"
ref="$2"

if [[ ! -f "$list" ]]; then
  echo "File not found: $list" >&2
  exit 1
fi

while IFS= read -r repo; do
  [[ -z "${repo// }" ]] && continue
  [[ "${repo:0:1}" == "#" ]] && continue

  if [[ ! -d "$repo/.git" ]]; then
    echo "Skipping (not a git repo): $repo" >&2
    continue
  fi

  sub="$repo/docs/coding-standards"
  if [[ ! -d "$sub/.git" ]]; then
    echo "Skipping (no submodule at docs/coding-standards): $repo" >&2
    continue
  fi

  echo "Bumping standards in: $repo"
  (cd "$repo" && git submodule update --init --recursive)
  (cd "$sub" && git fetch --tags --prune)
  (cd "$sub" && git checkout "$ref")
  (cd "$repo" && git add docs/coding-standards)
done < "$list"

echo "Done. Next steps per repo:"
echo "- review: git diff --submodule"
echo "- commit and open PR"

