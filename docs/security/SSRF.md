# SSRF guard (BigBadMeals)

The rules live in the shared standard: the SSRF section of
`docs/coding-standards/standards/SECURITY.md`. This page covers only how BigBadMeals
meets them.

## Where it is

- `server/pageFetch.ts` is the only server-side fetch of user-supplied URLs. It is used by
  `POST /api/ai/extract-url`.
  - `isUnsafeFetchUrl` runs string checks on every URL and every redirect hop: scheme,
    userinfo, and blocked hosts and IP literals.
  - `createSafeLookup` is the socket `lookup`. It resolves the hostname and rejects the
    connection if any resolved address is blocked, so DNS rebinding cannot swap in an
    internal address.
  - `fetchPublicHtml` follows redirects manually (at most `MAX_REDIRECTS`), caps the
    decompressed body at `MAX_HTML_BYTES`, and returns `null` for every failure.
- `server/discoverRecipeBanner.ts` uses `isUnsafeFetchUrl` to filter image URLs it returns
  to the client. It does not fetch them server-side.

Any new server-side fetch of an external URL must go through `fetchPublicHtml`, or reuse
`createSafeLookup` and `isUnsafeFetchUrl` the same way.

## Tests

- `tests/unit/pageFetch.ssrf.test.ts`: string-level checks and `isBlockedAddress`.
- `tests/unit/pageFetch.fetch.test.ts`: a real local HTTP server covering redirects,
  rebinding, mixed DNS answers, the hop cap, size and decompression caps, and timeouts.

Run with `pnpm test:unit`. Tests use the built-in `node:test` runner, with no extra
dependencies.

## Deployment note

This service does not run with IPv6-only egress, so NAT64 (`64:ff9b::/96`) is blocked outright. If
the service moves to IPv6-only egress with DNS64, unwrap the embedded IPv4 address
instead, as the standard describes.
