---
name: suede-kickoff
description: Use in a project just created by `pnpm create suede` — the repo has one bootstrap commit on `main` and `chore/suede-kickoff` is checked out. Grills the human on the project and its process layer, then captures the follow-up that tailors the fork. Triggers include "run the kickoff", "tailor this suede fork", "set up this new project".
disable-model-invocation: true
---

# Suede kickoff

Tailor a freshly created suede fork to its project. `pnpm create suede` has
already done everything mechanical: downloaded the template, initialized git,
written `package.json`, run `pnpm install` and `deciduous init`, committed the
bootstrap, and branched `chore/suede-kickoff`. This skill starts where the CLI
stops.

This skill runs once and deletes itself at the end of the follow-up it
captures.

**Preconditions:** Selvage is installed — `engineering-discipline` and
`poke-holes` are assumed available.

## Step 0: Confirm the CLI bootstrapped this repo

```bash
git branch --show-current                 # chore/suede-kickoff
git log --oneline main                    # exactly one commit: chore: bootstrap from suede <tag>
git log -1 --format=%B main               # body carries "suede commit: <hash>"
git status --short                        # clean
node -p "JSON.stringify(require('./package.json').suede)"   # {"from":"<tag>"}
```

If any of these doesn't hold, **stop**. This isn't a CLI-created project, or
someone has already worked on it. Tell the human to create the project with
`pnpm create suede <name>`, and don't try to reconstruct the bootstrap by hand.

Read, don't ask, what the CLI already captured:

- `name`, `description`, `version` from `package.json` — the project name, the
  one-line purpose, the first version.
- `suede.from` from `package.json` — the suede tag.
- The suede commit hash from the bootstrap commit body — the audit trail.

## Step 1: Grill

Interview the human per `/poke-holes` — one question per message, each with a
one-line recommended answer — across two threads.

**Do not write any code in this step.** The grill produces a plan; Step 3 turns
the plan into a follow-up. Capture the answers; don't act on them.

### Thread A — the project

Name, purpose, and first version are already in `package.json`. Don't re-ask
them; if one looks wrong, say so and let the human decide whether to change it.

1. **Primary user** — internal, end consumer, dev tool, something else.
2. **Project shape** — full-stack web app / content site / backend service or
   API or MCP / other. This decides which runtime defaults apply (SvelteKit +
   bits-ui vs Hono + zod vs MCP stdio vs custom). Capture the human's call;
   don't enforce one.
3. **Anything else load-bearing** — deadlines, author identity, audience,
   deployment target.

### Thread B — process-layer customizations

The pipeline is constant across every fork: goal alignment → cut plan
(`/project-plan`, multi-PR work only) → build (`/task`) → `/review` → release.
What varies is the details. Grill on each axis that might differ here.

4. **Tooling keep/rip** — Cloudflare, D1 + Drizzle, Storybook, bits-ui,
   stylebase, Vitest, Playwright, SvelteKit. **Default: keep all.**
   - Ripping Storybook triggers the Storybook-discipline override: the
     follow-up rewrites `CLAUDE.md` and `.claude/skills/task/` to match.
   - Ripping SvelteKit means the project is a backend, a CLI, or another
     non-web shape. Capture which, and the follow-up rewrites the parts of
     `CLAUDE.md` that assume a SvelteKit context — notably the Stack section
     and verification.
   - Ripping SvelteKit also means `stylebase` and `bits-ui` go; they're
     stack-bound.

5. **Version scheme** — **chronver** by default, suede's apps-and-templates
   convention. Override to **semver** if this fork is a library with
   dependents. A fork that picks semver rewrites the `CLAUDE.md` Releases
   section in the follow-up, and resets `package.json#version`.

6. **Branch and commit naming** — the canonical conventional-commits types are
   in `CLAUDE.md`. Most forks inherit them as-is. Capture an override if this
   one needs an extra type (`i18n` for a content-heavy project) or wants to
   drop one (`perf`, for a backend with no measurable perf budget).

7. **Pipeline compression** — for a short-lived prototype you might collapse
   the plan stage into the PR description: no plan issue, no tracker. The
   stages still happen; the artifacts don't.

8. **Which skills apply** — a backend has no use for Storybook discipline; a
   CLI has no use for `stylebase`. You may subtract. Selvage skills
   (`engineering-discipline`, `poke-holes`) apply everywhere and aren't up for
   subtraction.

9. **Anything else the human knows about this project that you can't infer.**

Forks currently run no automated CI review. Don't ask about it and don't set
one up; review happens through `/review` on the branch. This is a deliberate
deferral, not an omission.

## Step 2: Remote

```bash
git remote get-url origin
```

If `origin` exists, the CLI created the GitHub repo — skip to Step 3.

Otherwise ask whether the human wants one now. If yes, create it (`gh repo
create`, confirming visibility with them) and push `main`. Creating a public
repo is irreversible in the ways that matter — [REV-3] applies, so confirm
visibility explicitly rather than assuming.

## Step 3: Capture the follow-up

With a remote, open a draft PR from `chore/suede-kickoff` with the content
below as its description. Without one, write the same content to
`tmp/KICKOFF-FOLLOWUP.md` (gitignored) and open the PR from it when a remote
lands.

Capture:

- **The human's answers verbatim** from both threads, plus the name, purpose,
  and version read from `package.json` in Step 0.
- **The suede tag and commit hash** from Step 0 — the audit trail.
- **Process-layer edits**, as the lead section. A file-by-file list of what has
  to change in `CLAUDE.md` and `.claude/skills/` to match the Thread B answers.
  This is the substantive follow-up work.
- **Runtime-layer edits.** Auth strategy, deploy target, design system scope,
  per-tooling changes from Q4, the wrangler/D1/Storybook string sweep, README
  rewrite, config renames (`wrangler.jsonc`, `drizzle.config.ts`,
  `.storybook/`), and a post-fork `pnpm lint` / `pnpm check` / `pnpm test`
  re-verification.
- **Project records**, as unchecked items that run _after_ the runtime edits
  land — each describes the fork, so writing one against suede's demo app
  records an app this fork is about to replace:
  - `SYSTEMS_MAP.md` via `/systems-map`.
  - `CONTEXT.md` — the non-obvious constraints and gotchas unique to this
    project. Seed it from the Thread A and Q9 answers and anything the runtime
    edits surfaced. A short true file beats a long speculative one.
  - `.claude/skills/task/testing.md` — start from
    [testing-template.md](testing-template.md) and fit its "Seams" and "What
    runs when" sections to the tooling kept in Q4. The rest of the template is
    stack-independent; keep it unless a Thread B answer says otherwise.
- **`/run-skill-generator`**, as an unchecked item after the project records.
  It records how to build and launch this app so `/verify` stops guessing.
- **Final action of the follow-up:** delete `.claude/skills/suede-kickoff/`.
  The skill is consumed once.

## Verification before handing back

- `git log --oneline main` still shows exactly the one bootstrap commit.
- `chore/suede-kickoff` is checked out.
- The follow-up PR is open on `chore/suede-kickoff` with the process-layer
  edits list, or `tmp/KICKOFF-FOLLOWUP.md` holds it.

## Handing back

End with a short message, not a recap. The human just answered a dozen
questions; don't make them read their own answers back.

State three things:

1. Where the follow-up content lives — the PR or `tmp/KICKOFF-FOLLOWUP.md`.
2. The next action is the follow-up task, which turns the captured answers into
   edits.
3. **Once the runtime edits land, generate the project records and run
   `/run-skill-generator`.** Say it here as well as in the checklist. They're
   easy to skip because nothing breaks visibly without them — `/task` and
   `/verify` just quietly get less reliable on a project they have to infer.

## What this skill refuses to do

| Shortcut                                        | Why not                                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Rebuild the bootstrap by hand when Step 0 fails | The CLI is the one bootstrap path. A hand-built one drifts from it silently.                       |
| Re-ask what `package.json` already holds        | The human answered those in the CLI a minute ago.                                                  |
| Decide the tooling for the human                | A wrong Cloudflare/D1/Drizzle call costs them days to undo. Q4 is theirs.                          |
| Decide the process tweaks for the human         | The process is theirs. You don't pick the issue tracker, the version scheme, or which skills load. |
| Generate the project records during kickoff     | They describe the fork; before the runtime edits they describe suede's demo app.                   |
| Start editing files during Step 1               | The grill produces a plan, not a diff. The follow-up turns it into one.                            |
| Commit to `main`                                | The bootstrap is the only commit on `main` before review. Everything else lands through a PR.      |
