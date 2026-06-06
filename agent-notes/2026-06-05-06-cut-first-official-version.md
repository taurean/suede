# cut-first-official-version

## Task

Cut the first official suede version (2026.6.5) using the chronver release
process documented in AGENTS.md. Add a Versioning rule to AGENTS.md that
codifies the principle: every release branch ships as its own version. The
previous version (2026.6.4) had no annotated tag; this is the first one
tagged through the formal flow.

## Decisions

- **First release is on the same branch as the Working style change.**
  Single release branch, two commits: docs + release. Splits could be cleaner
  but the changes co-evolved and they're tiny. Squashing at merge time is
  the human's call.
- **Bump to `2026.6.5`, not `2026.06.05`.** `pnpm version` normalizes leading
  zeros per AGENTS.md.
- **Versioning rule goes in the Releases intro paragraph, not a new
  subsection.** One bold sentence plus a pointer to "Cutting a release" is
  enough. The mechanics already say "final commit is `chore(release): cut
  <version>`" — the rule just elevates the principle.

## Actions

- `pnpm version 2026.6.5 --no-git-tag-version` — bumps `package.json#version`.
- Will commit as `chore(release): cut 2026.6.5` per AGENTS.md, with the
  new task note.
- After merge, human tags the merge commit on `main` with bare `2026.6.5`
  and pushes with `--follow-tags`. Out of scope for the agent (push/merge
  are the human's).

## Files touched

- `AGENTS.md` — added "Working style" section (from previous turn) and
  Versioning rule sentence in the Releases intro (this turn).
- `agent-notes/2026-06-05-05-kill-superpowers-plugin.md` — task note from
  previous turn, now committed.
- `package.json` — version bump `2026.6.4` → `2026.6.5`.
- `agent-notes/2026-06-05-06-cut-first-official-version.md` — this file.

## Verification

- `pnpm check` — see previous turn (was passing).
- `pnpm test` — see previous turn (was passing; no test changes).
- `pnpm lint` — pre-existing prettier issues on `main`; not a regression.
- `git diff` on `package.json` shows only the version field changed.

## Follow-ups / stubs

- **Human merges to `main`, then tags the merge commit `2026.6.5` (annotated)
  and pushes with `--follow-tags`.** This is the first suede tag. The
  task-lifecycle rule about Co-authored-by trailers applies to commits
  only; tags are the human's.
- Subsequent release branches follow the same flow: every branch ready
  to be reviewed and merged = a new version.
