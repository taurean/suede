@AGENTS.md

Claude Code reads `CLAUDE.md`, not `AGENTS.md`; this file exists only to import it via the `@AGENTS.md` line above, so AGENTS.md stays the single source of truth. `.claude/skills/` and `.claude/commands/` are symlinks into `.pi/skills/` and `.pi/prompts/` — same content, no separate copy to keep in sync.
