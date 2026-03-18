# User Experience

A system that is technically functional but confusing, inconsistent, or opaque
is a quality failure. UX is a core quality attribute.

---

## Table of Contents

1. [Task Clarity](#task-clarity)
2. [Feedback & System Status](#feedback--system-status)
3. [Error Prevention & Recovery](#error-prevention--recovery)
4. [Consistency & Predictability](#consistency--predictability)
5. [Cognitive Load](#cognitive-load)
6. [Transparency](#transparency)

---

## Task Clarity

- The primary action on any screen must be visually and programmatically
  obvious without requiring discovery.
- Do not introduce unnecessary steps, confirmations, or branching paths that
  do not serve a clear user or business goal.
- Apply progressive disclosure: advanced or secondary options must not
  overwhelm first-time or infrequent users.

---

## Feedback & System Status

- All user actions must receive feedback: loading, processing, success, and
  failure states must be clearly communicated.
- Long-running operations must expose status — users must never be uncertain
  whether the system is working, stalled, or failed.
- State changes resulting from user actions must be clearly reflected in the
  interface.

---

## Error Prevention & Recovery

- Design interactions to reduce the likelihood of mistakes rather than
  relying on error messages.
- Error messages must explain what went wrong and how the user can recover.
- User input must never be lost silently on failure. Data must be preserved
  unless explicitly reset by the user.

---

## Consistency & Predictability

- Similar actions must behave the same way across the system.
- Do not introduce novel interaction patterns without justification and
  documentation.
- Labels, terminology, and controls must be stable — do not change meaning
  or behaviour across contexts.
- Destructive or irreversible actions require a clear warning and explicit
  confirmation.

---

## Cognitive Load

- Do not expose configuration, technical detail, or internal concepts unless
  required by the task.
- Break complex workflows into manageable sequential steps.
- Default states must represent the most common or least risky choice.

---

## Transparency

- When the system takes action on behalf of the user, the rationale must be
  clear.
- Users must understand the impact of their actions before committing them.
- Do not obscure consequences.
