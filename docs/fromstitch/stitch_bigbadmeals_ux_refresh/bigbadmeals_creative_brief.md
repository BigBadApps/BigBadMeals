# BigBadMeals: Creative Brief & Implementation Guide (Responsive Refresh)

## 1. Project Overview
A complete visual and interaction refresh for BigBadMeals, moving from a functional baseline to a premium "Modern Bistro" digital assistant. This refresh focuses on "Deep Slate Epicurean" aesthetics—high contrast, sophisticated typography, and professional kitchen utility.

## 2. Design Principles
- **Professional Precision:** Clear information hierarchy and scanning efficiency.
- **Crafted Warmth:** A balance of utility and tactile "cookbook" aesthetics (Warm Paper backgrounds).
- **Responsive Continuity:** Seamless transition from desktop grids to mobile lists.
- **Technical Integrity:** Strict adherence to existing `data-testid` selectors and app flows.

## 3. Visual Language (Deep Slate Epicurean)
- **Palette:** 
  - Primary: Deep Slate (#2F353B)
  - Surface: Warm Paper (#FBFAEE)
  - Accents: Golden Amber (#D97706) for primary CTAs and status.
- **Typography:** 
  - Headings: Serif (Noto Serif) for a crafted, menu-like feel.
  - UI/Data: Sans-serif (Geist/Inter) for speed and legibility.
- **Shape:** Soft radii (24px for major containers, 12px for components) to create a premium feel.

## 4. Key Patterns & Components
- **The Hero Card:** A "featured menu" approach for the next serving, using high-impact imagery and a bold "Start Cooking" CTA.
- **Recipe Grid:** Multi-column grid on desktop/tablet, shifting to a high-density vertical list on mobile.
- **Navigation:**
  - **Desktop:** Persistent SideNavBar + TopAppBar.
  - **Mobile:** Bottom Tab Bar (non-negotiable) + TopAppBar.
- **Empty/Loading States:** Use the Warm Paper palette with subtle skeletons or illustrative "Kitchen Prep" icons.

## 5. Developer Implementation Notes
- **Tailwind v4:** Map primary, surface, and accent tokens to CSS variables in `src/index.css`.
- **Selectors:** DO NOT modify `data-testid` attributes (e.g., `nav-dashboard`, `dashboard-lets-cook`).
- **Layout:** Use `max-w-7xl` for desktop content containers.
- **Accessibility:** Ensure all color pairs meet WCAG AA contrast standards.