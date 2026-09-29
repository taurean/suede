# CLAUDE.md — suede

Project rulebook. Read at task start.

## Suede overview

Suede is an opinionated SvelteKit starter template for shipping full-stack apps
on Cloudflare. It exists to give every project forked from it a consistent
process pipeline — from concept through release — with defined git conventions,
authoring boundaries, and decision tracking baked in from day one. Forks inherit
the mechanics and tailor the details (version scheme, commit types, tracker
setup) during their own kickoff.

## Stack

SvelteKit · Cloudflare Pages + Workers · D1 + Drizzle · Vitest + Playwright ·
pnpm · stylebase + Bits UI · Storybook.

## Git workflow

- Always branch from `main`, and always from the **latest** `main`. The
  branch-from-`main` rule is only meaningful if the base commit is current —
  otherwise the branch silently forks from a superseded commit and the PR base
  vanishes the same way an in-flight branch does. Before creating the branch,
  fetch `origin`, base on `origin/main`, and verify the tree is clean.
- **Never branch off an in-flight branch.** The only base for a new branch is
  `main`. While a PR is open, new work either becomes a follow-up commit on the
  _same_ branch or waits. A branch-of-branch creates a PR whose base vanishes the
  moment the first PR merges.
- All tasks are reviewed in a pull request.
- **The agent may push branches and apply tags, but never merges to `main` and
  never pushes directly to `main`.** The human reviews and merges. Pushing a
  release branch and tagging the human's merge commit are both agent-OK; the
  merge itself is human-only.
- The human is the commit author for all commits. Agent-made commits add a
  `Co-authored-by:` trailer crediting the harness, so assistance is visible
  without tying the repo to one tool.

### Branch and commit naming

Branch names are `<type>/<slug>`, where `<slug>` is a short kebab-case
description. Commit messages are `<type>(<scope>): <subject>`, scope optional,
subject present-tense imperative ("add X", not "added X"). `chore(release):` is
reserved for the version-bump commit — see **Releases**.

**Canonical type list** (conventional-commits 1.0.0):

`feat` (new user-visible feature) · `fix` (bug fix for user-visible behaviour) ·
`chore` (maintenance, dependency bumps, tooling, version bumps) · `docs`
(documentation only) · `refactor` (neither fixes a bug nor adds a feature) ·
`test` (test additions or corrections) · `build` (build system or external
dependency) · `ci` (CI configuration) · `perf` (performance) · `style`
(formatting, no logic change).

A fork that extends or trims the list records the override during
`/suede-kickoff`. The
[spec](https://www.conventionalcommits.org/en/v1.0.0/) is upstream; the list is
restated here so the agent doesn't fetch it on first use.

## Layout

- `CLAUDE.md` — this file
- `CONTEXT.md` — non-obvious constraints and gotchas unique to this project
- `SYSTEMS_MAP.md` — where things live and what changes together. Its Layout
  tree is the canonical repo map; this file doesn't duplicate it.
- `.claude/skills/` — in-repo skills. Directories are kebab-case, each with a
  `SKILL.md` and optional companion files (`task/brief.md`, `task/testing.md`).

`CONTEXT.md`, `SYSTEMS_MAP.md`, and `task/testing.md` describe a specific
project, so suede itself ships none of them. `/suede-kickoff` generates all
three for a fork, and the fork commits them. Skills that read them skip any
that are missing.

- `.claude/commands/` and `.claude/hooks/` — generated and maintained by
  `deciduous update`. Don't hand-edit.

Durable records of work: the `deciduous` decision graph in `.deciduous/`, the
project's tracker, and merged PR history. There is no per-task markdown note.

## Constant process pipeline

The workflow below ships to every fork. The _process_ is constant; the _details_
are tailored per fork during `/suede-kickoff`. Don't invent a new pipeline; if a
stage doesn't fit a task, compress it but keep the shape.

| Stage                                                             | Home                  | When                                                                                                     |
| ----------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| 1. **Concept** — in conversation, an issue, or a bug report       | —                     | Always; the input to the pipeline                                                                        |
| 2. **Align** on goal, boundary, reversibility, and review posture | `/task` step 1        | Every task. Short back-and-forth per `/poke-holes`                                                       |
| 3. **Cut plan**                                                   | `/project-plan`       | Only when the work cannot land as one PR. One plan issue with a cut checklist, never an issue per cut    |
| 4. **Build**                                                      | `/task`               | Every task: prep (worktree, systems map, brief, draft PR), then vertical slices with story-derived tests |
| 5. **Verify**                                                     | `/verify`             | Every task, before review. The app observed doing the thing, not a green suite                           |
| 6. **Review**                                                     | `/review`             | Three-axis review — Standards, Spec, Discipline — in parallel subagents, before merge                    |
| 7. **Release**                                                    | This file, "Releases" | Version bump as the final commit on the release branch; human tags the merge commit on `main`            |

**Always-on supporting layer** — not stages, they run throughout:

- **Engineering discipline** — the standing rules for fallbacks, slice hygiene,
  reversibility, dead code, failure messages, and when to stop and ask. Global,
  loaded automatically. Cited by rule ID in reviews.
- **Decision graph** — real-time logging, every commit linked to a node. See
  "Decision graph" below.
- **Git workflow** — this file's section above.
- **Authoring boundaries** — humans own design-token values, new primitive
  creation, and the visual contract; agents author markup and scoped CSS within
  it.

The pipeline is the same regardless of project shape or formality. Stage 3 fires
only for multi-PR work.

**Tracker.** Stages 3 and 6 assume **GitHub Issues** — where `/project-plan`
publishes the plan issue and `/review` reads specs. When no tracker is
configured, the plan lives in the first cut's PR description and review falls
back to the PR body's brief. Another git host may be added as a mirror, but is
not a substitute for the tracker.

## Authoring boundaries

**Humans own the design contract:**

- Design-token values — the `--hue-*`, `--space-*`, `--ff-*` definitions in
  stylebase.
- The visual contract — what the design is supposed to feel like.
- Architectural primitive decisions — which Bits UI primitives get wrapped, and
  whether a new primitive exists at all.

**Agents own implementation within that contract:**

- Svelte markup, using Bits UI primitives for any interactive element rather
  than raw HTML.
- `<style>` blocks and CSS in `src/lib/styles/`, drawing colour, spacing, and
  typography from stylebase properties and `u:` utilities.
- Layout, spacing, and typography — within the stylebase vocabulary.
- All TypeScript: `<script lang="ts">`, `*.ts` in `src/lib/` and `src/routes/`,
  Drizzle schemas and queries, server routes, API integrations, Workers.

**Hard constraints**, non-negotiable without the human:

- Don't redefine design tokens locally. If a stylebase property doesn't fit,
  flag it for the human to add at the source.
- Don't introduce a new UI primitive without explicit approval. Primitives shape
  the visual contract and ship with stories.
- Don't reach for raw HTML where a Bits UI primitive exists. The accessibility
  behaviour is the point of wrapping it.

Mechanics — which layer a rule goes in, which token, which primitive — are in
the `writing-css` skill. This section owns _who decides_; that skill owns _where
it goes_.

**Prototypes are the exception.** Throwaway variant components and prototype
routes may be agent-authored, provided they're clearly marked and deleted when
the prototype is done. Folding a winner into a real page is production markup
and the boundary applies again.

### Storybook discipline

A change to a UI primitive in `src/lib/components/` is **incomplete without a
story update in the same commit**. Stories are the agent-owned form of the
human-owned visual contract: the story captures the component's rendered states,
and any new state, prop, or visual branch added in code is a story-add or
story-edit. A primitive without a matching story is invisible to QA and to the
next contributor.

Storybook is the suede default. A fork that rips it records the override during
kickoff, and the follow-up rewrites this section and the `task` skill's
references.

## Working style

The pipeline table above says which skill applies at which stage. Load the
relevant one when the stage applies; don't load for the sake of loading.

In-repo skills (`.claude/skills/`):

- `task` — the task spine, user-invoked. `brief.md` owns the brief format;
  `testing.md` owns test quality and the prune pass.
- `project-plan` — cut plan for work too big for one PR. User-invoked.
- `review` — three-axis review, dispatching to global reviewer agents.
- `writing-css` — CSS and component markup in stylebase + Bits UI. Loads
  automatically on `.svelte` and CSS files.
- `suede-kickoff` — reset a fresh suede clone into a standalone project. Deletes
  itself when consumed.

Global skills ride in from the user's environment and are not enumerated here.
`engineering-discipline`, `poke-holes`, and `systems-map` are the ones this
pipeline depends on — `systems-map` is global rather than in-repo, since a
personal skill shadows a project skill of the same name.

`deciduous update` maintains its own commands and hooks under `.claude/`.

## Task flow

`/task` owns the sequence end to end — alignment, prep, build, verify, review,
closeout. Alongside it, the supporting layer applies throughout: decision-graph
logging in real time, authoring boundaries, and the co-authorship trailer.
Verification and release mechanics have their own sections below. The merge to
`main` is human-only.

## Releases

Suede uses [chronver](https://chronver.org) by default. Version lives in
`package.json#version`, format `YYYY.M.D[.N][-feature|-break]`. `pnpm version`
normalizes leading zeros — `2026.6.4`, not `2026.06.04`.

**The mechanics are constant across forks; the scheme is a fork-time decision.**
Mechanics: every release branch ships as its own version bump; the bump is the
final commit before merge; the merge commit on `main` is tagged with the bare
version string, annotated, and pushed with `--follow-tags`; the changelog is
`git log <prev>..<new>`, with no `CHANGELOG.md`. The scheme is a kickoff
question — chronver for apps and templates, semver for libraries consumed by
dependents.

**No versionless merges.** Every branch ready to merge to `main` ships as its
own version.

### Cutting a release

1. Note in the release PR description whether the decision graph answered a
   question this cycle — a `/pulse` consulted, a past decision that prevented
   re-litigating. Several releases of "no" in a row is the evidence for demoting
   the graph to fork-optional. The record is the point of this line.
2. Final commit is `chore(release): cut <version>`. Bump with
   `pnpm version <version> --no-git-tag-version` and commit only the version
   field. Known gotcha: `pnpm version` rejects the four-segment `.N` form as
   invalid semver — hand-edit the manifests for a same-day second cut.
3. Tag the merge commit on `main` with the bare version string, annotated. Push
   with `git push origin main --follow-tags`.
4. `git log <prev>..<new>` is the changelog.

### Downstream lineage

A project forked from suede adds `"suede": { "from": "<tag>" }` to its own
`package.json`, carrying the chronver tag of the commit it branched from.
Suede's own `package.json` has no such field.

## Decision graph

Suede tracks project decisions with `deciduous`. `deciduous update` writes and
maintains its own Decision Graph Workflow section in this file, along with the
commands and hooks under `.claude/`. It preserves custom content, so the house
conventions below sit alongside the generated section rather than replacing it.
Don't restate the generated mechanics here.

**Log in real time, not retroactively.** A pre-edit hook enforces this: an edit
is blocked unless a goal or action node was logged recently.

### What not to log

**The graph records the user's project decisions, not the agent's internal
process.** This is the rule that keeps the graph readable, and it's the one most
easily lost.

Do **not** create nodes for reading or exploring the codebase, your planning
process, tool usage, context gathering, or meta-commentary about starting work.

Do create nodes for what the user asked for (goals), concrete approaches being
considered (options), choices made between them (decisions), code being written
(actions), results (outcomes), and technical findings that affect decisions
(observations).

**Rule of thumb:** if a node describes something the user would put on a project
timeline or in a PR description, log it. If it describes the process of reading
and thinking, don't.

## Guardrails

Always:

- Run verification before claiming done.
- Capture verification results in the PR description.

Never:

- Edit markup or styles in a way the authoring boundaries forbid.
- Skip the PR description.
- Commit secrets.

## Verification before completion

- `pnpm lint` — pass
- `pnpm check` — pass
- `pnpm test` — run if tests changed
- `/verify` — the app observed doing the thing. A green suite is necessary and
  not sufficient; tests written against code written in the same context share a
  common ancestor.
- On a release branch, the full Playwright journey suite runs before the version
  bump.

Claim done with evidence: command plus result.
