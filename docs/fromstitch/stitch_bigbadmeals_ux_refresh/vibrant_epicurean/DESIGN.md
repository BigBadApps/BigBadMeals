---
name: Vibrant Epicurean
colors:
  surface: '#fff8f7'
  surface-dim: '#f4d2d2'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f0'
  surface-container: '#ffe9e8'
  surface-container-high: '#ffe1e1'
  surface-container-highest: '#fddada'
  on-surface: '#291717'
  on-surface-variant: '#5d3f40'
  inverse-surface: '#402b2b'
  inverse-on-surface: '#ffedec'
  outline: '#926e6f'
  outline-variant: '#e7bcbd'
  surface-tint: '#bf0033'
  primary: '#ba0032'
  on-primary: '#ffffff'
  primary-container: '#e80341'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3b4'
  secondary: '#77517c'
  on-secondary: '#ffffff'
  secondary-container: '#facbfd'
  on-secondary-container: '#77527d'
  tertiary: '#00685f'
  on-tertiary: '#ffffff'
  tertiary-container: '#008378'
  on-tertiary-container: '#f4fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb3b4'
  on-primary-fixed: '#40000b'
  on-primary-fixed-variant: '#920025'
  secondary-fixed: '#fdd6ff'
  secondary-fixed-dim: '#e5b8e9'
  on-secondary-fixed: '#2e0d35'
  on-secondary-fixed-variant: '#5d3a63'
  tertiary-fixed: '#8ff4e6'
  tertiary-fixed-dim: '#72d7ca'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#fff8f7'
  on-background: '#291717'
  surface-variant: '#fddada'
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
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 80px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

This design system embodies a "High-Contrast Minimalist" aesthetic, blending the editorial sophistication of a traditional bistro with a contemporary, high-energy pulse. It targets a discerning yet adventurous audience that values culinary excellence and bold visual expression. 

The emotional response is one of confidence and appetite; the deep reds and purples provide a grounded luxury, while the neon-adjacent accents inject a sense of playfulness. The interface utilizes generous white space to allow the "Lipstick Red" and "Blackberry Cream" to act as structural anchors, while the "Aquamarine" and "Tea Green" highlights guide the user through the experience with electric clarity.

## Colors

The palette is driven by "Lipstick Red" for primary actions and "Blackberry Cream" for deep structural elements and secondary navigation. The accents are used strategically: "Aquamarine" for success states and interactive cues, "Tea Green" for subtle highlights or dietary badges, and "Banana Cream" as a soft background alternative for cards or promotional banners. 

Neutral surfaces remain warm and off-white to prevent the high-saturation colors from feeling clinical. Text should primarily use the "Blackberry Cream" for high readability with a hint of warmth, rather than pure black.

## Typography

The design system utilizes a sophisticated pairing of **Noto Serif** for headlines and **Be Vietnam Pro** for functional text. 

Headlines should be set with tight tracking and leading to create a dense, editorial impact. Noto Serif conveys the timeless quality of a bistro menu, while Be Vietnam Pro provides a contemporary, friendly counter-balance that ensures readability on mobile devices. Use "Lipstick Red" for specific display-level emphasis and "Blackberry Cream" for standard content.

## Layout & Spacing

This design system uses a 12-column fluid grid for desktop and a single-column layout for mobile, adhering to a 4px baseline grid. Content is organized into large, distinct blocks to mimic the layout of a luxury lifestyle magazine. 

Spacing is intentionally generous ("xl" and "xxl" units) to create "breathing room" around high-saturation elements. Margin and padding within containers should scale based on the 4px unit, typically defaulting to 24px (lg) for internal padding to maintain a premium feel.

## Elevation & Depth

To maintain the vibrant and modern feel, the system avoids traditional heavy shadows. Instead, it employs **Tonal Layering** and **Color Depth**:

1.  **Low-Contrast Tinting:** Elements are lifted from the background using subtle color shifts (e.g., a "Banana Cream" surface on a white background).
2.  **Soft Ambient Shadows:** Where elevation is necessary (like floating action buttons), use extremely diffused shadows (32px blur) with a 5% opacity tint of "Blackberry Cream" to keep the shadow feeling organic.
3.  **Flat Stacking:** Elements often appear "flat" but are separated by high-contrast borders or vibrant background colors, creating a sense of physical paper layers.

## Shapes

The shape language is defined by ultra-soft, **3xl rounded corners**. 

Containers, cards, and modal sheets must use a 1.5rem to 3rem radius to soften the high-impact color palette. This "pill-adjacent" geometry makes the vibrant red and purple feel approachable rather than aggressive. Buttons follow a full pill shape (100px radius), while smaller components like chips and input fields use a consistent 1rem radius to maintain harmony with the larger containers.

## Components

### Buttons
*   **Primary:** Filled "Lipstick Red" with white text. Full pill-shape.
*   **Secondary:** Ghost style with "Blackberry Cream" border (2px) and text.
*   **Tertiary:** Filled "Aquamarine" with "Blackberry Cream" text for high-visibility calls to action (e.g., "Book Now").

### Cards & Containers
Containers use the "rounded-3xl" (1.5rem+) radius. Main surfaces should be white or "Banana Cream" to keep the UI light. Cards should have no borders, utilizing the soft ambient shadow for separation.

### Inputs & Fields
Input fields use a "Blackberry Cream" 1px outline that thickens to 2px in "Lipstick Red" upon focus. Backgrounds should be slightly tinted with "Tea Green" at 10% opacity for a fresh, clean look.

### Chips & Badges
Small, pill-shaped elements used for dietary labels (e.g., "Vegan", "Gluten-Free"). Use "Tea Green" or "Aquamarine" backgrounds with "Blackberry Cream" text to ensure they stand out without competing with primary buttons.

### Menu Lists
List items should be separated by thin, low-opacity "Blackberry Cream" horizontal rules. Utilize Noto Serif for dish names and Be Vietnam Pro for descriptions and pricing.