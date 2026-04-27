# Web Performance Standards

Performance is a feature: it improves conversion, retention, and perceived quality.

## Default performance priorities

- Fast first render for core routes.
- Keep interactions responsive (avoid long main-thread tasks).
- Reduce bundle size and runtime work.

## Budgets (starting point)

Treat these as defaults; adjust per product.

- **Bundle**: avoid shipping unnecessary code; code-split by route.
- **Images**: serve appropriately sized, compressed images; prefer modern formats.
- **JS execution**: avoid large synchronous work on page load.

## Practices (must)

- Use caching intentionally (HTTP cache headers, SWR strategies).
- Avoid waterfalls: parallelize independent requests.
- Defer non-critical scripts and UI work.
- Avoid layout thrash: batch DOM reads/writes; prefer CSS for animations.

## Practices (recommended)

- Preload critical resources when it measurably improves UX.
- Use virtualization for large lists.
- Use server rendering / streaming when it improves TTFB and LCP for key routes.

## Measurement

- Collect and monitor Core Web Vitals where feasible:
  - LCP, CLS, INP
- Add performance regression checks for critical pages in CI when mature enough.

