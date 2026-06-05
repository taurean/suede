# decision-graph-for-suede

## Task
Run `/decision-graph` against the suede repository: build a deciduous decision graph from the repo's commit history, capturing the design evolution (process layer spine + UI scaffolding side narrative) with grounded node descriptions and complete edge threading.

## Decisions
- Treat the **process layer** (AGENTS.md evolution, git workflow rule, release model, decision-graph integration, defensive gitignore) as the **spine** of the graph — the design question that keeps getting re-answered.
- Treat the **UI scaffolding** (bits-ui + stylebase wrappers) as a **side branch** from the root goal — independent track, branched from the same root, not from the process layer.
- Skip pure implementation commits: `344cafb` (Storybook dependency bump) is a routine upgrade with no model change; `fa5d685` (task note for the bootstrap) is a record, not a decision — captured as a small action node.
- Backdate all archaeology nodes to the date of the commit they describe, not to today.
- For commits that bundle multiple decisions (`5a9fda9` bundles three; `e430a03` bundles two; `c273b91` adds four gitignore lines that map to one decision), model each logical decision as its own decision/option cluster, all sharing the action node.
- For the `task-lifecycle` skill's "Before starting" branch-setup step added in `e430a03`, fold it into the action description (one commit) rather than carving out a separate decision.
- Cross-link the prior cleanup thread (nodes 1-5) to the `c273b91` outcome — "defensive gitignore was insufficient; full removal followed" — so a future reader sees the full arc.

## Actions
- **Layer 1 (all commits)**: `git log --all --oneline | wc -l` → 11 commits. Read each commit's stat and full message.
- **Layer 2 (keyword)**: `git log --grep` for `bits|stylebase|chronver|AGENTS|stack|release|story|chrom|version|Sentry|Axiom|tag|Stack|Layout|bootstrap` → no commits missed.
- **Foundation observation** (node 7): stock SvelteKit template ships with separate stack.md and vendor-specific config.
- **Bootstrap cluster** (5a9fda9, nodes 8-19): three decisions (process-doc location, task-records location, enforcement mechanism) → one action (creates AGENTS.md, task template, task-lifecycle skill) → one outcome.
- **Process updates cluster** (e430a03, nodes 20-29): two decisions (stack contents, git workflow) → one action (trims stack, adds git workflow, extends task-lifecycle) → one outcome.
- **Bootstrap task note** (fa5d685, node 30): small action, no decision (record only).
- **Release cluster** (4e3f42e + f2411d2, nodes 31-43): one observation → two decisions (version model, first version) → two actions (Releases section, version bump) → two outcomes.
- **Decision-graph cluster** (770b7d0, nodes 44-49): one observation → one decision (where deciduous doc lives) → one action (260-line AGENTS.md section) → one outcome.
- **Defensive gitignore cluster** (c273b91, nodes 50-55): one observation → one decision → one action → one outcome. Cross-link to cleanup goal.
- **UI scaffolding cluster** (341d364, nodes 56-64): one decision (UI primitives) → one action → one outcome → one observation → one revisit → one pending option (hybrid styling).
- Marked all historical action/decision/outcome/observation nodes as `completed` for clarity (archaeology — the events happened).
- Set option statuses: `completed` for chosen, `rejected` for not chosen, `pending` for the deferred hybrid-styling option.
- Synced graph: `deciduous sync` → `docs/graph-data.json` (64 nodes, 77 edges).

## Files touched
- `.deciduous/deciduous.db` — graph storage (local, gitignored)
- `docs/graph-data.json` — synced graph export (gitignored, regenerable)
- `agent-notes/2026-06-04-02-decision-graph-for-suede.md` — this task note

## Verification
- `deciduous nodes` — 64 nodes: 2 goal, 25 option, 10 decision, 11 action, 8 outcome, 7 observation, 1 revisit
- `deciduous edges` — 77 edges: every chosen/rejected/leads_to edge has a reason string
- `deciduous pulse` — clean: 43 completed, 14 rejected, 7 pending (cleanup goal + 4 cleanup actions + revisit + pending hybrid-styling option)
- `deciduous serve --port 3939` — starts and exposes the graph viewer
- `deciduous graph` (audit) — all outcomes have parent actions; all actions have parent decisions; all options have parent goals/observations; the only valid orphans are the two root goals (cleanup thread + repo-design thread)
- Cross-link edge 77: `54 → 1 (leads_to)` — the defensive-gitignore outcome explicitly leads to the cleanup thread, capturing the full arc

## Follow-ups / stubs
- The deferred `revisit` (node 63) and its `pending` option (node 64) capture the "next step" the 341d364 commit message called out: hybrid global data-attribute CSS + per-component overrides for the UI wrapper styling. When a future commit picks this up, mark the revisit `superseded` and the option `completed`, link to a new action.
- The 4e3f42e Releases section describes `pnpm version 2026.6.4` normalizing leading zeros; the 770b7d0 Decision Graph section, the c273b91 gitignore, and the cleanup all sit in the same PR (4 commits ahead of `origin/feat/install-bits-ui-stylebase`). When the PR merges to `main`, a future session can add a single outcome node capturing "Suede v2026.6.4 released; PR merged; tag applied" — to close the loop on the Releases section.
- The cross-link edge `54 → 1` is the only connection between the two graph threads (cleanup and repo-design). If a future task grows either thread, that edge may need a sibling (e.g., a `revisit` on the "should we commit CLAUDE.md after all" question, given deciduous's installer behavior).
- The deciduous `revisit` model says "force reconsideration of previous approach" — node 63 is more of a "deferred decision" than a true pivot. If the user wants a stricter model, we could split into `revisit` (the question) + `option` (the candidate) + a future `decision` when the user picks the hybrid strategy. For now, the current shape captures the "we know this needs a follow-up" semantics adequately.
