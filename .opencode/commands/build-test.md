---
description: Run typecheck + tests for the suede stack
arguments:
  - name: PATTERN
    description: Optional test name pattern to filter tests
    required: false
---

# Typecheck and test

Run the project's quality gate. This is the build+test command pair for the
Suede stack (SvelteKit + Cloudflare + D1 + Drizzle + Vitest + Playwright +
Storybook). The exact command set is a fork-time decision captured in
AGENTS.md; this skill ships with the suede defaults and the follow-up
branch from `suede-kickoff` rewrites it for the new project.

## Instructions

1. Regenerate wrangler types so svelte-check sees the latest env bindings:

   ```bash
   pnpm gen
   ```

2. Run the full quality gate:

   ```bash
   pnpm check && pnpm test
   ```

3. If typecheck fails, surface the error block verbatim — svelte-check
   reports the file and line. If tests fail, list which test files and
   which tests, then suggest a fix direction (don't auto-fix during a
   build gate; that's a separate diagnose/tdd cycle).

4. If the user specifies a test pattern, scope `pnpm test` to it:

   ```bash
   pnpm test -- -t <pattern>
   ```

5. For Storybook visual smoke (only relevant for full-stack forks that
   kept Storybook):

   ```bash
   pnpm storybook --port 6006
   ```

   Then drive a Playwright script against `localhost:6006` to verify the
   story canvas.

## Why this isn't `cargo build && cargo test`

The stock deciduous template's build-test command assumes Rust. Suede's
stack is pnpm + Vitest + svelte-check. The 2026-06-04-01 task note
flagged this as a misaligned stock command; this rewrite lands the fix
and pins it to the Suede defaults. Forks that rip SvelteKit should
rewrite this skill during their kickoff follow-up branch.

## Test categories in this project

- `src/**/*.spec.ts` — Vitest unit tests (component + pure-logic)
- `src/**/*.test.ts` — Vitest integration tests (server routes, drizzle queries)
- `src/stories/**/*.stories.svelte` — Storybook visual + interaction tests (Playwright-driven)
- `e2e/**` — Playwright end-to-end tests (full user flows against a running dev server)

## Quick reference

```bash
pnpm gen          # regenerate wrangler types
pnpm check        # wrangler types + svelte-check
pnpm test         # vitest run
pnpm lint         # prettier --check + eslint
pnpm storybook    # visual dev server
```
