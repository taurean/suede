# Building with suede

There is one sentence that, if you internalize it, makes most of the rest of this post obvious: **the point of a software project is to make the next change cheaper than the last one.** Every convention, every tool, every "you must do X before Y" rule in suede is a mechanism for that. Suede is a SvelteKit starter template that ships with an opinion about how software gets built. The opinion is the point. The Svelte is incidental.

If you've joined a suede-shaped project — or you've forked suede to start a new one — this post is the field guide. It assumes you can read Svelte and TypeScript. It does not assume you've worked in a project that treats the _process_ of building software as something worth being deliberate about. By the end of it you should be able to read `AGENTS.md` without confusion, write a PR a reviewer will thank you for, push back on a teammate who's about to merge a 2,000-line PR, and explain to a more junior developer why "the test passed" is not, by itself, evidence that anything works.

The post is long. It's also organized so you can read it section by section; each one ends with a single line — the _one thing_ — that survives if you forget everything else.

## 1. The stack in 90 seconds

Suede ships three things. You'll use all three, but the third is the one that ages well.

**A runtime stack.** SvelteKit for the web framework. Cloudflare Pages and Workers for the edge runtime. D1 (Cloudflare's SQLite-at-the-edge) for the database, accessed through Drizzle as the query builder and schema layer. Vitest for unit and integration tests. Playwright for end-to-end tests, run both in CI and against a local dev server. Storybook for visual + interaction tests of UI primitives, driven by Playwright under the hood. stylebase and Bits UI for styling and headless component primitives. pnpm as the package manager.

You don't need to know all of these on day one. You need to know the seams: a SvelteKit `+page.svelte` renders UI, a `+page.server.ts` `load` function is the seam between UI and data, Drizzle queries are the seam between server code and D1, and the route's HTTP endpoint is the seam between your code and the network. Every test, every review, every architectural conversation in suede happens at one of those seams. We'll get to that.

**A process.** A pipeline with a happy path — concept, grill, PRD, issues, triage, build, review, release — plus a set of skills you load _when they're triggered_ (`diagnose`, `qa`, `handoff`, and a few wraparound ones). The pipeline is the same for a 2-day prototype and a 2-year production app; what changes is the artifacts. A prototype has no PRD file and no tracker; a production app has both, plus the `deciduous` decision graph running in real-time and a closed issue as the durable record of each unit of work.

**A role for the agent.** A coding agent that reads `AGENTS.md` at the start of every task and follows the rules. The agent is excellent at the parts of software that are _tireless_ — writing tests, refactoring, searching the repo, capturing the user's verbatim prompt, running the TDD loop without fatigue, walking the test-prune checklist. The agent does not merge to `main`, make aesthetic calls about Svelte markup, sign off on a release, or independently influence production in any way without the human's explicit contextual permission. The human owns every gate between code and production. The agent may push branches and apply release tags — both are agent-OK — but only the human drives the merge button. The split is deliberate and we'll come back to it.

There is also a load-bearing boundary between human and agent authorship that you'll see referred to throughout suede's docs: **humans own Svelte markup, scoped CSS, and design tokens. Agents own `<script lang="ts">` blocks, `*.ts` files, Drizzle schemas and queries, and server routes.** When a human pushes back on how a component _looks_, the agent doesn't have a stake in that fight. When an agent refactors a query, the human doesn't have to re-litigate the design. The boundary exists so the two roles can disagree without colliding.

**The one thing:** the stack is replaceable. The process and the role for the agent are not. Most of this post is about the process.

## 2. Seams: the load-bearing concept you can't see

A _seam_ is a place in the code where two concerns meet. It can be a function boundary, a network call, a database query, a UI event handler, a CLI flag, a public API. The shape of your software is the shape of its seams — full stop. Not the shape of its modules, not the shape of its folder structure, not the shape of its class hierarchy. The shape of the _places where you can insert a test, a probe, a debugger, a swap-out, or a swap-in_.

If you internalize one architectural idea from this post, make it this one.

Junior engineers read "good architecture" and think _modules, layers, design patterns_. Senior engineers read it and think _where can I put a test? where can I put a breakpoint? where could I swap a real database for a fake one without rewriting the call site?_ Architecture, in the sense that actually matters day-to-day, is the topology of seams.

**The highest-seam rule.** When you test a feature, push the test as _high_ in the system as it can go. A test that drives a real HTTP request through a real SvelteKit route to a real D1 database catches more bugs than a test on the click handler. The TDD skill calls this "public-interface behaviour only." Restated as a senior engineer would: **test through the seam that the user actually crosses.**

There is a real limit to this. A "does the page render the user's todos" test that goes through HTTP-D1-render is also slow, brittle, and probably flaky in CI. The senior-engineer move is to test at the highest seam _that still gives you a fast, deterministic signal_. For most business logic, that's a function that takes inputs and returns outputs — the function is the seam, the test goes through the seam, and the rest of the system is wired up in one integration test that proves the wiring is correct. You don't need to re-prove the wiring in every test.

**Adding seams on purpose.** When a feature has no good seam — business logic is tangled into a server route, a Drizzle query, and a UI event handler all at once — the fix is not "write more tests." The fix is "introduce a function that does the work, then test that function." A five-line extraction can be the difference between a regression-testable feature and a flaky one. The function is the seam; the test goes through it.

**Three seams, three test homes, same feature.** A Suede todo app has a "mark complete" button. The feature touches three layers: a Svelte click handler, a SvelteKit form action that mutates the database, and a Drizzle `update` query. There are three seams and three correct test homes:

- _Click handler fires the form action_ — a Svelte component test with the form action mocked. The seam is the component boundary.
- _The Drizzle query updates the right row_ — a unit test on the query function, run against a local D1 fixture. The seam is the database boundary.
- _The user sees the row marked complete in the UI_ — a Playwright test that hits the route, clicks the button, and asserts on the rendered HTML. The seam is the network boundary.

The same feature, three seams, three test homes. None of the three replaces the others. The unit test catches a query regression. The component test catches a wiring regression. The Playwright test catches a "the button doesn't actually do anything" regression. **The senior-engineer move is to write the test at the seam that would have caught the bug you're trying to prevent.** If you don't know which seam that is, start at the network boundary and work down only if the higher seam can't reach the bug.

**The one thing:** when you don't know where to test, start at the seam closest to the user, work down only if the higher seam can't reach the bug.

## 3. The pipeline: stages, skills, and what each one buys you

Suede's process has a happy path and a set of "load when triggered" skills. The happy path is the stages that fire for almost every bug, feature, or update. The triggered skills are the ones you reach for only when something specific happens — a hard bug, a user describing a problem conversationally, context running out, a question that needs a prototype before it has a real answer. Don't load skills by vibe; load them by stage.

### The happy path

These are the stages that fire for almost every unit of work:

1. **Concept / problem.** The pipeline starts when a problem, a feature, a bug report, or a "this is broken" lands in conversation. You don't load a skill; you just notice that the pipeline has started.
2. **Grill.** `~/.agents/skills/grill-me`. An open-ended interview, one question at a time, with a recommended answer attached to each. The point is not to slow you down; the point is to find the assumptions you didn't know you were making. "Add a settings page" assumes there's a `User` model. "Add a settings page" assumes the auth middleware already exists. "Add a settings page" assumes you mean a single-user app and not a multi-tenant one. The grill surfaces those assumptions. The fork, `grill-with-docs`, grills _against_ the existing domain model — `CONTEXT.md`, ADRs, the project's ubiquitous language — and updates those documents inline as decisions crystallize. Use that one when the codebase has opinions. Load the grill whenever the concept is fuzzy, the requirements are in tension, or a non-trivial decision is being made.
3. **PRD.** `~/.agents/skills/to-prd`. Synthesises the conversation into a document with seven sections: problem statement, solution, user stories, implementation decisions, testing decisions, out of scope, further notes. The PRD's job is to _stop people from building the wrong thing_. We'll get into the shape of a good PRD in §6.
4. **Issues.** `~/.agents/skills/to-issues`. Break the PRD into tracer-bullet vertical slices. Each slice is a thin cut through _every_ layer end-to-end. Each slice is independently demoable. Each slice is ideally AFK-able — an agent can pick it up and ship it without a human in the loop. We'll get into the shape of a good issue in §5.
5. **Triage.** `~/.agents/skills/triage`. Move issues through a state machine: `needs-triage` → `ready-for-agent` / `ready-for-human` / `wontfix`, with `needs-info` as a detour and `bug` / `enhancement` as category labels. The tracker is GitHub Issues.
6. **Build.** `~/.agents/skills/tdd` plus `.opencode/skills/tdd-supplementary/`. Vertical-slice RED → GREEN → REFACTOR. Public-interface behaviour only. One test, then one implementation, then repeat. _Never_ write all tests, then write all code — that's horizontal slicing and produces tests that pass on broken code. The supplementary skill adds the prune pass and the Storybook discipline. We'll get into the details in §7.
7. **Review.** `~/.agents/skills/review`. Two-axis PR review — Standards (does the code follow the repo's documented standards?) and Spec (does the code match the originating issue?). The two axes run in parallel sub-agents and report side by side. Review fires for every PR that lands. We'll get into the shape of a good review in §9.
8. **Release.** In-repo (`AGENTS.md#releases`). chronver version bump as the final commit on the release branch; the human reviews the PR and merges to `main`; the merge commit on `main` gets the annotated tag. The agent may push the release branch and may apply the tag; the merge to `main` is human-only. We'll get into this in §11.

That is the pipeline. Eight stages, six of which load a skill. Stages 1 and 8 are mechanical (a problem appeared; a release shipped). Stages 2 through 7 each have a defined skill and a defined output. The pipeline compresses for a 2-day prototype: no PRD file, no tracker, no labels. The stages still happen; the artifacts don't.

### Skills to load when triggered

The happy path is what fires for most work. Some things happen only sometimes, and the skills for them are not "default on" — you reach for them when the situation matches.

- **`diagnose`** (`~/.agents/skills/diagnose`) — when the build hits a hard bug, a performance regression, or a non-deterministic failure. Discipline: _reproduce → minimise → hypothesise → instrument → fix → regression-test_. Phase 1 (build a fast, deterministic feedback loop) is most of the work. We'll get into the details in §11.
- **`qa`** (`~/.agents/skills/qa`) — when the human reports a bug conversationally. The user says "this feels slow on mobile" and the agent files a durable GitHub issue with reproduction steps, expected vs actual, and a clear severity. The bug is the user _describing_ a problem, not an engineer _guessing_ at one. QA is not a default stage — it fires when the human is the source of the report, not when an automated test or a code review surfaces the bug.
- **`handoff`** (`~/.agents/skills/handoff`) — when context is running out and a fresh session needs to pick up. Compacts to the OS temp dir, not the workspace. Distinct from a PR description: the PR description is the durable record of _what shipped_; a handoff is the pickup doc for _what's next_.
- **`prototype`** (`~/.agents/skills/prototype`) — when the design question needs code to answer it. Throwaway code that resolves a state-machine or UI question before you commit to an approach.
- **`improve-codebase-architecture`** (`~/.agents/skills/improve-codebase-architecture`) — when a `diagnose` pass flags structural debt worth a deliberate refactor.
- **`write-a-skill`** (`~/.agents/skills/write-a-skill`) — when the process itself needs capturing into a reusable skill.
- **`find-skills`** (`~/.agents/skills/find-skills`) — when the human asks for a capability that may already exist as a skill.
- **`caveman`** (`~/.agents/skills/caveman`) — terse mode, ~75% token drop. Use when the human asks.

### The always-on layer

None of those stages is "the always-on layer." The always-on layer runs throughout: the `deciduous` decision graph, the git workflow, the authoring boundary.

- The decision graph is goal → options → decision → actions → outcomes, real-time, every commit linked. Closed issues and merged PRs are the durable record of work.
- The git workflow is branch from `main`, never branch off an in-flight branch, the agent never merges, `Co-authored-by: opencode` trailer on agent-made commits.
- The authoring boundary is humans own presentation, agents own TS.

None of these is a stage. All of them are running while you do the stages.

**The one thing:** load the skill the stage needs, not the one that sounds like the work you're doing.

## 4. The decision graph: why every commit has a parent

Suede tracks project decisions through `deciduous`, a small CLI that lives at `.deciduous/`. The model is a typed graph:

- `goal` — a high-level objective. _"User can mark a todo complete."_
- `option` — a possible approach. _"Use a SvelteKit form action."_
- `decision` — the chosen approach. _"Use a form action with progressive enhancement."_
- `action` — something implemented. _"Added the form action and the Drizzle update."_
- `outcome` — the result of the action. _"Mark-complete works in browser and on the server-rendered fallback."_
- `observation` — a finding. _"D1's prepared statements don't support UPSERT; we need to do a SELECT first."_
- `revisit` — a pivot. _"Reconsidering the optimistic-update strategy after the QA bug."_

The flow is strict: `goal → options → decision → actions → outcomes`. Observations attach anywhere. **Goals do not lead directly to decisions** — there must be options first. A "decision" with no options is just an action wearing a costume.

**Why a graph and not a journal?** A journal is append-only. A graph is _navigable_. Six months from now, "why did we pick Drizzle over Prisma?" is one search away, with the actual options that were on the table, the actual reason they were rejected, and the actual commit that shipped the choice. The graph is durable institutional memory; the journal is a pile of notes.

**Why "verbatim user prompts" matters.** A summary of "user wants auth" is useless to a future agent trying to recover context. "User said, _I need login with email + Google OAuth, JWTs with refresh rotation, and the existing session middleware should be untouched_" is recoverable. The `--prompt-stdin` flag exists for multi-line pastes; use it. The user prompt is the _raw material_ of the goal node; everything downstream of the goal is interpretation of that material.

**What to log and what not to log.** Log the _user's_ project decisions: what they're building, choosing, accomplishing. Don't log _your_ internal process: reading files, planning, running tests, checking git log. The rule of thumb: if a node describes something that would go on a project timeline or in a PR description, log it. If it describes your reading-and-thinking, don't. The `deciduous` plugin that nags you to log a node before editing is a guardrail, not a gate — it writes a reminder to `.deciduous/plugin.log` and the edit still goes through. Same for the post-commit reminder to link the commit. Treat the nags as guardrails, not gates.

**The minimum workflow.** Before writing code:

```bash
deciduous add goal "Mark-complete action" -c 90 --prompt-stdin <<EOF
User said: I need a button on each todo row that marks it complete.
The row should update without a full page reload. Optimistic UI is fine.
EOF
```

Before each major edit:

```bash
deciduous add action "Add the markComplete() Drizzle query" -c 85 -f "src/lib/server/todos.ts"
deciduous link <goal_id> <action_id> -r "Implementation step"
```

After each commit:

```bash
deciduous add outcome "markComplete() updates D1 and returns the new row" -c 95 --commit HEAD
deciduous link <action_id> <outcome_id> -r "Implementation complete"
```

`deciduous sync` at task end, before the PR is opened.

**The one thing:** log the _option_ before you log the _decision_. A decision with no options is an action in a wig.

## 5. Writing issues (and what "good" looks like)

An issue is a _contract_ between a triage label (`ready-for-agent`) and the agent who will pick it up. A vague issue is a contract that can't be enforced. A precise issue is a contract that the agent can fulfil without six rounds of "wait, what did you mean by…"

**The slice shape.** Each issue is a _vertical_ slice — a thin cut through every layer end-to-end. "Add the Drizzle schema for todos" is horizontal. "User can mark a todo complete" is vertical: schema (column added), server (form action), UI (button + optimistic update), test (Playwright flow). Vertical slices demo on their own; horizontal slices are scaffolding for a vertical slice that someone still has to write.

If you find yourself writing a horizontal issue, write the vertical one that depends on it instead. The horizontal work is what the vertical issue is _for_.

**The issue template.** The `to-issues` skill ships a four-part template that you should treat as a contract:

- _Parent_ — a reference to the parent issue (often the PRD, or a higher-level "track this work" issue). If the source was an existing issue, reference it; otherwise omit.
- _What to build_ — a concise description of the vertical slice. End-to-end behaviour, not layer-by-layer. **No file paths, no code snippets.** Both go stale in days. The exception: a prototype-produced snippet that encodes a state machine or a type shape, inlined with a "this came from a prototype" note.
- _Acceptance criteria_ — a checklist. **One criterion per checkbox.** "Works correctly" is not a criterion. "Clicking 'complete' updates the row in D1, the UI reflects the change without a page reload, and the change survives a hard refresh" is a criterion — three, actually. The test is: if a junior engineer read only the acceptance criteria, would they know when to stop?
- _Blocked by_ — the issue number(s) that must close first, or "None — can start immediately."

**User stories live in the PRD, not the issue.** "As a user, I want to mark a todo complete so I can track what I've done" is a user story. It belongs in the PRD's user-stories section, not in the issue body. The issue is a _job_; the user story is the _reason_ the job exists. If you find yourself writing "as a user, I want…" in an issue, stop and move it.

**AFK vs HITL.** A slice is AFK-able if an agent can pick it up and ship it without a human. A slice is HITL if it needs a judgement call, a design decision, a deploy, or a manual test on hardware the agent doesn't have. Mark HITL slices explicitly — the agent shouldn't burn cycles trying to do work that needs a human. The `to-issues` skill flags HITL slices in the breakdown it shows the user before publishing, and the user can re-tag any slice as HITL if they think the agent can't do it AFK.

**Quiz the user before publishing.** `to-issues` shows the proposed breakdown as a numbered list, asks for granularity feedback (too coarse / too fine), dependency feedback, and HITL/AFK feedback. Iterate until the user approves. Don't dump 14 issues into the tracker and walk away — that's a planning failure wearing a planning hat.

**The one thing:** one acceptance criterion per checklist item. "Works correctly" is not a criterion.

## 6. Drafting PRDs without wasting a day

A PRD's job is to _stop people from building the wrong thing_. Not to be exhaustive, not to be approved by committee, not to live in a wiki. To be the document that, two weeks in, the team points at and says "this is what we agreed to build."

`to-prd` ships a seven-section template. Each section has a job.

**Problem statement.** The problem from the _user's_ perspective. "I keep losing track of which todos I've done" is a problem statement. "The `todos` table has no `completed_at` column" is an implementation detail. The PRD's _Problem_ section is the former; the _Implementation Decisions_ section is the latter. Keep them in their lanes or the document will read like a tech spec, which is a different artifact with a different audience.

**Solution.** The solution from the user's perspective. "Marking a todo complete updates the row in the database and the row's appearance in the list, so I can see at a glance what I've done." The user is not asking _how_ you're going to build it; the user is asking _what they'll be able to do_. The how goes in Implementation Decisions.

**User stories.** A _long_, numbered list. "As an <actor>, I want a <feature>, so that <benefit>." The list is supposed to be extensive. The list is the PRD's most underrated section, because it forces the writer to enumerate the actors — mobile user, keyboard-only user, multi-tenant admin, the user on a flaky connection, the user on a desktop with no touch — and write a story for each. Actors you didn't enumerate are actors whose edge cases you'll discover in QA.

**Implementation decisions.** The modules that will be built or modified, the interfaces of those modules, the schema changes, the API contracts, the architectural decisions. **Do not include specific file paths or code snippets.** They may end up being outdated very quickly. The exception: a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape) — inline that snippet and note briefly that it came from a prototype.

**Testing decisions.** A description of what makes a good test for this PRD. Which modules will be tested. Prior art for the tests — similar tests in the codebase the new tests can pattern-match. The point is to _constrain_ the test approach at PRD time, before the agent picks one. "We'll test the Drizzle query in isolation against a D1 fixture" is a decision; "we'll figure out testing when we get there" is a deferral that always costs more than deciding now.

**Out of scope.** The most underrated section. "We are _not_ building offline mode in this PRD." "We are _not_ supporting sub-tasks." "We are _not_ building a bulk-complete action." Each of those is a scope-creep line item that, if not written down, will be a status-meeting argument three weeks from now. The "we are not building X" phrasing is what stops the agent from spending a week on X.

**Further notes.** Anything else. Open questions, links to design docs, names of people to consult, links to prior art. The section exists so that the _one thing you were going to forget_ has a home.

**The one thing:** spend 15 minutes on the Out-of-scope section. It's the most underwritten section and the one that prevents the most scope creep.

## 7. TDD: the discipline and the "earn their keep" rule

The TDD skill is rich and worth reading end to end. This section is the field-guide version, with the parts most teams miss.

**The core discipline.** RED → GREEN → REFACTOR, vertical slices, public-interface behaviour only, one test then one implementation then repeat. The TDD skill is explicit about this and it is worth quoting: "Code can change entirely; tests shouldn't." If a refactor breaks your test, your test was coupled to the implementation, not the behaviour. The senior-engineer version: **a good test reads like a specification, not like a coverage report.**

**The anti-pattern to avoid.** The most common failure mode in TDD is _horizontal slicing_ — write all the tests, then write all the code. This produces:

- Tests that test the _shape_ of things (data structures, function signatures) rather than user-facing behaviour.
- Tests that pass on broken code, because the tests were written before the implementation was understood.
- Tests that fail on harmless refactors, because the tests were coupled to the implementation.

The TDD skill is blunt about this: "You outrun your headlights, committing to test structure before understanding the implementation." The fix is vertical slicing — one test, one implementation, learn from it, repeat.

**Mocking at boundaries, not at collaborators.** Mock the database when the database is the seam you're testing _across_. Don't mock the database when the database is the system _under test_ — that's a tautology test. The TDD skill has a full `mocking.md` companion; the rule of thumb is "if the mock's behaviour is the thing the test would have caught a bug in, you've mocked the wrong thing."

**The prune pass — the rule most teams miss.** The global TDD skill is rich on RED → GREEN → REFACTOR but silent on what to do with the tests that _already exist_ after a slice wraps up. Two failure modes accumulate over a project's lifetime:

- **Insensitive tests** — they pass on broken code. They test a data structure shape or a private method, not user-facing behaviour. False confidence: "tests pass, so it works."
- **Brittle tests** — they fail on harmless refactors. They assert on internal selectors (`page.locator('button.suede-button')`) or mock-heavy internal collaborator contracts. The team stops trusting them, then stops running them, then deletes the whole suite.

The fix is a periodic prune pass. Walk the TDD skill's "Red flags" checklist:

- Mocking internal collaborators? → Prune (delete or replace with an integration test at a higher seam).
- Testing private methods? → Delete. Private methods are an implementation detail.
- Asserting on call counts/order? → Prune unless the call order _is_ the contract.
- Test breaks when refactoring without behaviour change? → Prune.
- Test name describes _how_ not _what_? → Rename or prune.
- Verifying through external means instead of interface? → Refactor to use the public interface.

Tests that survive the checklist earn their keep. Tests that don't get deleted **in the same commit that flagged them** — leaving a "we should clean these up" follow-up is how test debt accumulates.

The prune pass is a _commit_, not a task. The commit message starts with `chore(tests): prune` and lists what was deleted and why. The decision graph gets one action node for the pass and one outcome node per category of deletion (insensitive-deleted, brittle-deleted, renamed, kept).

**When to run a prune pass.** End of any TDD cycle where REFACTOR changed the public interface. End of a release branch, before the merge. Start of a triage/QA cycle when a flaky test is reported — flaky = either insensitive or brittle; the prune pass diagnoses which.

**The test categories in Suede.** `*.spec.ts` for Vitest unit tests (component + pure logic). `*.test.ts` for Vitest integration tests (server routes, Drizzle queries). `*.stories.svelte` for Storybook visual + interaction tests (Playwright-driven). `e2e/**` for Playwright end-to-end flows against a running dev server. Each category sits at a different seam. Picking the wrong category for a test is itself a smell — if a unit test is mocking five collaborators, the test belongs in `*.test.ts` or in `e2e/`.

**Verification before you claim done.** `pnpm check` (wrangler types + svelte-check). `pnpm test` (Vitest run). `pnpm lint` (prettier + eslint) if you touched lintable files. The post says: claim done with evidence — command + result, not "looks good to me." A PR description that lists those three commands and their results is a PR description the reviewer doesn't have to dig into.

**The one thing:** delete a test in the same commit that flagged it. "We should clean these up later" is how test debt becomes test rot.

## 8. Drafting PRs the reviewer will thank you for

The PR is a sentence, then a diff. The sentence is the title (conventional-commits format, present-tense imperative: `feat(todos): add mark-complete action`). The diff is the work. Everything in between — description, screenshots, test plan, issue reference — is _evidence that the sentence is true._

**The PR description template.** A PR description that a reviewer will thank you for has five sections, in this order:

- `## What` — one sentence, plain English, the change.
- `## Why` — one or two sentences, the problem this fixes or the capability this adds. Reference the issue with `Closes #N` so the issue auto-closes on merge.
- `## How` — a bulleted list of the non-obvious decisions. _"Used an UPSERT instead of a SELECT-then-INSERT to avoid a race."_ _"Skipped the cache layer for v1 because the data is per-user and the cache hit rate would be low."_ _"Pulled `markComplete` into a separate module because the form action was getting too dense."_ The reader is a senior engineer; they want the _why_, not the _what_ (the _what_ is in the diff).
- `## Testing` — the commands you ran and the result. _"pnpm check: 0 errors, 0 warnings. pnpm test: 24/24 pass, 0 skipped. New story in `MarkComplete.stories.svelte` covering default, pending, and error states."_ Evidence, not assertions.
- `## Follow-ups` — things this PR _intentionally_ doesn't do, even if they belong in scope. _"Bulk-complete is not in this PR; tracked as #45."_ The follow-ups section is the _out-of-scope section of the PRD, restated at PR granularity_.

**The small-PR discipline.** A 2,000-line PR is a PR the reviewer will rubber-stamp or block, not review. If the work is genuinely 2,000 lines, the work is multiple PRs — break the issue into smaller slices at the to-issues stage, not the PR stage. The size budget for a "normal" PR is "a reviewer can hold the whole thing in their head in 15 minutes" — that's usually 200–400 lines of changed code, sometimes up to 800, rarely over 1,000 (in this author's opinion, anyway). If your PR is over 1,000 lines and the slices are genuinely independent, you have a stacking problem — see §10. If your PR is over 1,000 lines and the slices are not independent, you have a slicing problem — go back to stage 4.

**The test-in-the-PR rule.** A PR that doesn't include a test for the change is a PR that says "trust me." Trust is earned in the diff, not the description. If the change is to behaviour, the test is the proof. If the change is to a UI primitive, the story is the proof — Suede's Storybook discipline is that a code change to a primitive in `src/lib/components/ui/` is _incomplete_ without a story update in the same commit. The story captures the component's rendered states; any new state, prop, or visual branch added in code is a story-add or story-edit. A primitive without a matching story is invisible to QA and to the next contributor.

**The follow-ups-are-not-scope-creep rule.** A PR that explicitly says "this doesn't handle X — captured as #N" is a PR that respects the reviewer's time. The reviewer doesn't have to guess whether the missing X is a known gap or an oversight. The follow-ups list is a contract: _we know what's not in this PR, and here's where to track it._

**The ready-for-review checklist.** `pnpm check` clean. `pnpm test` clean. `pnpm lint` clean. PR description has all five sections. Linked issue is `Closes #N`. No `WIP` in the title. No "TODO: tests" comments in the diff. No secrets in the diff (grep for `api_key`, `token`, `password`, `BEGIN PRIVATE KEY`). No large binary files (grep for `Binary files differ`). No reformatting noise (run `prettier --write` _before_ you commit, not as a follow-up commit).

**The one thing:** make the PR title carry the whole story. If a reviewer reads only the title and the linked issue, they should know whether to approve.

## 9. Reviewing PRs: two axes, not one

A PR can fail Standards (it breaks the repo's documented conventions) _or_ fail Spec (it implements the wrong thing) _or_ both _or_ neither. Reporting them as one merged "review" hides the failure mode that actually matters.

The `review` skill formalises this. A two-axis review runs in parallel sub-agents — one for Standards, one for Spec — and reports the two side by side. Don't merge them; the user reads them independently, because a Standards-pass-Spec-fail PR is a different conversation than a Standards-fail-Spec-pass PR.

**The Standards axis.** Does the code conform to the standards sources in the repo? Read `AGENTS.md`, `CONTEXT.md`, ADRs, `STYLE.md`, `.editorconfig`, `eslint.config.*`, `tsconfig.json` — every file the repo points at as "this is how we write code." Note violations _with citation_: "this `as` cast violates the `no-as-in-tests` rule in `tdd-supplementary/SKILL.md`." Skip what tooling already checks — no value in repeating what `pnpm lint` will say. Distinguish hard violations from judgement calls. Cap the report at ~400 words.

**The Spec axis.** Does the code match the originating issue / PRD? Read the issue body, the PRD section, the user stories. Report three categories:

- _Spec requirements that are missing or partial._ Quote the spec line for each.
- _Behaviour in the diff that wasn't asked for (scope creep)._ Quote the diff line and the spec line. Scope creep is the silent killer of long-running projects.
- _Requirements that look implemented but where the implementation looks wrong._ Quote the spec line, quote the implementation, explain the gap.

Cap at ~400 words.

**The reviewer's posture.** Junior reviewers comment on style. Senior reviewers comment on _what would have prevented this_. A test that wasn't written is a seam that wasn't introduced. A duplicated component is a missing abstraction. A 1,200-line PR is an issue that was sliced wrong at stage 4. The review is the _last_ line of defence for the process; if the process is producing bad PRs, the review should say so. You can phrase it gently — "this would have been easier to review as two PRs" reads better than "this PR is too big" — but the observation should be there.

**The no-comment-is-a-comment rule.** A PR with zero review comments is either perfect (rare) or rubber-stamped (common). The senior-engineer move is to leave at least one comment on every PR, even if it's a one-character nit. The presence of comments signals engagement; the absence signals rubber-stamping. Rubber-stamping is a tax on the next PR you review, because the next PR's author doesn't know whether the bar is "looks good" or "actually good."

**The one thing:** when you write a Standards comment, cite the rule. "This is bad" is not actionable. "This `as` cast violates `tdd-supplementary/SKILL.md` §prune-pass" is actionable.

## 10. PR stacking: how to do it right

A _stack_ is a series of PRs that depend on each other, all open at once, merged in order. The first PR is the foundation (e.g. "add the Drizzle schema for todos and the migration"). The second PR builds on it (e.g. "add the server form action and its unit tests"). The third PR builds on the second (e.g. "add the UI and the Playwright flow"). Each PR is reviewable on its own; each depends on the previous.

**Why stacking exists.** Sometimes the work _is_ 1,200 lines and can't be sliced thinner at the issue level — the schema, the server action, and the UI are all so tightly coupled that no vertical slice is meaningful until all three exist. Stacking lets you ship the foundation early (so the schema is reviewable in isolation, in 200 lines) while the larger feature is still in flight. It's a tool for when vertical slicing at the issue level has hit its granularity limit.

**The four rules that make stacking work.**

1. **PR N is a strict subset of PR N+1's diff.** No "fix it in a follow-up" — if PR 2 introduces a bug, PR 2's reviewer blocks PR 2. Stacking is _not_ a license to ship broken foundations and patch them later.
2. **Each PR has its own base: the previous PR's branch, not `main`.** This is where stacking is different from sequential PRs. PR 2 targets PR 1's branch; PR 3 targets PR 2's branch. When PR 1 merges, PR 2's base auto-updates to `main` (and the diff shrinks by PR 1's changes), and so on.
3. **The merge order is the dependency order.** PR 1 merges first, then PR 2, then PR 3. The decision-graph chain reflects this — PR 1's `outcome` node is the parent of PR 2's `goal` node.
4. **Version bumps track _releases_, not PRs.** AGENTS.md says every release branch — a branch ready to merge to `main` — ships as its own version. A stack of 3 PRs merged days apart is 3 releases and 3 versions: chronver is doing its job. But a stack of 3 PRs all merging the same day is one logical release, and bumping each of them is process-purity theater — bump only the last PR in a same-day stack. The commit that ships the version is the one on the final PR.

**The one rule that breaks the whole model: branch-of-branch on `main` is fine, branch-of-branch on an in-flight PR is a footgun.** Concretely: if PR 1 is open and you cut a new branch off PR 1's branch to do unrelated work, you have a PR whose base _vanishes the moment PR 1 merges_. AGENTS.md bans this. The fix: either fold the new work into PR 1 (new goal node, same branch) or wait for PR 1 to merge. Branch-of-branch on an in-flight branch creates a PR whose base is unstable; branch-of-branch on `main` creates a normal PR.

**Stacking is _not_ free.** Three stacked PRs is roughly 3× the review effort, 3× the merge-conflict risk, and 3× the chance of the stack going stale. The senior-engineer move is to _try_ to slice the issue into independent vertical slices first; reach for stacking only when that's not possible. Stacking is a tool for the problem, not the default.

**The stack-got-stuck recovery.** When a stack goes stale — PR 1 is waiting for review, PR 2 has merge conflicts with `main`, PR 3 is from a different mental model than PR 2's reviewer — the recovery is to _rebase the stack onto current `main`_, push --force-with-lease, and re-request reviews. If rebase alone doesn't unstick it, _close the higher PRs, fold their work into PR 1, and ship PR 1 as the larger PR you were trying to avoid_. Stacks are a tool, not a religion. A merged 1,200-line PR is better than a 3-PR stack where 2 of the 3 are stale.

**Decision-graph discipline for stacks.** The chain is `PR 1 goal → PR 1 actions → PR 1 outcomes → PR 2 goal → …`. Each PR's `goal` node attaches to the previous PR's `outcome` node as a parent. This makes the dependency explicit in the graph, not just in the GitHub PR list.

**The one thing:** try to slice the issue into independent verticals first. Stacking is for when that fails, not for when you didn't try.

## 11. The boring stuff that saves you: diagnose, release, handoff

Three triggered skills every project eventually needs: `diagnose` (when the build hits a hard bug), `release` (when work ships), and `handoff` (when context runs out). This section is the field guide.

### Diagnose

The `diagnose` skill is for hard bugs, performance regressions, and non-deterministic failures. The discipline is six phases: _reproduce → minimise → hypothesise → instrument → fix → regression-test_. The skill is blunt: **Phase 1 (build a fast, deterministic feedback loop) is most of the work.** If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, you will find the cause — bisection, hypothesis-testing, and instrumentation all just consume that signal. If you don't have one, no amount of staring at code will save you.

Construct a feedback loop in roughly this order, escalating as needed:

1. **A failing test** at whatever seam reaches the bug — unit, integration, e2e.
2. **A curl / HTTP script** against a running dev server.
3. **A CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **A headless browser script** (Playwright / Puppeteer) — drives the UI, asserts on DOM/console/network.
5. **A replay of a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **A throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **A property / fuzz loop.** If the bug is "sometimes wrong output," run 1000 random inputs and look for the failure mode.
8. **A bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **A differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **A HITL bash script.** Last resort. If a human must click, drive _them_ with a structured script so the loop is still structured.

Iterate on the loop itself. Once you have _a_ loop, ask: can I make it faster? Can I make the signal sharper? Can I make it more deterministic? A 30-second flaky loop is barely better than no loop. A 2-second deterministic loop is a debugging superpower.

For non-deterministic bugs, the goal is not a clean repro but a _higher reproduction rate_. Loop the trigger 100×, parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; 1% is not — keep raising the rate until it's debuggable.

**Hypothesise, don't guess.** Generate 3–5 ranked hypotheses before testing any. Each hypothesis must be falsifiable: "If X is the cause, then changing Y will make the bug disappear." Show the ranked list to the user before testing — they often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver.

**Tag your debug logs.** Use a unique prefix like `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

### Release

Suede uses [chronver](https://chronver.org) — `YYYY.M.D[.N][-feature|-break]`, no leading zeros, version lives in `package.json#version`. The release is mechanical:

1. The version bump is the **last** commit on the release branch, before merge. `pnpm version <YYYY.M.D> --no-git-tag-version`, commit only the `version` field. Commit message: `chore(release): cut <version>`.
2. The human reviews the PR, merges to `main`.
3. The merge commit on `main` is tagged with the bare version string, annotated, pushed with `git push origin main --follow-tags`.

The changelog is `git log <prev>..<new>`. No `CHANGELOG.md`. The agent may push the release branch and may apply the tag; the merge to `main` is human-only.

For apps and templates, chronver is the right scheme — there's no API contract to break, and temporal releases match the cadence of "shipped when it was ready." Libraries that are consumed by dependents should override to semver during the kickoff follow-up; semver's breaking-change signal is persistent in a way chronver's isn't.

### Handoff

When context is running out — the conversation is getting long, the model is starting to forget, you've hit a session boundary — the `handoff` skill compacts the current conversation to a handoff document in the OS temp dir. The next session reads it and resumes. Handoff is _not_ a PR description: the PR description is the durable record of _what shipped_; a handoff is the pickup doc for _what's next_. A handoff that is committed to the workspace is a handoff that has already partially failed, because the next session won't know to look for it in the workspace's gitignored bits.

The handoff document includes a "suggested skills" section so the next session doesn't have to rediscover which skills apply. It does not duplicate content already captured in PRDs, ADRs, closed issues, commits, or diffs — those are referenced by path or URL. Sensitive information (API keys, passwords, PII) is redacted.

**The one thing:** the version bump is the last commit, not the first. The release branch is the work, not the announcement.

## Closing: when suede is wrong for you

The point of suede isn't to ship SvelteKit. The point is to make the next change cheaper than the last one. If a piece of suede is making the next change _more_ expensive, rip it. The kickoff follow-up is the right branch for the rip; the AGENTS.md rewrite is the right diff; the first PR description on the follow-up branch is the right place to record the why.

Three situations where you should rip pieces out:

**You don't ship a UI.** A backend MCP, a CLI, a content site using MDX for component docs — rip SvelteKit, rip Bits UI, rip Storybook. The `suede-kickoff` skill's Thread B has the override path; rewriting the parts of `AGENTS.md` and `.opencode/commands/build-test.md` that assume SvelteKit is part of the follow-up branch. The runtime stack is the most replaceable part of suede; the process layer (the pipeline, the decision graph, the authoring boundary) survives a stack change.

**You don't have a tracker.** A 2-day prototype, a research spike, a 1-week proof of concept — collapse the pipeline. Stages 3–5 fold into the PR description. The TDD discipline stays; the rest compresses. A solo developer who doesn't need a tracker still benefits from a `## Decisions` section in the PR description, because the `## Decisions` section is a _thinking_ tool, not a _tracking_ tool.

**You don't have an agent.** Suede's process layer assumes a coding agent that reads `AGENTS.md` at task start. If you're a solo developer with no agent, the pipeline is still useful as a _thinking_ framework, but skip the `deciduous` graph (or use it as a personal journal), skip the `Co-authored-by: opencode` trailer, skip the agent-cannot-merge-to-`main` rule. The seams, the PR discipline, the review frame, and the TDD discipline are the parts that age well — they're useful even when there's no agent to load the skills.

The seams, the small-PR discipline, the TDD loop, the prune pass, the decision graph, the two-axis review, the staging of releases — none of these are about Svelte. All of them are about _building software that survives the next change_. Suede ships them as a bundle because the bundle is what works in practice, and a starter template is the right vehicle for a bundle. But the bundle is not the point. **The point is the bundle of thinking.** You can take it with you into any stack, any language, any team.

The next change is the only one that matters. Make it cheaper than the last.

---

## A short reading list

Bookmark these. They're the source of truth for what this post was trying to teach.

- `AGENTS.md` — the rulebook. Read it cold at task start. Re-read it when you forget a rule.
- `~/.agents/skills/` — the process skills. The happy-path set: `grill-me` (or `grill-with-docs`), `to-prd`, `to-issues`, `triage`, `tdd`, `review`. The triggered set: `diagnose`, `qa`, `handoff`, `prototype`, `improve-codebase-architecture`, `write-a-skill`, `find-skills`, `caveman`. Load by stage, not by vibe.
- `.opencode/skills/tdd-supplementary/SKILL.md` — the prune pass and the Storybook discipline. The two rules most teams miss.
- `deciduous --help` — the decision-graph CLI. `deciduous nodes`, `deciduous edges`, `deciduous graph` to inspect what's been logged. Closed issues and merged PRs are the durable record of what shipped.
- The [conventional-commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) spec — the branch + commit type list. Inherited by AGENTS.md.
- The [chronver](https://chronver.org) spec — the version format.
