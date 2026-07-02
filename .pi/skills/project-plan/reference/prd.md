# Reference: full PRD

> Preserved ceremony — the compressed live process is [../SKILL.md](../SKILL.md). Reach for this only when a project needs the formality.

Take the current conversation context and codebase understanding and produce a PRD. Do NOT interview the user — just synthesize what you already know.

The issue tracker is **GitHub Issues** (suede default). Triage labels are the conventional ones: `needs-triage` → `ready-for-agent` / `ready-for-human` / `wontfix`, with `needs-info` as a detour and `bug` / `enhancement` as category labels. See `AGENTS.md` "Constant process pipeline" for the canonical vocabulary.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can.

Check with the user that these seams match their expectations.

3. Write the PRD using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit> — Done when: <user> can <do X> and observes <Y>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending — Done when: a signed-in customer opens the accounts page and sees the current balance of each account
</user-story-example>

Keep the list as short as the feature's distinct capabilities allow — the story list is the test list (`.pi/skills/task/testing.md`), so every extra story is an extra test the suite carries and the human reviews.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- The seams the scenario tests will run through (test shape and quality are owned by `.pi/skills/task/testing.md` — don't restate it here)
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>
