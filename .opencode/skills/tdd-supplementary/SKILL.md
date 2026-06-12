---
name: tdd-supplementary
description: Suede-specific supplements to the global tdd skill — test pruning pass, Storybook discipline, and the "earn their keep" rule. Load during stage 6 (build) when a slice wraps up, or at the refactor step of any TDD cycle. The prune rule applies to every fork; the Storybook rule applies to every fork that kept the default — the rare fork that rips Storybook records the override in the kickoff follow-up.
---

# TDD supplementary

The global `~/.agents/skills/tdd/` skill covers the core discipline: RED → GREEN → REFACTOR, vertical slices, public-interface behaviour, mocking at boundaries. This skill adds the Suede-specific rules that the global skill is silent on.

## Prune pass — the rule the global skill is missing

The global TDD skill is silent on what to do with the tests that _already exist_ after a slice wraps up. Two failure modes accumulate over a project's lifetime:

- **Insensitive tests** — they pass on broken code. They test a data structure shape or a private method, not user-facing behaviour. False confidence: "tests pass, so it works."
- **Brittle tests** — they fail on harmless refactors. They assert on internal selectors (`page.locator('button.suede-button')`) or mock-heavy internal collaborator contracts. The team stops trusting them, then stops running them, then deletes the whole suite.

### When to run a prune pass

- At the **end of any TDD cycle where REFACTOR changed the public interface** (a rename, a parameter shape, a contract clarification). The old tests may now test behaviour the new interface no longer has.
- At the **end of a release branch**, before the merge. The "what does this branch actually assert?" question is worth asking once per shipped slice.
- At the **start of a triage/QA cycle** when a flaky test is reported. Flaky = either insensitive or brittle; the prune pass diagnoses which.

### The pass

For each test file in the slice, walk the `~/.agents/skills/tdd/tests.md` "Red flags" checklist:

- Mocking internal collaborators? → Prune (delete or replace with an integration test at a higher seam).
- Testing private methods? → Delete. Private methods are an implementation detail.
- Asserting on call counts/order? → Prune unless the call order _is_ the contract (rare).
- Test breaks when refactoring without behaviour change? → Prune.
- Test name describes HOW not WHAT? → Rename or prune.
- Verifying through external means instead of interface? → Refactor to use the public interface.

Tests that survive the checklist earn their keep. Tests that don't get deleted in the same commit that flagged them — leaving a "we should clean these up" follow-up is how test debt accumulates.

### The output

A prune pass is a _commit_, not a task. The commit message starts with `chore(tests): prune` and lists what was deleted and why. The decision graph gets one action node for the pass and one outcome node per category of deletion (insensitive-deleted, brittle-deleted, renamed, kept).

## Storybook discipline — the suede-specific rule

Storybook is the suede default for UI forks. A UI primitive change is incomplete without a story update in the same commit. This is the **Authoring Boundaries Storybook-discipline** rule, restated as a workflow:

- **Code change to `src/lib/components/ui/<X>.svelte`** → matching `src/stories/<X>.stories.svelte` (or equivalent) updated in the same commit, covering the new state, prop, or visual branch.
- **New visual state** (e.g. "Disabled" was `aria-disabled` only, now there's a `disabled` prop) → new `<Story>` block.
- **Removed visual state** (e.g. a deprecated variant) → corresponding `<Story>` block removed.
- **Behavioural change** (e.g. the button now calls `preventDefault` on form submit) → story updated to demonstrate or assert on the new behaviour, even if no new visual state is added.

Stories are the agent-owned form of the human-owned visual contract. The author of a Storybook story is the _consumer_ of the component, not the implementer. A primitive without a matching story is invisible to QA and to the next contributor.

A fork that rips Storybook (e.g. a backend MCP, a content site using MDX for component docs) records the override in the kickoff follow-up task note and the agent rewrites AGENTS.md / this skill as part of that override. The discipline is unconditional for any fork that kept the default.

## What's intentionally not in this skill

- **General testing theory** — that's in the global `tdd` skill. Load that one first.
- **Vitest / Playwright / svelte-check commands** — those are in AGENTS.md and the per-command `build-test.md` skill.
- **Per-component test patterns** — those are the per-component file's call, not a global rule.
