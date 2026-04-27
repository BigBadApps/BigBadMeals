# Architecture Standards

These standards guide system design so software remains reliable and easy to change.

## Core principles

- **Explicit boundaries**: modules/services own specific responsibilities.
- **Stable interfaces**: APIs are contracts; changes are intentional and versioned when needed.
- **Separation of concerns**: business logic is independent of transport/UI/persistence.
- **Design for failure**: timeouts, retries, idempotency, backpressure.
- **Observability first**: measure and debug real behavior in production.

## Preferred shapes

- **Layered architecture (typical app)**:
  - **Domain**: core business logic and invariants
  - **Application**: use cases / orchestration
  - **Infrastructure**: DB, HTTP clients, queues, caches
  - **Interfaces**: HTTP/GraphQL/gRPC handlers, UI, CLI
- **Hexagonal (“ports & adapters”)** for complex domains or many integrations.
- **Event-driven** only when you have clear async needs and operational maturity.

## Dependencies and coupling

- Dependencies flow **inward**: interface → application → domain (domain depends on nothing).
- Avoid circular dependencies; enforce with tooling where possible.
- Prefer composition over inheritance.

## Data and schemas

- Treat schema changes as deployments:
  - Backwards compatible migrations first (expand)
  - Deploy code that writes both / reads new (migrate)
  - Remove old fields later (contract)
- Avoid “big bang” migrations.
- Establish ownership of each table/collection/topic.

## APIs and contracts

- Define error model (codes, messages, retryability).
- Version when you can’t be compatible.
- Make operations idempotent where clients may retry.
- Use timeouts everywhere; never wait forever.

## Reliability patterns

- Timeouts + retries with jitter (only for safe/idempotent ops).
- Circuit breakers for unstable dependencies.
- Rate limiting at edges.
- Graceful degradation for non-critical features.

## Observability requirements

- **Structured logging** with correlation IDs.
- **Metrics** for latency, throughput, errors, saturation.
- **Tracing** for distributed requests where applicable.
- Avoid logging secrets and sensitive payloads.

## Decision records (ADRs)

Use `templates/ADR.md` when:

- A decision will persist longer than a PR
- It affects multiple teams/systems
- It trades off operational complexity vs. delivery speed

