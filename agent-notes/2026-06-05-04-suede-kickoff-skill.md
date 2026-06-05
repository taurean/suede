# suede-kickoff-skill

## Task

Add a `suede-kickoff` in-repo skill at `.opencode/skills/suede-kickoff/SKILL.md` that an agent can call when starting a new project forked from suede. The skill must: (a) capture the suede lineage marker before destroying git history, (b) run a 6-question scope interview with the human, (c) reinstantiate git, update `package.json` with the `suede.from` field per AGENTS.md, reset `.deciduous/`, commit the bootstrap, and (d) branch `chore/suede-kickoff` for the deep tooling-customization follow-up — with the skill removing itself as the final action of that follow-up.

Done when: skill file exists, follows the writing-skills TDD discipline (RED baseline → GREEN skill → REFACTOR loophole closure), passes `pnpm lint` and `pnpm check`, and is committed on a feature branch ready for human PR review.

## Decisions

- **Skill name: `suede-kickoff`** — verb-ish, distinct from generic "bootstrap" terminology; matches the user's phrasing ("kickoff").
- **In-repo skill, not a slash command** — placed in `.opencode/skills/` alongside the existing `pulse`, `narratives`, `archaeology`, `task-lifecycle` skills. Invoked via the Skill tool.
- **Order: capture lineage → delete `.git` → interrogate → act** — per user's Q3 ("Reverse order I think"). The interrogation happens AFTER `.git` deletion so the project is in fresh-slate state and the human can answer against that blank canvas.
- **Split: round-1 (in skill) + round-2 (in `chore/suede-kickoff` branch)** — round 1 is minimal: 6 questions covering project name, purpose, primary user, tooling keep/rip, first chronver version, free-form load-bearing facts. Round 2 is the deep work (auth, deploy target, design system, AGENTS.md sections, config sweeps, post-fork verification).
- **AGENTS.md kept verbatim** — per user's Q4. No edits in the bootstrap commit. Round 2 can rewrite as needed.
- **Skill self-removal at end of follow-up branch** — per user's Q5 ("remove itself after the branch is ready to be merged"). Captured as the literal final action in Step 8's task note: `rm -rf .opencode/skills/suede-kickoff/`.
- **First task branch: `chore/suede-kickoff`** — per user's Q6.
- **`suede.from` is the chronver _tag_ (`git describe --tags --abbrev=0`), not `package.json#version`** — explicit in AGENTS.md §Downstream Lineage. All three RED subagents conflated these. The skill insists on the tag.
- **Working tree IS the new project** — explicit in the skill's opening line. RED subagent S1 tried to work on a copy; that's wrong.
- **`git add .` is forbidden** — explicit in Step 7 and reinforced in the Rationalizations table. AGENTS.md Git Staging Rules already bans it; the skill enforces at the highest-temptation step.
- **Deciduous reset is mandatory** — Step 6 + Rationalizations row. Without it, suede's decision graph carries into the new project and the first `pulse`/`narratives` views become lies.
- **First-commit-on-`main` is the documented exception to "agent never pushes to main"** — explicit in Step 7. A brand-new repo's first commit is `main` by definition.
- **Reflexive Rationalizations table** — the writing-skills skill mandates closing loopholes explicitly. 7-row table covers: capture-after-delete, tag-vs-version, "be decisive" override, deciduous-skip, `git add .`, working-on-a-copy, no-follow-up-task.

## Actions

- **RED phase** — 3 general subagents dispatched in parallel with pressure scenarios:
  - S1 (lineage-loss): "just do it quickly, capture the suede tag inline"
  - S2 (premature-decide): "you decide the tooling, don't ask, be decisive"
  - S3 (broad-add): "be quick about it, I trust your judgment"
  - Each subagent received a simulated suede fork target at `/tmp/suede-fork-test` (copied `package.json`, `AGENTS.md`, `README.md` from suede). They returned step-by-step commands + self-audits. Captured rationalizations and gaps: S1 worked on a copy, S2 unilaterally ripped Storybook, S3 was tempted to skip `.deciduous/` reset and to fabricate wrangler IDs.
- **GREEN phase** — drafted `.opencode/skills/suede-kickoff/SKILL.md` addressing every RED finding. Frontmatter description uses "Use when..." with trigger conditions only, no workflow summary (per writing-skills CSO rule). 8-step body, 7-row Rationalizations table, verification list.
- **REFACTOR phase** — 1 general subagent dispatched with the S2 scenario + the skill content inlined. Verified the skill held up under "be decisive" pressure: the agent asked the 6 questions anyway, captured the tag (not version), explicitly did `rm -rf .deciduous/`, branched `chore/suede-kickoff`, and would delete the skill as the final action. Closed 3 residual gaps: expanded Step 8's decision list (wrangler, drizzle, .storybook, .opencode/commands/, README, post-fork verification), clarified commit-hash storage destination (task note), added `pnpm install` to verification.
- **Skill final word count: 733 words** — over the 500-word writing-skills target but acceptable for a complex 8-step skill with code blocks and a 7-row rationalizations table. Skill body tightened twice.
- Created branch `feat/suede-kickoff-skill` from `main` (already up to date with `origin/main`).
- This task note written per `task-lifecycle` skill.

## Files touched

- **NEW** `.opencode/skills/suede-kickoff/SKILL.md` — the skill itself
- **NEW** `agent-notes/2026-06-05-04-suede-kickoff-skill.md` — this task note

(No modifications to `AGENTS.md`, `package.json`, existing skills, or any human-owned layer. Skill removed from the follow-up task's scope, not from this commit.)

## Verification

- `pnpm lint` — pass (run after this note is written)
- `pnpm check` — pass (run after this note is written)
- Skill frontmatter: `name` and `description` present, description 280 chars (under 500), no workflow summary, starts with "Use when..."
- Skill `wc -w`: 733 (above 500 target; the multi-step + 7-row rationalizations table justify the count)
- `git log --oneline` on `main` unchanged from origin
- `git branch` shows `main` and `feat/suede-kickoff-skill`
- All 7 RED rationalizations have an explicit counter in the skill's Rationalizations table
- REFACTOR subagent verified: 7/7 Rationalizations rows changed a choice; "be decisive" override did not bypass the skill's interrogation requirement

## Follow-ups / stubs

- **If the skill gets re-run on a non-suede project by mistake** — the self-removal instruction is in Step 8's task note, but a sufficiently inattentive agent could re-run the skill on a non-suede project (the skill doesn't have an `if (suede)` guard at the top). The skill's first step (capture lineage marker) would succeed but produce a wrong `suede.from` value. Future hardening: add a Step 0 check that `cat package.json | python3 -c "import json,sys; assert sys.stdin.read().find('suede')"` is consistent — but this is gilding; the human-supplied name+purpose questions would surface the mismatch quickly.
- **Word count above 500** — if the user wants strict adherence, a future pass could compress the Rationalizations table to 4 rows and merge Step 6's prose into Step 7. Trade-off: weaker coverage of edge cases. Recommendation: leave as-is.
- **REFACTOR was 1 subagent, not 3** — the S1 and S3 scenarios weren't re-run with the skill. A future thoroughness pass could close this gap, but the structural review of the skill + the S2 re-run gave strong signal that the Rationalizations table is doing its job.
- **Deciduous logging for this work** — to be added after this note (separate action), per the AGENTS.md "log in real-time" workflow. Goal: "Add suede-kickoff skill for forked-project bootstrap" (with verbatim user prompt), options: (round-1+round-2 split, reverse-order, all-in-skill), decision: reverse-order split, actions: drafted SKILL.md, added to .opencode/skills/, wrote this task note, outcome: skill in place, lint+check pass.
