---
name: imf-visual-design
description: >
  IMF brand guidelines, WCAG AA accessibility, and UX quality rules for every
  visual design decision. Use this skill whenever creating or modifying UI
  components, pages, layouts, dashboards, React components, HTML/CSS,
  presentations (.pptx), documents (.docx), or any browser-facing or
  printable artefact that carries IMF branding. Triggers on: colour choices,
  typography, spacing, icons, imagery, animations, Fluent UI theming, Tailwind
  class selection, component styling, data-visualisation palettes, document
  templates, slide decks, or any conversation that touches visual appearance
  within an IMF context. If in doubt about whether this skill applies — it
  probably does.
---

# IMF Visual Design — Brand, Accessibility & UX

This skill governs three concerns that apply to every visual output:

| Concern | What it controls | Reference |
|---|---|---|
| **Brand** | Colours, typography, logos, layout, imagery | `references/brand.md` |
| **Accessibility** | WCAG AA compliance, keyboard, screen readers | `references/accessibility.md` |
| **UX** | Clarity, feedback, consistency, cognitive load | `references/ux.md` |

Read the relevant reference file(s) before producing or reviewing visual output.
For most tasks, Brand is always relevant; load Accessibility and UX when the
output is interactive or user-facing.

---

## Workflow

Follow this sequence for every visual design task:

1. **Identify scope** — Determine which concerns apply (Brand only? Brand +
   Accessibility + UX?). Load the corresponding reference files.

2. **Resolve the tech stack** — Look for the `technology-stack-dotnet` skill
   or another companion tech-stack skill. If found, follow its component and
   framework guidance.
   **If no tech-stack skill is available:** propose concrete implementation
   choices (e.g. specific ShadCN components, Tailwind classes, HTML
   patterns) but clearly mark them as proposals and wait for user validation
   before applying. Never silently assume a stack.
   **If the project uses a pre-themed component library** (e.g. ShadCN/ui
   with IMF theme tokens configured in Tailwind), use the library's
   semantic tokens and variants (e.g. `variant="destructive"`) rather than
   applying raw hex values. The palette and semantic mapping below still
   govern *which* colours map to which roles — but the implementation
   should go through the theme system, not inline styles.

3. **Apply the palette** — Use the quick-reference palette below. Choose
   colours by their semantic role (see Semantic Colour Mapping).

4. **Build / review** — Produce the output, applying brand, accessibility,
   and UX rules from the loaded references.

5. **Self-check** — Before presenting the output, verify:
   - Brand colours are used correctly (check text-colour grouping).
   - Functional surface tokens are used where defined (see
     `references/brand.md`) — no ad-hoc derivations for covered cases.
   - Any non-palette colours not covered by a token are either neutrals or
     documented derivations flagged for review.
   - Contrast ratios meet WCAG AA minimums.
   - Interactive elements are keyboard-accessible with visible focus states.
   - Hover and disabled states use approved tokens, not custom colours.
   - The primary action is visually obvious.

---

## Quick-Reference Palette

Fund blue (`#004C97`) is the primary brand colour and must remain visually
dominant in every IMF-branded output.

### Use with black text

| Hex | Name |
|---|---|
| `#F2A900` | Amber |
| `#FF8200` | Orange |
| `#E35205` | Burnt orange |
| `#78BE20` | Bright green |
| `#658D1B` | Olive green |
| `#00B0B9` | Teal |
| `#009CDE` | Sky blue |
| `#B1B3B3` | Light grey |

### Use with white text

| Hex | Name |
|---|---|
| `#004C97` | Fund blue (primary) |
| `#001E60` | Dark navy |
| `#DA291C` | Red |
| `#910048` | Burgundy |
| `#8031A7` | Purple |
| `#707372` | Medium grey |
| `#6E6259` | Warm grey |

---

## Semantic Colour Mapping

Colours in IMF digital products are semantic, not decorative. Select colours
based on intent and function first, visual emphasis second. WCAG AA contrast
requirements apply to every choice.

### Fund Blue (`#004C97`) — Primary Brand Colour

Fund blue is the dominant colour and must always be present. Use it for:

- Primary actions (buttons, key calls to action)
- Core navigation elements
- Primary headings and key emphasis
- Authoritative or institutional surfaces that represent the IMF itself

Do **not** use Fund blue for error, warning, or success states, decorative
accents, or any context where another semantic meaning is intended. Fund blue
must visually outweigh accent colours and never be overpowered by them.

### Accent Colours

Accent colours support the primary brand colour, not compete with it.
Use for: secondary actions, highlights requiring differentiation but not
urgency, visual grouping where colour supports comprehension.

Rules:
- Accents must not dominate the interface.
- Do not stack multiple accents in close proximity without clear semantic
  intent.
- When in doubt, reduce colour use rather than introduce a new accent.

### Status & Feedback

Status colours communicate state and outcome. They must always be paired
with non-colour cues (text, icons, labels).

| Role | Approved colour | Text | Use |
|---|---|---|---|
| Success | Bright green `#78BE20` | Black | Completed or successful actions |
| Warning | Amber `#F2A900` | Black | Cautionary messages, attention needed |
| Error | Red `#DA291C` | White | Errors, failures, blocking issues |
| Informational | Sky blue `#009CDE` | Black | Neutral system messages, guidance |

Rules:
- Status colours must never be used for branding or emphasis outside of
  status messaging.
- Never rely on colour alone to convey meaning.
- **Warning surfaces** (banners, inline alerts, validation warnings): use
  the approved warning background. Do not derive lighter or darker variants
  for emphasis. Do not use warning surfaces for errors, decorative callouts,
  or brand emphasis.
- **Error surfaces** (form validation, blocking errors, failed actions): do
  not soften or dilute error colours through opacity or tinting. Errors must
  be visually unambiguous. Error messaging must describe what went wrong and
  how to recover.
- **Success surfaces** (confirmations, completed workflows): must be
  visually subordinate to primary content. Do not use success colours for
  primary actions or navigation. Avoid large success-coloured background
  areas — success feedback should be brief and non-persistent.

### Surfaces & Backgrounds

Surface colours establish hierarchy and structure, not emphasis.
Use for: page backgrounds, section containers, cards, panels, modals.

Rules:
- Surfaces should be neutral and recede visually (white, near-white, or
  approved neutral values — see "Derived colours" in `references/brand.md`).
- Avoid saturated accent colours as large surface backgrounds.
- Text and interactive elements must remain legible against all surfaces.
- **Modal backdrops** must use the approved neutral backdrop value. Do not
  use brand or accent colours for modal backdrops. Background content must
  be visually suppressed but still perceivable.

### Hover, Focus & Disabled States

Interactive states communicate interactivity and position, not status.
They must use the approved surface tokens from `references/brand.md`.

**Hover:**
- Hover must not rely on colour change alone — reinforce with shape,
  underline, or border changes.
- Do not introduce new colours for hover states. Use the approved
  `surface-hover` token.
- Do not reduce opacity in ways that compromise legibility or accessibility.

**Focus:**
- Focus indicators must be clearly visible and meet WCAG AA contrast
  requirements (minimum 3:1 against adjacent colours).
- Use the approved `surface-focus` token or a visible 2px+ outline.
- Never suppress focus outlines without providing an equivalent replacement.

**Disabled:**
- Disabled elements must remain visible and distinguishable — disabled does
  not mean hidden.
- Contrast must not fall below non-text contrast requirements (3:1).
- Do not use opacity alone to indicate disabled state — combine with a
  visual cue (e.g. muted colour + crossed-out label or changed border
  style).
- Use the approved `surface-disabled` token.

### Data Visualisation

Colour in data visualisation differentiates data, not decorates charts.

| Purpose | Approach |
|---|---|
| Distinguish series | Use approved palette in a consistent order; Fund blue first |
| Group related data | Use tonal variations within a single hue family |
| Support comparison | Ensure sufficient contrast between adjacent series |

Rules:
- Follow approved data-visualisation palettes. Apply a consistent colour
  order across charts within the same context.
- Do not encode meaning using colour alone — labels and legends are required.
- Avoid unnecessary colour variation that increases cognitive load.

### Derived & Generated Colours

When deriving tints, shades, or transparency (see `references/brand.md`
for the derivation hierarchy):

- Preserve the original semantic meaning of the base colour.
- Do not introduce new implied meanings through colour manipulation.
- Validate contrast and accessibility after derivation.
- If a derived colour introduces ambiguity or reduces clarity, default to
  the base semantic colour or a neutral surface colour.

### Default Principle

When uncertain which colour to apply:

1. Prefer Fund blue or neutral surfaces.
2. Avoid introducing new accent or status colours.
3. Prioritise clarity, restraint, and accessibility over visual novelty.

---

## What This Skill Does Not Cover

- **Code architecture, API design, data models** — these are not visual
  concerns. Do not apply this skill to backend or business-logic decisions.
- **Content writing, editorial tone** — this skill covers visual presentation
  of content, not the content itself (except that generated language must be
  neutral, professional, and inclusive per IMF voice).
