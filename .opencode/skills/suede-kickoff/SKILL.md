---
name: suede-kickoff
description: Use when starting a new project forked from suede - the working tree is a fresh suede clone, git history belongs to suede, and the human wants a standalone project. Triggers include "fork suede", "start a new project from this template", "bootstrap a new app", "I'm cloning suede for a new thing".
compatibility: opencode
---

# Suede kickoff

Reset a fresh suede clone into a standalone project. The working tree IS the new project — do not work on a copy.

**Preconditions:** `git status` clean. `pnpm install` has been run. `deciduous` on `PATH`.

## Step 1: Capture the lineage marker

BEFORE any destructive op, capture the suede tag and commit. The `.git` history is the only ground truth.

```bash
git describe --tags --abbrev=0   # the chronver tag, e.g. 2026.6.4
git rev-parse HEAD               # the exact commit hash
```

The `suede.from` field is the **tag**, not `package.json#version`. They can differ. Store both — the tag goes in `package.json` (Step 5), the commit hash goes in the Step 8 task note as the audit trail.

## Step 2: Delete `.git`

```bash
rm -rf .git
```

## Step 3: Interrogate the human

Ask in order. Do not skip. Wait for answers.

1. **Project name** — for `package.json#name` and the repo.
2. **One-sentence purpose** — plain English, not a marketing line.
3. **Primary user** — internal, end consumer, dev tool, etc.
4. **Tooling keep/rip** — Cloudflare, D1+Drizzle, Storybook, Bits UI, stylebase, Vitest, Playwright. Default to keep if unsure.
5. **First chronver version** — `YYYY.M.D[.N]`, no leading zeros.
6. **Anything else load-bearing** — deadlines, author identity, target audience, etc.

## Step 4: Initialize fresh git

```bash
git init
git checkout -b main 2>/dev/null || git branch -m main
```

Do NOT add a remote.

## Step 5: Edit `package.json`

- `name` ← Q1
- `version` ← Q5 (`pnpm version <v> --no-git-tag-version`)
- `suede: { from: "<tag>" }` ← Step 1 (the tag, not the version)
- `description` ← Q2 if it fits

## Step 6: Reset `deciduous`

```bash
rm -rf .deciduous/
```

The CLI auto-reinits. The follow-up task creates the first real goal node.

## Step 7: Commit the bootstrap

Stage explicit files only. Never `git add .` (AGENTS.md Git Staging Rules).

```bash
git add package.json
git commit -m "chore: bootstrap forked project from suede <tag>

Co-authored-by: opencode <noreply@opencode.ai>"
```

Human is commit author. A brand-new repo's first commit is `main` — the documented exception to "agent never pushes to main."

## Step 8: Branch the first real task

```bash
git checkout -b chore/suede-kickoff
```

Write the first task note at `agent-notes/YYYY-MM-DD-01-suede-kickoff.md`. Capture:

- The human's answers verbatim.
- The commit hash from Step 1 (audit trail).
- A decision list: auth strategy, deploy target, design system scope, AGENTS.md sections to keep/drop/rewrite, per-tooling customizations from Q4, wrangler/D1/Storybook string sweep, README rewrite, `.opencode/commands/` and `.opencode/agents/` audit (delete suede-specific ones), config files (`wrangler.jsonc`, `drizzle.config.ts`, `.storybook/`) rename/sweep, post-fork `pnpm lint`/`pnpm check`/`pnpm test` re-verification.
- **Final action of this task:** delete `.opencode/skills/suede-kickoff/`. The skill is consumed once.

## Rationalizations this skill counters

| Excuse                                           | Reality                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| "I can capture the tag after `rm -rf .git`"      | No. The history is gone. Capture first.                                                 |
| "The version in package.json is the tag"         | AGENTS.md says the field is the tag. They can differ.                                   |
| "I'll just decide the tooling for them"          | The human pays 1–4 days to undo a wrong Cloudflare/D1/Drizzle call. Always ask.         |
| "I can skip resetting `.deciduous/`"             | Carries suede's graph into the new project. First `pulse` and `narratives` become lies. |
| "`git add .` is fine, the tree is clean"         | AGENTS.md bans it. `.env`, `node_modules/`, `docs/`, `.deciduous/` are all candidates.  |
| "I'll work on a copy to be safe"                 | The working tree IS the new project. A copy just delays the same ops.                   |
| "Bootstrap commit doesn't need a follow-up task" | Deep tooling decisions are a separate concern, separate branch, separate PR.            |

## Verification before handing back

- `git log --oneline` shows one commit on `main`.
- `git branch` shows `main` and `chore/suede-kickoff`.
- `cat package.json` shows `suede.from` set to the tag from Step 1.
- `.deciduous/` does not exist.
- First task note exists at the path Step 8 wrote it to.
- `pnpm install` succeeds (the bootstrap is mechanical; if it broke something, the follow-up task will surface it).
