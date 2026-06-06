# add-task-flow

## Task

Add an explicit task flow section to AGENTS.md that consolidates the rules
already scattered across the file (Authoring boundaries, Working style,
Releases, Decision Graph) into one Start / During / End sequence the
agent can follow turn-by-turn. The procedural detail continues to live at
`.opencode/skills/task-lifecycle/SKILL.md`; AGENTS.md gets the in-context
summary.

## Decisions

- **Replace, don't add.** The existing "Task lifecycle" section was a
  one-line pointer to a skill. Subsume it into the new "Task flow" section
  so there's one canonical location.
- **Three phases: Start, During, End.** Matches the natural rhythm of
  git work (branch → work → release). Keeps the section scannable.
- **No new flowcharts.** The superpowers skills leaned on dot/graphviz
  diagrams; a numbered list is more useful as a turn-by-turn checklist
  and lighter in context.
- **Restored the version-bump-final-commit rule.** Adding the new section
  in a commit after the existing `chore(release): cut 2026.6.5` would
  violate the rule we just added. Reset the version bump commit, added
  this section, re-applied the version bump as the final commit. Branch
  now diverges from origin by SHA; human can resolve with a force-push
  if the new structure is preferred.

## Actions

- Replaced "## Task lifecycle" with "## Task flow" (37 lines added,
  3 lines removed) in AGENTS.md.
- `git reset --soft HEAD^` to uncommit the version bump, kept the
  version files and new task note in the working tree.
- Committed the AGENTS.md change as `docs(agents): add Task flow section`.
- Re-committed the version bump as `chore(release): cut 2026.6.5`.
- Deciduous: goal 105 → action 106 → outcome 107, all linked.
- Node 104 (the previous outcome node) was deleted and re-created as 107
  with the new commit SHA, because deciduous doesn't support updating
  the commit on an existing node.

## Files touched

- `AGENTS.md` — added Task flow section, removed old Task lifecycle pointer.
- `package.json` — version bump `2026.6.4` → `2026.6.5` (unchanged from
  previous turn; re-applied).
- `package-lock.json` — version sync (re-applied).
- `agent-notes/2026-06-05-06-cut-first-official-version.md` — re-applied
  (unchanged content).

## Verification

- `pnpm check` — pass (0 errors, 0 warnings).
- `pnpm test` — pass (5 files, 10 tests).
- `pnpm lint` — pre-existing prettier issues on `main`; not a regression.
- `git diff` on `package.json` shows only the version field changed.

## Follow-ups / stubs

- **Local branch diverges from origin by SHA.** The previous version bump
  commit (`e78f801`) on `origin/chore/kill-superpowers-plugin` is
  semantically equivalent to the new one (`6ad9243`) but has a different
  SHA because the new docs commit was added before the version bump.
  Resolution: `git push --force-with-lease` from local to align origin.
  Or, alternatively, drop the force-push and let the PR review happen
  against the local branch.
- After the human merges, the merge commit on `main` is tagged
  `2026.6.5` (annotated) and pushed with `--follow-tags`. First suede
  tag.
