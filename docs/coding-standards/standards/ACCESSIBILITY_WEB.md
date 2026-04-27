# Web Accessibility Standards

Goal: ship UIs that are usable with keyboard, screen readers, and touch, and that meet a WCAG-oriented bar.

## Baseline requirements (must)

- **Keyboard support**
  - All interactive elements are reachable and operable via keyboard.
  - Visible focus indicator is present and not suppressed.
- **Semantic HTML**
  - Use native elements (`button`, `a`, `input`, `label`) before divs.
  - Use headings in order (don’t skip levels without reason).
- **Labels and names**
  - Inputs have associated labels.
  - Icon-only controls have accessible names.
- **Color and contrast**
  - Do not rely on color alone to convey meaning.
  - Ensure readable contrast for text and essential UI.
- **Dynamic content**
  - Modals trap focus and restore it on close.
  - Announce important async updates when needed (ARIA live regions).
- **Motion**
  - Respect reduced-motion preferences.

## Common pitfalls to avoid

- Click handlers on non-interactive elements without keyboard equivalents.
- Missing `alt` text (or using non-informative placeholders).
- Focus loss after route changes or dialog interactions.
- Custom components that don’t expose the right roles/states.

## Testing expectations

- Include at least one accessibility-focused check per critical flow:
  - keyboard-only navigation
  - screen-reader sanity check for core pages
- Catch obvious issues with automated tooling where available, but do not rely on it alone.

