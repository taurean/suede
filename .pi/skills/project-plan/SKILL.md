---
name: project-plan
description: >
  Plan work too big for one PR as a short sequence of independently-mergeable
  cuts, published as a single plan issue. User-invoked when a feature involves
  a big rewrite or several sizeable cuts that could merge on their own. The
  fuller PRD / per-issue / triage ceremony is preserved under reference/.
disable-model-invocation: true
---

# Project plan

Carve work that cannot land as one PR into **cuts**: PR-sized units that
merge independently, each leaving the app shippable. If the goal fits in one
PR, stop here — run `/skill:task` directly.

## 1. Interview

Short back-and-forth, one question per message with a one-line recommended
answer; stop when the load-bearing unknowns resolve. The unknowns that
matter:

- the end state — what is true when the whole plan is done;
- what must keep working after every merge — the app stays shippable
  between cuts;
- the seams that let cuts merge independently — existing seams first.

## 2. Draft the cut map

An ordered list. Per cut:

- **Title** — short enough to become a branch name.
- **Outcome** — one sentence, user-observable.
- **Stories** — one to three "Done when" lines (`<user> can <do X> and
  observes <Y>`). These become the cut's test list, so restraint here is
  restraint everywhere downstream.
- **Blocked by** — earlier cuts it needs, if any.

A cut earns its place by being independently mergeable **and** worth its own
review cycle; if two cuts would be reviewed together anyway, merge them.
Prefer few sizeable cuts over many small ones — every extra cut is another
PR the human must read.

## 3. Confirm

Show the map. Ask exactly three things: granularity (too coarse or too
fine), order, and whether each cut is truly mergeable alone. Iterate until
approved.

## 4. Publish one issue

One tracker issue holds the whole plan: a short problem statement, the
decisions that constrain every cut, then the cut map as a task checklist.
Do **not** open an issue per cut — the plan issue is the spec; each cut's PR
links it and checks off its box on merge.

When a cut starts, run `/skill:task` as usual; the slice-brief inherits that
cut's stories from the plan issue.

## 5. Re-plan as cuts land

After each merged cut, revisit the map — later cuts learn from earlier ones
the same way slices do. Edit the plan issue in place; don't regenerate it.

## Reference — the fuller ceremony

When a project needs more formality (external stakeholders, many
contributors, inbound bug flow), the original PRD → per-cut issues → triage
process is preserved:

- [reference/prd.md](reference/prd.md) — synthesize a full PRD and publish it
- [reference/issues.md](reference/issues.md) — break a plan into per-slice tracker issues
- [reference/triage.md](reference/triage.md) — the label state machine for inbound issues
- [reference/agent-brief.md](reference/agent-brief.md) and
  [reference/out-of-scope.md](reference/out-of-scope.md) — triage's durable
  brief and rejection formats
