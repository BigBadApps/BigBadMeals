# Data Migration Standards

Data changes are production changes. Treat them as deployments.

## Expand / Migrate / Contract (default)

- **Expand**: add new schema elements in a backwards compatible way
- **Migrate**: deploy code that writes new shape (and optionally dual-writes), migrate existing data
- **Contract**: remove old fields/paths after safe window

## Safety requirements

- Always have a rollback plan:
  - can we roll back code without breaking reads/writes?
  - can we pause/stop the migration safely?
- Migrations should be:
  - resumable
  - idempotent
  - progress-visible (metrics/logging)
  - rate-limited to avoid production impact

## Large migrations

- Prefer background jobs with checkpoints.
- Avoid long-running locks.
- Verify with sampling and invariants checks.

## Compatibility

- Old clients may exist. Assume mixed versions during rollout.
- Keep both read paths working during the overlap period.

