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
pnpm · suede-css + Bits UI · Storybook.

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
- `.claude/agents/` — in-repo subagents dispatched by `review` and `task`, one
  `<name>.md` each.

`CONTEXT.md`, `SYSTEMS_MAP.md`, and `task/testing.md` describe a specific
project, so suede itself ships none of them. `/suede-kickoff` generates all
three for a fork, and the fork commits them. Skills that read them skip any
that are missing.

Durable records of work: the project's tracker and merged PR history. There is
no per-task markdown note.

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
| 6. **Review**                                                     | `/review`             | Four-axis review — Standards, Spec, Discipline, Legibility — in parallel subagents, before merge         |
| 7. **Release**                                                    | This file, "Releases" | Version bump as the final commit on the release branch; human tags the merge commit on `main`            |

**Always-on supporting layer** — not stages, they run throughout:

- **Engineering discipline** — the standing rules for fallbacks, slice hygiene,
  reversibility, dead code, failure messages, and when to stop and ask. A
  personal skill (see "Working style"), loaded automatically. Cited by rule ID in reviews.
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
  suede-css.
- The visual contract — what the design is supposed to feel like.
- Architectural primitive decisions — which Bits UI primitives get wrapped, and
  whether a new primitive exists at all.

**Agents own implementation within that contract:**

- Svelte markup, using Bits UI primitives for any interactive element rather
  than raw HTML.
- `<style>` blocks and CSS in `src/lib/styles/`, drawing colour, spacing, and
  typography from suede-css properties and `u:` utilities.
- Layout, spacing, and typography — within the suede-css vocabulary.
- All TypeScript: `<script lang="ts">`, `*.ts` in `src/lib/` and `src/routes/`,
  Drizzle schemas and queries, server routes, API integrations, Workers.

**Hard constraints**, non-negotiable without the human:

- Don't redefine design tokens locally. If a suede-css property doesn't fit,
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

## Legibility

Most code here is generated, and it's read by people who weren't there when it
was written. Write for the time it takes someone unoriented to understand one
unit — a function, component, or route — and to debug it. People hold about four
half-understood ideas at once; every layer that makes them hold one more is a
cost.

This covers hand-written code: app code, tests, and stories. Not generated
files, lockfiles, config, or markdown.

### What reading a unit costs

- **Read cost** — the lines a reader actually reads to understand the unit: the
  unit itself plus every hop they have to follow. Shorter is better, until
  shortness makes code confusing, brittle, or opaque.
  - When **understanding**, a reader skips hops whose name and signature say
    what they do.
  - When **debugging**, names stop helping: the question is whether the code
    does what its name says. The reader follows every hop on the failing path,
    except ones they can check at the boundary.
- **Linearity** — how often a top-to-bottom read has to leave the unit. Code
  that needs a reading order explained isn't linear.
- **Name sufficiency** — whether a hop's name and signature predict what it
  does. A hop that does is free to a reader who's understanding, not debugging.
- **Hop depth** — how many hops a reader has to follow before reaching ground
  they already know: the language, the framework, or a well-known library. A
  name-sufficient hop isn't followed, so it doesn't count.
- **Concepts held open** — the most half-understood things a reader has to keep
  in mind at once.
- **Pass-through layer** — a layer that, inlined, would cost the reader nothing:
  a wrapper that forwards its arguments, a single-use helper whose name says
  less than its body, an options object with one caller.
- **Explicit boundary** — an extracted unit's inputs are its arguments, and its
  effects are its return value or named by it (`saveDraft`, not `process`). A
  hidden input is anything read from outside the arguments, except module-level
  `const` and imports from the framework or standard library. `getContext`,
  stores, and `$page` count as hidden. A unit with an explicit boundary can be
  checked from the call site — what went in, what came out — without stepping
  into it.

### Writing to it

- Extract only when the name lets a reader skip the body. Otherwise, inline.
- Keep inputs in the arguments. Read framework state (context, stores, `$page`)
  in the component or route, and pass the value down.
- Extend a pattern the codebase already has before introducing a new one.
- `const` by default; `let` only for a binding that's reassigned. Lint enforces
  this (`svelte/prefer-const`).

### What blocks merge

`/review`'s legibility reviewer blocks on:

- hop depth over 2;
- any pass-through layer;
- an extraction whose name doesn't predict what it does;
- an extraction with hidden inputs or unnamed effects;
- more than **3** new ideas in one PR without a reason in the PR body. A new
  idea is a new exported name or dependency, or the first instance of a pattern
  the codebase didn't have. A new module isn't counted apart from its exports:
  one file exporting one function is one idea. Forks tune the number here.

Read cost, linearity, and concepts held open are advisory: reported where
they're high, as findings, never as numbers. A diff over about 400 changed lines
of hand-written code is noted, never blocked.

## Working style

The pipeline table above says which skill applies at which stage. Load the
relevant one when the stage applies; don't load for the sake of loading.

In-repo skills (`.claude/skills/`):

- `task` — the task spine, user-invoked. `brief.md` owns the brief format;
  `testing.md` owns test quality and the prune pass.
- `project-plan` — cut plan for work too big for one PR. User-invoked.
- `review` — four-axis review, dispatching to the in-repo reviewer agents.
- `writing-css` — CSS and component markup in suede-css + Bits UI. Loads
  automatically on `.svelte` and CSS files.
- `suede-kickoff` — tailor a project created by `pnpm create suede`. Deletes
  itself when consumed.

In-repo agents (`.claude/agents/`): `standards-reviewer`, `spec-reviewer`,
`discipline-reviewer`, and `legibility-reviewer` (dispatched by `review`), and `story-test-writer`
(dispatched by `task`).

Personal skills live in `~/.claude/skills/` and are not enumerated here.
`engineering-discipline`, `poke-holes`, and `systems-map` are the ones this
pipeline depends on. Install each by copying its folder from
[selvage](https://github.com/taurean/selvage/tree/main/dot_claude/exact_skills)
into `~/.claude/skills/<name>/`. They stay personal rather than in-repo, since a
personal skill shadows a project skill of the same name and an in-repo copy
would never run for anyone who has the personal one.

## Task flow

`/task` owns the sequence end to end — alignment, prep, build, verify, review,
closeout. Alongside it, the supporting layer applies throughout: authoring
boundaries and the co-authorship trailer. Verification and release mechanics
have their own sections below. The merge to `main` is human-only.

## Agent-authored output

Everything an agent writes on GitHub — PR bodies, `/review` reports, closeout
comments — has two readers: the human deciding what to do, and the next agent
picking up the work. They need different things, so each gets its own part.

**The human summary comes first**, at most about ten lines. Lead with the
verdict: whether anything blocks, or what the human needs to decide. Then one
line per item they act on:

```
- What's wrong, in plain words. Fix: what to do. In `file.ts:42`.
```

The problem comes first, because it's what the reader needs to decide whether
to keep reading. Location comes last: a bare file name when it's unambiguous, a
path when it isn't, and every file named on its own — never a `{a,b}` set.
Labels a reader can skip, like a category or severity, go after the location in
parentheses.

Nothing goes in the summary that the human doesn't act on. If it runs past ten
lines and not every line is an action, detail has leaked in; move it down.

**Everything for agents goes below, collapsed:**

```
<details>
<summary>For agents</summary>

The brief, full reports, reasoning, evidence.

</details>
```

The blank lines inside the block are required; GitHub doesn't render markdown
without them.

| Surface                  | Summary                                                                     | Collapsed                  |
| ------------------------ | --------------------------------------------------------------------------- | -------------------------- |
| PR body                  | What changed, why, where the human's judgement is needed, verification line | The brief                  |
| `/review` report         | Verdict, then one line per blocking finding, synthesized across reviewers   | Each reviewer's raw report |
| `/task` closeout comment | Merge verdict, where to focus, one line per open question                   | Reasoning behind each      |

**Agent comments start with a marker** on their first line —
`<!-- suede:review -->` or `<!-- suede:closeout -->`. `/review` reads PR comments
as spec and skips any whose first line is a `suede:` marker, so a past review
never gets read as a requirement.

## Releases

Suede uses [chronver](https://chronver.org) by default. Version lives in
`package.json#version`, format `YYYY.M.D[.N][-feature|-break]`. `pnpm version`
normalizes leading zeros — `2026.6.4`, not `2026.06.04`.

**The mechanics are constant across forks; the scheme is a fork-time decision.**
Mechanics: every release branch ships as its own version bump; the bump is the
final commit before merge; the merge commit on `main` is tagged with the bare
version string, annotated, and pushed with `--follow-tags`; the changelog is
`git log <prev>..<new>`, with no `CHANGELOG.md`. The scheme is chosen when the
project is created (`pnpm create suede` records it as `suede.versioning`) —
chronver for apps and templates, semver for libraries consumed by dependents.

**No versionless merges.** Every branch ready to merge to `main` ships as its
own version.

### Cutting a release

1. Final commit is `chore(release): cut <version>`. Bump with
   `pnpm version <version> --no-git-tag-version` and commit only the version
   field. Known gotcha: `pnpm version` rejects the four-segment `.N` form as
   invalid semver — hand-edit the manifests for a same-day second cut.
2. Tag the merge commit on `main` with the bare version string, annotated. Push
   with `git push origin main --follow-tags`.
3. `git log <prev>..<new>` is the changelog.

### Downstream lineage

A project forked from suede carries `"suede": { "from": "<tag>", "versioning":
"<scheme>" }` in its own `package.json`: the chronver tag of the suede commit it
branched from, and the version scheme chosen at creation. `pnpm create suede`
writes both. Suede's own `package.json` has no such field.

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
