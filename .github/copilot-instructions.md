---
version: 0.2.0
ratified: 2026-02-26
last-amended: 2026-03-07
applyTo: "**"
---

# Agent Constitution

This file is the single source of truth for how AI agents assist on this
codebase. Every rule here applies to every file, every task, without
exception. Rules that apply only to specific file types, workflows, or roles
live in scoped instruction files or Skills — not here.

---

## Defaults & Skill Routing

These are the standing defaults. Skills carry the implementation detail —
the constitution only sets direction.

- **Default technology stack: `technology-stack-dotnet`.**
  React 18 + ShadCN/ui + Tailwind CSS frontend, ASP.NET Core 8 + EF
  Core 8 + SQLite backend, Azure AD / MSAL auth, Playwright E2E. Use this
  stack for any new project or feature unless the user explicitly specifies
  a different framework or language.
- **Default cloud platform: Azure.**
  Any exception requires explicit approval before work begins.

### When to load skills

| Trigger | Skill to load |
|---|---|
| Any technology, framework, or stack decision — or any new project where no stack is specified | `technology-stack-dotnet` |
| Any visual design decision: colours, typography, layout, spacing, icons, component styling, presentations, documents, or any artefact that carries IMF branding | `accessible-frontend` |

### When both skills apply

For UI component work (dashboards, pages, forms, interactive widgets):

1. Load `technology-stack-dotnet` first — it determines *which* components
   and frameworks to use.
2. Load `accessible-frontend` second — it determines *how those components
   should look and behave* (brand, accessibility, UX).
3. If the two skills conflict, `accessible-frontend` wins on visual and
   accessibility matters; `technology-stack-dotnet` wins on architecture and
   wiring matters.

---

## AI Agent Behaviour

These rules govern how the AI acts, not just what it produces.

- **Minimal footprint.** Do the least necessary to accomplish the task. Do
  not refactor code that is not related to the change, do not reorganise
  files unprompted, and do not expand scope beyond what was asked.
- **Prefer edits over rewrites.** When modifying existing code, change the
  minimum required. Full rewrites destroy git history context, bloat diffs,
  and introduce unintended behaviour changes.
- **Explain before irreversible operations.** Before executing anything that
  cannot be easily undone — deleting data, dropping columns, running
  migrations, overwriting files — state what you are about to do and why,
  and wait for confirmation.
- **Never invent facts about the codebase.** If you do not know whether a
  service exists, what a function does, or what a schema looks like, say so
  and look it up. Do not assume method signatures, table names, or API
  shapes.
- **Surface uncertainty explicitly.** When confidence is low — ambiguous
  requirements, unfamiliar patterns, conflicting signals — flag it rather
  than picking silently. A visible uncertainty is far less costly than a
  confident wrong answer.
- **One concern per change.** Each change should address one thing. Do not
  mix a bug fix with a refactor with a dependency upgrade in one response.
- **Match the existing style first.** Before applying preferred patterns,
  match what is already in the file being edited. Consistency within a file
  beats correctness in the abstract.
- **Run tests after every change.** Code that compiles is not code that
  works. After making changes, run the existing test suite and verify all
  tests pass before considering the task complete. If tests fail, fix the
  issue before moving on — do not leave broken tests for the user to
  discover.
- **Maintain test coverage.** When adding or modifying functionality, add
  or update tests to cover the change. Do not reduce existing test coverage.

> These rules exist because AI failure modes differ from human ones: agents
> can be confidently wrong, can silently expand scope, and can produce
> changes that compile and build successfully but break at runtime.

---

## Security First

All code must treat security as the top priority.

- Frontend authentication must use the organisation's approved identity
  provider for interactive flows.
- All backend endpoints must require authentication using the approved token
  scheme unless explicitly documented as public.
- Secrets must never be stored in source control. Production secrets must be
  stored in the approved secrets store.
- Local development must use secure environment configuration (local key
  vaults, secret managers, or env files not checked in).
- HTTPS is required in all non-local environments.
- Sensitive data (PII, tokens, secrets) must not be logged.
- Security boundaries must remain intact under retries, duplicate requests,
  and partial failures.
- Encryption in transit and at rest is required wherever the platform
  supports it.

> Centralised secret management and strong auth reduce credential leakage
> risk and ensure a predictable security posture across environments.

---

## API Contracts — Principles

APIs must be explicit, versioned, and safe to retry. These principles apply
universally; implementation patterns (DTOs, error format, correlation IDs,
idempotency key handling) are defined in the `technology-stack-dotnet` skill.

- Breaking changes must be versioned and documented before deployment.
- Server-side validation is required for all inputs. Clients cannot be
  relied upon for validation.
- State-changing operations must be designed for idempotency where feasible.
  Duplicate submissions must not create inconsistent state.

---

## Simplicity, Structure & Error Handling

Architectural decisions must favour simplicity and predictable behaviour.

**Design principles:**
- **Single responsibility**: every function, class, and module should do one
  thing well. Controllers and handlers must remain thin — business logic
  belongs in services.
- **Fail fast and explicitly**: return or throw at the earliest point an
  invalid state is detected. Never allow invalid state to propagate silently.
  Every error must be handled or explicitly propagated — silently swallowing
  exceptions is prohibited.
- **Use typed, domain-specific errors** where the language supports it.
  Log errors with enough context to diagnose them (relevant identifiers,
  state, the operation that failed). Never expose internal error details to
  end users.
- **Design for partial failure**: in distributed systems, assume any call
  can fail. Use timeouts, retries with back-off, and circuit breakers.
- **Avoid deep nesting**: more than two or three levels of indentation is a
  signal to refactor. Use early returns and guard clauses.
- **No magic numbers or strings**: use named constants with meaningful
  identifiers.
- **Pure functions where possible**: functions without side effects are
  easier to test, reason about, and reuse.
- **Build reusable components**: avoid solving the same problem twice.
- **Consistent naming**: naming conventions must align across frontend
  components, API routes, and data entities. Error handling and logging
  formats must be consistent across services.

---

## Observability

Applications must be observable by design.

- Structured logging must be implemented across all backend services.
- Correlation IDs must flow end-to-end and be present in all logs and
  telemetry.
- Telemetry must capture authentication failures, duplicate submission
  attempts, API failures, and key performance metrics.
- Logging must be environment-aware: sensitive fields must be redacted in
  non-development environments.
- Retry behaviour and error handling must be observable and diagnosable.
  Silent failures are disallowed.

---

## Version Control Discipline

- **Commit one logical change at a time**: never bundle unrelated changes
  in a single commit. Each commit should be independently understandable,
  reviewable, and revertable.
- **Write meaningful commit messages**: state *what* changed and *why*. Use
  conventional commit format (`feat:`, `fix:`, `refactor:`, `chore:`).
- **Commit frequently**: do not accumulate large uncommitted diffs.
- **Never commit broken code**: every commit on a shared branch must leave
  the codebase in a buildable, testable state.
- **Use branches for all non-trivial work**: no direct commits to main or
  trunk without a pull request and approval.

---

## Documenting Intent

- **Document the *why* behind non-obvious decisions**: use a `# WHY:`
  comment for any design choice that looks strange, was the result of a
  constraint, or that a future developer might be tempted to change.
- **Every public interface must have a doc comment**: all exported functions,
  classes, and API endpoints must describe their purpose, parameters, return
  values, and important constraints or side effects.
- **Every module or service must have a README or header block** explaining
  what it does, what it owns, what it depends on, and what should not be
  changed without understanding the broader context.

---

## Governance

This constitution supersedes informal practices and guides all design
decisions.

Scoped instruction files (skills, `.md` files in specific directories) may
extend or override specific rules in this constitution for their scope. When
an override occurs, the agent must:

1. State in its response which constitution rule is being overridden and by
   which scoped file.
2. Proceed with the scoped rule.

This ensures overrides are visible and traceable, never silent.
