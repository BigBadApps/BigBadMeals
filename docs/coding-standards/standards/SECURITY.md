# Security Standards

Security is a first-class product requirement.

## Data classification (minimum)

- **Public**: safe to disclose
- **Internal**: non-public business info
- **Sensitive**: credentials, tokens, personal data, financial data

Treat unknown data as **Sensitive**.

## Secrets and credentials

- Never commit secrets (API keys, private keys, tokens, passwords).
- Store secrets in a secrets manager (or environment variables for local dev).
- Rotate compromised credentials immediately.
- Use short-lived tokens where possible.

## Input handling

- Validate and sanitize at trust boundaries.
- Prefer allow-lists over block-lists.
- Protect against injection (SQL/NoSQL/command), XSS, SSRF, deserialization bugs.

## SSRF (Server-Side Request Forgery)

Any server-side code that fetches a URL derived from external input **must** use an SSRF guard. This includes URLs from request bodies, query strings, headers, database fields, or user config.

### Mandatory requirements

1. **Pre-fetch validation** — call the guard before every `fetch()` / `axios` / `requests.get` call.
2. **Post-redirect re-validation** — after following redirects, re-check `res.url` (Node) or `response.url` (Python). This is the most commonly missed item: an attacker at a public domain can return `Location: http://169.254.169.254/` and the pre-fetch check alone will not catch it.
3. **Protocol allowlist** — only `http:` and `https:` pass; block `file:`, `ftp:`, `javascript:`, `data:`, etc.

### Blocked IP ranges (Node.js reference — adapt for other runtimes)

Use `isIPv4()` / `isIPv6()` from `node:net`; never roll your own IP parsing.

Always strip IPv6 brackets first — Node's WHATWG `URL.hostname` returns `"[::1]"` with brackets; naive equality checks silently pass without this step:
```typescript
const h = hostname.replace(/^\[|\]$/g, "").toLowerCase();
```

| Range | CIDR | Reason |
|-------|------|--------|
| Loopback | `127.0.0.0/8` | localhost |
| Unspecified | `0.0.0.0/8` | maps to localhost |
| Link-local / cloud metadata | `169.254.0.0/16` | AWS & GCP IMDS at `169.254.169.254` |
| Private A | `10.0.0.0/8` | internal network |
| Private B | `172.16.0.0/12` | internal network |
| Private C | `192.168.0.0/16` | internal network |
| CGNAT | `100.64.0.0/10` | shared address space |
| Benchmark | `198.18.0.0/15` | testing range |
| Reserved | `240.0.0.0/4` | reserved + broadcast |
| IPv6 loopback / unspecified | `::1`, `::` | |
| IPv6 link-local | `fe80::/10` | |
| IPv6 ULA | `fc00::/7` | covers `fc__` and `fd__` |
| IPv4-mapped IPv6 | `::ffff:0:0/96` | `::ffff:127.0.0.1` bypasses IPv4-only checks |
| **NAT64 well-known** | `64:ff9b::/96` | **Critical for IPv6-only hosts (GCP Cloud Run):** `[64:ff9b::a9fe:a9fe]` routes to `169.254.169.254` via the OS NAT64 gateway — no DNS tricks required |
| 6to4 | `2002::/16` | encodes IPv4 in address bits 16–47 |

### Reference implementation

See `server/pageFetch.ts:isUnsafeFetchUrl()` for the production implementation used in this project. The `/security-ssrf-audit` Claude Code skill runs a full automated audit including unit-test generation.

### Unit tests

Every SSRF guard must have a unit test file covering:
- Each blocked range above (at least one IP per range)
- IPv6 bracket forms (`[::1]`, `[fe80::1]`, etc.)
- NAT64 (`[64:ff9b::a9fe:a9fe]`)
- At least two public IPs / domains that must be allowed

Run via `pnpm test:unit` in this project (Node built-in `node:test`, zero extra dependencies).

## Authentication and authorization

- Authentication answers **who**; authorization answers **what they can do**.
- Enforce authorization on every privileged action.
- Default deny.

## Dependency security

- Keep dependencies minimal.
- Update regularly and respond quickly to high severity CVEs.
- Pin lockfiles; review new dependencies and their licenses.

## Logging and privacy

- Do not log secrets, tokens, or full credentials.
- Minimize personal data in logs; redact when needed.
- Prefer event metadata over full payloads.

## Secure delivery

- CI must run tests and linters on every PR.
- Use code review for all changes.
- Prefer signed releases for artifacts where feasible.

