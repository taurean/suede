---
name: slice-brief
description: Produces a per-PR BRIEF.md under tmp/ that hands off a vertical-slice task to a fresh agent session — compressing prior workflow context (goal, systems map, branch) into one file with sections for problem, opportunity, goal, scope, and code surface. Use when the user invokes /slice-brief or asks to create a slice brief.
---

# Slice Brief

## When this runs

Runs during task prep (`/skill:task`), after the worktree exists and the systems map has been read, and immediately before the draft PR opens with this brief as its body. Do not run before the systems map exists; seam assessment and surface sections depend on it.

## Prerequisites — what's already in context

Spend each fact once. Don't re-derive what earlier steps already paid for:

- **Goal from the alignment conversation** (task step 0) — seed for problem, opportunity, goal. Don't re-interview from zero.
- **Systems map from prep** — read it. Use it to identify the relevant code area before reading anything further. Do not re-scan the whole repository.
- **Current branch name** — confirm scope from it; don't invent new context.

## Conversation behavior

Short conversation, not a form. Ask the human one at a time, only for parts requiring judgment. Investigate and confirm for the rest.

**Ask the human directly:**

- **Problem statement** — what the current state is costing (time, errors, blocked work — not just a failure description).
- **Opportunity statement** — what becomes possible going forward. If nothing exists beyond "the problem stops happening," say so. Don't pad.
- **Goal** — narrow, falsifiable outcome still true a week after merge. Not a proxy like "tests pass" or "PR merges."

**Investigate first, then confirm:**

- **Background** — pull from systems map. Current state as it exists today. Zero failure framing.
- **User stories** — propose from goal + systems map, then confirm. If the task is a cut from a plan issue (`/skill:project-plan`), start from that cut's stories instead of proposing fresh ones. Give each a "Done when" line — "\<user\> can \<do X\> and observes \<Y\>" — which becomes the name and shape of that story's scenario test (see `.pi/skills/task/testing.md`).
- **Out of scope** — propose explicit boundaries from what the goal does and doesn't claim. Over-specify.
- **Seam assessment, systems updates, modified surface, new surface** — derive from targeted reading of files the systems map flags. If the map doesn't cover the area, read just enough actual code to answer.

## Validation before writing

Stop and resolve before writing:

- If Goal restates Opportunity, or Opportunity restates Problem — stop, ask the human to sharpen the distinguishing one.
- If Background contains failure language ("doesn't," "fails to," "missing," "broken") — move that content to Problem statement.

## Output

Write the brief with these H2 sections, in order:

1. Background
2. Problem statement
3. Opportunity statement
4. Goal
5. User stories
6. Out of scope
7. Seam assessment
8. Systems updates
9. Modified surface
10. New surface

**Success bar:** a fresh agent session with no memory of this conversation, given only this file plus the systems map, should start building the first vertical slice without asking what the goal is or where the boundary sits. If you couldn't do that from the file alone, it's not done.

## File handling

- Derive the filename from the branch: `tmp/BRIEF-<branch-slug>.md` at the worktree root (short kebab-case slug, ~30 chars max). If a PR already exists for this branch (in-flight follow-up), prefer `tmp/BRIEF-<PR-number>-<slug>.md`, with the number from `gh pr view --json number -q '.number'` (or the host's equivalent — GitLab MR IID, etc.).
- Create `tmp/` if it doesn't exist.
- Never committed — working context for this task's worktree, not part of the codebase. The draft PR's body carries the brief; if the tmp copy diverges during the task, update the PR body before closeout, after which the worktree (and the file) is removed.
- Gitignore the whole `tmp/` directory. If `.gitignore` doesn't already exclude it, add it. Don't duplicate existing entries.

## If the brief file already exists

Don't overwrite silently. Ask the human: is this a revision to specific sections, or a restart from scratch?

## Examples

**Problem / Opportunity / Goal — each must be distinct:**

- Problem: "Engineers spend ~30 min/sprint guessing which test file owns a failing case."
- Opportunity: "We could make test ownership discoverable from the failure message itself, opening up future agent-driven triage."
- Goal: "Every test failure surfaces the owning file path in its output, verifiable by reading any failure log."

Not a valid Goal: "test failures are easier to debug" — restates Problem.

**Background vs Problem — zero failure language in Background:**

- Background (good): "Today, test files live in `tests/` and are named after the module they cover."
- Background (bad): "Today, test files don't expose ownership." — move that sentence to Problem.
