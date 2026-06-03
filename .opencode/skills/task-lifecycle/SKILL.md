# Task lifecycle

Run at the start of a task (branch setup) and at the end (note + verification).

## Before starting

1. Pull latest `main`: `git pull origin main` (or `git fetch` + rebase if `main` has moved).
2. Create a new branch from `main`: `git checkout -b <branch-type>/<slug>`.
3. Do the work. Apply other skills (TDD, debugging, code review) as relevant.

## Steps at task end

1. If a plan was generated in this conversation, persist it to `agent-notes/plans/<slug>.md` (Goal, Approach, Alternatives, Files anticipated, Test plan, Acceptance criteria). Slug matches the task note.
2. Copy `agent-notes/0000-00-00-00-task-template.md` to `agent-notes/YYYY-MM-DD-NN-<slug>.md`. **Always.** No skip-step.
3. Fill all sections from the work just done. Size scales with task; trivial tasks get short notes.
4. Run verification per AGENTS.md, fill `## Verification` with results.
5. Commit the work. Add a `Co-authored-by: opencode <noreply@opencode.ai>` trailer to the commit message. The human is the author; the trailer credits agent assistance.
6. Hand back with a one-line summary and a pointer to the note file.

## Rules

- Task notes are records, not scratchpads. Fill at end, not during.
- Plan files in `agent-notes/plans/` are write-only at task end. Do not read them as part of starting a task.
- AGENTS.md is always in context. Do not re-read it.
- All work happens on a feature branch, not `main`. PR + merge per AGENTS.md.
- The agent hands back at task end; it does not merge to `main`. The human reviews the PR and merges.
