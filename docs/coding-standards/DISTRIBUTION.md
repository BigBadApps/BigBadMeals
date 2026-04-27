# Distribution and Referencing (Cursor / Claude / Gemini)

This repo is meant to be referenced from every product repository.

## Recommended: publish this repo and pin a version

1. Initialize git (once) and commit.
2. Push to your Git provider (GitHub/GitLab).
3. Tag releases (e.g. `v1.0.0`) so projects can pin.

## Option A (recommended): add as a git submodule in each project

- Pros: pinned version, easy updates, works with any agent/tool.
- Cons: some teams dislike submodules.

Workflow:

- Add submodule at: `docs/coding-standards/`
- Reference `docs/coding-standards/AGENTS.md` (and `standards/INDEX.md`) in project docs.

## Option B: vendor a snapshot into each project

- Pros: simplest; no git submodule complexity.
- Cons: updates must be manually propagated.

Workflow:

- Copy this repo into `docs/coding-standards/`
- Update periodically via scripted sync.

## Option C: reference the canonical URL only

- Pros: zero repo changes.
- Cons: agents and CI may not have network access; version drift.

Workflow:

- Put the canonical repo URL in the project `AGENTS.md` / `README.md`.
- Prefer linking to a tagged release.

## Cursor-specific (optional): add a local pointer in project repos

In each product repo, add a short `AGENTS.md` with:

- “Read `docs/coding-standards/AGENTS.md` first”
- “Use `docs/coding-standards/standards/INDEX.md` to navigate”

This works even when agents can’t access external URLs.

## Suggested minimal bootstrap for product repos

Add these files to every product repo:

- `AGENTS.md` (project-local, short, points to the standards location)
- `docs/coding-standards/` (submodule or vendored)
- `docs/adrs/` (decision records)

