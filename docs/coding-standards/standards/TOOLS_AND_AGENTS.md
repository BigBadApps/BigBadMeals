# Tools and Agent Productivity Standards

These standards exist to maximize output quality while minimizing wasted agent time.

## Default agent loop (universal)

- **Restate goal** and define “done”.
- **Inspect before changing**: read relevant files and current behavior.
- **Propose the smallest safe change** that achieves the goal.
- **Implement** with minimal diff and clear structure.
- **Verify** with the fastest credible tests (then add deeper tests if risk warrants).
- **Summarize** what changed, why, and how to validate.

## Tool usage (general)

- Prefer **repo-native tooling**: existing linters, formatters, test runners, and CI scripts.
- Avoid introducing new dependencies unless:
  - it clearly reduces total complexity
  - it is widely supported and maintained
  - it has a clear owner and upgrade path

## Source-of-truth hierarchy

When deciding behavior, use:

1. Product requirements and acceptance criteria
2. Existing tests (they define contracts)
3. Existing public APIs and docs
4. Current runtime behavior (if tests are missing)

## Efficiency patterns

- Batch related work in one pass (read → plan → patch → test).
- Prefer targeted searches over reading many full files.
- When uncertain, add a test or instrumentation to reduce ambiguity.

## Quality gates (recommended defaults)

For every PR:

- Lint/format/typecheck passes
- Unit tests pass
- Risk-based integration/e2e tests (when boundaries change)
- PR template completed with test plan and rollout plan

## Cross-agent consistency

All agents should:

- Use the same definition of “done” (acceptance criteria + tests).
- Write PR summaries in the `templates/PULL_REQUEST_TEMPLATE.md` format.
- Record durable architecture decisions in ADRs (`templates/ADR.md`).

