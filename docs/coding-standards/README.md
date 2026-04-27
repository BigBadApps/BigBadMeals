# BigBadCodingStandards

This repository is a **shared, tool-agnostic operating system** for AI-assisted software development.
It is written to be readable by humans *and* coding agents (Cursor, Claude, Gemini, etc.) and is intended to:

- **Raise quality**: reliability, security, maintainability, and performance.
- **Increase throughput**: less rework, fewer regressions, faster reviews.
- **Standardize delivery**: predictable architecture, testing, releases, and ops.

## How to use this repo

- **Agents**: start with `AGENTS.md`, then follow `standards/PLAYBOOK.md`. For GitHub PRs, auto-merge, and how agents observe CI/merge (polling, PR comments), see `AGENTS.md` and `standards/DELIVERY.md`.
- **Fast navigation**: use `standards/INDEX.md`.
- **Humans**: skim `standards/PR_CHECKLIST.md` and `standards/TESTING.md` first.
- **Projects**: copy or reference `templates/` and adopt the “quality gates” in `standards/DELIVERY.md`.

## Repository map

- `AGENTS.md`: entrypoint for any coding agent
- `standards/`: lifecycle standards and checklists
- `templates/`: PR/issue/design/ADR templates you can reuse in product repos
- `.editorconfig`: formatting defaults across languages

### Web app standards (responsive, mixed-stack)

- `standards/FRONTEND_WEB.md`: frontend architecture + responsive UI standards
- `standards/ACCESSIBILITY_WEB.md`: accessibility requirements (WCAG-oriented)
- `standards/PERFORMANCE_WEB.md`: web performance + budgets
- `standards/API_CONTRACTS.md`: API design, compatibility, and error models
- `standards/PROJECT_CONVENTIONS_WEB.md`: recommended repo structures + required scripts/CI gates

## Guiding principles

- **Make it correct, then make it clear, then make it fast.**
- **Design for change**: modularity, explicit boundaries, and stable APIs.
- **Tests are part of the product**: they protect velocity.
- **Operational excellence**: observability, safe rollouts, and incident readiness.

