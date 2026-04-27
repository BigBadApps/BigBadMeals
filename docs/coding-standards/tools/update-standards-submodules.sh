#!/usr/bin/env bash
set -euo pipefail

# Updates a list of product repos that include the standards as a git submodule
# at docs/coding-standards.
#
# Usage:
#   tools/update-standards-submodules.sh /absolute/path/to/REPOS.txt
#
# REPOS.txt format:
#   One absolute repo path per line.
#   Blank lines and lines starting with # are ignored.

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /absolute/path/to/REPOS.txt" >&2
  exit 1
fi

list="$1"
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

  if [[ ! -d "$repo/docs/coding-standards" ]]; then
    echo "Skipping (no docs/coding-standards): $repo" >&2
    continue
  fi

  echo "Updating standards submodule in: $repo"
  (cd "$repo" && git submodule update --init --recursive)
done < "$list"

