# Code Review Standards

Code review is a quality gate and a teaching tool. Optimize for safety and learning, not perfectionism.

## Reviewer focus order

1. **Correctness**: does it meet acceptance criteria and preserve invariants?
2. **Security and privacy**: secrets, authz, input handling, data exposure.
3. **Reliability**: timeouts, retries, failure modes, idempotency.
4. **Maintainability**: readability, boundaries, cohesion, naming.
5. **Performance**: obvious bottlenecks, unbounded work, regressions.
6. **Style**: only after the above; let formatters handle most style.

## What to require

- A clear PR summary + test plan.
- Changes are scoped and coherent.
- Tests for non-trivial logic and bug fixes.
- No hidden breaking changes.

## How to comment

- Be specific: describe impact and offer a concrete alternative.
- Prefer “why” (principle) over personal preference.
- Separate “must fix” from “nice to have”.

## Agent-authored PRs

- Require the same standards as human-authored code.
- If something is unclear, request:
  - added tests,
  - clearer naming/structure,
  - or a short ADR/design note if the decision is durable.

