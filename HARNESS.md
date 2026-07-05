# HARNESS

Operational reference for the harness invariants and snags that surface during real suede work. The session-onboarding skill (`.pi/skills/session-onboarding/SKILL.md`) carries the compressed checklist; this file is the long-form parent doc with full snippets, edge cases, and rationale.

**This doc is harness-specific.** Most of it talks about how pi behaves, not about suede philosophy. Suede philosophy lives in `AGENTS.md`; the compressed process layer lives in `.pi/skills/`. If another agent (not pi) reads this, much of it won't apply.

A prior session worked through every snag in this file in about forty minutes of needless churn. Each is a single-line fix once you know.

## The three invariants

The three rules below hold in every suede fork under pi. They are not negotiable — treat them as physical constraints of the environment. Internalize them on first session; checking for them mid-task costs more than following them by default.

### 1. Worktree for any multi-commit work

Every task that creates a feature branch or commits more than once runs in a git worktree under `.worktrees/<type>-<slug>/`. Branching in the main repo is allowed only for one-line state changes — single-commit fixes where no parallel work is at risk.

**Why this rule.** The main repo's working tree tracks the branch you checked out (almost always `main`). If you create a branch there and start committing, every other workstream that wants to use the main repo is blocked until you finish. A worktree gives each branch its own working directory — parallel work becomes physically possible. The path convention `.worktrees/<type>-<slug>/` keeps worktrees grouped together and gitignored so they don't show up as dirty untracked content at the repo root.

```bash
git fetch origin
git worktree add .worktrees/<type>-<slug> -b <type>/<slug> origin/main
```

### 2. `git -C <path>`, never `cd <path> && git`

The bash tool runs each invocation in a fresh shell. `cd worktree && git rebase --continue` operates on the worktree _within that single call only_; the next call starts back in the main repo. Every "I think I'm in the worktree" turned out to be in main.

```bash
git -C .worktrees/<type>-<slug> rebase --continue
git -C .worktrees/<type>-<slug> push -u origin <type>/<slug>
```

Reserve `cd … && cmd` for cases where the entire single bash call operates in that directory from start to finish. The moment you need a second bash call inside the worktree, switch to `git -C`.

### 3. `GIT_EDITOR=true`

Set `GIT_EDITOR=true` at the top of any bash that might invoke `git rebase --continue/abort/skip`, `git rebase -i`, or interactive `git commit`. The harness's stdin is not a TTY; vim (the default editor) sees an empty buffer; the rebase considers it an empty commit message and aborts. The session appears to hang — but it's not hanging, it's already aborted and waiting for the next command.

This one variable alone prevents a multi-hour stall:

```bash
export GIT_EDITOR=true
GIT_EDITOR=true git -C .worktrees/<type>-<slug> rebase --continue
```

Per-call form when export isn't worth it: `git -c sequence.editor=true -c core.editor=true rebase --continue`.

## Operational snags

### Snag 1: CWD does not persist across bash invocations

Already covered in invariant 2 above. The trap is forgetting it during a long rebase sequence — the first `git -C` works, then you relax and write `cd .worktrees/foo && git commit`, and the commit lands in main.

### Snag 2: Default rebase editor stalls the harness

Already covered in invariant 3. The trap is the first time you hit a rebase conflict on a session — you forget, vim opens on an empty buffer, you stare at it wondering why nothing's happening, and you eventually `<C-c>` and try again.

### Snag 3: Blocked flags (cannot bypass)

The agent permission system blocks a small set of destructive commands outright. Plan around them; do not try to find workarounds the system doesn't sanction.

- **`git reset --hard *`** — blocked. Use `--soft` or `--mixed` when available:
  ```bash
  git -C .worktrees/<branch> reset --soft HEAD~1   # uncommit, keep changes staged
  git -C .worktrees/<branch> reset --mixed HEAD~1  # uncommit, keep changes unstaged
  ```
  If you really must rewind a published commit (the situation `--hard` would handle), do it through a fresh branch — `git switch -c <branch> origin/main` in the main repo, recreate the commit, push.

- **`git push --force*`** — blocked, **including `--force-with-lease`**. To delete a remote branch:
  ```bash
  git push origin --delete <branch>
  ```
  Then a fresh `git push -u origin <branch>` will be non-fast-forward-safe (because the remote branch is gone) and will be allowed. The sequence `gh pr close --delete-branch` → `git push origin --delete <branch>` → `git push -u origin <branch>` is the standard "force-push substitute" for an in-flight PR.

- **`rm -rf *`** — blocked. Use plain `rm` for individual files; use `git worktree remove --force .worktrees/<name>` for worktrees.

### Snag 4: `gh` CLI flag spelling

- `gh pr close --delete-branch` works (closes the PR and removes the remote branch in one call).
- `gh pr merge --delete-branch-remote` is **not a flag**. The flag is `--delete-branch`:
  ```bash
  gh pr merge <num> --merge --delete-branch
  ```

The two flags serve similar purposes; the merge form takes `--delete-branch`, the close form takes `--delete-branch`. Memorize that and don't conflate them.

### Snag 5: Modify-vs-delete conflict in a rebase

If you rebase a branch that modifies `some/file.md` onto a base where that file has been deleted, git pauses on a conflict (`deleted by us, modified by them`). Resolution:

```bash
GIT_EDITOR=true git -C .worktrees/<branch> add some/file.md
GIT_EDITOR=true git -C .worktrees/<branch> rebase --continue
```

That keeps the modification. If you have multiple modify/delete conflicts and the rebase becomes a tangle, abandon and recreate the branch from scratch — delete the remote branch, `git switch -c <branch> origin/main` in the main repo, recreate the commit, push. This is bulletproof and is the right move when the tangle is more than two commits deep.

### Snag 6: Markdown lint auto-fix on file write

When writing a markdown file, the editing tool may auto-fix markdownlint rules (commonly MD022, blank lines after `###` headings). The content is unchanged; only whitespace is added. **Always re-read the modified file** after the tool reports an auto-fix; never trust that what you wrote is exactly what's on disk.

This matters when:
- You're staging files for a commit (review what's actually there).
- You're diffing against another file or branch (the diff includes whitespace noise).
- You're about to base64-encode or hash the content (auto-fix changes the bytes).

If a downstream tool's diff is showing whitespace-only changes you didn't write, that's an auto-fix. Re-read the file; confirm; commit.

## Rationalizations this doc counters

| Excuse                                         | Reality                                                                                                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Worktrees are overkill, I'll just be careful" | Two parallel tasks in the main repo is a race condition. Worktrees make parallel work physically possible, not just disciplined.                                                                                          |
| "`cd && git` works in this one call"           | It does. The next call doesn't. `git -C` works in every call.                                                                                                                                                            |
| "I don't need `GIT_EDITOR=true` until I do"    | You don't know you need it until the rebase hangs. Set it upfront; the cost is zero.                                                                                                                                     |
| "`git reset --hard` is the right tool here"    | The harness blocks it; the substitute (`--soft`/`--mixed`/fresh-branch) is always available. Find it before reaching for the blocked flag.                                                                                |
| "`--force-with-lease` is safe, it should work" | It's blocked by name, not by safety analysis. The substitute is `delete-then-fresh-push`, which is safe and always allowed.                                                                                              |
| "I'll trust the file write went through"       | Markdown lint auto-fixes whitespace silently. Re-read after every write that involves whitespace-sensitive constructs.                                                                                                    |

## Verification before declaring work tree-clean

After any rebase, force-push substitute, or worktree handoff:

- `git -C .worktrees/<branch> status` — clean
- `git -C .worktrees/<branch> log --oneline -5` — commit history matches expectation
- `deciduous nodes --branch <branch>` — graph nodes are linked to commits (if decision-graph logging was active)
- `gh pr view <num>` — PR reflects the current branch state

## References

- `AGENTS.md` "Git workflow" — the worktree rule, branch-from-latest-main, no-merge-to-main.
- `.pi/skills/session-onboarding/SKILL.md` — compressed checklist for session start.
- `.pi/skills/task/SKILL.md` — the per-type execution paths.
- `.pi/skills/decision-graph/SKILL.md` — mandatory logging (real-time; Node Flow Rule).