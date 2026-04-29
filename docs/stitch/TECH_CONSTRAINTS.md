# Tech & implementation constraints for UX refresh

## Stack
- React 19 + Vite
- Tailwind CSS v4 + CSS variables (`src/index.css`)
- shadcn/ui components live under `components/ui/`
- Icons: lucide-react
- Motion: motion/react for tab transitions (`src/App.tsx`)

## Navigation model
- Tabs: `dashboard | recipes | planner | shopping | profile`
- Bottom nav: `src/components/Navigation.tsx`
- App switches tabs locally (not URL routes)

## E2E / test selectors that must remain
Do not remove or rename these `data-testid` values:
- `nav-primary`
- `nav-dashboard`, `nav-recipes`, `nav-planner`, `nav-shopping`, `nav-profile`
- `dashboard-lets-cook`
- `dashboard-view-week`
- `planner-generate`
- `shopping-sync-plan`
- `recipes-import-text`
- `recipes-import-submit`
- `e2e-login`

## Practical constraints
- Prefer reusing existing shadcn components rather than inventing new primitives.
- Keep tap targets ≥44px and avoid low-contrast text.
- Avoid heavy shadows/gradients that reduce legibility in lists.
- Keep page bottom padding to account for fixed bottom nav (screens use `pb-24`).

## Implementation-friendly deliverables
- Token set that maps to Tailwind classes or CSS variables
- Component/pattern specs buildable with shadcn/ui
