# Delivery Standards (PRs → Releases → Operations)

## Pull requests

- Keep PRs small and focused.
- PR description must include:
  - **Summary**: what and why
  - **Risk**: what could break
  - **Test plan**: what was run and what scenarios were verified
  - **Rollout/rollback** (if relevant)

Use `standards/PR_CHECKLIST.md` and `templates/PULL_REQUEST_TEMPLATE.md`.

### Automation-friendly delivery (optional per repo)

Some repositories add:

- **Required CI** on the default branch (job/check names in branch rules must match workflow job names exactly).
- **Auto-merge** (often squash) once required checks pass, sometimes enabled only for specific PR authors via a small workflow (`github.event.pull_request.user.login`, not `github.actor`).
- **A “CI finished” PR comment** after the main CI workflow completes, so humans and agents can reread the thread instead of polling blindly.

Agents should still **verify** final state with `gh` (or repo scripts): GitHub does not push merge results into the IDE. If auto-merge is very fast, a “notify on PR” job may race with merge; treat the API as source of truth.

### Container deploy + session handoff (optional)

For **full-stack** Node apps, teams often add a **`Dockerfile`** (multi-stage `npm run build` + `npm ci --omit=dev` runtime) and document **one** target (e.g. **Google Cloud Run**, **Fly.io**, **AWS App Runner**) with env/secrets expectations. Keep a short **`docs/STATUS.md`** (or equivalent) updated when pausing so the next human or agent knows what was last verified and what deploy step remains.

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

