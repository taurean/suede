# Suede process bootstrap

## Task

Design and bootstrap the Suede process layer for this template repo. Deliverables: cross-agent `AGENTS.md` (replaces `CLAUDE.md`), `agent-notes/` with a task template, `.opencode/skills/task-lifecycle/` end-of-task skill, fold `stack.md` content into `AGENTS.md`, and initial git commit.

## Decisions

- Process backbone is a custom unified shape (one chronological note per task, written at task end), not the full Superpowers spec/plan flow. Ceremonial overhead didn't match user's "passively focused on plans" stance.
- `stack.md` content folded into a `## Stack` section of `AGENTS.md`; option-picking reference tables (D1 vs Postgres, ATProto OAuth vs Better Auth) dropped from the repo — those are picking guides for the user, not rules for the agent.
- Notes directory named `agent-notes/`, not `notes/` or `journal/`. Explicit about purpose.
- Plan files live at `agent-notes/plans/<slug>.md`, written at task end from a plan-mode conversation, never auto-loaded. Mitigates accidental context pull.
- Task note template sections: Task, Decisions, Actions, Files touched, Verification, Follow-ups / stubs. Always created, regardless of task size. Verbosity scales with size.
- One in-repo skill ships: `task-lifecycle`. Cross-cutting skills (brainstorming, TDD, debugging, etc.) stay in global plugin install.
- Test plan section in plans is a single list of justified tests; "what we're not testing" is agent-internal, not documented.
- AGENTS.md is always in context — no "read first" step in the skill.
- Drop the formal spec artifact (no `docs/superpowers/specs/`) and the formal implementation plan file. Plan lives in chat, then gets executed.

## Actions

- Designed the system across five sections: layout, AGENTS.md content, task template, task-lifecycle skill, day-in-the-life.
- Created `agent-notes/` and `.opencode/skills/task-lifecycle/` directories.
- Wrote `AGENTS.md` (52 lines) with stack, layout, authoring boundaries, task-lifecycle pointer, guardrails, verification commands.
- Wrote `agent-notes/0000-00-00-00-task-template.md` (21 lines) with the per-task form.
- Wrote `.opencode/skills/task-lifecycle/SKILL.md` (17 lines) with the end-of-task steps and rules.
- Overwrote `README.md` (3 lines) to point at `AGENTS.md`.
- Removed `stack.md` — content was folded into `AGENTS.md`'s Stack section.
- Verified `.gitignore` excludes `.env` / `.env.*` while allowing `.env.example`.
- Committed as `chore: bootstrap Suede process — AGENTS.md, agent-notes template, task-lifecycle skill`. Five files changed, 92 insertions, 274 deletions.

## Files touched

- `AGENTS.md` — created
- `agent-notes/0000-00-00-00-task-template.md` — created
- `.opencode/skills/task-lifecycle/SKILL.md` — created
- `README.md` — overwritten (boilerplate → Suede blurb)
- `stack.md` — deleted
- `agent-notes/2026-06-03-01-suede-process-bootstrap.md` — created (this note)

## Verification

- `git status` — working tree clean
- `git log --oneline -5` — three commits: gitignore, init, process bootstrap
- File existence check: all four created files present with correct content; `stack.md` confirmed absent
- `.gitignore` review: `.env` and `.env.*` excluded, `.env.example` explicitly allowed

## Follow-ups / stubs

- The "option-picking" reference content dropped from the repo (database options, auth options tables) could live in a personal notes location if you want it preserved. Currently no home for it.
- When Suede is duplicated into a new project, this very note + the `init` template files come along. If you want a "clean on duplicate" mechanism (e.g., a script that strips `agent-notes/`), that could be a future task.
- No test for the process itself. The system is documentation, not code.
