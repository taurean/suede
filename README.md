<img width="400px" alt="suede logo" src="./static/suede-padding.png" />

# Suede

A SvelteKit starter template with an agentic development process baked in.

Suede is two layers in one repo:

1. **A runtime stack** — SvelteKit on Cloudflare Pages + Workers, D1 + Drizzle for data, Vitest + Playwright for tests, Storybook for component states, stylebase + Bits UI for the design layer.
2. **A process layer** — a constant concept-to-merge pipeline, a decision graph (`deciduous`), in-repo skills and commands, and clear boundaries between what humans author and what agents author.

You don't build _in_ suede so much as you fork it: copy the repo, run the kickoff skill, and the new project inherits both layers with the details tailored to it.

[`CLAUDE.md`](CLAUDE.md) is the canonical rulebook. Claude Code loads it as the project instruction file, and it is the source of truth wherever this README summarizes. When the two disagree, CLAUDE.md wins.

## Stack

| Concern         | Choice                                                                           |
| --------------- | -------------------------------------------------------------------------------- |
| Framework       | SvelteKit (Svelte 5)                                                             |
| Hosting         | Cloudflare Pages + Workers (`wrangler`)                                          |
| Database        | Cloudflare D1 via Drizzle ORM                                                    |
| Tests           | Vitest (+ Playwright browser tests)                                              |
| Component dev   | Storybook                                                                        |
| UI primitives   | Bits UI + [@taurean/stylebase](https://www.npmjs.com/package/@taurean/stylebase) |
| Package manager | pnpm                                                                             |

Every piece is a default, not a mandate — keep/rip decisions are made per fork during kickoff (see below).

## Getting started

```bash
pnpm install
cp .env.example .env   # fill in Cloudflare D1 credentials if using the DB
pnpm dev               # start the dev server
```

Day-to-day scripts:

| Command                                                     | What it does                                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `pnpm dev`                                                  | Vite dev server                                                                     |
| `pnpm build`                                                | Production build (checks wrangler types first)                                      |
| `pnpm preview`                                              | Run the built Worker locally via wrangler                                           |
| `pnpm check`                                                | Type-check (svelte-check + wrangler types)                                          |
| `pnpm lint`                                                 | Prettier check + ESLint                                                             |
| `pnpm format`                                               | Prettier write                                                                      |
| `pnpm test`                                                 | Vitest, single run                                                                  |
| `pnpm storybook`                                            | Storybook dev server on port 6006                                                   |
| `pnpm db:push` / `db:generate` / `db:migrate` / `db:studio` | Drizzle workflows against D1 (each verifies `.env` first via `scripts/db-check.js`) |

The quality gate before any task is called done: `pnpm check`, `pnpm lint`, `pnpm test` if tests changed, and `/verify` — with command + result captured as evidence in the PR description.

## Starting a new project from suede

Suede is a template you duplicate, not a dependency you install. The flow:

1. **Copy the repo.** Clone suede (or copy the working tree) to a new directory. The working tree _is_ the new project — don't work on a side copy.
2. **Install and verify.** `pnpm install`, confirm `git status` is clean.
3. **Run `/suede-kickoff`** in Claude Code. The [skill](.claude/skills/suede-kickoff/SKILL.md) walks through:
   - **Capture lineage** — record the suede chronver tag and commit hash _before_ anything destructive. The tag lands in the new `package.json` as `"suede": { "from": "<tag>" }`.
   - **Reset history** — delete `.git`, init a fresh repo on `main`.
   - **Grilling session** — a one-question-at-a-time interview in two threads. **Thread A** captures the project itself (name, purpose, primary user, project shape, first version). **Thread B** captures process-layer tailoring: which stack pieces to keep or rip (Cloudflare, D1, Storybook, SvelteKit itself, …), version scheme (chronver vs semver), commit-type vocabulary, pipeline compression, and which skills apply.
   - **Bootstrap commit** — update `package.json` (name, version, `suede.from`), reset `.deciduous/` and run `deciduous init`, commit.
   - **Branch the follow-up task** — `chore/suede-kickoff`, where the Thread B answers are turned into actual edits to `CLAUDE.md`, `.claude/skills/`, configs, and this README. The kickoff skill deletes itself at the end of that task — it's consumed once.

The grill produces a plan; the follow-up branch produces the diff. No code is written during the interview.

Suede ships no `SYSTEMS_MAP.md`, `CONTEXT.md`, or `.claude/skills/task/testing.md` — those describe a specific project, so each fork generates its own and commits them.

Downstream forks can always trace their lineage: `package.json#suede.from` holds the suede tag they branched from.

## Working with Claude Code

Suede is built to be driven through Claude Code. The contract:

- **CLAUDE.md is always loaded.** It defines the stack, the git workflow, the pipeline, and the guardrails. Skills live in `.claude/skills/`.
- **Authoring boundaries.** Humans own the design contract: design-token values, the visual contract, and whether a new UI primitive exists at all. Agents author markup, scoped CSS, and all TypeScript within that contract — through stylebase tokens and Bits UI primitives, never by redefining tokens locally.
- **Storybook discipline.** A change to a UI primitive in `src/lib/components/` is incomplete without a story update in the same commit — stories are the agent-owned record of the human-owned visual contract.
- **The human merges.** Agents may branch, commit (with a co-author trailer crediting assistance), push branches, and apply tags — but never merge to `main` or push to it directly. Every task lands through a PR the human reviews.
- **Everything is recorded.** Decisions go in the decision graph in real time. Closed issues and merged PRs are the durable record of what shipped.

## From concept to merge

Every task moves through the same pipeline. The _process_ is constant across all suede forks; the _details_ (branch convention, version scheme) are tailored at kickoff. Stages compress for small tasks, but the shape stays.

1. **Concept** — a problem exists: in conversation, an issue, or a bug report.
2. **Align** (`/task` step 1) — a short back-and-forth, one question at a time, on goal, boundary, reversibility, and review posture.
3. **Cut plan** (`/project-plan`) — only for work too big for one PR: agree on the few independently-mergeable cuts, publish one plan issue with the cut checklist. Single-PR tasks skip straight to build.
4. **Build** (`/task`) — prep (sibling worktree, systems map, brief, draft PR), then vertical slices with one story-derived test per user story.
5. **Verify** (`/verify`) — the app observed doing the thing, not just a green suite.
6. **Review** (`/review`) — three-axis review (Standards, Spec, Discipline) in parallel subagents, before merge.
7. **Release** (CLAUDE.md "Releases") — chronver bump as the final commit on the branch; human merges and tags.

`engineering-discipline`, `poke-holes`, and `systems-map` are global skills the pipeline depends on; they come from the user's environment, not this repo.

### The shape of a single task

1. **Start** — branch `<type>/<slug>` from the latest `origin/main` (never from an in-flight branch) in a sibling worktree (`git worktree add ../<type>-<slug> -b <type>/<slug> origin/main`), log a goal node with the verbatim prompt. If requirements are fuzzy, align on the goal before touching code.
2. **During** — log action nodes before major edits, honour authoring boundaries, commit as `<type>(<scope>): <subject>` in present-tense imperative, link each commit to the graph.
3. **End** — run the quality gate, bump the version (`chore(release): cut <version>` as the final commit), hand back. The human reviews the PR, merges, and the merge commit gets tagged on `main`.

Branch types and commit types share one vocabulary — the conventional-commits 1.0.0 list (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`, `perf`, `style`), enumerated in CLAUDE.md.

## Tools

### Decision graph (`deciduous`)

Suede tracks project decisions as a graph: `goal → options → decision → actions → outcomes`, with observations attached anywhere. Logging is real-time, not retroactive — log what you're about to do, then log how it went, and link every commit to a node. The graph records the _project's_ decisions (what the user is building and choosing), never the agent's internal process.

- `deciduous init` / `deciduous update` write the Claude Code integration: the commands in `.claude/commands/`, the hooks in `.claude/hooks/`, and a Decision Graph Workflow section in `CLAUDE.md`. Don't hand-edit the generated parts.
- A pre-edit hook enforces real-time logging: an edit is blocked unless a goal or action node was logged recently.
- House rules for what belongs in the graph: CLAUDE.md "Decision graph".
- Web viewer: `deciduous serve`.

### In-repo skills (`.claude/skills/`)

| Skill           | Purpose                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `task`          | The task spine: alignment, prep, build, verify, review, closeout. `brief.md` owns the brief format |
| `project-plan`  | Cut plan for multi-PR work, published as one plan issue                                            |
| `review`        | Three-axis review (Standards, Spec, Discipline) in parallel subagents                              |
| `design`        | Visual judgment for new UI in a stylebase + Bits UI project                                        |
| `writing-css`   | CSS and component markup in stylebase + Bits UI; loads on `.svelte` and CSS files                  |
| `suede-kickoff` | One-shot bootstrap of a new project from a fresh suede clone (see above)                           |

## Git workflow and releases

- Branch from `main`, always. Every task is reviewed in a PR; the human is the only one who merges.
- The human is commit author; agent-made commits carry a co-author trailer.
- **chronver** by default (`YYYY.M.D[.N]`, no leading zeros): every release branch ships its own version bump as its final commit, the merge commit on `main` is tagged with the bare version string and pushed with `--follow-tags`, and `git log <prev>..<new>` is the changelog — no `CHANGELOG.md`. Libraries with dependents switch to semver at kickoff.
- Default tracker is GitHub Issues.

Full details: CLAUDE.md "Git workflow", "Task flow", and "Releases".
