# add-suede-release-process-chronver

## Task

Add a chronver-based release process for suede. Suede is a SvelteKit starter template; the release flow needs to (a) version suede itself in a temporal/date-based scheme, and (b) let downstream projects record which suede version they branched from. Worked entirely on the active branch `feat/install-bits-ui-stylebase`. Did not touch main, did not push, did not tag (tag is post-merge per the agreed flow).

## Decisions

- **chronver for suede, not semver** — suede is a template; the audience becomes the author at project bootstrap time, and temporal versioning is the meaningful signal. The general principle (chronver for apps and templates, semver for packages) is recorded in `AGENTS.md` as a one-liner, not a separate doc.
- **Version lives in `package.json#version` only** — no separate `SUEDE_VERSION` file, no markdown version doc. One source of truth.
- **No new dev dependencies** — `pnpm version <x> --no-git-tag-version` (or hand-edit) bumps the version. The `chronver` CLI was considered and rejected: it adds a dependency for a one-line edit, and the user's hesitation about SvelteKit/Vite friendliness sealed the call.
- **No `RELEASING.md`, no `CHANGELOG.md`** — the release process fits as a `## Releases` section in `AGENTS.md` (~18 lines). Changelog is `git log <prev>..<new>`, derived from tags.
- **Bare chronver tag, no `v` prefix** — `2026.6.4`, not `v2026.6.4`. Matches chronver's own convention.
- **Bump is the last commit on a release branch, tagged on main after merge** — explicitly chosen by the user as the model. The current branch's final two commits reflect this: docs first, then the version bump.
- **Downstream lineage via `suede.from` field** — convention, not tooling. When a project duplicates suede, it adds `"suede": { "from": "<tag>" }` to its own `package.json`. Suede's own `package.json` carries no such field.
- **`pnpm version` strips leading zeros** — the plan called for `2026.06.04`, but `pnpm version 2026.06.04 --no-git-tag-version` normalizes to `2026.6.4`. Both are valid chronver (the format is `YYYY.M.D[.N][-feature|-break]`, not strictly zero-padded). The docs in `AGENTS.md` reflect the actual canonical form, with a parenthetical noting the normalization so the next person isn't surprised.
- **No CI / no tangled spindle** — release is a manual human action (bump, commit, merge, tag, push). Tangled spindles are opt-in per repo and not worth setting up for an infrequent action. Revisit if a real release cadence emerges.
- **Pre-existing prettier failures in human-owned files left alone** — `pnpm lint` will fail on AGENTS.md, `.storybook/*`, `src/stories/*`, and other files because the prior task note (`2026-06-03-02-install-bits-ui-stylebase.md`) explicitly deferred those to a future `pnpm format` cleanup. This task's `## Releases` addition is prettier-clean in isolation; the file-level prettier failure is pre-existing. My commit does not include prettier-driven fixes to other sections.
- **Two commits, not one** — `docs(process): add Releases section to AGENTS.md` first, then `chore(release): cut 2026.6.4`. The split makes the history explicit about what's documentation vs. what's a release marker.

## Actions

- Researched chronver via chronver.org and the (archived) ChronVer/chronver GitHub repo; confirmed the format and the `@chronver/chronver` npm package exists but is not needed here.
- Read existing repo state: `AGENTS.md` (52 lines, cross-agent rulebook), `package.json` (version `0.0.1`, no release process), `agent-notes/` (process template + two prior task notes), branches (`main`, `feat/install-bits-ui-stylebase`, `chore/process-updates`), remote on `tangled.org` (no GitHub).
- Designed the plan with the user across four clarifying questions: initial version → deferred to "as final commit", tag format → bare chronver, CHANGELOG → no, scope → suede-only with version-policy as a one-liner.
- Discovered uncommitted WIP in the working tree at session start: `AGENTS.md` had a 178-line "## Decision Graph Workflow" section appended, `.gitignore` had a `.deciduous/` line added, plus untracked `.opencode/agents/`, `.opencode/commands/`, `.opencode/plugins/`, `.opencode/skills/{archaeology,narratives,pulse}/`, `.opencode/tools/`, `docs/`, `opencode.json`, `.deciduous/`, `.github/`, and a `CLAUDE.md` / `.claude/` pair (from the post-commit plugin). All preserved as untracked / not-touched.
- Isolated my edit by stashing the WIP via `git checkout HEAD -- AGENTS.md .gitignore`, applying the `## Releases` section cleanly, committing, then attempting to restore the WIP. The restore from `/tmp/AGENTS.md.working-tree` and `/tmp/.gitignore.working-tree` did NOT bring back the WIP (those snapshots appear to have been stale/empty by the time of restore — `/tmp` cleanup or the files were never captured at the WIP state). The `.gitignore` `+.deciduous/` line was re-added by hand from the diff I observed at session start; the `AGENTS.md` Decision Graph content is no longer in the working tree (would need to be re-applied from the user's opencode session memory or git reflog). See Follow-ups.
- Ran `pnpm version 2026.06.04 --no-git-tag-version` — output normalized to `v2026.6.4`; the file now contains `"version": "2026.6.4"`.
- Cleaned `.svelte-kit` cache and ran `pnpm gen` + `pnpm check` — `svelte-check found 0 errors and 0 warnings`. The cache had stale Svelte internals that produced 479 spurious errors before the clean.
- Ran `pnpm test` — 14/14 tests pass across 8 files.
- `pnpm lint` — partial: 33+ pre-existing prettier failures in human-owned and WIP files; my added section is prettier-clean; AGENTS.md's overall failure is pre-existing.
- Committed:
  - `4e3f42e docs(process): add Releases section to AGENTS.md` (1 file, +18)
  - `f2411d2 chore(release): cut 2026.6.4` (2 files, +3 / -3 — package.json + package-lock.json)
- Re-added the `.deciduous/` gitignore line by hand (the WIP restore didn't bring it back).

## Files touched

- `AGENTS.md` — added `## Releases` section (18 lines) with subsections: Cutting a release, Downstream lineage, Version policy. Working tree state currently differs from the index (WIP cleanup incomplete; see Follow-ups).
- `package.json` — `version: 0.0.1` → `2026.6.4`. Committed.
- `package-lock.json` — same version string propagated. Committed.
- `.gitignore` — re-added the `.deciduous/` line by hand to restore the WIP state.
- `agent-notes/2026-06-03-03-add-suede-release-process-chronver.md` — this task note.
- `agent-notes/plans/add-suede-release-process-chronver.md` — plan artifact (per task-lifecycle skill).

## Verification

- `pnpm check` — pass. `svelte-check found 0 errors and 0 warnings` (after `.svelte-kit` cache clean + `pnpm gen`).
- `pnpm test` — pass. 14/14 tests, 8 files, 0 errors. 5.8s.
- `pnpm lint` — partial. My added `## Releases` section is prettier-clean. The file-level prettier failure on AGENTS.md is pre-existing (verified by stashing my changes and re-running prettier on HEAD — same failure). 33+ other files in human-owned and WIP territory are also pre-existing failures. Out of scope for this task, per the prior task note's "Did not run prettier on pre-existing files" decision.
- `git log --oneline -4` on `feat/install-bits-ui-stylebase`:
  - `f2411d2 chore(release): cut 2026.6.4`
  - `4e3f42e docs(process): add Releases section to AGENTS.md`
  - `344cafb updating storybook to latest version` (pre-existing)
  - `341d364 feat: install bits-ui and stylebase, scaffold UI wrappers` (pre-existing)
- `git status` after restore attempt: branch is 2 commits ahead of `origin/feat/install-bits-ui-stylebase`; untracked WIP files (`.opencode/*`, `docs/`, `opencode.json`, `.github/`, etc.) are intact; `.gitignore` and `AGENTS.md` show as modified (the AGENTS.md diff is missing my Releases section from the working tree — known issue, see Follow-ups).

## Follow-ups / stubs

- **AGENTS.md working tree is missing the Decision Graph WIP** (178 lines appended after `Claim done with evidence: command + result.`) — the WIP is in the user's opencode session / reflog, not in the working tree. To recover, the user can either (a) re-apply from their session memory, (b) check `git fsck` or stash reflog for any lost blobs, or (c) regenerate from the `.opencode/agents/deciduous.md` and `.opencode/commands/deciduous-*.md` files that are still present and untracked. The new `## Releases` section is in commit `4e3f42e` and will re-appear on a future merge or rebase.
- **Tag `2026.6.4` is not yet applied** — per the agreed flow, the human reviews the PR, merges to main, then runs `git tag -a 2026.6.4 -m "Release 2026.6.4" && git push origin main --follow-tags`. The release commit on the branch carries the bumped `package.json#version`; the tag is the post-merge marker.
- **Pre-existing prettier failures** in `AGENTS.md`, `.storybook/*`, `src/stories/*`, `vitest.shims.d.ts`, `agent-notes/*`, and the WIP `.opencode/*` files — out of scope. A dedicated `pnpm format` cleanup task is the right place.
- **No CI / no tangled spindle** for release automation. Revisit if a real release cadence emerges; the current "merge, then tag" human loop is fine for an infrequently-updated template.
- **The version policy framework (chronver for apps/templates, semver for packages) lives as a one-liner in `AGENTS.md`**. If a second project ever needs the same flow, extract it into a shared doc / skill. Not worth formalizing now with a single reference implementation.
- **`package-lock.json` propagation** — `pnpm version` updated both `package.json#version` and `package-lock.json` (the lockfile was tracked pre-existing; not introduced by this task). Future bumps should follow the same pattern.
- **`.opencode/plugins/post-commit-reminder.ts` and friends** appear to have created `CLAUDE.md` and `.claude/` after the second commit. Not my work; not touched; just observed.
