# process-updates

## Task

Update the Suede process layer with two changes: (1) introduce a Git workflow rule (branch from main, PR review, no direct pushes), (2) drop Sentry, Axiom, OpenCode, and Claude Code from the explicit stack mentions in AGENTS.md.

## Decisions

- New "## Git workflow" section in AGENTS.md covers the rule in three bullets: branch from main, PR review, no direct push. Kept terse — it's a guardrail, not a tutorial.
- Stack line trimmed to the technologies only; tools-that-were-decided and LLM-tooling dropped per user preference.
- Task-lifecycle skill expanded with a "## Before starting" section. The skill now covers both ends of a task — start (branch setup) and end (note + verification). Renamed the end-of-task section header to "## Steps at task end" for clarity.
- Branch name: `chore/process-updates`. Conventional-commits-ish prefix; user hasn't formalized a convention yet.
- **Refinement after first commit:** the Git workflow rule was made explicit — "The agent never pushes directly to `main` and never merges to `main`. The human reviews the PR and merges." Drops the previous ambiguous "Merge only after PR passes" wording. The agent hands back; merge is a human decision.
- **Refinement:** the task note ownership was made explicit in AGENTS.md's "Task lifecycle" section — "The agent owns the task note — create it at task end without being asked." Reinforced in the skill's Rules.
- **Refinement:** the human remains the commit author for all commits (including agent-made ones). Agent-made commits add a `Co-authored-by: opencode <noreply@opencode.ai>` trailer to credit assistance. The trailer format and commit step are now explicit in the skill's "Steps at task end" and the Git workflow section of AGENTS.md.

## Actions

- Created branch `chore/process-updates` from `main` (no remote configured yet, so `git pull` step skipped — main is the local source of truth).
- Edited `AGENTS.md`: removed "Sentry + Axiom · OpenCode (primary) / Claude Code (fallback)" from the Stack line; added a new "## Git workflow" section between Stack and Layout.
- Rewrote `.opencode/skills/task-lifecycle/SKILL.md`: added "## Before starting" with the branch-setup steps; renamed end-of-task section to "## Steps at task end"; added a "PR + merge per AGENTS.md" line to Rules.

## Files touched

- `AGENTS.md` — edited (stack line, added Git workflow section)
- `.opencode/skills/task-lifecycle/SKILL.md` — edited (added Before starting section)
- `agent-notes/2026-06-03-02-process-updates.md` — created (this note)

## Verification

- `git status` — clean working tree on `chore/process-updates`
- `git branch` — confirms we're on the feature branch, not main
- File content re-read on both edited files (during edit) — confirmed correct

## Follow-ups / stubs

- No git remote is configured yet. PR step is on the user: set a remote, push the branch, open the PR, merge after review. The bootstrap commit (`5a9fda9`) was made directly on `main` before this rule was in place — that's a one-time historical exception, not a pattern.
- Branch naming convention is not standardized. If the user wants a strict convention (e.g., `type/short-slug` from conventional commits), that's a future task.
