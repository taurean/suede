# Tests that earn their keep

The unit of a test is a user story from the slice-brief: one story, one
scenario test, named as the story and driven through the seam the story's
user touches. The story list is the test list — nothing more (no tests for
intermediate shapes the user never sees) and nothing less (a story without
its passing test isn't done).

That anchoring is what keeps machine-generated tests honest. A test derived
from the implementation inherits the implementation's misunderstandings and
passes anyway — theater. A test derived from the human-confirmed story has an
independent source, so wrong code fails it. Write the test from the story's
"Done when" line, never from the code you just wrote.

## Who writes the test

A session that just wrote the implementation can't unsee it — its test will
lean on the code no matter what it intends. When a sub-agent tool is
available (Pi's `pi-subagents` `subagent` tool with `context: fresh`, or the
harness's equivalent), delegate each story test to a fresh-context sub-agent
whose brief contains only:

- the story and its "Done when" line from the slice-brief,
- the seam surface — route paths, page URLs, or public API signatures, not
  their implementations,
- the test file's destination and one existing test file as a style
  reference.

Never include the diff or implementation files. If the returned test fails
against the real code, that's signal, not noise: reconcile against the
story before touching either side.

Without a sub-agent tool, write the test yourself from the "Done when" line
before rereading the implementation — instructed independence is weaker, so
hold the red flags below more strictly.

## Seams

Drive each test through the seam the story's user actually touches:

- **UI journey** → Playwright, through the rendered page.
- **Route / API / Worker behavior** → Vitest at the request boundary.
- **Library or pure logic with its own consumers** → Vitest through the
  public API.

Unit tests below these seams are the exception, for genuinely intricate pure
logic (parsing, pricing, date math) where the scenario test would need too
many variants. Keep them few; they supplement the story's test, never
substitute for it.

## What runs when

The suite grows with the app's real surface; the per-task run must not. Tier
by cost:

- **Every task, every slice** — request-level and unit tests (seconds), plus
  the Playwright journeys touching the changed surface (the slice-brief's
  seam assessment names it), plus every `@critical` journey.
- **Release branch, before the version bump** — the full journey suite.

Tag the handful of journeys that must never break — checkout, auth, anything
that could lose user data — with `@critical` in the test name. The tag is
human-granted: propose it, don't self-award it. Critical journeys run on
every task and are exempt from pruning.

## What the story test looks like

```typescript
// GOOD: the story, executable — survives any internal refactor
test('user can checkout with valid cart', async () => {
	const cart = createCart();
	cart.add(product);
	const result = await checkout(cart, paymentMethod);
	expect(result.status).toBe('confirmed');
});

// BAD: coupled to internals — breaks on refactor, not on broken behavior
test('checkout calls paymentService.process', async () => {
	const mockPayment = jest.mock(paymentService);
	await checkout(cart, payment);
	expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Verify through the interface, not around it: `createUser` makes the user
retrievable via `getUser`, not visible in a raw `db.query`.

## Red flags

- Test maps to no user story and guards no bug reproduction
- Mocking internal collaborators
- Testing private methods
- Asserting on call counts or call order (unless the order _is_ the contract)
- Test breaks when refactoring without behavior change
- Test name describes HOW, not WHAT
- Verifying through external means instead of the interface

## Mocking

Mock at system boundaries only: external APIs, time and randomness, sometimes
the database or file system (prefer a test DB). Never mock your own modules or
internal collaborators — the story runs through real code.

Design boundaries to be mockable:

- **Inject dependencies** — pass the payment client in; don't construct a
  `new StripeClient(...)` inside the function.
- **SDK-style interfaces over generic fetchers** — one function per external
  operation (`api.getUser`, `api.createOrder`), so each mock returns one
  specific shape and no conditional logic leaks into test setup.

## Prune pass

Two failure modes accumulate over a project's lifetime: **insensitive** tests
that pass on broken code (they assert a data shape, not a story — false
confidence), and **brittle** tests that fail on harmless refactors (internal
selectors, mock-heavy collaborator contracts — the team stops trusting the
suite). Run a prune pass:

- at the end of any slice whose cleanup changed a public interface,
- at the end of a release branch, before merge,
- when a flaky test is reported (flaky = insensitive or brittle; the pass
  diagnoses which).

Walk each test file in the slice against the red flags above. Tests that
survive earn their keep; tests that don't get deleted **in the same commit
that flagged them** — a "clean these up later" follow-up is how test debt
accumulates. Where a story deserves coverage the pruned test never gave it,
replace at the story's seam instead of deleting outright.

Pruning removes redundancy and theater, never coverage. When a newer story's
test exercises everything an older test asserts, **merge, don't delete**:
move any assertion the survivor lacks into it, then remove the duplicate.
Outright deletion is only for tests that prove no story and guard no
reproduction. `@critical` journeys are exempt.

A prune pass is a commit, not a task: `chore(tests): prune` listing what was
deleted and why, with the project's decision-record tooling capturing the
pass and its outcome if the project has one.
