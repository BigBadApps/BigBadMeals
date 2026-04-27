# Testing Standards

Testing protects velocity. The goal is fast feedback and high confidence.

## Testing pyramid (default)

- **Unit tests**: fast, deterministic; cover business rules and edge cases.
- **Integration tests**: verify boundaries (DB, HTTP clients, queues) with realistic wiring.
- **E2E tests**: cover critical user flows; keep count small but high value.

## What must be tested

- Bug fixes: reproduce the bug with a test, then fix.
- Business logic: invariants, edge cases, error paths.
- Boundary behavior: validation, auth/permissions, error mapping, retries/timeouts.
- Data migrations: forward + backward compatibility where relevant.

## Test quality

- Tests should be:
  - **Deterministic** (no time-dependent flakiness)
  - **Isolated** (no shared state leaking across tests)
  - **Readable** (arrange/act/assert or given/when/then)
  - **Targeted** (assert the behavior, not internal implementation)

## Flakiness rules

- A flaky test is a production outage in slow motion.
- Quarantine only as a short-lived emergency measure with an owner and deadline.
- Fix root cause: timeouts, race conditions, environmental dependencies.

## Coverage guidance

- Use coverage as a **signal**, not a target.
- Prefer high-value coverage of critical logic and failure modes.
- Avoid testing trivial getters/setters or framework internals.

## Test data

- Keep fixtures small and intention-revealing.
- Prefer factories/builders over giant JSON blobs.
- Never use real customer data in tests.

