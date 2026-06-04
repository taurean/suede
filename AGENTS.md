# AGENTS

Cross-agent rulebook. Read at task start (always in context for OpenCode, Claude Code, etc.).

## Stack

SvelteKit · Cloudflare Pages + Workers · D1 + Drizzle · Vitest + Playwright · pnpm · stylebase + Bits UI · Storybook.

## Git workflow

- Always branch from `main`. Pull latest `main` before creating the new branch.
- All tasks are reviewed in a pull request.
- The agent never pushes directly to `main` and never merges to `main`. The human reviews the PR and merges.
- The human is the commit author for all commits. Agent-made commits add a `Co-authored-by: opencode <noreply@opencode.ai>` trailer to credit assistance.

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

End-of-task skill: `.opencode/skills/task-lifecycle/SKILL.md`. The agent owns the task note — create it at task end without being asked, regardless of task size. Size of note scales with task.

## Releases

Suede uses [chronver](https://chronver.org). Version lives in `package.json#version` (chronver format `YYYY.M.D[.N][-feature|-break]`; `pnpm version` normalizes leading zeros, so e.g. `2026.6.4`, not `2026.06.04`).

### Cutting a release

1. Final commit on the release branch, before merge, is `chore(release): cut <version>`. Bump with `pnpm version <version> --no-git-tag-version` (or hand-edit), commit only the `version` field.
2. Tag the merge commit on `main` with the bare chronver string, annotated. Push with `git push origin main --follow-tags`.
3. `git log <prev>..<new>` is the changelog. No `CHANGELOG.md`.

### Downstream lineage

When a project duplicates suede, it adds `"suede": { "from": "<tag>" }` to its own `package.json` with the chronver tag of the suede commit it branched from. Suede's own `package.json` carries no such field.

### Version policy

chronver for apps and templates (temporal releases, no API contract to break); semver for packages consumed by dependents (persistent breaking-change signals).

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
