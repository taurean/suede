# AGENTS

Cross-agent rulebook. Read at task start. This is the project-specific AGENTS.md file.

## Suede overview

Suede is an opinionated SvelteKit starter template for shipping full-stack apps on Cloudflare. It exists to give every project forked from it a consistent process pipeline — from concept through release — with defined git conventions, authoring boundaries, and decision tracking baked in from day one. Forks inherit the mechanics and tailor the details (version scheme, label vocabulary, tracker setup) during their own kickoff.

## Stack

SvelteKit · Cloudflare Pages + Workers · D1 + Drizzle · Vitest + Playwright · pnpm · stylebase + Bits UI · Storybook.

## Git workflow

- Always branch from `main`, and always from the **latest** `main` (not a stale local view). The branch-from-`main` rule is only meaningful if the base commit is current — otherwise the new branch silently forks from a commit that has since been superseded, and the PR base vanishes the same way an in-flight branch does. Before creating the branch (`git worktree add` or `git checkout -b`), fetch `origin` and base on `origin/main`, and verify the tree is clean.
- **Never branch off an in-flight branch.** The only base for a new branch is `main`. While a PR is open (not yet merged), new work either becomes a follow-up commit on the _same_ branch (new goal node, same PR) or waits. A branch-of-branch creates a PR whose base vanishes the moment the first PR merges.
- All tasks are reviewed in a pull request.
- **The agent may push branches and may apply tags, but never merges to `main` and never pushes directly to `main`.** The human reviews the PR and merges. (Pushing the release branch to the remote and tagging the human's merge commit on `main` are both agent-OK; the act of merging the PR into `main` is human-only.)
- The human is the commit author for all commits. Agent-made commits add a `Co-authored-by:` trailer crediting the agent harness in use (e.g. `Co-authored-by: pi <noreply@earendil.works>`), so assistance is visible without tying the repo to one tool.

### Branch and commit naming

The branch name and the commit-message type share a vocabulary. **Branch names** are `<type>/<slug>` where `<slug>` is a short kebab-case description of the work. **Commit messages** are `<type>(<scope>): <subject>` where `<scope>` is optional and `<subject>` is a present-tense imperative ("add X", not "added X"). The `chore(release):` type is reserved for the version-bump commit on a release branch — see the **Releases** section.

**Canonical type list** (conventional-commits 1.0.0, as of this writing):

- `feat` — new user-visible feature
- `fix` — bug fix for user-visible behaviour
- `chore` — maintenance, dependency bumps, tooling, version bumps
- `docs` — documentation only (AGENTS.md, READMEs, ADRs)
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — test additions or corrections, no production code change
- `build` — build system or external dependency change
- `ci` — CI configuration change
- `perf` — performance improvement
- `style` — formatting, whitespace, missing semicolons, etc. (no logic change)

A fork that needs to extend the list (e.g. add `i18n` for a content-heavy project) or trim it (e.g. drop `perf` for a backend MCP that doesn't have a measurable perf budget) records the override in `suede-kickoff` Step 3 Thread B Q9. The full [conventional-commits 1.0.0 spec](https://www.conventionalcommits.org/en/v1.0.0/) is the upstream reference; AGENTS.md inherits the type list from it and re-states it here so the agent doesn't have to fetch the spec on first use.

## Layout

- `AGENTS.md` — this file
- `.pi/skills/` — in-repo skills. The process layer (`task`, `slice-brief`, `systems-map`, `project-plan`, `review`, plus supporting skills) ships with the repo. Skill directories are `kebab-case` and contain a `SKILL.md` (and optionally per-topic companion files like `task/testing.md`). `.pi/prompts/` holds user-invoked prompt templates.

Durable records of work: the `deciduous` decision graph (real-time, in `.deciduous/`), the project's tracker (GitHub Issues), and the merged PR history. There is no per-task markdown note.

## Constant process pipeline

The workflow below ships to every project forked from suede. The _process_ is constant; the _details_ (branch convention, version policy, which in-repo skills apply) are tailored per fork via `suede-kickoff` Step 3 Thread B. Don't invent a new pipeline; if a stage doesn't fit a particular task, compress it but keep the shape.

| Stage                                                                            | Home                                                                    | When                                                                                                                                                        |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. **Concept / problem** exists in conversation, in an issue, or as a bug report | —                                                                        | Always; this is the input to the pipeline                                                                                                                    |
| 2. **Align** on the goal                                                         | `.pi/skills/task` step 0                                                 | Every task; short back-and-forth, one question at a time. For a substantial design or requirements in tension, escalate to the `/poke-holes` prompt first    |
| 3. **Cut plan**                                                                  | `.pi/skills/project-plan`                                                | Only when the work cannot land as one PR — a rewrite or feature spanning several independently-mergeable cuts. One plan issue with a cut checklist, not an issue per cut |
| 4. **Build**                                                                     | `.pi/skills/task` (per-type paths; `task/testing.md` for test quality)   | Every task: prep (worktree, systems map, slice-brief, draft PR), then the bug / refactor / feature / meta / follow-up path                                   |
| 5. **Review**                                                                    | `.pi/skills/review`                                                      | Two-axis PR review (Standards + Spec) before merge. Runs both axes in parallel sub-agents                                                                    |
| 6. **Release**                                                                   | (in-repo, this section "Releases")                                       | chronver bump as final commit on the release branch; human tags the merge commit on `main` and pushes with `--follow-tags`                                   |

**Always-on supporting layer** (not a stage — runs throughout):

- **Decision graph** (`deciduous` CLI + this file's "Decision Graph Workflow" section) — every commit linked to a node, goal → options → decision → actions → outcomes, real-time logging
- **Git workflow** (this file's "Git workflow" section) — branch from `main`, PR review, agent never pushes/merges, `Co-authored-by:` harness trailer on agent-made commits
- **Authoring boundaries** (this file's "Authoring boundaries" section) — humans own Svelte markup / scoped CSS / design tokens; agents own `<script lang="ts">` and `*.ts`

The pipeline is the same regardless of project shape (full-stack, content, backend, other) and regardless of project formality. Stage 3 fires only for multi-PR work; single-PR tasks go straight from alignment to build. A project with real inbound issue flow can additionally adopt the fuller PRD / per-issue / triage ceremony preserved under `.pi/skills/project-plan/reference/`.

**Tracker preconditions.** Stage 3 (cut plan) and stage 5 (review) assume a project tracker exists — **GitHub Issues** (where `project-plan` publishes the plan issue and `review` reads specs). The conventional label vocabulary (`needs-triage` → `ready-for-agent` / `ready-for-human` / `wontfix`, `bug` / `enhancement`) belongs to the reference triage ceremony. When no tracker is configured, the plan lives in the first cut's PR description and review falls back to the PR body's brief.

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

### Storybook discipline (UI forks)

A change to a UI primitive in `src/lib/components/` is **incomplete without a story update** in the same commit. Stories are the agent-owned form of the human-owned visual contract: the story captures the component's rendered states, and any new state, prop, or visual branch added in code is a story-add or story-edit. A primitive without a matching story is invisible to QA and to the next contributor. Storybook is the suede default; a fork that rips it records the override in the kickoff follow-up PR description (or an ADR if the project uses one), and the agent rewrites AGENTS.md / `.pi/skills/task/` references to Storybook as part of that override.

## Working style

The **Constant process pipeline** section above is the canonical reference for which skill applies at which stage. In-repo skills live in `.pi/skills/`; load the relevant one when the stage applies (don't load for the sake of loading):

- `task` — the task-process spine, user-invoked `/skill:task` at task start; its `testing.md` owns test quality and the prune pass
- `slice-brief` — per-PR brief that hands a vertical slice to a fresh session
- `systems-map` — create and maintain `SYSTEMS_MAP.md`
- `project-plan` — cut plan for work too big for one PR (user-invoked `/skill:project-plan`); the fuller PRD / per-issue / triage ceremony lives under its `reference/`
- `review` — two-axis PR review (Standards + Spec)
- `decision-graph` — deciduous mechanics: node/edge commands, verbatim prompt capture, commit linking, audit, sync
- `suede-kickoff` — reset a fresh suede clone into a standalone project

Project prompts live in `.pi/prompts/` (user-invoked, invisible until called): `/pulse`, `/narratives`, `/archaeology` — the deciduous decision-graph views — and `/request-refactor-plan` for filing a deferred-refactor plan as an issue.

Global skills and prompts (debugging, prototyping, terse mode, skill authoring) ride in from the user's environment and announce themselves; this file doesn't enumerate them.

When the human's harness exposes a plan/build mode toggle, follow the active
mode without prompting. See **Verification before completion** for done
criteria.

## Task flow

`/skill:task` (`.pi/skills/task/`) owns the task sequence end to end — goal
alignment, prep, per-type execution, review, closeout. Alongside that
sequence, the always-on supporting layer applies throughout: decision-graph
logging in real time (a goal node with the verbatim user prompt at task
start for non-trivial work, an action node before each major edit, outcomes
after, `--commit HEAD` per commit — mechanics in
`.pi/skills/decision-graph/`), authoring boundaries, and the co-authorship
trailer. Verification and release mechanics live in their own sections
below; the merge to `main` is human-only.

## Releases

Suede uses [chronver](https://chronver.org) by default. Version lives in `package.json#version` (chronver format `YYYY.M.D[.N][-feature|-break]`; `pnpm version` normalizes leading zeros, so e.g. `2026.6.4`, not `2026.06.04`).

**The _mechanics_ are constant across forks; the _scheme_ is a fork-time decision.** The mechanics: every release branch ships as its own version bump; the bump is the final commit on the branch, before merge; the merge commit on `main` is tagged with the bare version string, annotated, and pushed with `--follow-tags`; the changelog is `git log <prev>..<new>` (no CHANGELOG.md). The scheme is one of the questions in `suede-kickoff` Step 3 Thread B — chronver is the suede default for apps and templates, semver is the override for libraries consumed by dependents. A fork that picks semver rewrites this section during its kickoff follow-up.

**Every release branch — a branch ready to be reviewed and merged to `main` — ships as its own version.** The bump is the final commit on the release branch, before merge. No versionless merges.

**Tracker and remotes.** The project tracker is **GitHub Issues** (where `project-plan` publishes plan issues and `review` reads specs). Tangled (or any other git host) can be added as an additional remote for mirroring, but is not a substitute for the tracker.

### Cutting a release

1. Before cutting, note in the release PR description whether the decision graph answered a question this cycle (a `/pulse` consulted, a past decision that prevented re-litigating). Several releases of "no" in a row is the evidence for demoting the graph to fork-optional — the record is the point of this line.
2. Final commit on the release branch, before merge, is `chore(release): cut <version>`. Bump with `pnpm version <version> --no-git-tag-version` (or hand-edit), commit only the `version` field.
3. Tag the merge commit on `main` with the bare chronver string, annotated. Push with `git push origin main --follow-tags`.
4. `git log <prev>..<new>` is the changelog. No `CHANGELOG.md`.

### Downstream lineage

When a project duplicates suede, it adds `"suede": { "from": "<tag>" }` to its own `package.json` with the chronver tag of the suede commit it branched from. Suede's own `package.json` carries no such field.

### Version policy

chronver for apps and templates (temporal releases, no API contract to break); semver for packages consumed by dependents (persistent breaking-change signals).

## Decision Graph Workflow

Suede tracks project decisions through the `deciduous` decision-graph tool. This section is the cross-agent view: when to log and what belongs in the graph. The operational mechanics — commands, flags, connection audit, sync — live in `.pi/skills/decision-graph/` and are not duplicated here.

**THIS IS MANDATORY. Log decisions IN REAL-TIME, not retroactively.**

### The Node Flow Rule - CRITICAL

The canonical flow through the decision graph is:

```
goal -> options -> decision -> actions -> outcomes
```

- **Goals** lead to **options** (possible approaches to explore)
- **Options** lead to a **decision** (choosing which option to pursue)
- **Decisions** lead to **actions** (implementing the chosen approach)
- **Actions** lead to **outcomes** (results of the implementation)
- **Observations** attach anywhere relevant
- Goals do NOT lead directly to decisions -- there must be options first
- Options do NOT come after decisions -- options come BEFORE decisions
- Decision nodes should only be created when an option is actually chosen, not prematurely

### The Core Rule

```
BEFORE you do something -> Log what you're ABOUT to do
AFTER it succeeds/fails -> Log the outcome
CONNECT immediately -> Link every node to its parent
AUDIT regularly -> Check for missing connections
```

### What NOT to Log - CRITICAL

**The decision graph records the USER'S project decisions, not your internal process.**

Nodes should capture what the user is building, choosing, and accomplishing. Do NOT create nodes for your own thinking, planning, or tooling steps.

**DO NOT create nodes for:**

- Reading/exploring the codebase ("Analyzing project structure", "Reading config files")
- Your planning process ("Planning implementation approach", "Evaluating options internally")
- Tool usage ("Running tests to check status", "Checking git log")
- Context gathering ("Understanding existing auth code", "Reviewing PR comments")
- Meta-commentary ("Starting work on this task", "Preparing to implement")

**DO create nodes for:**

- What the user asked for (goals)
- Concrete approaches being considered (options)
- Choices made between approaches (decisions)
- Code being written or changed (actions)
- Results of implementation (outcomes)
- Technical findings that affect decisions (observations)

**Rule of thumb:** If a node describes something the user would put on a project timeline or in a PR description, log it. If it describes your internal process of reading and thinking, don't.

For all other `deciduous` commands and workflows — quick commands, node flags, commit linking, document attachments, verbatim prompt capture, connection rules, branch-based grouping, audit checklist, git staging rules, session start/end sync, and multi-user sync — see `.pi/skills/decision-graph/SKILL.md`.

## Guardrails

Always:

- Run verification before claiming done.
- Capture verification results in the PR description.

Never:

- Modify the presentation layer (Svelte markup, scoped CSS, `src/lib/styles/`).
- Skip the PR description.
- Commit secrets.

## Verification before completion

- `pnpm lint` — pass
- `pnpm check` — pass
- `pnpm test` — run if tests changed
- On a release branch, the full Playwright journey suite runs before the version bump (see `.pi/skills/task/testing.md`, "What runs when")

Claim done with evidence: command + result.
