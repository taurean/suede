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

## Step 3: Grilling session — what is this project, and what should the process layer look like for it?

The working tree is now a fresh suede fork. Use `/grill-me` (one question at a time, recommended answer with each) to drive the human through two intertwined threads. Do not skip questions. Do not propose file edits in this step — the goal is to _capture_ the answers, not act on them. The follow-up task in Step 8 turns the captured answers into edits.

### Thread A — the project

1. **Project name** — for `package.json#name` and the repo.
2. **One-sentence purpose** — plain English, not a marketing line.
3. **Primary user** — internal, end consumer, dev tool, etc.
4. **Project shape** — full-stack web app / content-focused website / backend service or API or MCP / other. This decides which runtime defaults are appropriate (SvelteKit + bits-ui vs Hono + zod vs MCP stdio vs custom). Don't enforce a choice; capture the human's call.
5. **First chronver version** — `YYYY.M.D[.N]`, no leading zeros. (`pnpm version` normalizes leading zeros per AGENTS.md.)
6. **Anything else load-bearing** — deadlines, author identity, target audience, deployment target, etc.

### Thread B — process-layer customizations

The process itself is constant across every suede fork — the workflow from concept through `grill-me` → `to-prd` → `to-issues` → `triage` → `tdd` → `diagnose` → `review` → `qa` → release → `handoff` ships to every project (see AGENTS.md "Constant process pipeline"). What _varies_ is the _details_ of that pipeline. Grill on each axis that might differ:

7. **Tooling keep/rip** — Cloudflare, D1+Drizzle, Storybook, Bits UI, stylebase, Vitest, Playwright, SvelteKit itself. **Defaults: keep all.** Storybook is the suede default for UI forks; ripping it triggers the Authoring Boundaries Storybook-discipline override (the agent rewrites AGENTS.md + `.opencode/skills/tdd-supplementary/` to reflect the rip during this follow-up branch). SvelteKit is the suede default runtime; ripping it means the project is a backend MCP, a CLI, or another non-web shape — capture which, and rewrite the parts of AGENTS.md / `.opencode/commands/build-test.md` that assume a SvelteKit context.
8. **Process details to tailor** — open-ended. The process itself is constant; what varies is the _details_. Examples of the _kind_ of thing that might apply to this fork but not every fork:
   - **Issue tracker** — default is **GitHub Issues** (where `qa` / `triage` / `to-issues` / `review` expect to read and write). Override options: a markdown-dir tracker (e.g. `.scratch/issues/`) for forks that don't want an external service, or Linear / GitLab if you actually use them. Tangled is a git-host mirror, not a tracker.
   - **Version scheme** — default is **chronver** (suede's apps-and-templates convention). Override to **semver** if this fork is a library consumed by dependents. A fork that picks semver rewrites the AGENTS.md Releases section during this follow-up branch.
   - **Branch naming** — the repo currently has no enforced rule. Conventional-commits type prefixes (`feat/`, `chore/`, `fix/`, `docs/`, `refactor/`) are the de-facto convention. Override per project if needed.
   - **Pipeline compression** — for a 2-day prototype you might collapse `to-prd` / `to-issues` / `triage` into the task note (no PRD file, no tracker, no labels). The stages still happen; the artifacts don't.
   - **Which global skills from `~/.agents/skills/` apply** — e.g. a docs-heavy content project might pull in `writing-shape`; a backend project might pull in `improve-codebase-architecture`; a CLI might _not_ need `web-haptics`. The pipeline's Working style section lists the canonical set; you can subtract.
   - **Anything else that the human knows about this project that the agent can't infer.**

The follow-up task (Step 8) reads the answers to Thread B and decides which files in `AGENTS.md`, `.opencode/skills/`, `.opencode/commands/`, `agent-notes/`, and `.opencode/plugins/` to edit, add, or remove.

**Do not write any code in this step.** The grill produces a _plan_, not a diff. Step 8 turns the plan into a diff.

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

- The human's answers verbatim from Step 3 (both Thread A and Thread B).
- The commit hash from Step 1 (audit trail).
- **A "process-layer edits" decision list** as the lead section — file-by-file list of what needs to change in `AGENTS.md`, `.opencode/skills/`, `.opencode/commands/`, `.opencode/agents/`, `.opencode/plugins/`, `agent-notes/`, etc. to match the human's Thread B answers. This is the _substantive_ follow-up work.
- A "runtime-layer edits" decision list — auth strategy, deploy target, design system scope, per-tooling customizations from Q7, wrangler/D1/Storybook string sweep, README rewrite, config files (`wrangler.jsonc`, `drizzle.config.ts`, `.storybook/`) rename/sweep, post-fork `pnpm lint`/`pnpm check`/`pnpm test` re-verification.
- **Final action of this task:** delete `.opencode/skills/suede-kickoff/`. The skill is consumed once.

## Rationalizations this skill counters

| Excuse                                            | Reality                                                                                                                                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "I can capture the tag after `rm -rf .git`"       | No. The history is gone. Capture first.                                                                                                                                                                              |
| "The version in package.json is the tag"          | AGENTS.md says the field is the tag. They can differ.                                                                                                                                                                |
| "I'll just decide the tooling for them"           | The human pays 1–4 days to undo a wrong Cloudflare/D1/Drizzle call. Always ask.                                                                                                                                      |
| "I can skip resetting `.deciduous/`"              | Carries suede's graph into the new project. First `pulse` and `narratives` become lies.                                                                                                                              |
| "`git add .` is fine, the tree is clean"          | AGENTS.md bans it. `.env`, `node_modules/`, `docs/`, `.deciduous/` are all candidates.                                                                                                                               |
| "I'll work on a copy to be safe"                  | The working tree IS the new project. A copy just delays the same ops.                                                                                                                                                |
| "Bootstrap commit doesn't need a follow-up task"  | Deep tooling decisions are a separate concern, separate branch, separate PR.                                                                                                                                         |
| "I'll just plan the runtime-layer customizations" | Thread B captures process-layer customizations, not just runtime. The follow-up edits `AGENTS.md` / `.opencode/skills/` / `.opencode/commands/` / etc. — those are _also_ follow-up work, not part of the bootstrap. |
| "I can decide the process tweaks for them"        | The process is the human's. The grill captures their call. The agent does not pick which `~/.agents/skills/` to load, which issue tracker to use, or which branch convention to enforce — those are Q8 in Thread B.  |
| "Let me also start editing files in Step 3"       | Step 3 produces a plan, not a diff. Step 8 turns the plan into a diff. Writing code in Step 3 violates the grill-then-act discipline.                                                                                |

## Verification before handing back

- `git log --oneline` shows one commit on `main`.
- `git branch` shows `main` and `chore/suede-kickoff`.
- `cat package.json` shows `suede.from` set to the tag from Step 1.
- `.deciduous/` does not exist.
- First task note exists at the path Step 8 wrote it to.
- `pnpm install` succeeds (the bootstrap is mechanical; if it broke something, the follow-up task will surface it).
