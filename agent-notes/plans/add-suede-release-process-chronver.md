# Suede release process (chronver) — plan

## Goal

Add a chronver-based release process to suede. Version lives in `package.json`. Tags are bare chronver strings. Downstream projects record lineage via a `suede.from` field in their own `package.json`. Worked on the active branch `feat/install-bits-ui-stylebase`; did not touch main, did not push, did not tag.

## Approach

1. Add a `## Releases` section to `AGENTS.md` documenting the process, the version policy, and the downstream lineage convention. ~18 lines.
2. Bump `package.json#version` from `0.0.1` to `2026.6.4` (today's date in chronver format; `pnpm version` normalizes leading zeros).
3. Commit in two steps: docs first (`docs(process): ...`), then the release marker (`chore(release): cut 2026.6.4`).
4. Tag and push are post-merge, performed by the human as part of the PR review and merge.

## Alternatives considered

- **chronver CLI as a devDependency** — rejected. Adds a dependency for a one-line edit; the user expressed hesitation about SvelteKit/Vite friendliness; `pnpm version` does the same job natively.
- **Separate `RELEASING.md` doc** — rejected. The process is short enough to live in `AGENTS.md` as a section; the user noted they didn't know what else `RELEASING.md` would be good for.
- **`CHANGELOG.md`** — rejected. `git log <prev>..<new>` is the canonical changelog; no extra file to maintain.
- **A separate `SUEDE_VERSION` file or `suede.from` field in suede's own `package.json`** — rejected. Suede is the origin, not a derivative. The `suede.from` convention lives only in downstream projects.
- **Generalized cross-project release standard** — deferred. The version-policy framework (chronver for apps/templates, semver for packages) is recorded as a one-liner in `AGENTS.md`. A fuller standard can be extracted later once there's a second project to test it against.
- **Tangled spindle for release automation** — deferred. Manual merge-then-tag is fine for an infrequently-updated template; revisit if cadence picks up.

## Files anticipated

- `AGENTS.md` — add `## Releases` section.
- `package.json` — bump `version` field.
- `package-lock.json` — version string propagation (auto, not authored).
- `agent-notes/2026-06-03-03-add-suede-release-process-chronver.md` — task note.

## Test plan

- `pnpm check` — pass after `.svelte-kit` cache clean + `pnpm gen`.
- `pnpm test` — pass (no test changes; 14/14 baseline).
- `pnpm lint` — partial; the new section is prettier-clean in isolation; pre-existing failures in human-owned and WIP files are out of scope.
- `git log --oneline -4` shows the two new commits at the tip of `feat/install-bits-ui-stylebase`.

## Acceptance criteria

- `AGENTS.md` has a `## Releases` section covering: cutting a release, downstream lineage, version policy.
- `package.json#version` reads `2026.6.4`.
- Branch ends with `docs(process): add Releases section to AGENTS.md` followed by `chore(release): cut 2026.6.4`.
- No new dev dependencies, no new files (other than task note + this plan), no CI changes.
- `pnpm check` and `pnpm test` pass.
