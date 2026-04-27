# PR Checklist

Use this on every PR (human or agent-authored).

## Scope and clarity

- [ ] PR is small, cohesive, and reviewable.
- [ ] PR description includes **what/why**, not just what changed.
- [ ] User-facing behavior changes are called out.

## Correctness

- [ ] Input validation exists at boundaries.
- [ ] Errors are actionable and safe (no secrets/PII).
- [ ] Edge cases and failure modes considered.

## Tests

- [ ] Tests added/updated for bug fixes and non-trivial logic.
- [ ] Tests cover happy path and key error paths.
- [ ] No flaky tests introduced.

## Security

- [ ] No secrets committed.
- [ ] AuthN/AuthZ enforced where required.
- [ ] Dependencies reviewed if added/updated.

## Performance and reliability

- [ ] No obvious \(O(n^2)\) or unbounded memory growth.
- [ ] Timeouts/retries are correct and bounded.
- [ ] Idempotency considered for retried operations.

## Delivery

- [ ] Rollout plan exists for risky changes.
- [ ] Rollback is feasible and documented if needed.
- [ ] Observability added for new critical paths.

