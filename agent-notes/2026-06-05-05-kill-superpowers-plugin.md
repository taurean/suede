# kill-superpowers-plugin

## Task

Remove the `superpowers` plugin from the global opencode config and update
`AGENTS.md` to cover the gap with a "Working style" section that points at
the user's `~/.agents/skills/` ecosystem and notes the Zed plan/build mode
toggle. Done-when: plugin reference gone from `~/.config/opencode/opencode.jsonc`,
`AGENTS.md` lists the eight process skills, lint/check/test outcomes captured.

## Decisions

- **Kill superpowers wholesale, not prune.** A near-full overlap with
  `~/.agents/skills/` exists (`tdd` ≈ `test-driven-development`, `diagnose` ≈
  `systematic-debugging`, `review` ≈ `requesting/receiving-code-review`,
  `write-a-skill` ≈ `writing-skills`). The unique superpowers value
  (using-superpowers as a dispatcher, brainstorming as design dialogue) is
  replaced by Zed's plan/build mode toggle and an explicit "load only when
  clearly applies" rule in AGENTS.md.
- **One-line Zed mention in AGENTS.md.** The human drives the toggle; the
  agent follows the active mode. No need for a longer explanation.
- **"Working style" lives between Authoring boundaries and Task lifecycle.**
  Pairs "who owns what" with "how the agent approaches work" before the
  suede-specific task flow.
- **Skills list is the eight that came up in the design discussion**, not
  every skill in `~/.agents/skills/`. The rest stay discoverable.

## Actions

- Edited `~/.config/opencode/opencode.jsonc` to remove the `plugin` array
  (only entry was the superpowers npm spec). File now:
  `{ "$schema": "...", "shell": "zsh" }`.
- Edited `AGENTS.md` to add a "Working style" section (17 lines) between
  Authoring boundaries and Task lifecycle.
- Deciduous: goal 97 → action 98 (config edit) → action 99 (AGENTS.md edit)
  → outcome 100, all linked.
- `deciduous sync` not run — agent does not push or sync on the user's
  behalf. See follow-ups.

## Files touched

- `~/.config/opencode/opencode.jsonc` — removed `plugin: ["superpowers@..."]`
- `AGENTS.md` — added "Working style" section (17 lines, lines 37-52 in new file)

## Verification

- `pnpm lint` — **FAIL** (pre-existing). 35 files have prettier issues on
  `main` (`git stash` confirmed). AGENTS.md was already failing prettier
  before this change. Not a regression from this work.
- `pnpm check` — **PASS** (svelte-check 0 errors, 0 warnings; wrangler types
  up to date).
- `pnpm test` — **PASS** (5 files, 10 tests, 4.57s).

## Follow-ups / stubs

- **User must quit and restart opencode** for the plugin removal to take
  effect — config is loaded once at startup.
- Branch `chore/kill-superpowers-plugin` is ready for human review/commit.
  Suggested commit: `chore(config): remove superpowers plugin + add working style
to AGENTS.md` with `Co-authored-by: opencode <noreply@opencode.ai>` trailer.
- Preexisting prettier issues across the repo are a separate cleanup task;
  out of scope here.
