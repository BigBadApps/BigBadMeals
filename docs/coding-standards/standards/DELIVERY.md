# Delivery Standards (PRs → Releases → Operations)

## Pull requests

- Keep PRs small and focused.
- PR description must include:
  - **Summary**: what and why
  - **Risk**: what could break
  - **Test plan**: what was run and what scenarios were verified
  - **Rollout/rollback** (if relevant)

Use `standards/PR_CHECKLIST.md` and `templates/PULL_REQUEST_TEMPLATE.md`.

## Versioning and releases

- Prefer automated releases.
- Use semantic versioning for libraries and public APIs.
- Include release notes for user-visible changes and breaking changes.

## Backwards compatibility

- APIs should be compatible by default.
- For breaking changes:
  - plan migration
  - communicate timelines
  - version or feature-flag

## Feature flags

Use flags when:

- the change is risky
- rollback is hard
- behavior is user-visible
- you need to separate deploy from release

Flags must have:

- an owner
- a removal plan
- instrumentation to measure impact

## Operational readiness

New critical paths require:

- logs with correlation IDs
- metrics (latency, errors)
- alerts based on SLO-impacting signals
- a runbook link

## Incident response expectations

- Mitigate first (stop the bleeding).
- Communicate clearly.
- Follow up with a blameless postmortem and tracked action items.

