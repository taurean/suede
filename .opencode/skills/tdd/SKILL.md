---
name: tdd
description: Test-driven development with red-green-refactor loop, plus the suede-specific prune pass and Storybook discipline. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
---

# Test-Driven Development

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** are integration-style: they exercise real code paths through public APIs. They describe _what_ the system does, not _how_ it does it. A good test reads like a specification - "user can checkout with valid cart" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They mock internal collaborators, test private methods, or verify through external means (like querying a database directly instead of using the interface). The warning sign: your test breaks when you refactor, but behavior hasn't changed. If you rename an internal function and tests fail, those tests were testing implementation, not behavior.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing" - treating RED as "write all tests" and GREEN as "write all code."

This produces **crap tests**:

- Tests written in bulk test _imagined_ behavior, not _actual_ behavior
- You end up testing the _shape_ of things (data structures, function signatures) rather than user-facing behavior
- Tests become insensitive to real changes - they pass when behavior breaks, fail when behavior is fine
- You outrun your headlights, committing to test structure before understanding the implementation

**Correct approach**: Vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle. Because you just wrote the code, you know exactly what behavior matters and how to verify it.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## Workflow

### 1. Planning

When exploring the codebase, use the project's domain glossary so that test names and interface vocabulary match the project's language, and respect ADRs in the area you're touching.

Before writing any code:

- [ ] Confirm with user what interface changes are needed
- [ ] Confirm with user which behaviors to test (prioritize)
- [ ] Identify opportunities for [deep modules](deep-modules.md) (small interface, deep implementation)
- [ ] Design interfaces for [testability](interface-design.md)
- [ ] List the behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

Ask: "What should the public interface look like? Which behaviors are most important to test?"

**You can't test everything.** Confirm with the user exactly which behaviors matter most. Focus testing effort on critical paths and complex logic, not every possible edge case.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

This is your tracer bullet - proves the path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass current test
- Don't anticipate future tests
- Keep tests focused on observable behavior

### 4. Refactor

After all tests pass, look for [refactor candidates](refactoring.md):

- [ ] Extract duplication
- [ ] Deepen modules (move complexity behind simple interfaces)
- [ ] Apply SOLID principles where natural
- [ ] Consider what new code reveals about existing code
- [ ] Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

## Prune pass — earn their keep

The workflow above is silent on what to do with the tests that _already exist_ after a slice wraps up. Two failure modes accumulate over a project's lifetime:

- **Insensitive tests** — they pass on broken code. They test a data structure shape or a private method, not user-facing behaviour. False confidence: "tests pass, so it works."
- **Brittle tests** — they fail on harmless refactors. They assert on internal selectors (`page.locator('button.suede-button')`) or mock-heavy internal collaborator contracts. The team stops trusting them, then stops running them, then deletes the whole suite.

### When to run a prune pass

- At the **end of any TDD cycle where REFACTOR changed the public interface** (a rename, a parameter shape, a contract clarification). The old tests may now test behaviour the new interface no longer has.
- At the **end of a release branch**, before the merge. The "what does this branch actually assert?" question is worth asking once per shipped slice.
- At the **start of a triage/QA cycle** when a flaky test is reported. Flaky = either insensitive or brittle; the prune pass diagnoses which.

### The pass

For each test file in the slice, walk the [tests.md](tests.md) "Red flags" checklist:

- Mocking internal collaborators? → Prune (delete or replace with an integration test at a higher seam).
- Testing private methods? → Delete. Private methods are an implementation detail.
- Asserting on call counts/order? → Prune unless the call order _is_ the contract (rare).
- Test breaks when refactoring without behaviour change? → Prune.
- Test name describes HOW not WHAT? → Rename or prune.
- Verifying through external means instead of interface? → Refactor to use the public interface.

Tests that survive the checklist earn their keep. Tests that don't get deleted in the same commit that flagged them — leaving a "we should clean these up" follow-up is how test debt accumulates.

### The output

A prune pass is a _commit_, not a task. The commit message starts with `chore(tests): prune` and lists what was deleted and why. The decision graph gets one action node for the pass and one outcome node per category of deletion (insensitive-deleted, brittle-deleted, renamed, kept).

## Storybook discipline (UI forks)

Storybook is the suede default for UI forks. A UI primitive change is incomplete without a story update in the same commit. This is the **Authoring Boundaries Storybook-discipline** rule, restated as a workflow:

- **Code change to `src/lib/components/ui/<X>.svelte`** → matching `src/stories/<X>.stories.svelte` (or equivalent) updated in the same commit, covering the new state, prop, or visual branch.
- **New visual state** (e.g. "Disabled" was `aria-disabled` only, now there's a `disabled` prop) → new `<Story>` block.
- **Removed visual state** (e.g. a deprecated variant) → corresponding `<Story>` block removed.
- **Behavioural change** (e.g. the button now calls `preventDefault` on form submit) → story updated to demonstrate or assert on the new behaviour, even if no new visual state is added.

Stories are the agent-owned form of the human-owned visual contract. The author of a Storybook story is the _consumer_ of the component, not the implementer. A primitive without a matching story is invisible to QA and to the next contributor.

A fork that rips Storybook (e.g. a backend MCP, a content site using MDX for component docs) records the override in the kickoff follow-up PR description (or an ADR if the project uses one) and the agent rewrites AGENTS.md / this skill as part of that override. The discipline is unconditional for any fork that kept the default.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```
