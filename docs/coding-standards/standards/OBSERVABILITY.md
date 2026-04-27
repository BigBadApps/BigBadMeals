# Observability Standards

Observability is required for reliable delivery. Build systems you can understand in production.

## Baseline signals (must)

- **Logs**: structured, queryable, with correlation IDs
- **Metrics**: latency, throughput, errors, saturation
- **Traces**: for distributed request paths when systems are multi-service

## Logging requirements

- Use structured logs (JSON or equivalent).
- Include:
  - request/correlation ID
  - user/session identifier **only if needed** and privacy-safe
  - route/handler name
  - error code/classification
  - latency for requests and key operations
- Avoid:
  - secrets/tokens
  - full request/response bodies containing sensitive data

## Metrics requirements

At minimum for each critical API/route/job:

- request count
- error count (by class/code)
- latency distribution (p50/p95/p99)

## Tracing requirements (when applicable)

- Propagate trace context across service boundaries.
- Name spans consistently (service + operation).
- Add attributes that help debugging (endpoint, dependency, status).

## Alerts and SLOs

- Alerts should be actionable and tied to user impact.
- Prefer SLO-based alerting for mature systems:
  - error budget burn
  - tail latency
- Avoid noisy alerts (high false positives).

## Debuggability patterns

- Use stable error codes for boundary errors.
- Capture enough context to reproduce without exposing sensitive data.
- Make feature flags and config visible in diagnostics where safe.

