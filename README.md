<img width="400px" alt="suede logo" src="./static/suede-padding.png" />


# Suede

A SvelteKit starter template with an agentic development process baked in.

Suede is two layers in one repo:

1. **A runtime stack** — SvelteKit on Cloudflare Pages + Workers, D1 + Drizzle for data, Vitest + Playwright for tests, Storybook for component states, stylebase + Bits UI for the design layer.
2. **A process layer** — a constant concept-to-merge pipeline, a decision graph (`deciduous`), in-repo skills and commands, and clear boundaries between what humans author and what agents author.

You don't build _in_ suede so much as you fork it: copy the repo, run the kickoff skill, and the new project inherits both layers with the details tailored to it.

[`AGENTS.md`](AGENTS.md) is the canonical rulebook — it's always in the agent's context (wired up via [`opencode.json`](opencode.json)) and is the source of truth wherever this README summarizes. When the two disagree, AGENTS.md wins.

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

The quality gate before any task is called done: `pnpm check`, `pnpm lint`, and `pnpm test` if tests changed — with command + result captured as evidence in the PR description.

## Starting a new project from suede

Suede is a template you duplicate, not a dependency you install. The flow:

1. **Copy the repo.** Clone suede (or copy the working tree) to a new directory. The working tree _is_ the new project — don't work on a side copy.
2. **Install and verify.** `pnpm install`, confirm `git status` is clean.
3. **Run the kickoff skill.** Tell the agent something like _"start a new project from this template"_ or _"fork suede"_. That triggers [`suede-kickoff`](.opencode/skills/suede-kickoff/SKILL.md), which walks through:
   - **Capture lineage** — record the suede chronver tag and commit hash _before_ anything destructive. The tag lands in the new `package.json` as `"suede": { "from": "<tag>" }`.
   - **Reset history** — delete `.git`, init a fresh repo on `main`.
   - **Grilling session** — a one-question-at-a-time interview in two threads. **Thread A** captures the project itself (name, purpose, primary user, project shape, first version). **Thread B** captures process-layer tailoring: which stack pieces to keep or rip (Cloudflare, D1, Storybook, SvelteKit itself, …), version scheme (chronver vs semver), commit-type vocabulary, pipeline compression, and which skills apply.
   - **Bootstrap commit** — update `package.json` (name, version, `suede.from`), reset the `.deciduous/` graph, commit.
   - **Branch the follow-up task** — `chore/suede-kickoff`, where the Thread B answers are turned into actual edits to `AGENTS.md`, `.opencode/`, configs, and this README. The kickoff skill deletes itself at the end of that task — it's consumed once.

The grill produces a plan; the follow-up branch produces the diff. No code is written during the interview.

Downstream forks can always trace their lineage: `package.json#suede.from` holds the suede tag they branched from.

## Working with the coding agent

Suede is built to be driven through a coding agent (OpenCode, Claude Code, or similar). The contract:

- **AGENTS.md is always loaded.** It defines the stack, the git workflow, the pipeline, and the guardrails. Agent-facing integration files live in `.opencode/` (skills, commands, plugins).
- **Authoring boundaries.** Humans own the presentation layer: Svelte component markup, `<style>` blocks, `src/lib/styles/`, design tokens. Agents own the TypeScript: `<script lang="ts">` blocks, `*.ts` in `src/lib/` and `src/routes/`, Drizzle schemas, server routes, Workers. An agent never edits markup or scoped CSS.
- **Storybook discipline.** A change to a UI primitive in `src/lib/components/` is incomplete without a story update in the same commit — stories are the agent-owned record of the human-owned visual contract.
- **The human merges.** Agents may branch, commit (with a co-author trailer crediting assistance), push branches, and apply tags — but never merge to `main` or push to it directly. Every task lands through a PR the human reviews.
- **Everything is recorded.** Decisions go in the decision graph in real time. Closed issues and merged PRs are the durable record of what shipped.

## From concept to merge

Every task moves through a happy-path pipeline. The _process_ is constant across all suede forks; the _details_ (branch convention, version scheme) are tailored at kickoff. Stages compress for small tasks — a prototype might skip the PRD file and tracker labels — but the shape stays.

The happy path is the eight stages that fire for almost every unit of work:

1. **Concept** — a problem exists: in conversation, an issue, or a QA bug report.
2. **Grill** (`grill-me` / `grill-with-docs`) — stress-test the idea, one question at a time, until understanding is shared.
3. **PRD** (`to-prd`) — synthesize the conversation into a PRD: problem, stories, decisions, scope.
4. **Issues** (`to-issues`) — break the PRD into tracer-bullet vertical slices, each independently demoable.
5. **Triage** (`triage`) — label and queue: `needs-triage` → `ready-for-agent` / `ready-for-human` / `wontfix`.
6. **Build** (`tdd`) — RED → GREEN per slice; one test, one implementation, repeat; public-interface behaviour only. Also covers the prune pass and Storybook discipline.
7. **Review** (`review`) — two-axis PR review (Standards + Spec) in parallel sub-agents, before merge.
8. **Release** (AGENTS.md "Releases") — chronver bump as the final commit on the branch; human merges and tags.

A few skills are loaded only when the situation matches: `diagnose` for hard bugs, `qa` for conversational bug filing, `handoff` when context runs out, plus `prototype`, `improve-codebase-architecture`, `write-a-skill`, `find-skills`, and `caveman` as wraparound tools.

Stage skills all live in `.opencode/skills/`. No global plugin is required.

### The shape of a single task

1. **Start** — pull `main`, branch `<type>/<slug>` (always from `main`, never from an in-flight branch), log a goal node with the verbatim prompt. If requirements are fuzzy, grill before touching code.
2. **During** — log action nodes before major edits, honour authoring boundaries, commit as `<type>(<scope>): <subject>` in present-tense imperative, link each commit to the graph.
3. **End** — run the quality gate, bump the version (`chore(release): cut <version>` as the final commit), hand back. The human reviews the PR, merges, and the merge commit gets tagged on `main`.

Branch types and commit types share one vocabulary — the conventional-commits 1.0.0 list (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`, `perf`, `style`), enumerated in AGENTS.md.

## Tools

### Decision graph (`deciduous`)

Suede tracks project decisions as a graph: `goal → options → decision → actions → outcomes`, with observations attached anywhere. Logging is real-time, not retroactive — log what you're about to do, then log how it went, and link every commit to a node. The graph records the _project's_ decisions (what the user is building and choosing), never the agent's internal process.

- Rules and the node-flow model: AGENTS.md "Decision Graph Workflow"
- Full CLI reference and workflows: [`.opencode/commands/decision.md`](.opencode/commands/decision.md)
- Session-start context recovery: [`.opencode/commands/recover.md`](.opencode/commands/recover.md)
- Web viewer: [`.opencode/commands/serve-ui.md`](.opencode/commands/serve-ui.md) · multi-user sync: [`.opencode/commands/sync.md`](.opencode/commands/sync.md)
- Two OpenCode plugins enforce the habit: `require-action-node` (no file edits without a recent action/goal node) and `post-commit-reminder` (link commits after the fact).

### In-repo skills (`.opencode/skills/`)

| Skill           | Purpose                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `suede-kickoff` | One-shot bootstrap of a new project from a fresh suede clone (see above)                                    |
| `tdd`           | RED → GREEN workflow, vertical slicing, mocking at boundaries, plus the prune pass and Storybook discipline |
| `pulse`         | Map the system's _current_ state as decision nodes — no history, just now                                   |
| `narratives`    | Reconstruct how the system evolved, as prose narratives                                                     |
| `archaeology`   | Turn those narratives into a backdated, queryable decision graph                                            |

Cross-cutting process skills (grill-me, to-prd, tdd, review, qa, …) all ship in `.opencode/skills/`.

### Commands (`.opencode/commands/`)

`/build-test` (typecheck + test gate), `/decision` (graph management), `/decision-graph` (build a graph from commit history), `/recover` (session-start context recovery), `/serve-ui`, `/sync`.

## Git workflow and releases

- Branch from `main`, always. Every task is reviewed in a PR; the human is the only one who merges.
- The human is commit author; agent-made commits carry a co-author trailer.
- **chronver** by default (`YYYY.M.D[.N]`, no leading zeros): every release branch ships its own version bump as its final commit, the merge commit on `main` is tagged with the bare version string and pushed with `--follow-tags`, and `git log <prev>..<new>` is the changelog — no `CHANGELOG.md`. Libraries with dependents switch to semver at kickoff.
- Default tracker is GitHub Issues.

Full details: AGENTS.md "Git workflow", "Task flow", and "Releases".
