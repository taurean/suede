---
name: decision-graph
description: >
  Operate the deciduous decision graph: create and connect nodes, capture
  verbatim prompts, link commits, audit for orphans, and sync with teammates.
  Use when logging decision-graph work (goals, options, decisions, actions,
  outcomes), linking a commit to the graph, or running a graph audit or sync.
---

# Decision graph operations

AGENTS.md owns when and what to log (real-time, the node-flow rule, what not
to log). This file owns the mechanics. Under Pi there is no plugin
enforcement — no nag if an edit lands without a node — so the real-time
discipline is carried by habit alone; treat "log before you code" as if it
were enforced.

## Commands

Node creation, with the house default confidence per type:

```bash
deciduous add goal "..." -c 90
deciduous add option "..." -c 70
deciduous add decision "..." -c 75
deciduous add action "..." -c 85
deciduous add outcome "..." -c 90
deciduous add observation "..." -c 80
deciduous add revisit "..." -c 75
```

Flags: `-p/--prompt "..."` (`--prompt-stdin` for multi-line), `-f "a.ts,b.ts"`
to associate files, `--commit HEAD` to link a commit, `-b <branch>` /
`--no-branch` (branch auto-detected otherwise), `--date "YYYY-MM-DD"` to
backdate (archaeology).

Edges: `deciduous link <from> <to> -r "<reason>"`. Edge types: `leads_to`,
`chosen`, `rejected` (always give the reason), `requires`, `blocks`,
`enables`.

Views: `deciduous nodes`, `edges`, `graph`, `pulse`, `serve` (web UI).
Documents: `deciduous doc attach <node> <file> -d "..."` (or `--ai-describe`);
`doc list [node]`. When the user shares an image or file outside the project,
attach it to the most relevant active node.
Export: `deciduous writeup` drafts a PR writeup; `deciduous dot --png`
renders the graph.

## Verbatim prompts

Root goal nodes and major direction changes carry the user's exact message —
never a summary; summaries are useless for context recovery:

```bash
deciduous add goal "..." -c 90 --prompt-stdin << 'EOF'
[the user's message, word for word]
EOF
```

Update an existing node with `deciduous prompt <node_id>`. Routine downstream
nodes skip the prompt — they inherit context via edges.

## Commit linking

After every commit:

```bash
deciduous add action|outcome "..." --commit HEAD
deciduous link <parent_id> <new_id> -r "<reason>"
```

## Connection rules and audit

Every node connects to its parent; only root goals are valid orphans.
An `option` links from its goal; a `decision` from the option(s) it chose
between; an `action` from its decision; an `outcome` from the action that
produced it; an `observation` to whatever it informs; a `revisit` from the
decision or outcome being reconsidered.

Audit after a burst of nodes, at session end, and before sync: does every
outcome trace to an action, every action to a decision, every option to a
goal? Fix gaps with
`deciduous link <parent> <child> -r "Retroactive connection — <why>"`.

## Branch grouping

Nodes auto-tag the current git branch (`.deciduous/config.toml` names the
main branches). Filter with `deciduous nodes --branch <name>`; use
`--no-branch` for cross-cutting notes.

## Staging rules

Never `git add .`, `-A`, `-am`, or glob patterns — `.env`, `node_modules/`,
`.deciduous/`, and `tmp/` are all candidates. Stage files explicitly by name.

## Sync (multi-user)

Each user's `deciduous.db` is local and gitignored; events are the shared
record. Session start: `git pull && deciduous events rebuild`. Session end:
`deciduous sync`, then stage `.deciduous/sync/` explicitly and commit.
One-time setup: `deciduous events init`. Compact periodically:
`deciduous events checkpoint --clear-events`. (A legacy patch flow exists —
`deciduous diff export` / `diff apply` — for manual control.)
