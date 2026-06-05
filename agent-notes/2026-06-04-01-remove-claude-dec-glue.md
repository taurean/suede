# remove-claude-dec-glue

## Task
Remove the Claude-Code-specific artifacts (`CLAUDE.md`, `.claude/` tree) that the deciduous installer wrote into the suede repo root. Verify that all substantive content is already mirrored in `.opencode/` or `AGENTS.md`. Fix one Claude-path reference that leaked into an OpenCode-side file.

## Decisions
- Delete `CLAUDE.md` and the entire `.claude/` directory — both are Claude-Code-only integration glue (hook settings, Claude-flavor commands/skills/hooks), and all substantive content is already in `.opencode/` (commands, skills, plugins, tools) and `AGENTS.md` (Decision Graph Workflow section).
- Keep the `.gitignore` lines for `CLAUDE.md` and `.claude/` (defensive — prevents a future `deciduous update` from polluting git).
- Fix `.opencode/commands/decision.md:258` to point at `.opencode/` instead of `.claude/` so the example is correct for this project's layout.
- Leave the stock `deciduous` content alone (no `task-lifecycle` skill regeneration, no edits to `.opencode/{agents,plugins,tools}`).

## Actions
- Surveyed `.opencode/`, `.claude/`, `CLAUDE.md`, `AGENTS.md`, and `.gitignore` to map every Claude-specific artifact to its OpenCode/suede equivalent.
- Deleted `suede/CLAUDE.md` (290-line deciduous-managed block — superseded by `AGENTS.md` "Decision Graph Workflow" section).
- Deleted `suede/.claude/` (agents.toml, settings.json, commands/, skills/, hooks/) — content mirrored in `.opencode/{commands,skills,plugins,tools,agents}` and `AGENTS.md`.
- Edited `.opencode/commands/decision.md:258` — changed example `git add .claude/commands/decision.md` to `git add .opencode/commands/decision.md` to match suede's layout.

## Files touched
- `CLAUDE.md` — deleted
- `.claude/` — deleted (full tree: agents.toml, settings.json, commands/, skills/, hooks/)
- `.opencode/commands/decision.md` — line 258 path example corrected

## Verification
- `ls -la suede/ | grep -i claude` — no matches
- `ls suede/.claude suede/CLAUDE.md` — both: No such file or directory
- `grep -rn "claude|\.claude|CLAUDE" suede/.opencode/` — no matches
- `grep -n "Decision Graph Workflow" suede/AGENTS.md` — still present (full section)
- `git status` — no new untracked files from this work; existing untracked `.opencode/*` and `opencode.json` are unchanged

## Follow-ups / stubs
- `deciduous update` will likely re-create `CLAUDE.md` and `.claude/` on next run (by design in the deciduous installer). The defensive `.gitignore` lines prevent that from reaching git, but the files will reappear on disk. If regen suppression is wanted, that's a deciduous-side flag or a post-install cleanup hook — separate task.
- `.opencode/commands/build-test.md` uses `cargo build && cargo test` (stock deciduous template). Suede is pnpm + Vitest, not Rust. Not Claude-related, but the command is misaligned with this project. Out of scope here; flag for a future "suede-ize stock deciduous commands" task.
- The `## Decision Graph Workflow` section currently in `AGENTS.md` was recovered from a prior session's WIP (per the 2026-06-03-03 task note's follow-up). Confirmed it's intact.
