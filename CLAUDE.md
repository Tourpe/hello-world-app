# CLAUDE.md — Agent Constitution for hello-world-app

<!-- Derived from .github/copilot-instructions.md v0.2.0 (ratified 2026-02-26, amended 2026-03-07) -->
<!-- Converted for Claude Code / Claude Agent SDK on 2026-03-25 -->

This file is the single source of truth for how Claude assists on this codebase.
Every rule here applies to every file, every task, without exception.

---

## Project Overview

**hello-world-app** is a broadcast-themed interactive "Hello World" demo — a
cinematic single-page application with adaptive audio synthesis (Web Audio API),
particle effects, live engagement metrics, event-log replay, and easter-egg
controls. There is no build step; assets are served as static files.

**Author:** Herve Tourpe
**License:** MIT
**Repo:** https://github.com/Tourpe/hello-world-app

---

## Quick Reference — Commands

```bash
npm start           # Serve locally via live-server at http://localhost:8080
npm test            # Run the full Jest test suite (46 tests across 3 suites)
npm run test:watch  # Jest in watch mode
npm run improve-randomly  # Run the auto-improvement script (also triggered by CI)
```

> Always run `npm test` after every code change and verify all tests pass
> before considering a task complete.

---

## Project Structure

```
hello-world-app/
├── src/
│   ├── index.html          # DOM structure — all IDs/classes referenced in app.js live here
│   ├── scripts/app.js      # Main application (~1 800 lines); orchestrates all features
│   └── styles/style.css    # CSS with hardware-accelerated animations and CSS vars
├── __tests__/
│   ├── app.test.js         # 21 unit tests (start script, package metadata, file structure)
│   ├── functional.test.js  # 25 functional tests (features, accessibility, code quality)
│   └── integration.test.js # Optional: server start, HTTP responses
├── scripts/
│   └── improve-randomly.js # Auto-improvement script invoked by GitHub Actions
├── .github/
│   ├── copilot-instructions.md   # Source constitution (VS Code Copilot format)
│   ├── prompts/            # Reusable prompt templates for compliance and style checks
│   ├── skills/
│   │   ├── accessible-frontend/  # Brand, accessibility, and UX guidelines
│   │   └── technology-stack-dotnet/  # Stack defaults for new features
│   └── workflows/
│       └── improverandomly.yml   # Runs improve-randomly every 6 hours
├── ARCHITECTURE.md         # Deep-dive: patterns, code org, performance notes
├── README.md               # User documentation
├── TDD_IMPLEMENTATION.md   # Testing architecture and TDD principles
└── package.json
```

**Key architectural facts:**
- `src/scripts/app.js` is a single-module vanilla JS file. No bundler, no transpiler.
- All magic numbers live in the `CONFIG` object (top of app.js). Change them there.
- DOM elements are queried once in `initializeDOMCache()` and stored in `domCache`.
  Access them via getter functions (e.g. `getHeadlineRef()`), never via raw
  `document.querySelector` calls outside of cache init.
- `anime.js` is loaded as an npm dependency, NOT via CDN — it must be present in
  `node_modules` and referenced correctly. Currently the app uses it via
  `node_modules/animejs/lib/anime.es.js`. Verify import path before modifying.
- Web Audio context is lazy-initialised on first user interaction (browser requirement).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JavaScript ES6+ (no framework) |
| Styling | Pure CSS3 with CSS custom properties and keyframe animations |
| Animations | `anime.js` ^3.2.1 + `requestAnimationFrame` |
| Audio | Web Audio API |
| CSS reset | `normalize.css` ^8.0.1 |
| Dev server | `live-server` ^1.2.1 (via `npx live-server src`) |
| Testing | `jest` ^29.5.0 |
| Runtime | Node.js ≥ 14.0.0 |

**Default stack for new features (unless the user specifies otherwise):**
React 18 + ShadCN/ui + Tailwind CSS front-end, ASP.NET Core 8 + EF Core 8 +
SQLite back-end, Azure AD / MSAL auth, Playwright E2E.
Default cloud: **Azure**. Any exception requires explicit approval.

---

## Skill Routing

Load the appropriate skill file before starting work:

| Trigger | Skill to read |
|---|---|
| Any technology, framework, or stack decision; any new project | `.github/skills/technology-stack-dotnet/SKILL.md` |
| Any visual design decision: colours, typography, layout, spacing, icons, component styling, presentations, documents, any IMF-branded artefact | `.github/skills/accessible-frontend/SKILL.md` |

**When both skills apply** (UI component work — dashboards, pages, forms, widgets):
1. Read `technology-stack-dotnet` first → determines *which* components to use.
2. Read `accessible-frontend` second → determines *how they look and behave*.
3. Conflict resolution: `accessible-frontend` wins on visual/accessibility matters;
   `technology-stack-dotnet` wins on architecture/wiring matters.

When overriding a constitution rule via a scoped skill, **state in the response**
which rule is being overridden and by which file. Overrides must never be silent.

---

## AI Agent Behaviour

- **Minimal footprint.** Do the least necessary to accomplish the task. Do not
  refactor code unrelated to the change, reorganise files unprompted, or expand
  scope beyond what was asked.
- **Prefer edits over rewrites.** Modify the minimum required. Full rewrites
  destroy git history context, bloat diffs, and introduce unintended behaviour.
- **Explain before irreversible operations.** Before deleting data, dropping
  columns, running migrations, or overwriting files — state what you are about
  to do and why, and wait for confirmation.
- **Never invent facts about the codebase.** If you do not know whether a
  function exists or what it does, look it up. Do not assume method signatures,
  DOM IDs, or config key names.
- **Surface uncertainty explicitly.** Flag ambiguity rather than picking
  silently. A visible uncertainty is far less costly than a confident wrong answer.
- **One concern per change.** Do not mix a bug fix with a refactor with a
  dependency upgrade in one response.
- **Match the existing style first.** Before applying preferred patterns, match
  what is already in the file. Consistency within a file beats correctness in
  the abstract.
- **Run tests after every change.** After making changes run `npm test` and
  verify all 46 tests pass before considering the task complete. If tests fail,
  fix the issue before moving on.
- **Maintain test coverage.** When adding or modifying functionality, add or
  update tests. Do not reduce existing test coverage.

---

## Security

- Frontend auth must use the organisation's approved identity provider for
  interactive flows.
- All backend endpoints require authentication unless explicitly documented as
  public.
- **Secrets must never be stored in source control.** Production secrets go in
  the approved secrets store; local dev uses env files excluded from git.
- HTTPS is required in all non-local environments.
- Sensitive data (PII, tokens, secrets) must not appear in logs.
- Security boundaries must remain intact under retries, duplicate requests, and
  partial failures.
- Encryption in transit and at rest is required wherever the platform supports it.

---

## API Contracts

- Breaking changes must be versioned and documented before deployment.
- Server-side validation is required for all inputs. Never rely on clients for
  validation.
- State-changing operations must be designed for idempotency where feasible.

---

## Code Quality Principles

- **Single responsibility:** every function, class, and module does one thing
  well. Controllers and handlers must be thin — business logic belongs in services.
- **Fail fast and explicitly:** return or throw at the earliest point an invalid
  state is detected. Never allow invalid state to propagate silently. Every error
  must be handled or explicitly propagated — silently swallowing exceptions is
  prohibited.
- **Typed, domain-specific errors** with enough context to diagnose them.
  Never expose internal error details to end users.
- **Design for partial failure:** use timeouts, retries with back-off, and
  circuit breakers.
- **Avoid deep nesting:** more than two or three indentation levels is a signal
  to refactor. Use early returns and guard clauses.
- **No magic numbers or strings:** use named constants from the `CONFIG` object.
- **Pure functions where possible:** functions without side effects are easier
  to test and reuse.
- **Consistent naming** across DOM selectors, function names, and CONFIG keys.
- Use `# WHY:` comments for any non-obvious design decision.

---

## Observability

- Structured logging across all backend services.
- Correlation IDs flow end-to-end and appear in all logs and telemetry.
- Telemetry captures auth failures, duplicate submissions, API failures, and key
  performance metrics.
- Logging is environment-aware: sensitive fields are redacted in non-development
  environments.
- Silent failures are disallowed.

---

## Version Control Discipline

- **One logical change per commit.** Never bundle unrelated changes.
- **Meaningful commit messages** using conventional commit format:
  `feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`
- **Commit frequently.** Do not accumulate large uncommitted diffs.
- **Never commit broken code.** Every commit must leave the codebase buildable
  and all tests passing.
- **Use branches** for all non-trivial work. No direct commits to `main` without
  a pull request and approval.

---

## Documenting Intent

- `# WHY:` comments for any design choice that looks strange, resulted from a
  constraint, or that a future developer might be tempted to change.
- Doc comments on all exported/public functions describing purpose, parameters,
  return values, and side effects.
- Every module or service must have a README or header block explaining what it
  owns and what must not be changed without understanding broader context.

---

## Known Issues (as of 2026-03-25)

The following bugs were identified during a static audit and should be fixed
before adding new features. See the bug report in `docs/bug-report-2026-03-25.md`
for full details.

| Severity | Location | Issue |
|---|---|---|
| High | `app.js:691` | `playClickChord` — `playVoice` calls not awaited; audio race condition |
| High | `app.js:745` | `scheduleAdaptiveBeat` — `playBeatPulse()` not awaited; beats may overlap |
| High | `app.js:1084` | `installHeadlineHoverFx` — event listeners added on every render but never removed (memory leak) |
| High | `app.js:1308` | `startGlyphDrift` rAF loop never cancelled; stacks on re-initialisation |
| Medium | `app.js:780` | `updateMapByMentions` — no guard if `eventMapNodes` is empty |
| Medium | `app.js:1358` | `triggerIdleAttentionStep` — no null check on `driftingGlyphs[idleIndex]` |
| Medium | `app.js:1758` | Feed `setInterval` never cleared; stacks if `initialize()` is called twice |
| Low | `app.js:769` | `refreshTicker` — random `pulse-highlight` class assignment is non-deterministic |
| Low | `app.js:1234` | `triggerViralAlert` counter rAF not cancelled on re-trigger; can flicker |
| Low | `app.js:229` | Dead variables `viewerCount`, `countryCount`, `mentionCount` always `null` |

---

## Governance

This file supersedes informal practices and guides all design decisions.

Scoped files (skills, prompt files in `.github/`) may extend or override
specific rules for their scope. When an override occurs, the agent must state
in its response which rule is being overridden and by which scoped file.
Overrides must always be visible and traceable, never silent.
