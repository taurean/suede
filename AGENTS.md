# AGENTS

Cross-agent rulebook. Read at task start (always in context for OpenCode, Claude Code, etc.).

## Stack

SvelteKit · Cloudflare Pages + Workers · D1 + Drizzle · Vitest + Playwright · pnpm · stylebase + Bits UI · Storybook.

## Git workflow

- Always branch from `main`. Pull latest `main` before creating the new branch.
- **Never branch off an in-flight branch.** The only base for a new branch is `main`. While a PR is open (not yet merged), new work either becomes a follow-up commit on the _same_ branch (new goal node, same PR) or waits. A branch-of-branch creates a PR whose base vanishes the moment the first PR merges.
- All tasks are reviewed in a pull request.
- **The agent may push branches and may apply tags, but never merges to `main` and never pushes directly to `main`.** The human reviews the PR and merges. (Pushing the release branch to the remote and tagging the human's merge commit on `main` are both agent-OK; the act of merging the PR into `main` is human-only.)
- The human is the commit author for all commits. Agent-made commits add a `Co-authored-by: opencode <noreply@opencode.ai>` trailer to credit assistance.

### Branch and commit naming

The branch name and the commit-message type share a vocabulary. **Branch names** are `<type>/<slug>` where `<slug>` is a short kebab-case description of the work. **Commit messages** are `<type>(<scope>): <subject>` where `<scope>` is optional and `<subject>` is a present-tense imperative ("add X", not "added X"). The `chore(release):` type is reserved for the version-bump commit on a release branch — see the **Releases** section.

**Canonical type list** (conventional-commits 1.0.0, as of this writing):

- `feat` — new user-visible feature
- `fix` — bug fix for user-visible behaviour
- `chore` — maintenance, dependency bumps, tooling, version bumps
- `docs` — documentation only (AGENTS.md, task notes, READMEs, ADRs)
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — test additions or corrections, no production code change
- `build` — build system or external dependency change
- `ci` — CI configuration change
- `perf` — performance improvement
- `style` — formatting, whitespace, missing semicolons, etc. (no logic change)

A fork that needs to extend the list (e.g. add `i18n` for a content-heavy project) or trim it (e.g. drop `perf` for a backend MCP that doesn't have a measurable perf budget) records the override in `suede-kickoff` Step 3 Thread B Q9. The full [conventional-commits 1.0.0 spec](https://www.conventionalcommits.org/en/v1.0.0/) is the upstream reference; AGENTS.md inherits the type list from it and re-states it here so the agent doesn't have to fetch the spec on first use.

## Layout

- `AGENTS.md` — this file
- `agent-notes/` — chronological task notes, one per task, written at task end. Filename: `YYYY-MM-DD-NN-<slug>.md` where `NN` is a per-day counter (`01`, `02`, ...) zero-padded to 2 digits. The counter is the order tasks _landed_, not the order they were _started_ — if the day ends with 3 notes, the next task the next day starts at `01` again, not `04`. `<slug>` is short kebab-case, lower-case, no trailing dash.
- `agent-notes/plans/` — gitignored (transient scratchpads; see Task flow for the full rule)
- `.opencode/skills/` — in-repo skills (cross-cutting process skills live in your global plugin, not here)
- `.opencode/{agents,commands,plugins,tools}/` — OpenCode integration files. All filenames in `.opencode/` use kebab-case. Skill directories are `kebab-case` and contain a single `SKILL.md`.

### Task note section headings

Every task note uses the six section headings from the template at `agent-notes/0000-00-00-00-task-template.md`, in this order:

1. `## Task` — what was asked, scope, done-when.
2. `## Decisions` — choices made, with the why.
3. `## Actions` — steps taken, with brief results or pointers.
4. `## Files touched` — list of paths with one-line descriptions of what changed.
5. `## Verification` — `pnpm check` / `pnpm test` / `pnpm lint` results, with command + outcome.
6. `## Follow-ups / stubs` — things deferred, stubbed, or flagged for later.

The template says "fill at end, not during" and "size scales with task" — trivial tasks get short notes (one or two lines per section), not skipped sections. A task note with fewer than the six sections is incomplete.

## Constant process pipeline

The workflow below ships to every project forked from suede. The _process_ is constant; the _details_ (issue tracker, branch convention, version policy, which global skills apply) are tailored per fork via `suede-kickoff` Step 3 Thread B and recorded in the fork's first task note. Don't invent a new pipeline; if a stage doesn't fit a particular task, compress it (see "Size scales with task" under **Working style**) but keep the shape.

| Stage                                                                               | Skill                                                                              | When to load                                                                                                                                                                    |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. **Concept / problem** exists in conversation, in an issue, or as a QA bug report | —                                                                                  | Always; this is the input to the pipeline                                                                                                                                       |
| 2. **Grill** the design until shared understanding                                  | `~/.agents/skills/grill-me` (open-ended) or `grill-with-docs` (against the domain) | Whenever the concept is fuzzy, the requirements are in tension, or a non-trivial decision is being made                                                                         |
| 3. **PRD**                                                                          | `~/.agents/skills/to-prd`                                                          | After the grill resolves. Synthesises the conversation into a PRD with problem statement, user stories, implementation decisions, testing decisions, out of scope               |
| 4. **Issues**                                                                       | `~/.agents/skills/to-issues`                                                       | Breaks the PRD into tracer-bullet vertical slices; each is independently demoable and ideally AFK-able                                                                          |
| 5. **Triage**                                                                       | `~/.agents/skills/triage`                                                          | Labels and queues issues (`needs-triage` → `ready-for-agent` / `ready-for-human` / `wontfix`); uses the project's label vocabulary, which is captured in the kickoff's Thread B |
| 6. **Build**                                                                        | `~/.agents/skills/tdd`                                                             | Tracer-bullet RED→GREEN per slice; one test, then one implementation, repeat. Public-interface behaviour only                                                                   |
| 7. **Diagnose**                                                                     | `~/.agents/skills/diagnose`                                                        | When a build hits a hard bug, performance regression, or non-deterministic failure. Build a feedback loop first, then bisect                                                    |
| 8. **Review**                                                                       | `~/.agents/skills/review`                                                          | Two-axis PR review (Standards + Spec) before merge. Runs both axes in parallel sub-agents                                                                                       |
| 9. **QA**                                                                           | `~/.agents/skills/qa`                                                              | Conversational bug filing against the running app. Produces durable GitHub (or project-tracker) issues from the user's perspective                                              |
| 10. **Release**                                                                     | (in-repo, this section "Releases")                                                 | chronver bump as final commit on the release branch; human tags the merge commit on `main` and pushes with `--follow-tags`                                                      |
| 11. **Handoff**                                                                     | `~/.agents/skills/handoff`                                                         | When context is running out and a fresh session needs to pick up. Compacts to the OS temp dir, not the workspace                                                                |

**Always-on supporting layer** (not a stage — runs throughout):

- **Decision graph** (`deciduous` CLI + this file's "Decision Graph Workflow" section) — every commit linked to a node, goal → options → decision → actions → outcomes, real-time logging
- **Task notes** (`agent-notes/YYYY-MM-DD-NN-<slug>.md`, template at `agent-notes/0000-00-00-00-task-template.md`) — one per task, written at end. Records decisions, actions, files touched, verification evidence
- **Git workflow** (this file's "Git workflow" section) — branch from `main`, PR review, agent never pushes/merges, `Co-authored-by: opencode` trailer on agent-made commits
- **Authoring boundaries** (this file's "Authoring boundaries" section) — humans own Svelte markup / scoped CSS / design tokens; agents own `<script lang="ts">` and `*.ts`

The pipeline is the same regardless of project shape (full-stack, content, backend, other) and regardless of project formality. A 2-day prototype compresses stages 3–5 (no PRD file, issues live in the task note, no triage labels); a 2-year production app runs every stage.

**Tracker preconditions.** Stages 4 (issues), 5 (triage), 8 (review), and 9 (qa) all assume a project tracker exists with the conventional label vocabulary (`needs-triage` → `ready-for-agent` / `ready-for-human` / `wontfix`, `bug` / `enhancement`). The default tracker is **GitHub Issues**; forks that want a markdown-dir tracker or Linear can override via `suede-kickoff` Step 3 Thread B. When no tracker is configured, these stages collapse to mental checks on the task note's Follow-ups list and the stage-skill descriptions still apply as vocabulary, just not as formal workflow.

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

A change to a UI primitive in `src/lib/components/` is **incomplete without a story update** in the same commit. Stories are the agent-owned form of the human-owned visual contract: the story captures the component's rendered states, and any new state, prop, or visual branch added in code is a story-add or story-edit. A primitive without a matching story is invisible to QA and to the next contributor. Storybook is the suede default; a fork that rips it records the override in the kickoff follow-up task note, and the agent rewrites AGENTS.md / `.opencode/skills/tdd-supplementary/` references to Storybook as part of that override.

## Working style

The **Constant process pipeline** section above is the canonical reference for which skill applies at which stage. Load the relevant one when the stage applies (don't load for the sake of loading):

Design-stage skills (load during stages 2–5):

- `grill-me` — open-ended stress-test of a plan; one question at a time, recommended answer with each
- `grill-with-docs` — like `grill-me` but grills against the existing domain model and updates `CONTEXT.md` / ADRs inline
- `to-prd` — synthesise the conversation into a PRD
- `to-issues` — break a PRD into tracer-bullet vertical slices
- `triage` — label and queue issues through the state machine

Build-stage skills (load during stages 6–9):

- `tdd` — vertical-slice RED→GREEN; public-interface behaviour only
- `tdd-supplementary` (in-repo, `.opencode/skills/tdd-supplementary/`) — suede-specific supplements: test pruning pass, Storybook-when-in-use discipline, "earn their keep" rule
- `diagnose` — feedback-loop-first debugging for hard bugs
- `review` — two-axis PR review (Standards + Spec)
- `qa` — conversational bug filing against the running app

Wraparound skills (load any time):

- `prototype` — throwaway code that answers a question before committing
- `handoff` — compact the session for the next agent
- `caveman` — terse mode, ~75% token drop
- `write-a-skill` — authoring a new skill
- `improve-codebase-architecture` — find deepening opportunities
- `find-skills` — discover skills the user hasn't surfaced

Zed's plan/build mode toggle is the human's lever — follow the active mode
without prompting. See **Verification before completion** for done criteria.

## Task flow

Every release branch follows this flow from task start to task done. The
procedural reference lives at `.opencode/skills/task-lifecycle/SKILL.md`;
this section is the in-context summary that consolidates the rules
scattered above (Authoring boundaries, Working style, Releases, Decision
Graph) into one sequence.

### Start

1. `git pull origin main` — sync with `main`.
2. `git checkout -b <type>/<slug>` — branch from `main`.
3. For non-trivial work, log a goal node with the verbatim user prompt.
4. For design or unclear requirements, load `grill-me` (stage 2 of the
   **Constant process pipeline**) and grill until the human approves a
   direction. Continue into `to-prd` / `to-issues` / `triage` as
   appropriate. No code edits during design stages.

### During

1. Before each major edit, log an action node and link it to the goal.
2. Apply `~/.agents/skills/` process skills when the relevant pipeline
   stage applies (see **Constant process pipeline** above). The "During"
   steps in particular: `tdd` (build), `diagnose` (when stuck),
   `prototype` (when you need to throw code at a question), `review`
   (before merge), `qa` (when the human reports a bug),
   `improve-codebase-architecture` (when diagnose flags architectural
   debt), `handoff` (when context is running out), `caveman` (terse
   mode), `write-a-skill` (when capturing a new process).
3. Honour Authoring boundaries — humans own presentation, agents own TS.
4. Commit on the branch with the `Co-authored-by: opencode` trailer.
5. Link each commit: `deciduous add action|outcome "..." --commit HEAD`.

### End

1. Verify: `pnpm check`, `pnpm test`, and `pnpm lint` if lintable files
   changed. Capture command + result in the task note.
2. Write the task note at `agent-notes/YYYY-MM-DD-NN-<slug>.md` from the
   template. Append to the chronological record — never delete.
3. Bump the version: `pnpm version <YYYY.M.D> --no-git-tag-version`.
4. Commit the version bump: `chore(release): cut <version>`.
5. Hand back. The human reviews the PR, merges to `main`, and tags the
   merge commit on `main` with the bare version string. The agent may
   push the release branch and apply the tag (see Git workflow rule),
   but the merge to `main` is human-only.

## Releases

Suede uses [chronver](https://chronver.org) by default. Version lives in `package.json#version` (chronver format `YYYY.M.D[.N][-feature|-break]`; `pnpm version` normalizes leading zeros, so e.g. `2026.6.4`, not `2026.06.04`).

**The _mechanics_ are constant across forks; the _scheme_ is a fork-time decision.** The mechanics: every release branch ships as its own version bump; the bump is the final commit on the branch, before merge; the merge commit on `main` is tagged with the bare version string, annotated, and pushed with `--follow-tags`; the changelog is `git log <prev>..<new>` (no CHANGELOG.md). The scheme is one of the questions in `suede-kickoff` Step 3 Thread B — chronver is the suede default for apps and templates, semver is the override for libraries consumed by dependents. A fork that picks semver rewrites this section during its kickoff follow-up.

**Every release branch — a branch ready to be reviewed and merged to `main` — ships as its own version.** The bump is the final commit on the release branch, before merge. No versionless merges.

**Tracker and remotes.** The default project tracker is **GitHub Issues** (where the `qa` / `triage` / `to-issues` / `review` skills expect to read and write). Forks that want a different tracker override via `suede-kickoff` Step 3 Thread B. Tangled (or any other git host) can be added as an additional remote for mirroring, but is not a substitute for the tracker.

### Cutting a release

1. Final commit on the release branch, before merge, is `chore(release): cut <version>`. Bump with `pnpm version <version> --no-git-tag-version` (or hand-edit), commit only the `version` field.
2. Tag the merge commit on `main` with the bare chronver string, annotated. Push with `git push origin main --follow-tags`.
3. `git log <prev>..<new>` is the changelog. No `CHANGELOG.md`.

### Downstream lineage

When a project duplicates suede, it adds `"suede": { "from": "<tag>" }` to its own `package.json` with the chronver tag of the suede commit it branched from. Suede's own `package.json` carries no such field.

### Version policy

chronver for apps and templates (temporal releases, no API contract to break); semver for packages consumed by dependents (persistent breaking-change signals).

## Decision Graph Workflow

Suede tracks project decisions through the `deciduous` decision-graph tool. This section is the cross-agent view: it describes the `deciduous` CLI and the graph model, which are tool-agnostic. Tool-specific commands and skills live in `.opencode/commands/` and `.opencode/skills/` (OpenCode) and are loaded by OpenCode at runtime; they are not duplicated here.

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

### Behavioral Triggers - MUST LOG WHEN:

| Trigger                       | Log Type           | Example                        |
| ----------------------------- | ------------------ | ------------------------------ |
| User asks for a new feature   | `goal` **with -p** | "Add dark mode"                |
| Exploring possible approaches | `option`           | "Use Redux for state"          |
| Choosing between approaches   | `decision`         | "Choose state management"      |
| About to write/edit code      | `action`           | "Implementing Redux store"     |
| Something worked or failed    | `outcome`          | "Redux integration successful" |
| Notice something interesting  | `observation`      | "Existing code uses hooks"     |

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

### Document Attachments

Attach files (images, PDFs, diagrams, specs, screenshots) to decision graph nodes for rich context.

```bash
# Attach a file to a node
deciduous doc attach <node_id> <file_path>
deciduous doc attach <node_id> <file_path> -d "Architecture diagram"

# List documents
deciduous doc list              # All documents
deciduous doc list <node_id>    # Documents for a specific node

# Manage documents
deciduous doc show <doc_id>     # Show document details
deciduous doc describe <doc_id> "Updated description"
deciduous doc open <doc_id>     # Open in default application
deciduous doc detach <doc_id>   # Soft-delete (recoverable)
deciduous doc gc                # Remove orphaned files from disk
```

**When to suggest document attachment:**

| Situation                               | Action                                                         |
| --------------------------------------- | -------------------------------------------------------------- |
| User shares an image or screenshot      | Ask: "Want me to attach this to the current goal/action node?" |
| User references an external document    | Ask: "Should I attach a copy to the decision graph?"           |
| Architecture diagram is discussed       | Suggest attaching it to the relevant goal node                 |
| Files not in the project are dropped in | Attach to the most relevant active node                        |

**Do NOT aggressively prompt for documents.** Only suggest when files are directly relevant to a decision node. Files are stored in `.deciduous/documents/` with content-hash naming for deduplication.

### CRITICAL: Capture VERBATIM User Prompts

**Prompts must be the EXACT user message, not a summary.** When a user request triggers new work, capture their full message word-for-word.

**BAD - summaries are useless for context recovery:**

```bash
# DON'T DO THIS - this is a summary, not a prompt
deciduous add goal "Add auth" -p "User asked: add login to the app"
```

**GOOD - verbatim prompts enable full context recovery:**

```bash
# Use --prompt-stdin for multi-line prompts
deciduous add goal "Add auth" -c 90 --prompt-stdin << 'EOF'
I need to add user authentication to the app. Users should be able to sign up
with email/password, and we need OAuth support for Google and GitHub. The auth
should use JWT tokens with refresh token rotation.
EOF

# Or use the prompt command to update existing nodes
deciduous prompt 42 << 'EOF'
The full verbatim user message goes here...
EOF
```

**When to capture prompts:**

- Root `goal` nodes: YES - the FULL original request
- Major direction changes: YES - when user redirects the work
- Routine downstream nodes: NO - they inherit context via edges

**Updating prompts on existing nodes:**

```bash
deciduous prompt <node_id> "full verbatim prompt here"
cat prompt.txt | deciduous prompt <node_id>  # Multi-line from stdin
```

Prompts are viewable in the web viewer.

### CRITICAL: Maintain Connections

**The graph's value is in its CONNECTIONS, not just nodes.**

| When you create... | IMMEDIATELY link to...                  |
| ------------------ | --------------------------------------- |
| `outcome`          | The action that produced it             |
| `action`           | The decision that spawned it            |
| `decision`         | The option(s) it chose between          |
| `option`           | Its parent goal                         |
| `observation`      | Related goal/action                     |
| `revisit`          | The decision/outcome being reconsidered |

**Root `goal` nodes are the ONLY valid orphans.**

### Quick Commands

```bash
deciduous add goal "Title" -c 90 -p "User's original request"
deciduous add action "Title" -c 85
deciduous link FROM TO -r "reason"  # DO THIS IMMEDIATELY!
deciduous serve   # View live (auto-refreshes every 30s)
deciduous sync    # Export for static hosting

# Metadata flags
# -c, --confidence 0-100   Confidence level
# -p, --prompt "..."       Store the user prompt (use when semantically meaningful)
# -f, --files "a.rs,b.rs"  Associate files
# -b, --branch <name>      Git branch (auto-detected)
# --commit <hash|HEAD>     Link to git commit (use HEAD for current commit)
# --date "YYYY-MM-DD"      Backdate node (for archaeology)

# Branch filtering
deciduous nodes --branch main
deciduous nodes -b feature-auth
```

### CRITICAL: Link Commits to Actions/Outcomes

**After every git commit, link it to the decision graph!**

```bash
git commit -m "feat: add auth"
deciduous add action "Implemented auth" -c 90 --commit HEAD
deciduous link <goal_id> <action_id> -r "Implementation"
```

The `--commit HEAD` flag captures the commit hash and links it to the node. The web viewer will show commit messages, authors, and dates.

### Git History & Deployment

```bash
# Export graph AND git history for web viewer
deciduous sync

# This creates:
# - docs/graph-data.json (decision graph)
# - docs/git-history.json (commit info for linked nodes)
```

The exported `docs/` directory is gitignored (regenerated per machine via `deciduous sync`). The web viewer is browsable locally with `deciduous serve`; for a hosted view, deploy `docs/` to a static host.

### Branch-Based Grouping

Nodes are auto-tagged with the current git branch. Configure in `.deciduous/config.toml`:

```toml
[branch]
main_branches = ["main", "master"]
auto_detect = true
```

### Audit Checklist (Before Every Sync)

1. Does every **outcome** link back to what caused it?
2. Does every **action** link to why you did it?
3. Any **dangling outcomes** without parents?

### Git Staging Rules - CRITICAL

**NEVER use broad git add commands that stage everything:**

- ❌ `git add -A` - stages ALL changes including untracked files
- ❌ `git add .` - stages everything in current directory
- ❌ `git add -a` or `git commit -am` - auto-stages all tracked changes
- ❌ `git add *` - glob patterns can catch unintended files

**ALWAYS stage files explicitly by name:**

- ✅ `git add src/lib/components/ui/Button.svelte`
- ✅ `git add package.json pnpm-lock.yaml`
- ✅ `git add .opencode/commands/work.md`

**Why this matters:**

- Prevents accidentally committing sensitive files (.env, credentials)
- Prevents committing large binaries or build artifacts
- Forces you to review exactly what you're committing
- Catches unintended changes before they enter git history

### Session Start Checklist

```bash
deciduous nodes           # What decisions exist?
deciduous edges           # What connections? Any gaps?
deciduous doc list        # Any attached documents to review?
git status                # Current state
```

**Do not run `deciduous update`.** The `update` subcommand regenerates `.opencode/`, `.claude/`, and AGENTS.md content from the upstream `deciduous` CLI defaults, which will overwrite any hand-edits in those files (including this AGENTS.md and the `.opencode/commands/` overrides). If a new version of `deciduous` is needed for a feature, install it (`cargo install deciduous` or `brew upgrade deciduous`) and treat the new install as a _new_ integration to opt into — not a forced refresh. The `version-check.ts` plugin is a no-op in this repo by design (it used to nag; the nag is now a footgun, see commit history).

### Multi-User Sync

Sync decisions with teammates via event logs:

```bash
# Check sync status
deciduous events status

# Apply teammate events (after git pull)
deciduous events rebuild

# Compact old events periodically
deciduous events checkpoint --clear-events
```

Events auto-emit on add/link/status commands. Git merges event files automatically.

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
