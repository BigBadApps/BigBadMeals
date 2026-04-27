# Agent Operating Contract (AOC)

This file is the **primary entrypoint** for any coding agent working with this organization’s codebases.

## Mission

Deliver software that is:

- **Reliable** under real-world conditions
- **Secure** by default
- **Maintainable** by design
- **Observable** in production
- **Fast to iterate on** without regressions

## Non‑negotiables (always)

- **Clarify the objective**: restate the user goal and success criteria before making changes.
- **Small, reviewable changes**: prefer incremental PRs; avoid “mega-diffs”.
- **No silent behavior changes**: if a change alters semantics, document it in the PR summary.
- **Test changes that matter**: add/adjust tests for bug fixes and non-trivial logic.
- **Defense in depth**: validate inputs, handle edge cases, and fail safely.
- **Security hygiene**: never commit secrets; minimize sensitive data exposure.

## Default workflow (end-to-end)

Use `standards/PLAYBOOK.md` as the detailed guide. At a minimum:

1. **Understand**
   - Define user-facing behavior, constraints, and non-goals.
   - Identify risks (security, data loss, backwards compatibility, performance).
2. **Design**
   - Propose architecture and boundaries.
   - Choose “boring” proven tech unless there’s a clear win.
3. **Implement**
   - Keep changes minimal.
   - Prefer clarity over cleverness.
4. **Verify**
   - Run unit tests.
   - Add targeted integration/e2e tests when warranted.
   - Ensure lint/format pass.
5. **Deliver**
   - Write a useful PR description with test plan and rollout plan.
   - Provide migration notes if needed.
6. **Operate**
   - Add observability (logs/metrics/traces) for new critical paths.
   - Document runbooks and alerting expectations.

## Communication expectations

- **Be explicit**: assumptions, trade-offs, and risk areas.
- **Be traceable**: link decisions to requirements; use ADRs for durable decisions.
- **Be concise**: avoid long prose; prefer bullets and checklists.

## GitHub: agents and pull requests

Agents (including Claude) do not receive asynchronous events from Git or GitHub inside the chat. Treat delivery as **poll- or artifact-driven**:

- **Ship via PRs** to the default branch (usually `main`); do not bypass agreed branch protection.
- After pushing or opening a PR, **wait for a terminal GitHub outcome** (CI pass/fail, merge or not) by polling the API/CLI—do not assume success from `git push` alone. Product repos may provide a single command (e.g. `pr-publish --wait`); otherwise poll `gh pr view` / `gh pr checks` on an interval until done or timeout, then **continue with the appropriate next step** (sync default branch, fix failures, or report). Use `gh pr view` or scripts such as `pr-status.sh` when the repo provides them.
- Use **CI results and PR comments** from automation as the durable handoff: they are the practical substitute for a “webhook into the IDE.”
- When the repository configures **auto-merge**, enabling it (manually or via workflow) means GitHub performs the squash/merge **after** required checks pass—agents should still **poll** until `state` is `MERGED` or a check fails.

Product-specific commands, workflow names, and allowlists live in the project’s root **`AGENTS.md`** (or equivalent).

## Project conventions (apply unless overridden)

- **Docs live with code**: architecture and runbooks belong near the code they describe.
- **One obvious way**: consistent patterns beat local cleverness.
- **Default branches**: `main` with short-lived feature branches.
- **Semantic versioning**: for libraries/services when applicable.

## Standards location

In product repositories, the preferred layout is:

- `docs/coding-standards/` → a copy or submodule of this repo
- Project-local `AGENTS.md` should point agents to `docs/coding-standards/AGENTS.md`

## When uncertain

- Prefer the safest interpretation that preserves existing behavior.
- Add instrumentation or tests to reduce ambiguity.
- If requirements are incomplete, proceed with a reasonable default and clearly document it.

