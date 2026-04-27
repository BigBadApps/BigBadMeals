# Project Agent Instructions (copy to product repo `AGENTS.md`)

This repository uses shared coding standards.

## Required: read standards first

Before making changes, agents must read:

- `docs/coding-standards/AGENTS.md`
- `docs/coding-standards/standards/INDEX.md`

## Local workflow expectations

- Keep changes small and reviewable.
- Add/update tests for non-trivial changes and bug fixes.
- Follow the PR template if present.

## GitHub (optional)

If the product repo documents PR automation (scripts, auto-merge, CI notify), keep that in **root `AGENTS.md`** so Claude and other agents see it immediately. Generic guidance lives in `docs/coding-standards/AGENTS.md` and `standards/DELIVERY.md`.

## Standards updates

If `docs/coding-standards/` is a submodule, ensure it is up to date before starting work:

- `git submodule update --init --recursive`

