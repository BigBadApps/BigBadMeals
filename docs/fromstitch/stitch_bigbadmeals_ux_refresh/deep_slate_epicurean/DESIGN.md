---
name: Deep Slate Epicurean
colors:
  surface: '#fbfaee'
  surface-dim: '#dbdbcf'
  surface-bright: '#fbfaee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4e8'
  surface-container: '#efeee3'
  surface-container-high: '#e9e9dd'
  surface-container-highest: '#e4e3d7'
  on-surface: '#1b1c15'
  on-surface-variant: '#44474a'
  inverse-surface: '#303129'
  inverse-on-surface: '#f2f1e5'
  outline: '#75777b'
  outline-variant: '#c5c6cb'
  surface-tint: '#595f66'
  primary: '#1a2025'
  on-primary: '#ffffff'
  primary-container: '#2f353b'
  on-primary-container: '#989da5'
  inverse-primary: '#c1c7cf'
  secondary: '#67587c'
  on-secondary: '#ffffff'
  secondary-container: '#e5d2fe'
  on-secondary-container: '#67587d'
  tertiary: '#002424'
  on-tertiary: '#ffffff'
  tertiary-container: '#003b3b'
  on-tertiary-container: '#6aa7a6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde3eb'
  primary-fixed-dim: '#c1c7cf'
  on-primary-fixed: '#161c22'
  on-primary-fixed-variant: '#41474e'
  secondary-fixed: '#ecdcff'
  secondary-fixed-dim: '#d1bfe9'
  on-secondary-fixed: '#221535'
  on-secondary-fixed-variant: '#4e4063'
  tertiary-fixed: '#b0eeed'
  tertiary-fixed-dim: '#94d1d0'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#034f4f'
  background: '#fbfaee'
  on-background: '#1b1c15'
  surface-variant: '#e4e3d7'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  title-sm:
    fontFamily: Noto Serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Noto Serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base-unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 24px
  margin: 32px
---

## Brand & Style
This design system captures the essence of a high-end, contemporary bistro—moving away from the high-energy urgency of red toward the composed, professional authority of deep charcoal. It targets a sophisticated audience that values culinary precision and understated luxury. 

The design style is a blend of **Minimalism** and **Tactile** refinement. It utilizes expansive whitespace and a restrained color application to evoke a sense of calm and exclusivity. The aesthetic is editorial, treating digital interfaces like printed degustation menus where every element has a deliberate, structural purpose.

## Colors
The palette shifts the focus to **Deep Slate (#2F353B)** as the primary anchor, providing a grounded and professional alternative to more aggressive tones. This is supported by **Blackberry Cream** for deep interactive elements and **Aquamarine** for subtle highlights. 

**Tea Green** and **Banana Cream** serve as the foundational background and container colors, creating a "paper-like" warmth that feels more organic and premium than pure white. Use the Deep Slate for primary actions, headers, and structural borders to maintain a crisp, authoritative hierarchy.

## Typography
The typography is rooted in the timeless elegance of **Noto Serif**, used for both headlines and body copy to reinforce the editorial, bistro-menu feel. High-contrast sizing between headers and body text creates a clear path for the eye.

To balance the classicism of the serif, **Work Sans** is introduced for labels, captions, and micro-copy. This provides a functional, grounded legibility for technical details (like pricing, timestamps, or nutritional info) without distracting from the premium serif narrative.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy, centering content within a generous 12-column structure to create a "contained" and curated feeling. Wide margins are essential; the interface should never feel crowded.

A rhythmic 4px baseline is used to ensure vertical alignment. Use "lg" (2.5rem) and "xl" (4rem) spacing to separate major sections, allowing the sophisticated palette and typography enough "air" to be perceived as a premium experience.

## Elevation & Depth
Depth is achieved through **Tonal Layers** rather than heavy shadows. In this design system, surfaces are distinguished by subtle shifts in color (e.g., a Blackberry Cream footer against a Tea Green background). 

Where elevation is necessary for interactive components like modals or dropdowns, use **Low-Contrast Outlines** in Deep Slate at 10-15% opacity. This maintains a flat, tactile aesthetic reminiscent of expensive stationery. If shadows must be used, they should be "ambient"—highly diffused, with a slight tint of the Blackberry Cream color to maintain warmth.

## Shapes
The shape language is **Soft (0.25rem)**. This slight rounding takes the "edge" off the professional Deep Slate elements without appearing overly casual or "bubbly." Larger containers and cards may use `rounded-lg` (0.5rem) to suggest a gentle, tactile quality, like a leather-bound menu or a thick-cut coaster.

## Components
- **Buttons:** Primary buttons use a solid Deep Slate background with Banana Cream text. Secondary buttons use a Deep Slate outline with no fill.
- **Chips:** Small, pill-shaped tags in Aquamarine or Tea Green with dark text to categorize menu items or attributes.
- **Lists:** Clean, horizontal dividers using a 1px solid Deep Slate line at 10% opacity. Use Noto Serif for list items with Work Sans for metadata.
- **Input Fields:** Minimalist design with only a bottom border in Deep Slate. Focus states transition the border to full opacity.
- **Cards:** Use a subtle Tea Green background with no border. Elevation is suggested through a 1px white "inner glow" or a very soft ambient shadow.
- **Dividers:** Use ornamental flourishes or simple thin lines in Deep Slate to separate sections, echoing traditional print layout techniques.