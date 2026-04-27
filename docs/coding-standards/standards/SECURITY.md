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

