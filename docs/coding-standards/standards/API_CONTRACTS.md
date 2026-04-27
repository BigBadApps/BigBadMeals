# API Contracts (Frontend ↔ Backend)

These standards keep mixed-stack systems interoperable, evolvable, and debuggable.

## Contract rules

- APIs are **product interfaces**: changes must be intentional and compatible by default.
- Define:
  - request/response shapes
  - error model (codes + messages)
  - auth requirements
  - idempotency expectations
  - rate limits (if applicable)

## Backwards compatibility (default)

- Additive changes are preferred:
  - add new fields (with sensible defaults)
  - add new endpoints
- Avoid breaking changes:
  - renaming/removing fields
  - changing semantics of existing fields
  - changing pagination/sorting defaults

If a breaking change is unavoidable:

- version the endpoint/contract or use a flag
- provide a migration plan and overlap period

## Error model

At boundaries, return errors that are:

- **Actionable**: stable error code + message suitable for users (when appropriate)
- **Safe**: no secrets/PII
- **Debuggable**: includes correlation/request ID; optional debug details behind auth

Classify errors:

- validation (4xx)
- auth/permission (401/403)
- not found (404)
- conflict (409)
- rate limited (429)
- dependency failure (502/503/504)
- unexpected (500)

## Pagination and sorting

- Use explicit parameters; avoid surprising defaults.
- Make pagination stable (cursor-based when possible for large datasets).

## Idempotency

- For operations that clients may retry (network failures), provide idempotency keys or idempotent semantics.

## Observability

- Propagate correlation IDs from frontend to backend and back.
- Log structured request metadata (method, route, status, latency) without sensitive payloads.

