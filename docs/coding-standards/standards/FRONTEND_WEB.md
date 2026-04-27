# Frontend Web Standards (Responsive Apps)

These standards apply to web apps that must work well on **phone, tablet, and desktop**.

## UI architecture

- Prefer **feature-oriented** structure (by capability) over “by file type”.
- Keep **domain logic** independent of UI framework where feasible.
- Separate:
  - **UI components** (pure rendering + local state)
  - **State/data** (queries, caches, app state)
  - **Side effects** (network, storage, analytics)

## Responsive design rules

- Mobile-first layouts; scale up via breakpoints.
- Use fluid sizing (flex/grid), not fixed pixel layouts.
- Avoid hover-only interactions; provide tap equivalents.
- Ensure reachable targets: touch targets should be comfortably tappable.

## Component standards

- Components should be:
  - **Predictable** (controlled vs uncontrolled is intentional)
  - **Composable** (prefer composition and slots/children)
  - **Accessible** by default
- Avoid “god components”; extract subcomponents when state/logic grows.

## State management

- Use the smallest tool that works:
  - Component local state for local concerns
  - A request cache/query layer for server state
  - A global store only for true app-wide state
- Make state transitions explicit; avoid implicit coupling through shared mutable objects.

## Styling

- Prefer a consistent system: design tokens, spacing scale, typography scale.
- Avoid scattered “magic numbers”.
- Keep theming and dark mode in mind (even if not shipped day one).

## Forms and validation

- Validate on the client for UX, and **always** validate on the server for safety.
- Make error messages clear and near the relevant control.
- Avoid losing user input on errors.

## Frontend error handling

- Show user-friendly messages; log technical detail safely.
- Handle offline and partial failure states where relevant.
- Use retry semantics carefully; avoid repeated submits without idempotency.

## Accessibility (baseline)

Follow `standards/ACCESSIBILITY_WEB.md`.

## Observability (frontend)

- Capture errors with:
  - route/screen
  - build/version
  - correlation/request ID (if available)
- Track key UX metrics (Core Web Vitals) and critical funnel events.

