# Screens & flows

App is a single-page shell with bottom navigation tabs:
- Dashboard (Home)
- Recipes
- Planner
- Shopping
- Profile

## Dashboard (Home)
- Greeting
- “Next Serving” hero card with CTA “Let’s Cook”
- Stats grid (recipes, favorites, etc.)
- “Today’s Schedule” list (Breakfast/Lunch/Dinner rows)
  - If meal exists, row offers “Start”
  - If no meal, plus button navigates to Planner

## Recipes
- Search bar + filter button (UI only today)
- Grid of recipe cards
  - Favorite toggle
  - Tap recipe opens recipe detail (within same page)
- Add/import recipe dialog
  - URL import (optional section)
  - Text import textarea
  - (File also supports image import)
- Add recipe to today’s meal plan (creates plan if missing)

## Planner
- Week navigation (prev/next)
- Auto-generate weekly plan (Gemini)
- Per day: breakfast/lunch/dinner rows

## Shopping
- Sync list from latest plan
- Checklist rows with checkbox + category badge
- Clear finished
- Empty state when no list

## Profile
- Edit preferences
- Manage family members
- System diagnostics (AI + Firebase)

Expectation: redesign improves clarity/polish without altering these flows.
