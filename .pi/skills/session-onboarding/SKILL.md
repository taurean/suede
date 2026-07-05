---
name: session-onboarding
description: >
  Session-start checklist for any suede fork: read AGENTS.md, verify the
  three harness invariants (worktree mandatory, `git -C` over `cd && git`,
  `GIT_EDITOR=true`), and walk the operational snags once. Use at the start
  of every pi session in a suede repo. Compressed version of HARNESS.md —
  the long-form reference lives at the repo root.
---

# Session onboarding

The first five minutes of a suede session determine whether the rest of it is friction-free. This skill is the compressed checklist; `HARNESS.md` at the repo root is the long-form reference (full snippets, edge cases, rationale). Load `HARNESS.md` the first time any snag actually bites — don't pre-load it.

## 0. Read the load-bearing docs

In order, at session start:

1. `AGENTS.md` — the cross-agent rulebook. Read in full. Pay attention to: Git workflow, Constant process pipeline, Decision graph workflow, Guardrails.
2. `SYSTEMS_MAP.md` — where things live and what changes together.
3. `.pi/skills/task/SKILL.md` — the per-type execution paths you'll follow.
4. `.deciduous/` — `deciduous nodes` to see recent decisions; sync with teammates if any are in flight (`deciduous events rebuild`, then `deciduous sync` at session end).

Don't load any of these again unless they signal drift — suede assumes the agent reads once at session start and operates from memory.

## 1. The three harness invariants

These hold in every suede fork under pi. Internalize them; checking for them costs more than following them.

### Worktree for any multi-commit work

Branch from latest `origin/main` in a worktree under `.worktrees/<type>-<slug>/`. Branching in the main repo is for one-line state changes only. AGENTS.md "Git workflow" carries the full wording; this is the operational form:

```bash
git fetch origin
git worktree add .worktrees/<type>-<slug> -b <type>/<slug> origin/main
```

### `git -C`, never `cd && git`

The bash tool runs each invocation in a fresh shell. `cd worktree && git rebase --continue` operates on the worktree _for that single call only_; the next call starts back in the main repo. Every cross-directory operation uses `git -C`:

```bash
git -C .worktrees/<type>-<slug> rebase --continue
git -C .worktrees/<type>-<slug> push -u origin <type>/<slug>
```

Reserve `cd … && cmd` for cases where the entire single bash call operates in that directory from start to finish.

### `GIT_EDITOR=true`

Set at the top of any bash that might invoke `git rebase --continue/abort/skip`, `git rebase -i`, or interactive `git commit`. Stdin isn't a TTY in the harness; the editor (vim) sees an empty buffer; the operation aborts on empty message. This one variable alone prevents a multi-hour stall:

```bash
export GIT_EDITOR=true
GIT_EDITOR=true git -C .worktrees/<type>-<slug> rebase --continue
```

Per-call form when export isn't worth it: `git -c sequence.editor=true -c core.editor=true rebase --continue`.

## 2. Operational snags (compressed)

Six patterns a prior session hit. Each is a single-line fix once you know. Full snippets and edge cases in `HARNESS.md`.

| Snag | One-line fix |
|---|---|
| `cd && git` "looks like" it persisted | It didn't. Use `git -C <path>` for cross-dir ops. |
| Rebase editor stalls the harness | `export GIT_EDITOR=true` upfront. |
| `git reset --hard` is blocked | Use `--soft`/`--mixed`; rewind a published commit via a fresh branch. |
| `git push --force` (incl. `--force-with-lease`) is blocked | `git push origin --delete <branch>` then `git push -u origin <branch>`. |
| `rm -rf` is blocked | Plain `rm` for files; `git worktree remove --force` for worktrees. |
| `gh pr merge --delete-branch-remote` is a fake flag | The flag is `--delete-branch`. |
| Modify/delete rebase conflict (`deleted by us, modified by them`) | `git add <file>` + `rebase --continue`. Recreate from scratch if tangled > 2 commits. |
| Markdown lint auto-fixes on file write | Always re-read the file after the tool reports an auto-fix; never trust disk. |

If any of these bite for real, load `HARNESS.md` for the full recipe.

## 3. Task startup recipe

```bash
# 1. Get to latest main
git fetch origin
git status                              # clean tree

# 2. Worktree (mandatory for any multi-commit work)
git worktree add .worktrees/<type>-<slug> -b <type>/<slug> origin/main

# 3. Export the editor guard
export GIT_EDITOR=true

# 4. Work — read AGENTS.md + the relevant skill, then act.
#    Use `git -C .worktrees/<type>-<slug>` for every git op against the worktree.

# 5. Push, PR, merge (merge is human-only unless the user explicitly overrides)
git -C .worktrees/<type>-<slug> push -u origin <type>/<slug>
gh pr create --base main --head <type>/<slug> \
  --title '<type>(<scope>): <subject>' \
  --body-file /tmp/pr-body.md
gh pr merge <num> --merge --delete-branch

# 6. Cleanup
git worktree remove --force .worktrees/<type>-<slug>
git worktree prune
git branch -d <type>-<slug>             # already deleted by --delete-branch, but defensive
```

## References

- `HARNESS.md` — long-form harness reference (this skill's parent doc).
- `AGENTS.md` "Git workflow" — the worktree rule, branch-from-latest-main, no-merge-to-main.
- `/skill:task` — the per-type execution paths.
- `/skill:slice-brief` — slice-brief production for vertical-slice handoff.
- `/skill:decision-graph` — mandatory logging (real-time; Node Flow Rule).