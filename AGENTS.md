# AGENTS

Cross-agent rulebook. Read at task start (always in context for OpenCode, Claude Code, etc.).

## Stack

SvelteKit · Cloudflare Pages + Workers · D1 + Drizzle · Vitest + Playwright · pnpm · stylebase + Bits UI · Storybook · Sentry + Axiom · OpenCode (primary) / Claude Code (fallback).

## Layout

- `AGENTS.md` — this file
- `agent-notes/` — chronological task notes (one per task, written at end)
- `agent-notes/plans/` — plan artifacts (write-only at task end, not auto-loaded)
- `.opencode/skills/` — in-repo skills (cross-cutting process skills live in your global plugin, not here)

## Authoring boundaries

Humans own:
- Svelte component markup
- Svelte `<style>` blocks
- CSS files in `src/lib/styles/`
- Layout, spacing, typography, design tokens

Agents own (TypeScript only):
- `<script lang="ts">` blocks within `.svelte` files
- `*.ts` files in `src/lib/`, `src/routes/`
- Drizzle schemas and queries
- Server routes, API integrations, Workers

## Task lifecycle

End-of-task skill: `.opencode/skills/task-lifecycle/SKILL.md`. Always create a task note in `agent-notes/`, regardless of task size. Size of note scales with task.

## Guardrails

Always:
- Create an `agent-notes/` entry at task end.
- Run verification before claiming done.
- Preserve `agent-notes/` history (append, never delete).

Never:
- Modify the presentation layer (Svelte markup, scoped CSS, `src/lib/styles/`).
- Skip the task note.
- Commit secrets.

## Verification before completion

- `pnpm lint` — pass
- `pnpm check` — pass
- `pnpm test` — run if tests changed

Claim done with evidence: command + result.
