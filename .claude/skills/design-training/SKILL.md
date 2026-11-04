---
name: design-training
description: >
  Run one round of the temporary design training project: do a design exercise
  in suede parts, take the human's critique, and turn what holds up into skill
  rules.
argument-hint: '[the exercise, or a reference to start from]'
disable-model-invocation: true
---

# Design training

Grow a suite of design skills slowly, from real exercises and the human's
critique. Only what's written in a skill file counts as trained. What this
conversation remembers ends with it.

The human owns taste and decides what becomes a rule. Don't draft rules ahead of
critique, and don't scaffold a skill for a topic no exercise has touched.

The training covers visual design, user experience, human-computer interaction,
accessibility, CSS, semantic markup, and neighbouring topics. That's the
territory to learn, not a list of skills to create.

## Git

`feat/design-training-montage` is the integration branch, and it's the one
standing exception to CLAUDE.md's branch-from-`main` rule. For each round:

- Fetch `origin`, then branch `<type>/design-training-<slug>` from the latest
  `origin/feat/design-training-montage`, in its own worktree.
- Open the PR against the integration branch. The human merges it.
- Don't bump the version. The version bump belongs to the final merge to `main`.
- Skip `/task`, `/verify`, and `/review` on round PRs. The human's critique is the
  review, and the pages are throwaway. Run `/review` on the final merge to `main`.

## A round

**1. Frame.** Say in a line what you're building and what you think it'll be
judged on. If the exercise leaves one thing open that would change the work, ask
it, and otherwise start.

**2. Build.** Read `critique-log.md` first, then follow `writing-css`
and any design skills that exist by then. Put the page at
`src/routes/training/<slug>/+page.svelte`, marked in a comment as a training
prototype. Keep references and screenshots in `tmp/design-training/<slug>/`, so
other people's work stays out of git history.

Use suede parts. When they can't express the design, get as close as they allow
and name the gap. A gap is a finding, and new tokens and primitives stay the
human's call under CLAUDE.md's authoring boundaries.

**3. Look.** Run the app and screenshot the page in a browser, then compare it
against the reference or brief. Check whatever states and viewports the exercise
is about. Fix what you can see before showing it, and say what you couldn't fix.
Report what's on the page, not what the code should produce.

**4. Critique.** The human leads. Take one note at a time and apply it. Ask why
when the reason isn't clear, since the reason is what generalizes. Disagree
plainly when you have a concrete objection, then follow their call.

**5. Log.** Add each note to `critique-log.md` as you get it: their words
verbatim, the round, and the reason. Note a mistake you repeated even if they
only said it again. Don't paraphrase taste into something tidier.

**6. Distill.** Before the PR, propose rules from the log. A note becomes a rule
when it has come up in two different exercises or when the human says it's a
rule. Everything else waits in the log. Show each proposed rule with the notes
behind it, and write only the ones the human approves. Mark them in the log.

**7. Test.** Dispatch a fresh subagent on a small exercise the rule should
change, with only the skill files and no account of the critique. Show the human
the result. If the rule didn't carry over, rewrite the rule. Skip this when the
round produced no rule.

## Where rules go

Put a rule in the skill that already owns its question. Give each rule an ID so
other skills can cite it. Propose a new skill only when one of these holds:

- Several rules share a trigger the existing skills don't have.
- A skill has grown past one readable pass.

Each skill owns one question, the way `writing-css` owns where a rule goes.
Skills cite each other's rule IDs and never restate them. When a new rule
contradicts an old one, show the human both and let them pick. Don't let the two
coexist.

## Graduating

The human decides when training is done. Then, on a final branch off the
integration branch:

- Delete `src/routes/training/`, this skill including its log, and its line in
  CLAUDE.md.
- Check that the remaining skills read cold, with no reference to rounds, the
  log, or this project.
- Cut the release per CLAUDE.md, for the human to merge to `main`.
