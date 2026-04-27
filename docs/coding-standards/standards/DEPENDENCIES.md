# Dependency Standards

Dependencies are part of your attack surface and operational burden.

## Default rules

- Prefer the standard library and existing dependencies.
- Add a dependency only if it:
  - reduces total complexity,
  - is maintained and widely used,
  - has a clear license story,
  - has a viable upgrade path.

## Introducing a new dependency (checklist)

- Evaluate alternatives (including “do nothing”).
- Check maintenance health (recent releases, issue response).
- Check security posture and known CVEs.
- Confirm license compatibility.
- Minimize scope (import only what you need).

## Versioning and upgrades

- Use lockfiles where supported.
- Upgrade regularly; do not allow years of drift.
- Avoid pinning to unmaintained forks without a clear owner.

## Supply chain hygiene

- Do not run untrusted install scripts in sensitive environments.
- Prefer verified publishers and official registries.
- Keep build steps deterministic and reproducible.

