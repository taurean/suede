---
name: suede-kickoff
description: Use when starting a new project forked from suede - the working tree is a fresh suede clone, git history belongs to suede, and the human wants a standalone project. Triggers include "fork suede", "start a new project from this template", "bootstrap a new app", "I'm cloning suede for a new thing".
---

# Suede kickoff

Reset a fresh suede clone into a standalone project. The working tree IS the new project — do not work on a copy.

**Preconditions:** `git status` clean. `pnpm install` has been run. `deciduous` on `PATH`.

## Step 0: Verify external dependencies

Suede's process layer depends on a small set of system tools outside the `pnpm install` boundary. Verify each is installed and on `PATH` before any destructive op; if anything is missing, **stop and notify the human** — do not silently install or continue.

```bash
command -v deciduous >/dev/null 2>&1 && echo "OK: deciduous"     || echo "MISSING: deciduous"
command -v gh         >/dev/null 2>&1 && echo "OK: gh (optional)" || echo "MISSING: gh (optional — only needed for PR-history reconstruction via /archaeology)"
command -v git        >/dev/null 2>&1 && echo "OK: git"          || echo "MISSING: git"
command -v pnpm       >/dev/null 2>&1 && echo "OK: pnpm"         || echo "MISSING: pnpm"
command -v node       >/dev/null 2>&1 && echo "OK: node"         || echo "MISSING: node"
```

**Required** (the kickoff cannot proceed without these):

- `deciduous` — the decision-graph CLI. Install per [deciduous docs](https://github.com/anomalyco/deciduous) (`cargo install deciduous` is the typical path).
- `git` — for the lineage capture, the `.git` reset, the branch creation.
- `pnpm` — for the version bump, `pnpm install` re-verification.
- `node` — required by `pnpm` and `wrangler`.

**Optional** (the kickoff proceeds, but a specific step is degraded):

- `gh` — Step 8 uses it to create the remote and open the follow-up PR, and the `/narratives` → `/archaeology` reconstruction prompts use it for PR history. Without it, Step 8 parks the PR content in the worktree until a remote exists.

If any required tool is missing, list the missing tools in the notification, link to install instructions where reasonable, and stop. Do not proceed to Step 1.

If all clear, continue.

## Step 1: Capture the lineage marker

BEFORE any destructive op, capture the suede tag and commit. The `.git` history is the only ground truth.

```bash
git describe --tags --abbrev=0   # the chronver tag, e.g. 2026.6.4
git rev-parse HEAD               # the exact commit hash
```

The `suede.from` field is the **tag**, not `package.json#version`. They can differ. Store both — the tag goes in `package.json` (Step 5), the commit hash goes in the Step 8 follow-up PR description as the audit trail.

## Step 2: Delete `.git`

```bash
rm -rf .git
```

## Step 3: Grilling session — what is this project, and what should the process layer look like for it?

The working tree is now a fresh suede fork. Interview the human one question at a time, a one-line recommended answer with each (the `/poke-holes` contract), through two intertwined threads. Do not skip questions. Do not propose file edits in this step — the goal is to _capture_ the answers, not act on them. The follow-up task in Step 8 turns the captured answers into edits.

### Thread A — the project

1. **Project name** — for `package.json#name` and the repo.
2. **One-sentence purpose** — plain English, not a marketing line.
3. **Primary user** — internal, end consumer, dev tool, etc.
4. **Project shape** — full-stack web app / content-focused website / backend service or API or MCP / other. This decides which runtime defaults are appropriate (SvelteKit + bits-ui vs Hono + zod vs MCP stdio vs custom). Don't enforce a choice; capture the human's call.
5. **First chronver version** — `YYYY.M.D[.N]`, no leading zeros. (`pnpm version` normalizes leading zeros per AGENTS.md.)
6. **Anything else load-bearing** — deadlines, author identity, target audience, deployment target, etc.

### Thread B — process-layer customizations

The process itself is constant across every suede fork — the workflow from concept through goal alignment → cut plan (`project-plan`, multi-PR work only) → build (`task`) → `review` → release ships to every project (see AGENTS.md "Constant process pipeline"). What _varies_ is the _details_ of that pipeline. Grill on each axis that might differ:

7. **Tooling keep/rip** — Cloudflare, D1+Drizzle, Storybook, Bits UI, stylebase, Vitest, Playwright, SvelteKit itself. **Defaults: keep all.** Storybook is the suede default for UI forks; ripping it triggers the Authoring Boundaries Storybook-discipline override (the agent rewrites AGENTS.md + `.pi/skills/task/` to reflect the rip during this follow-up branch). SvelteKit is the suede default runtime; ripping it means the project is a backend MCP, a CLI, or another non-web shape — capture which, and rewrite the parts of AGENTS.md (notably "Verification before completion" and the Stack section) that assume a SvelteKit context.
8. **Process details to tailor** — open-ended. The process itself is constant; what varies is the _details_. Examples of the _kind_ of thing that might apply to this fork but not every fork:
   - **Issue tracker** — default is **GitHub Issues** (where `project-plan` / `review` expect to read and write). Tangled is a git-host mirror, not a tracker.
   - **Version scheme** — default is **chronver** (suede's apps-and-templates convention). Override to **semver** if this fork is a library consumed by dependents. A fork that picks semver rewrites the AGENTS.md Releases section during this follow-up branch.
   - **Branch and commit naming** — the canonical list of conventional-commits types is in AGENTS.md "Branch and commit naming." Most forks inherit the canonical 10 (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`, `perf`, `style`) as-is. Override cases: a fork that needs an extra type (e.g. `i18n` for a content-heavy project) or wants to trim one (e.g. drop `perf` for a backend MCP with no measurable perf budget) records the override here, and the agent updates AGENTS.md's "Branch and commit naming" section to reflect the fork's list.
   - **Pipeline compression** — for a 2-day prototype you might collapse the `project-plan` stage into the PR description (no plan issue, no tracker). The stages still happen; the artifacts don't.
   - **Which skills apply** — the pipeline's Working style section lists the canonical set. A backend project might lean on the global `deepen` skill; a CLI has no use for Storybook discipline. You can subtract.
   - **Anything else that the human knows about this project that the agent can't infer.**

The follow-up task (Step 8) reads the answers to Thread B and decides which files in `AGENTS.md`, `.pi/skills/`, and `.pi/prompts/` to edit, add, or remove.

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

Stage explicit files only. Never `git add .` (staging rules — `.pi/skills/decision-graph/SKILL.md`).

```bash
git add package.json
git commit -m "chore: bootstrap forked project from suede <tag>

Co-authored-by: <the agent harness in use, per AGENTS.md Git workflow>"
```

Human is commit author. A brand-new repo's first commit is `main` — the documented exception to "agent never pushes to main."

## Step 8: Branch the first real task

```bash
git checkout -b chore/suede-kickoff
```

The follow-up PR's description is the audit trail. Step 4 created no remote, so ask the human: if they want one now, create it (`gh repo create`, confirming visibility with them) and open the draft PR (with a placeholder diff — a `chore: open PR for follow-up` commit on the new branch is fine). If not, write the same content to `tmp/KICKOFF-FOLLOWUP.md` (gitignored) and open the PR from it when a remote lands.

Immediately after the remote exists, wire the review workflow's secret — `.github/workflows/pi-review.yml` is inert without it:

```bash
op read "op://Private/Minimax Subscription Key/key" --account family-passvault.1password.com | gh secret set MINIMAX_API_KEY
```

If `op` isn't available or the human deferred the remote, list the secret as an unchecked item in the follow-up PR description (or `tmp/KICKOFF-FOLLOWUP.md`) instead — don't let it silently drop.

Either way, capture:

- The human's answers verbatim from Step 3 (both Thread A and Thread B).
- The commit hash from Step 1 (audit trail).
- **A "process-layer edits" decision list** as the lead section — file-by-file list of what needs to change in `AGENTS.md`, `.pi/skills/`, `.pi/prompts/`, etc. to match the human's Thread B answers. This is the _substantive_ follow-up work.
- A "runtime-layer edits" decision list — auth strategy, deploy target, design system scope, per-tooling customizations from Q7, wrangler/D1/Storybook string sweep, README rewrite, config files (`wrangler.jsonc`, `drizzle.config.ts`, `.storybook/`) rename/sweep, post-fork `pnpm lint`/`pnpm check`/`pnpm test` re-verification.
- **Final action of this task:** delete `.pi/skills/suede-kickoff/`. The skill is consumed once.

## Rationalizations this skill counters

| Excuse                                            | Reality                                                                                                                                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "I can capture the tag after `rm -rf .git`"       | No. The history is gone. Capture first.                                                                                                                                                                       |
| "The version in package.json is the tag"          | AGENTS.md says the field is the tag. They can differ.                                                                                                                                                         |
| "I'll just decide the tooling for them"           | The human pays 1–4 days to undo a wrong Cloudflare/D1/Drizzle call. Always ask.                                                                                                                               |
| "I can skip resetting `.deciduous/`"              | Carries suede's graph into the new project. First `pulse` and `narratives` become lies.                                                                                                                       |
| "`git add .` is fine, the tree is clean"          | The staging rules (`.pi/skills/decision-graph/SKILL.md`) ban it. `.env`, `node_modules/`, `docs/`, `.deciduous/` are all candidates.                                                                          |
| "I'll work on a copy to be safe"                  | The working tree IS the new project. A copy just delays the same ops.                                                                                                                                         |
| "Bootstrap commit doesn't need a follow-up task"  | Deep tooling decisions are a separate concern, separate branch, separate PR.                                                                                                                                  |
| "I'll just plan the runtime-layer customizations" | Thread B captures process-layer customizations, not just runtime. The follow-up edits `AGENTS.md` / `.pi/skills/` / `.pi/prompts/` / etc. — those are _also_ follow-up work, not part of the bootstrap.       |
| "I can decide the process tweaks for them"        | The process is the human's. The grill captures their call. The agent does not pick which `.pi/skills/` to load, which issue tracker to use, or which branch convention to enforce — those are Q8 in Thread B. |
| "Let me also start editing files in Step 3"       | Step 3 produces a plan, not a diff. Step 8 turns the plan into a diff. Writing code in Step 3 violates the grill-then-act discipline.                                                                         |

## Verification before handing back

- `git log --oneline` shows one commit on `main`.
- `git branch` shows `main` and `chore/suede-kickoff`.
- `cat package.json` shows `suede.from` set to the tag from Step 1.
- `.deciduous/` does not exist.
- The follow-up PR is open on `chore/suede-kickoff` with the process-layer edits list in the description (or `tmp/KICKOFF-FOLLOWUP.md` holds it, if the human deferred the remote).
- `gh secret list` shows `MINIMAX_API_KEY` (or the secret is an unchecked item in the follow-up description, if the remote was deferred).
- `pnpm install` succeeds (the bootstrap is mechanical; if it broke something, the follow-up task will surface it).
