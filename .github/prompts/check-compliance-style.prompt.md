---
name: check-compliance-style
description: Checks whether browser-facing code complies with the IMF visual design skill (imf-visual-design.SKILL.md). Reviews colour usage, typography, accessibility, and UX rules. Read-only — makes no changes to any file.
---

# IMF Visual Design Compliance Check

## Safety rules — read before doing anything else

- You are in READ-ONLY mode. Do not edit, create, delete, or refactor any file.
- Do not suggest inline fixes inside code blocks that could be copy-pasted 
  and applied blindly. Describe what needs to change in plain language only.
- Do not run any terminal commands.
- If you are uncertain whether a rule applies, flag it as a warning rather 
  than a violation. Never invent violations.

## Step 1 — Load the skill

Read this file in full before checking any code:
- `skills/imf-visual-design/SKILL.md`

If that path does not exist, try:
- `.claude/skills/imf-visual-design/SKILL.md`

If you cannot find it, stop and tell the user exactly which path you looked 
for so they can correct it.

## Step 2 — Identify files in scope

Check the file currently open in the editor, or if the user specified files 
or folders, check those. Focus on:
- React components (*.tsx, *.jsx)
- CSS and Tailwind files (*.css)
- HTML files (*.html)
- Any file that makes colour, typography, layout, or accessibility decisions

Skip: test files, migration files, backend .cs files, config files.

## Step 3 — Run the compliance check

For each file in scope, check against every rule in the skill.


## Step 4 — Report findings

Use this exact format:

---
**IMF VISUAL DESIGN COMPLIANCE REPORT**
**Scope:** [files checked]
**Skill version checked against:** [version from SKILL.md frontmatter]

**Violations**

| # | Rule section | File + line | What was found | What is required | Severity |
|---|---|---|---|---|---|
| 1 | [section] | [file:line] | [what the code does] | [what the rule says] | BLOCKER / MAJOR / MINOR |

Severity:
- BLOCKER — wrong brand colour, unapproved font, missing auth on a 
  public-facing form, WCAG failure on a primary journey
- MAJOR — missing aria-live, missing focus management, contrast issue 
  on secondary element
- MINOR — naming inconsistency, missing autocomplete attribute, minor 
  spacing deviation

**Warnings** (uncertain — needs human review)
[List any rules where you could not determine compliance from the code alone]

**Summary:** N BLOCKER / N MAJOR / N MINOR / N WARNINGS
**Verdict:** PASS or FAIL

FAIL if any BLOCKER or MAJOR violation exists.
PASS only if zero BLOCKERs and zero MAJORs. MINORs do not fail.

If no violations are found, state PASS explicitly. Do not invent findings.
