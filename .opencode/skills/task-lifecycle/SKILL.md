# Task lifecycle

End-of-task skill. Run after the work is done, before claiming completion.

## Steps

1. If a plan was generated in this conversation, persist it to `agent-notes/plans/<slug>.md` (Goal, Approach, Alternatives, Files anticipated, Test plan, Acceptance criteria). Slug matches the task note.
2. Copy `agent-notes/0000-00-00-00-task-template.md` to `agent-notes/YYYY-MM-DD-NN-<slug>.md`. **Always.** No skip-step.
3. Fill all sections from the work just done. Size scales with task; trivial tasks get short notes.
4. Run verification per AGENTS.md, fill `## Verification` with results.
5. Hand back with a one-line summary and a pointer to the note file.

## Rules

- Task notes are records, not scratchpads. Fill at end, not during.
- Plan files in `agent-notes/plans/` are write-only at task end. Do not read them as part of starting a task.
- AGENTS.md is always in context. Do not re-read it.
