# Web App Project Conventions (Framework-Agnostic)

This document defines **repeatable conventions** for responsive web apps in a mixed-stack organization.
It is intentionally framework-agnostic (works for React/Next/Vite/Remix/etc. and varied backends).

## Goals

- Predictable structure across repos
- Consistent scripts and CI quality gates
- Clean separation between frontend, backend, and shared contracts
- Safe configuration and secrets hygiene

## Recommended repo shapes

Choose one; document the choice in the repo `README.md`.

### Option A: Single app repo (most common)

- `app/` or `src/`: frontend application code
- `server/` (optional): backend-for-frontend (BFF) or API server
- `shared/` (optional): shared types/schemas/utilities (avoid leaking server-only code into client)
- `docs/`: design docs, runbooks, ADRs (or use `/docs` + `/templates`)

### Option B: Monorepo (multiple deployables)

- `apps/web/`
- `apps/api/` (or `apps/bff/`)
- `packages/ui/` (design system)
- `packages/shared/` (schemas/types; published or workspace package)
- `docs/`

## Required scripts (minimum)

Every repo should expose these commands (names can vary, but keep them consistent if possible):

- **Format**: auto-format source files
- **Lint**: catch common issues early
- **Typecheck** (when applicable)
- **Test**: unit tests (and integration tests when present)
- **Build**: production build
- **Start**: run app locally

If you have CI, ensure CI runs: lint + typecheck + test + build.

## Configuration and environments

- Use **explicit configuration**:
  - config module/file that reads env vars once and validates them
  - fail fast on missing/invalid config (in non-dev environments)
- Never commit secrets; use `.env` locally and a secrets manager in deployed environments.
- Provide `.env.example` (safe placeholders) and document required variables.

## Shared contracts (frontend ↔ backend)

Follow `standards/API_CONTRACTS.md`.

- Prefer **schemas** (OpenAPI/JSON Schema/Zod/etc.) to generate types and validate at runtime.
- Keep shared code dependency-light.
- Version or feature-flag breaking changes.

## UI and UX baseline

- Responsive layout works for phone/tablet/desktop.
- Follow `standards/ACCESSIBILITY_WEB.md`.
- Follow `standards/PERFORMANCE_WEB.md`.

## Logging and observability

- Frontend errors should include:
  - build/version
  - route/screen
  - correlation/request ID if available
- Backend logs/metrics must not include secrets/PII.

## Documentation baseline (must)

Each repo should include:

- `README.md`:
  - what the system does
  - how to run locally
  - key scripts
  - how to test
  - deployment notes (high-level)
- `docs/` (or equivalent) for:
  - ADRs for durable decisions
  - runbooks for production systems

