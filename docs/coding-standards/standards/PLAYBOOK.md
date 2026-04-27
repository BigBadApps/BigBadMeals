# Software Lifecycle Playbook

This playbook is the **default end-to-end workflow** for building and operating software in an AI-assisted organization.
It is designed to be followed by coding agents and humans.

## 0) Define success

- **Outcome**: what “done” looks like to the user/customer.
- **Scope**: what is explicitly included and excluded.
- **Constraints**: performance, cost, compliance, latency, platforms, compatibility.
- **Quality bar**: reliability target (SLO), security needs, and data sensitivity.

Deliverable: a short problem statement + acceptance criteria.

## 1) Understand the domain

- Identify key entities, state transitions, invariants, and failure modes.
- Map dependencies: internal services, external APIs, data stores.
- Note compliance and privacy requirements (PII/PHI/PCI).

Deliverable: a short domain model (bullets or diagram) and risk list.

## 2) Design the change

Prefer small “slices” that can ship independently.

- Choose boundaries (modules/services) and stable interfaces.
- Decide persistence model and migration strategy if data changes.
- Decide error handling and retry semantics.
- Define observability: what to log, measure, and alert on.

Deliverable: `templates/DESIGN.md` (or ADR if it’s a durable decision).

## 3) Implement safely

- Keep diffs minimal and coherent.
- Follow `standards/CODING.md` and `standards/ARCHITECTURE.md`.
- Add input validation and safe defaults.
- Avoid “action at a distance” changes.

Deliverable: working code with tests.

## 4) Verify (prove it works)

Follow `standards/TESTING.md`.

- Unit tests for logic and edge cases.
- Integration tests for boundaries (DB, network, queues) where feasible.
- E2E tests for critical user journeys if applicable.
- Run linters/formatters and type checks.

Deliverable: automated checks + a human-readable test plan in the PR.

## 5) Deliver (ship it)

Follow `standards/DELIVERY.md`.

- Feature flags for risky or user-visible behavior changes.
- Backwards compatibility plan (clients, APIs, data).
- Rollout plan (canary/gradual if needed) and rollback plan.

Deliverable: PR merged + release notes (when applicable).

## 6) Operate (keep it healthy)

- Add dashboards and alerts for new critical paths.
- Ensure logs are actionable (request IDs, error codes, key context).
- Create/extend runbooks: “how to detect, mitigate, and recover”.

Deliverable: updated docs/runbooks and on-call readiness.

## 7) Learn (close the loop)

- Post-release verification.
- If an incident/regression occurs: blameless postmortem with action items.

Deliverable: measurable improvements to prevent recurrence.

