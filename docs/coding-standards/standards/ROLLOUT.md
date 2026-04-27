# Standards Rollout (Submodule-Based)

This document defines the recommended way to **publish, pin, and roll out** updates to shared standards across many projects.

## Canonical repository

- This standards repo is the **source of truth**.
- Publish it to GitHub and use **tags** (e.g. `v1.0.0`) to create stable versions.

## In each product repo

- Add this standards repo as a git submodule at:
  - `docs/coding-standards/`
- Add a project-local `AGENTS.md` that points agents to:
  - `docs/coding-standards/AGENTS.md`
  - `docs/coding-standards/standards/INDEX.md`
- (Cursor) Commit `.cursor/rules/coding-standards.mdc` so Cursor always applies the rule.

## Publishing an update (standards repo)

1. Make changes on a branch.
2. Verify docs are consistent.
3. Merge to `main`.
4. Tag a release:
   - `vX.Y.Z` (increment:
     - **patch** for clarifications/small guidance
     - **minor** for new standards/templates
     - **major** for breaking conventions/renames)

## Rolling out an update (product repos)

For each product repo:

1. Update the submodule to the desired tag/commit.
2. Commit the submodule pointer bump.
3. Open a PR with:
   - summary of what standards changed
   - any required follow-ups (e.g. new CI gate to add)

### Recommended: scripted bump across repos

Use `tools/bump-standards-submodule.sh` with a repo list file (one repo path per line).

## Important notes

- Submodules pin an exact commit. This is **intentional**: rollouts stay auditable and reversible.
- Do not auto-update standards on every build; that creates surprise breakages.
- Prefer periodic rollout cadence (e.g. weekly) or per-need updates.

