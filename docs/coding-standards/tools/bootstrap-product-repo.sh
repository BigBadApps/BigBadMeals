#!/usr/bin/env bash
set -euo pipefail

# Bootstraps a product repo to reference shared standards locally.
#
# Usage:
#   tools/bootstrap-product-repo.sh /absolute/path/to/product-repo
#
# This script:
# - creates docs/coding-standards/ (you provide contents via submodule or copy)
# - creates a project-local AGENTS.md (if missing) pointing to the standards
# - installs a Cursor rule that always applies (if .cursor/ exists or is created)

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /absolute/path/to/product-repo" >&2
  exit 1
fi

repo="$1"
if [[ ! -d "$repo" ]]; then
  echo "Repo path not found: $repo" >&2
  exit 1
fi

mkdir -p "$repo/docs/coding-standards"

if [[ ! -f "$repo/AGENTS.md" ]]; then
  cat > "$repo/AGENTS.md" <<'EOF'
# Agent Instructions

This repo uses shared coding standards.

## Required: read standards first

- `docs/coding-standards/AGENTS.md`
- `docs/coding-standards/standards/INDEX.md`
EOF
fi

mkdir -p "$repo/.cursor/rules"
cat > "$repo/.cursor/rules/coding-standards.mdc" <<'EOF'
---
description: Always follow shared coding standards in docs/coding-standards
alwaysApply: true
---

# Shared Coding Standards

## Mandatory

- Read `docs/coding-standards/AGENTS.md` first.
- Use `docs/coding-standards/standards/INDEX.md` to navigate standards quickly.
- Follow `docs/coding-standards/standards/PLAYBOOK.md`.
EOF

echo "Bootstrapped:"
echo "- $repo/docs/coding-standards/  (populate via submodule or copy)"
echo "- $repo/AGENTS.md"
echo "- $repo/.cursor/rules/coding-standards.mdc"

