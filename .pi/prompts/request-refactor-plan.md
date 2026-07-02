---
description: Interview for a deferred refactor and file the resulting plan as a GitHub issue for a later session to execute.
---

# Request a refactor plan

Produce a refactor plan through a short interview, then file it as a GitHub
issue for later execution. This is for deferred refactors — work worth
planning now and doing in another session. A refactor you're about to start
goes through `/skill:task` (one PR) or `/skill:project-plan` (several
independently-mergeable cuts) instead.

Skip steps that are clearly unnecessary for the case at hand.

1. Ask what the current shape is costing and what solutions the user has in
   mind. One question per message, each with a one-line recommended answer;
   stop when the load-bearing unknowns resolve.
2. Explore the repo to verify the assertions and understand the current
   state.
3. Present alternative approaches the user hasn't named, if any exist, with
   a recommendation.
4. Pin the scope: what changes, and what explicitly doesn't.
5. Check test coverage in the affected area. The refactor path in
   `/skill:task` needs a green baseline; if coverage is too thin to catch a
   behavior change, the plan's first steps are the missing scenario tests
   (see `.pi/skills/task/testing.md`).
6. Break the work into steps small enough that the program visibly works
   after each — "make each refactoring step as small as possible" (Fowler).
7. File one GitHub issue using the template below.

<refactor-plan-template>

## Problem Statement

The problem the developer is facing, from the developer's perspective.

## Solution

The solution, from the developer's perspective.

## Steps

The implementation plan in plain English, broken into the smallest steps
that each leave the codebase working. As short as the steps allow.

## Decision Document

Implementation decisions made during the interview: modules touched,
interface changes, architectural calls, schema changes, API contracts. No
file paths or code snippets — they go stale fast.

## Testing Decisions

The seams the verifying tests run through, and any coverage that must land
before the refactor starts (test shape is owned by
`.pi/skills/task/testing.md` — don't restate it).

## Out of Scope

What this refactor explicitly will not touch.

</refactor-plan-template>
