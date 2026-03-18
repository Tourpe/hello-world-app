---
name: technology-stack-dotnet
description: >
  This is the default technology stack for all new projects. Use this skill
  whenever the user asks to build, scaffold, or start a new application,
  component, API, or feature — unless they have explicitly specified a
  different framework or language. Also use this skill whenever working on an
  existing project that uses React 18, ShadCN/ui, Tailwind CSS, ASP.NET
  Core 8, EF Core 8, SQLite, MSAL / Azure AD auth, or Playwright. Triggers
  on: "build me an app", "create a new project", "scaffold a feature", React
  components, ShadCN components, Tailwind configuration, .NET controllers,
  EF Core migrations, MSAL authentication, Playwright tests, Vite setup,
  CORS issues, JWT Bearer configuration, or any frontend/backend wiring
  question. Also applies to existing Fluent UI v9 projects. When in doubt
  about which stack to use, use this one.
---

# Technology Stack Reference — React + ASP.NET Core

This is the **default technology stack** for all new projects.

Use this skill to resolve any question about how to write, run, or wire up
code. It covers the full stack: React 18 frontend, ASP.NET Core 8 backend,
EF Core 8 with SQLite, Azure AD auth via MSAL, and Playwright E2E testing.

For colour choices, typography, and brand compliance, load the
`imf-visual-design` skill. This skill covers *how* to build; that skill
covers *how it should look*.

## Default Stack Policy

When a user asks to build something new without specifying a technology:

1. **Assume this stack.** Use React 18 + ShadCN/ui + Tailwind CSS for the
   frontend and ASP.NET Core 8 + EF Core 8 + SQLite for the backend.
2. **State the assumption early.** In your response, mention which
   technologies you are using so the user can redirect if needed —
   e.g. "I'll scaffold this with React 18 and ASP.NET Core 8 per our
   default stack."
3. **If the user specifies a different stack**, defer to their choice. This
   skill only applies as a default, not an override.

---

## Resolving Project Paths

This skill uses `<ProjectName>` as a placeholder for the actual .NET project
name and path. Before running any command that references a project path:

1. Inspect the repository structure (e.g. `ls src/` or `find . -name "*.csproj"`)
   to locate the actual project directory and `.csproj` file.
2. Substitute `<ProjectName>` with the resolved path in all commands.
3. If multiple `.csproj` files exist, identify the correct one by context
   (API project for backend commands, test project for test commands).

Never guess a project path — resolve it from the repo first.

---

## Quick Command Reference

| Task | Command |
|---|---|
| Start frontend dev server | `npm run dev` |
| Production frontend build | `npm run build` |
| Run Playwright tests | `npx playwright test` |
| Run backend locally | `dotnet run --project src/<ProjectName>` |
| Add EF Core migration | `dotnet ef migrations add <Name> --project src/<ProjectName>` |
| Apply migrations to DB | `dotnet ef database update --project src/<ProjectName>` |
| Install frontend deps | `npm install` |
| Restore backend deps | `dotnet restore` |

---

## Frontend

> **Direction:** The team is converging on **ShadCN/ui + Tailwind CSS 4** as
> the standard component library, with a pre-themed boilerplate repo that
> will include all libraries, tokens, and IMF theme configuration
> pre-installed. When the boilerplate is available, clone it as the starting
> point for new projects and follow its conventions — many of the manual
> colour, spacing, and component rules below will be handled by the
> boilerplate's theme configuration.
>
> **Until the boilerplate lands**, follow the guidance below.

**Core stack:** React 18, Vite 5, Tailwind CSS, React Router v6, MSAL.

**Component library:** ShadCN/ui is the target. For existing projects still
on Fluent UI v9, follow the Fluent UI rules in the Legacy section below.

**Key packages:**
```
react@18
vite@5
tailwindcss
@shadcn/ui
react-router-dom@6
@azure/msal-browser
@azure/msal-react
```

### ShadCN/ui

- Use ShadCN components as the primary building blocks for all UI.
  ShadCN components are unstyled primitives themed via Tailwind — this
  means the Tailwind config (see below) is the single source of truth
  for visual appearance.
- Prefer ShadCN's built-in variants (`variant="destructive"`,
  `variant="outline"`, etc.) over custom class overrides.
- When a ShadCN component exists for the pattern you need (Button, Dialog,
  Alert, Table, Card, etc.), use it. Do not build custom equivalents.
- When ShadCN does not cover a pattern, build a custom component using
  Tailwind classes that follow the same token conventions as the rest of
  the ShadCN theme.

### Tailwind Configuration

ShadCN themes are configured through Tailwind's CSS variables. Ensure the
theme uses only approved IMF palette values from the `accessible-frontend`
skill. Do not rely on Tailwind's default colour scale (e.g. `blue-500`,
`red-600`) — these are off-brand.

Map semantic roles to IMF colours in the theme config:

```css
/* globals.css — IMF theme tokens */
@layer base {
  :root {
    --primary: 212 100% 29%;         /* Fund blue #004C97 */
    --primary-foreground: 0 0% 100%; /* white */
    --destructive: 5 80% 48%;        /* Red #DA291C */
    --destructive-foreground: 0 0% 100%;
    --warning: 40 100% 47%;          /* Amber #F2A900 */
    --warning-foreground: 0 0% 0%;
    --success: 92 72% 43%;           /* Bright green #78BE20 */
    --success-foreground: 0 0% 0%;
    --muted: 0 0% 96%;               /* near-white surface */
    --muted-foreground: 215 19% 35%;
    --accent: 184 100% 36%;          /* Teal #00B0B9 */
    --accent-foreground: 0 0% 0%;
    /* ... extend with remaining approved palette values */
  }
}
```

> When the boilerplate repo is available, it will ship with this
> configuration pre-built. Until then, set it up manually per the above.

### Tailwind Setup

If not already configured:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Add to `index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Routing

Use `react-router-dom@6` with nested routes and data loaders where
applicable. Protect authenticated routes using `@azure/msal-react` hooks
(`useIsAuthenticated`, `useMsalAuthentication`).

### Legacy: Fluent UI v9 (existing projects only)

Some existing projects use Fluent UI v9. When working on these codebases:

- Use Fluent UI v9 component tokens and theming APIs for all design-system
  components. Do not override Fluent UI tokens with raw Tailwind utilities.
- Prefer Fluent UI's own styling APIs (`makeStyles`, `mergeClasses`) for
  component-level styles.
- Use Tailwind only for layout and spacing on wrapper elements outside of
  Fluent UI components — for example, `<div className="mt-4 flex gap-2">`
  wrapping a `<Button>`. Do not apply Tailwind classes directly to Fluent
  UI component props.

New features in Fluent UI projects should still follow Fluent UI patterns
for consistency. Migration to ShadCN will be handled as a separate effort.

---

## Backend

**Core stack:** ASP.NET Core 8 (.NET 8 LTS), EF Core 8, SQLite, JWT Bearer auth.

**Key packages:**
```
Microsoft.EntityFrameworkCore.Sqlite
Microsoft.EntityFrameworkCore.Design
Microsoft.AspNetCore.Authentication.JwtBearer
```

**Run locally:**
```bash
dotnet restore
dotnet build
dotnet run --project src/<ProjectName>
```

### API Structure

- Controllers must remain thin — business logic belongs in services.
- All endpoints must define explicit request/response DTOs. Loosely shaped
  JSON is disallowed.
- All non-public endpoints require `[Authorize]`. Document any intentionally
  public endpoint in the OpenAPI spec.
- Error responses must use `ProblemDetails` (RFC 7807). Use
  `Results.Problem(...)` or `ControllerBase.Problem(...)`.
- All responses must include and propagate a correlation ID
  (`X-Correlation-ID` header).

---

## EF Core & Database

**Database engine:** SQLite. Default location: `Data/` or the configured
path in connection string.

**Connection string:**
```
Data Source=Data/<database-name>.db
```

**Install EF tools** (once per machine):
```bash
dotnet tool install --global dotnet-ef
```

**Migrations workflow** — follow this order every time:
```bash
# 1. Add migration after model changes
dotnet ef migrations add <DescriptiveName> --project src/<ProjectName> --startup-project src/<ProjectName>

# 2. Review the generated migration file before applying
# 3. Apply to database
dotnet ef database update --project src/<ProjectName> --startup-project src/<ProjectName>
```

⚠️ **Migration rules (never skip):**
- Never edit the database directly. All schema changes go through migrations.
- Always commit the migration files alongside the code change that requires
  them.
- Review generated migration files before applying — EF Core occasionally
  generates destructive operations for innocent model changes.
- The SQLite database file is the source of truth. Any move to a different
  database engine requires a documented, approved migration plan.

---

## Authentication

**Frontend (MSAL):**
- Configure `MsalProvider` with `clientId`, `authority` (tenant URL), and
  `redirectUri` matching the Azure app registration exactly.
- Obtain access tokens via MSAL hooks and attach as
  `Authorization: Bearer <token>` on all API calls.
- Protect routes via `useMsalAuthentication` or `AuthenticatedTemplate` /
  `UnauthenticatedTemplate`.
- ⚠️ Redirect URI mismatches between the Azure app registration and
  frontend config are the most common auth failure — verify both match
  exactly.

**Backend (JWT Bearer):**
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        // Validate audience and issuer against your Azure AD app registration
    });
```
- Validate `aud` (audience) and `iss` (issuer) against your Azure AD app
  registration values.
- Implement AppRoles in token validation for role-based access control.
- Use Microsoft Identity Platform middleware when available — it handles
  token validation, key refresh, and multi-tenant scenarios automatically.

---

## File Handling

- Validate all uploads server-side: file size, allowed MIME types, and
  content. Client-side validation is not sufficient.
- Store uploaded files in Azure Blob Storage (production) or
  `wwwroot/uploads` (local dev only).
- Return secure URLs or signed access tokens — never expose raw file paths.
- Design upload endpoints to be idempotent: duplicate uploads must not
  create duplicate stored artefacts.
- Virus scanning is recommended for any file accepted from untrusted sources.
- ⚠️ Not validating uploaded files server-side is a security defect, not a
  missing feature.

---

## E2E Testing (Playwright)

**Setup** (once):
```bash
npm i -D @playwright/test
npx playwright install
```

**Run tests:**
```bash
npx playwright test
npx playwright test --headed    # with browser visible
npx playwright test --debug     # step-through debugger
```

Configure `playwright.config.ts` with `baseURL` pointing at the dev server.
Critical flows requiring E2E coverage: authentication, duplicate submission
handling, file upload and retry, API failure recovery.

---

## CI

Minimum CI pipeline steps in order:

```bash
# Frontend
npm ci && npm run build

# Backend
dotnet restore && dotnet build && dotnet ef database update

# E2E (after services are up)
npx playwright test
```

**CI environment rules:**
- Pin the Node version via `.nvmrc` or GitHub Actions matrix. Use `npm ci`
  (not `npm install`) in CI.
- Target `net8.0` in all project files and keep the .NET SDK version
  consistent across CI and local dev.
- Never embed secrets in CI configuration — use the approved secrets store
  (Azure Key Vault).

---

## Common Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Auth fails with 401 / redirect loop | MSAL redirect URI mismatch | Verify URI in Azure app registration matches `redirectUri` in frontend config exactly |
| CORS errors on frontend → API calls | CORS policy not configured | Add `app.UseCors(...)` with the correct origin in `Program.cs` |
| SQLite file locking errors | Multiple processes accessing the DB | Expected under concurrent load — use a proper RDBMS if multi-instance deployment is needed |
| EF migration applies unexpectedly destructive change | Model change auto-detected as column drop/rename | Always review the generated migration file before running `database update` |
| Duplicate records created on retry | Missing idempotency key handling | Design the endpoint to check for existing records by idempotency key before inserting |
| File upload creates duplicate artefacts on retry | Upload endpoint not idempotent | Deduplicate by content hash or idempotency key before storing |
| Off-brand colours leak into UI via Tailwind defaults | Tailwind config uses default colour scale | Map ShadCN theme tokens to approved IMF palette values in `globals.css` |
| ShadCN component used but renders with default theme | IMF CSS variables not loaded | Ensure `globals.css` with IMF theme tokens is imported before ShadCN components render |
| Fluent UI tokens overridden by Tailwind in legacy project | Tailwind utility applied directly to Fluent component | Use Tailwind only on wrapper elements outside Fluent UI components |
