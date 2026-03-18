# Accessibility (WCAG AA)

Accessibility is a quality attribute, not a post-launch checklist.
Accessibility defects block merge with the same priority as functional defects.

---

## Table of Contents

1. [Semantic HTML & ARIA](#semantic-html--aria)
2. [Keyboard Navigation](#keyboard-navigation)
3. [Colour & Contrast](#colour--contrast)
4. [Forms](#forms)
5. [Dynamic Content & SPAs](#dynamic-content--spas)
6. [User Preferences](#user-preferences)
7. [Testing Requirements](#testing-requirements)

---

## Semantic HTML & ARIA

- Prefer native HTML elements (`<button>`, `<nav>`, `<main>`, `<header>`,
  `<footer>`, `<section>`) over ARIA roles.
- Never skip heading levels. Use one `<h1>` per page.
- Every interactive element must have an accessible name via `<label>`,
  `aria-label`, or `aria-labelledby`. The programmatic name must match the
  visible label.
- Use ARIA only when semantic HTML is insufficient. Incorrect ARIA is worse
  than none.
- ARIA state attributes (`aria-expanded`, `aria-selected`, `aria-checked`)
  must be kept in sync programmatically.
- Decorative images and icons must be hidden from assistive technologies
  (`alt=""` or `aria-hidden="true"`).

---

## Keyboard Navigation

- All interactive elements must be keyboard accessible. No mouse-only
  interactions are permitted.
- Never suppress focus outlines without providing a clear, high-contrast
  replacement (minimum 2px).
- Tab order must follow visual reading order.
- Provide a "Skip to main content" link as the first focusable element on
  every page.
- Modals, dialogs, and overlays must trap focus while open and restore it
  on close.
- Dismissible components must respond to the Escape key unless explicitly
  documented otherwise.

---

## Colour & Contrast

- Normal text: minimum 4.5:1 contrast ratio.
- Large text (18pt+ or 14pt+ bold) and UI components: minimum 3:1.
- Contrast requirements apply in all modes: light, dark, high-contrast, and
  themed.
- Never use colour as the only means of conveying information — always pair
  with a label, icon, or pattern.
- Disabled states must remain perceivable; reduced contrast must not fall
  below non-text contrast requirements.

---

## Forms

- Every input must have an associated `<label>`. Placeholders are not
  substitutes.
- Required fields must be indicated using both visual and programmatic cues.
- Errors must be descriptive, placed near the affected field, and explain
  how to fix the problem.
- Forms with errors must include a summary announced to assistive
  technologies, with links to affected fields.
- Use the `autocomplete` attribute on common fields (name, email, address).
- Authentication must not require users to recall or transcribe codes that
  a password manager or authenticator could handle.

---

## Dynamic Content & SPAs

- Use `aria-live="polite"` for non-urgent dynamic updates;
  `aria-live="assertive"` only for critical alerts.
- On route changes, modal opens, or injected content, move focus to a
  meaningful location (heading or container).
- Update the document `<title>` to reflect the current view on navigation.
- Communicate loading and processing states to users.

---

## User Preferences

- Honour `prefers-reduced-motion`: disable or reduce animations and
  transitions when requested.
- Content must remain usable and readable without horizontal scrolling at
  400% zoom.
- Do not override user-defined font size, line height, letter spacing, or
  word spacing in ways that break layout.
- Respect system accessibility settings where supported (high-contrast mode,
  user-selected fonts).
- No functionality may be hidden or removed when accessibility preferences
  are active.

---

## Testing Requirements

- Automated accessibility checks (axe or pa11y) must run in CI. A passing
  automated check is a minimum bar, not a guarantee of full compliance.
- All interactive flows must be tested with keyboard only before merging.
- Critical user journeys must be verified with a screen reader (NVDA, JAWS,
  or VoiceOver).
- Critical user journeys must be defined, documented, and included in
  accessibility testing scope.
