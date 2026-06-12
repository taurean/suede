# consolidate-agent-instructions

## Task

Consolidate the suede agent-instructions layer and make the *constant process pipeline* explicit. The user kicked this off with a question about which skills/agents apply to what (writing tests, problem → PRD → issue → build → fixing, tagging), with the explicit goal of producing a process that "should be the same every time" regardless of project shape. Worked through the design in conversation via `/grill-me` (three Q&A rounds), then built.

## Decisions

- **Process is constant, details vary.** The 11-stage pipeline (concept → grill → PRD → issues → triage → build → diagnose → review → QA → release → handoff) ships to every suede fork. What varies is the *details* — issue tracker, branch convention, version policy, which global skills apply, triage label vocabulary. Captured this in AGENTS.md's new "Constant process pipeline" section and in `suede-kickoff` Step 3 Thread B.

- **`suede-kickoff` Step 3 reframed as a `/grill-me` session, two threads.** Thread A captures the project (name, purpose, primary user, project shape, first version, load-bearing facts). Thread B captures process-layer customizations (tooling keep/rip, then an open-ended "what process details does this fork need to tailor"). The agent does **not** propose file edits in Step 3 — it produces a plan, not a diff. Step 8 turns the plan into a diff. The follow-up task note is the lead vehicle for that diff.

- **The pipeline I wrote is wrong; the pipeline the skills already describe is right.** My first Q1 response invented a 4-stage pipeline (concept → grill → PRD → issues → build). The user caught that it omitted QA and PR review. The actual shape, as documented in `grill-me` / `to-prd` / `to-issues` / `triage` / `tdd` / `diagnose` / `review` / `qa` / AGENTS.md Releases / `handoff`, is 11 stages with an always-on supporting layer. Working from the source-of-truth skills (not my own summary) prevents the same mistake in future forks.

- **Design-stage skills added to Working style.** The previous Working style listed 8 skills (the "build" + "wraparound" set) and missed `grill-me`, `to-prd`, `to-issues`, `triage`. The new Working style is bucketed by pipeline stage (design / build / wraparound) and references the pipeline section as the canonical source.

- **Task flow `During` step now references the pipeline section, not its own partial skill list.** Previously the During step listed 8 skills inline; the new version points at the pipeline section. Single source of truth.

- **`work.md:13` "hooks will BLOCK" claim is wrong; fixed.** The actual `require-action-node.ts` plugin writes a reminder to `.deciduous/plugin.log` and returns — it does *not* block. The original intent (block on missing node) was softened to a nag because blocking corrupts the TUI, but the docstring wasn't updated. Fixed the wording in both `work.md:13` and the "Why This Matters" section. Same plugin is in `post-commit-reminder.ts` — same fix shape applies.

- **`build-test.md` rewritten for the suede stack.** Stock deciduous content with `cargo build && cargo test` and Rust test categories. Replaced with the pnpm + Vitest + svelte-check + Storybook command set, and a "Why this isn't cargo" section pointing at the 2026-06-04-01 task note that originally flagged the misalignment.

- **Did NOT touch the other four stock commands** (`decision.md`, `decision-graph.md`, `document.md`, `recover.md`, `sync.md`, `sync-graph.md`, `serve-ui.md`). They have similar drift (Cargo examples in `decision.md`, ghost `require-documentation.sh` hook references in `document.md`, "the user is watching the graph live" pressure in `recover.md`) but they're not in the user's stated scope ("process pipeline + tagging + test guidance"). Out of scope; can land in a future `chore(opencode): suede-ize stock commands` task.

- **Did NOT fix the `deciduous sync` boundary ambiguity** (one task note ran it, another didn't). The user didn't ask, and the right call depends on the eventual multi-user story, which is also out of scope.

- **Did NOT introduce a branch-naming convention.** The repo has `chore/` and `feat/` and `fix/`-flavoured names; the user said the process is constant but didn't commit to a specific convention. A future consolidation pass can make this call.

## Actions

- Branched `chore/consolidate-agent-instructions` from `main` (was up to date; tip is `49f6184 chore(release): cut 2026.6.5`, tag `2026.6.5` present).
- Logged goal node 109 (verbatim user prompt, two follow-up prompts appended).
- Logged action node 110, linked to goal 109 (edge 123).
- Updated `.opencode/skills/suede-kickoff/SKILL.md`:
  - Step 3 renamed "Interrogate the human" → "Grilling session" and split into Thread A (project) and Thread B (process-layer customizations). Open-ended Q8 replaces the prior fixed bucket of questions.
  - Step 8 decision list reordered: "process-layer edits" decision list leads; "runtime-layer edits" follows.
  - Three new Rationalizations rows added to the table (decide-for-them on process tweaks, plan-only-runtime, write-code-in-Step-3).
- Updated `AGENTS.md`:
  - New `## Constant process pipeline` section after Layout. 11-stage table with skill + when-to-load columns. Always-on supporting layer (decision graph, task notes, git workflow, authoring boundaries) listed below.
  - Working style rewritten: opens with "The Constant process pipeline section above is the canonical reference" and is now bucketed by pipeline stage (design / build / wraparound). `grill-me`, `grill-with-docs`, `to-prd`, `to-issues`, `triage`, `improve-codebase-architecture`, `find-skills` added.
  - Task flow `Start` step 4: replaced "use Zed plan mode" with "load `grill-me` (stage 2 of the Constant process pipeline) and grill until the human approves a direction."
  - Task flow `During` step 2: replaced the inline 8-skill list with a reference to the pipeline section, plus explicit pointers to `improve-codebase-architecture`, `handoff`, `caveman`, `write-a-skill` (which the old list missed or was implicit).
- Updated `.opencode/commands/work.md`:
  - Line 13: "hooks will BLOCK" → "plugins will nag to `.deciduous/plugin.log` (they don't block)".
  - "Why This Matters" first bullet: same fix shape.
- Rewrote `.opencode/commands/build-test.md` from stock deciduous (cargo + Rust) to suede defaults (pnpm + Vitest + svelte-check + Storybook). 76 lines.
- `pnpm prettier --write` on the three files I touched that had pre-existing drift (AGENTS.md, suede-kickoff/SKILL.md, work.md); `build-test.md` was already prettier-clean.
- Verified: `pnpm check` (0/0), `pnpm test` (5 files, 10 tests, all pass), `pnpm lint` (3 fewer warnings than baseline — the 4 files I touched now match repo style).

## Files touched

- `AGENTS.md` — new "Constant process pipeline" section; rewritten Working style; updated Task flow Start + During steps.
- `.opencode/skills/suede-kickoff/SKILL.md` — Step 3 grilling reframed with Thread A/B; Step 8 decision list split; 3 new Rationalizations rows.
- `.opencode/commands/work.md` — fixed the "hooks will BLOCK" misclaim.
- `.opencode/commands/build-test.md` — rewritten for the suede stack (was stock cargo).
- `agent-notes/2026-06-11-01-consolidate-agent-instructions.md` — this file.

## Verification

- `pnpm check` — pass. `svelte-check found 0 errors and 0 warnings`. `wrangler types` up to date.
- `pnpm test` — pass. 5 files, 10 tests, 0 errors, 2.72s.
- `pnpm lint` — partial. 4 fewer prettier warnings than the `main` baseline (AGENTS.md, suede-kickoff/SKILL.md, work.md were on the warning list before; now clean). 34 remaining warnings are pre-existing drift on `main` (stock deciduous commands, stock plugins, storybook demo content, agent-notes from prior tasks). Out of scope for this change; matches the prior task notes' "pre-existing prettier failures not a regression" stance.

## Follow-ups / stubs

- **The other 8 stock deciduous commands are still un-suede-ified.** `decision.md` has Cargo examples and a "Multi-User Sync" section that doesn't apply to a single-human project. `document.md` references a `require-documentation.sh` hook that doesn't exist. `recover.md` has "the user is watching the graph live" pressure language. `sync.md` and `sync-graph.md` assume a multi-user setup. A future `chore(opencode): suede-ize stock commands` task can clean these up — but the user's stated scope was "process pipeline + tests + tagging", and that's what this task touched.
- **Branch-naming convention not enforced.** The repo has `chore/`, `feat/`, `fix/`-flavoured names by convention but no rule. A future pass can add the rule to AGENTS.md and to `suede-kickoff` Thread B (so each fork can pick its own).
- **`deciduous sync` boundary not resolved.** The archaeology note (2026-06-04-02) ran `deciduous sync`; the kill-superpowers note (2026-06-05-05) explicitly didn't. AGENTS.md Releases doesn't say who runs it. Local-only sync (no remote push) is unambiguously the agent's; the question is whether the agent does it on every PR handoff or only on demand. Out of scope here; a follow-up task can pin this down.
- **No `setup-matt-pocock-skills` integration.** The Matt Pocock skills (`to-prd`, `to-issues`, `triage`, `qa`, `review`) reference `docs/agents/issue-tracker.md` for the project's issue-tracker config. Suede doesn't have that file. A suede fork that keeps GitHub as the tracker should `pnpm dlx setup-matt-pocock-skills` (or whatever the entrypoint is) during its `chore/suede-kickoff` follow-up. Worth capturing in the kickoff skill as a Thread B prompt.
- **`suede-kickoff` skill frontmatter `description` still ends in a workflow summary.** The writing-skills CSO rule says "Use when..." with trigger conditions only, no workflow summary. The current description (lines 3-4) does have a "Use when" lead and trigger list, but it also describes what the skill does. Acceptable for now; can be tightened in a follow-up.
- **The `## Decision Graph Workflow` section in AGENTS.md is still stock deciduous** (~260 lines, largely overlapping with the `~/.opencode/commands/decision.md` content). It works, but a future pass could deduplicate by either (a) thinning the AGENTS.md section to a pointer at the command, or (b) deleting the command and keeping the AGENTS.md section. Out of scope here.
- **AGENTS.md's `Working style` now has 15 skill names** in the in-context reference (up from 8). This is a tradeoff: more discoverable, but slightly more context weight. The user's stated priority was "always work the same way... the more familiar I become, the faster I can move" — the cost is real but the familiarity dividend is bigger. If context weight becomes a problem, a future pass can compress back to 8 by moving the design-stage list behind a "see pipeline section" pointer.
