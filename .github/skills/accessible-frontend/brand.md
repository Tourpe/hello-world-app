# IMF Brand Compliance

Brand compliance is an institutional risk control, not a visual preference.
Non-compliant brand usage must block merge.

---

## Colours

- Use the official IMF colour palette only. Colours outside the approved
  palette are prohibited.
- **Fund blue (`#004C97`) is the primary brand colour** and must remain
  visually dominant.
- Do not alter brand colour values — no transparency adjustments, gradients,
  or manipulation of core brand colours unless explicitly approved.
- Brand colours must still meet WCAG AA contrast requirements (see
  `references/accessibility.md`).
- Always check the text-colour group before applying — using a "black text"
  colour with white text (or vice versa) will fail contrast requirements.

The approved palette and text-colour groupings are defined in the main
`SKILL.md` quick-reference table. Refer there for hex values.

### Derived colours, tints & transparency

The approved palette covers brand-identity colours. Interactive UI sometimes
needs functional surface colours that the palette does not explicitly define —
for example, a light background tint for a warning banner, or a semi-transparent
backdrop behind a modal.

Apply this decision hierarchy:

1. **Use a palette colour as-is** whenever possible — this is always the
   safest choice.
2. **Use neutral values** (white, near-white like `#F8F8F8`, or `rgba(0,0,0,…)`)
   for functional surfaces such as page backgrounds, card surfaces, overlays,
   and dividers. Neutral values are not brand colours and do not conflict with
   the palette restriction.
3. **Derive a tint only when a neutral won't work** (e.g. a warning banner
   that needs a faint Amber background). When deriving:
   - Use a very low opacity of the source palette colour over white
     (e.g. `rgba(242,169,0, 0.08)` rather than inventing an arbitrary hex).
   - Preserve the original semantic meaning of the base colour — a tint
     derived from a status colour must only be used in that status context.
   - Never apply opacity or transparency to the core brand colours themselves
     (Fund blue, Dark navy) in contexts where they serve as brand identifiers
     (logos, headers, primary buttons).
   - Document the derivation in a code comment so reviewers can trace it to
     the source palette value.
   - Validate contrast and accessibility after derivation.
   - If a derived colour introduces ambiguity or reduces clarity, default
     to the base semantic colour or a neutral surface colour.
4. **Check the Functional Surface Tokens table below first.** If a token
   exists for the use case, use it as-is — no derivation or flagging needed.
   If no token exists and you must derive a new value, flag it as a proposal
   in the output so a human can confirm it is acceptable.

### Functional Surface Tokens

These are the canonical surface values. When a functional surface token is
defined below, use it as-is — do not derive alternatives unless explicitly
instructed.

| Token | Value | Source | Use |
|---|---|---|---|
| `surface-warning` | `rgba(242, 169, 0, 0.08)` | Amber `#F2A900` at 8% | Warning banner / alert bg |
| `surface-info` | `rgba(0, 156, 222, 0.08)` | Sky blue `#009CDE` at 8% | Informational banner bg |
| `surface-success` | `rgba(120, 190, 32, 0.08)` | Bright green `#78BE20` at 8% | Success confirmation bg (use sparingly, keep subordinate) |
| `surface-error` | White or `#F8F8F8` + solid Red `#DA291C` border | Neutral + Error | Error banner bg — do **not** use a red tint; errors must not be softened or diluted |
| `overlay-backdrop` | `rgba(0, 0, 0, 0.5)` | Neutral black | Modal / dialog backdrop — do not use brand or accent colours |
| `surface-hover` | `rgba(0, 76, 151, 0.06)` | Fund blue `#004C97` at 6% | Row / card / button hover |
| `surface-selected` | `rgba(0, 76, 151, 0.10)` | Fund blue `#004C97` at 10% | Selected row / card |
| `surface-focus` | `#004C97` solid 2px outline | Fund blue | Keyboard focus ring |
| `surface-disabled` | `#F8F8F8` with `#B1B3B3` border | Neutral + Light grey | Disabled controls — combine with visual cue, not opacity alone |

Rules for functional surface tokens:
- Where a token is defined, use it. Do not derive case-by-case alternatives.
- Error surfaces specifically must not be softened through opacity or
  tinting — use a neutral background with the solid error colour for borders
  and icons. This is an intentional exception to the general derived-colour
  hierarchy.
- Success surfaces must remain visually subordinate — keep them small and
  non-persistent.
- Validate all derived tokens against WCAG AA contrast after applying.

---

## Typography

- **Arial** for editable, system-based, or interface contexts.
- **Avenir Next W1G** where licensed and approved.
- Use approved fallback fonts where primary fonts are unavailable.
- Do not introduce unlicensed or non-approved fonts.
- Maintain consistent typographic hierarchy: headings, body text, and labels
  must follow IMF typographic patterns.

---

## Logos, Seal & Marks

- The IMF seal is a protected institutional emblem. Never alter, stylize,
  crop, animate, or repurpose it.
- Use only approved seal artwork. Do not recreate or approximate it.
- Do not combine the seal with product names, feature icons, or UI elements.
- Use IMF initials when the seal is not legible or appropriate (e.g. small
  surfaces).
- Never use the seal as a watermark, background texture, or UI affordance.
- Do not independently create new logos, marks, or brand assets.

---

## Layout & Visual Style

- Follow the IMF visual identity system for layout, spacing, iconography, and
  visual patterns.
- Use only icons and illustrations from official IMF libraries.
- Do not introduce new visual motifs, shapes, or decorative elements
  independently.
- Favour clarity, credibility, and restraint. Avoid visual clutter.
- Applications must reflect a single IMF identity. Products must not appear
  branded as independent entities unless explicitly approved.

---

## Imagery & Media

- Use only rights-cleared imagery (photos, videos, illustrations).
- Content must convey neutrality, professionalism, inclusiveness, and
  credibility.
- Do not use imagery that implies endorsement, bias, or scenarios that did
  not occur.

---

## AI-Generated Output

- Do not generate non-compliant logos, colours, typography, or layouts.
- Do not fabricate or approximate IMF brand assets — reference approved
  assets only.
- Generated language must remain neutral, professional, inclusive, and
  aligned with IMF voice.
