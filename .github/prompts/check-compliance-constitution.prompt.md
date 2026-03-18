---
name: check-compliance-constitution
description:  Checks whether code complies with the project constitution (CLAUDE.md). Read-only — makes no changes to any file.
---


# Constitution Compliance Check

## Safety rules — read before doing anything else

- You are in READ-ONLY mode. Do not edit, create, delete, or refactor any file.
- Do not suggest inline fixes inside code blocks that could be copy-pasted 
  and applied blindly. Describe what needs to change in plain language only.
- Do not run any terminal commands.
- Do not run migrations, seed scripts, or any executable.
- If you are uncertain whether a rule applies to the file type in scope, 
  skip it and note the uncertainty. Never invent violations.

## Step 1 — Load the constitution

Read this file in full before checking any code: constitution.md or copilot-instructions.md


If file cannot be found in the root, try to find it in a subfolder. If you cannot find it at all, stop and report exactly which path was attempted. Do not proceed without both files loaded.

## Step 2 — Identify files in scope

Check the file currently open in the editor, or the files/folders the user 
specified. Apply only the principles that are relevant to the file type you are checking.

Never apply backend security rules to frontend styling files.
Never apply migration rules to service files.

## Step 3 — Run the compliance check

Check the code in scope against each applicable principle in the constitution file.



## Step 4 — Report findings

Use this exact format:

---
**CONSTITUTION COMPLIANCE REPORT**
**Scope:** [files checked]
**Constitution version:** [version from constitution.md frontmatter]

**Violations**

| # | Principle section | File + line | What was found | What is required | Severity |
|---|---|---|---|---|---|
| 1 | [section] | [file:line] | [what the code does] | [what the rule says] | BLOCKER / MAJOR / MINOR |

Severity:
- BLOCKER — secret in source, missing auth on endpoint, PII in logs, 
  direct DB edit bypassing migrations, data exposure
- MAJOR — missing DTO, wrong error format, no correlation ID, mixed 
  concerns in service, missing idempotency on critical operation
- MINOR — naming inconsistency, unnecessary abstraction, style mismatch

**Warnings** (uncertain — needs human review)
[Rules where compliance could not be determined from static analysis alone]

**Summary:** N BLOCKER / N MAJOR / N MINOR / N WARNINGS
**Verdict:** PASS or FAIL

FAIL if any BLOCKER or MAJOR violation exists.
PASS only if zero BLOCKERs and zero MAJORs. MINORs do not fail.

If no violations are found, state PASS explicitly. Do not invent findings.
