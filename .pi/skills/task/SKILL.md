---
name: task
description: >
  Suede's end-to-end coding-task process: goal alignment, prep (worktree,
  slice-brief, draft PR), a per-type execution path (bug, refactor, feature,
  meta, in-flight PR follow-up), and closeout. User-invoked at task start.
disable-model-invocation: true
---

# Task process

## 0. Align on the goal

Reach shared understanding through a short back-and-forth: short sentences,
one question per message, each with a one-line recommended answer. Stop as
soon as the load-bearing unknowns are resolved — exhaustive grilling wastes
the human's energy. This step is lightweight alignment, not plan scrutiny;
for a substantial design with real unknowns, suggest the user run
`/poke-holes` first. If alignment reveals the goal cannot land as one PR —
a rewrite, or several sizeable cuts that could merge independently —
suggest `/skill:project-plan` before any prep.

## 1. Prep

1. Create a new git worktree for the task.
2. Fetch `origin` and branch from the latest `origin/main`, named
   `<type>/<slug>` per AGENTS.md.
3. Read `SYSTEMS_MAP.md`.
4. Produce a slice-brief (`/skill:slice-brief`).
5. Open a draft PR titled for the task, with the slice-brief as its body.

## 2. Execute by task type

Pick the matching path: bug, refactor, new feature, meta (docs or tooling),
or follow-up on an in-flight PR.

### Bug

1. Confirm the bug still exists. If it doesn't, say so in a PR comment with
   your explanation of why, and stop.
2. If it reproduces, comment the reproduction steps on the PR.
3. Trace the code path to the root cause.
4. Fix one affected path at a time, re-running the reproduction after each
   fix, until every affected path is covered.
5. Where the reproduction can be driven from the user's seam, encode it as a
   scenario test that lands with the fix — the repro comment made executable
   (see [testing.md](testing.md)).

### Refactor

1. Run the verification suite first to establish a green baseline.
2. Refactor one module or area at a time without altering observable
   behavior.
3. Verify no regression after each slice; repeat until done.
4. Document the rationale — the why, not the what — in the PR description.

### New feature

1. Build one vertical slice: the thinnest end-to-end path first, then widen
   slice by slice.
2. Every user story in the brief ships with exactly one scenario test that
   proves it, landed in the slice that completes the story — the story list
   is the test list. Slices that only plumb toward a story add no tests.
   Delegate the test to a fresh-context sub-agent when a sub-agent tool is
   available, write it yourself when not ([testing.md](testing.md), "Who
   writes the test"); shape and seam per [testing.md](testing.md) either
   way.
3. A change to a UI primitive is incomplete without a story update in the
   same commit (AGENTS.md, "Storybook discipline").
4. Verify after each slice; repeat until the goal from step 0 is met.

### Meta (documentation, tooling)

1. Identify every file to create or update.
2. Read the neighboring documentation for consistency and context.
3. Complete one document or section at a time, verifying that any code
   examples or commands in it still work.

### In-flight PR follow-up

1. Fetch the latest `origin/main`.
2. Create a worktree for the PR's existing branch.
3. Continue under whichever path above fits the follow-up.

## 3. Share

1. Invoke the `review` skill against the branch and resolve what it finds.
2. If the work moved an area boundary, changed a seam, or shifted what's
   fragile (the brief's seam assessment is the signal), propose the
   `systems-map` update so it commits with the branch.
3. Push the branch and confirm the PR reflects it.
4. Add a PR comment pointing the human reviewer at where to focus.
5. Delete the local worktree; return to `main` and pull.
