# Known needs

What the design skills and suede still need before a rough sketch and prose notes can
produce good work. Read at the start of each round, update at the end. This tracks gaps.
Rules still come only from critique, through `SKILL.md`.

Training runs one source at a time, as if that source were the only one, then repeats with
new sources. `Seen in` records which sources back a need, so one site's style doesn't pass
as a general truth. Remove an item when it's resolved, and say where it went.

| Need                                                                                                                                                                                | Status                      | Owner     | Seen in                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------- | ----------------------------------------- |
| **Suede element defaults.** `article` and heading defaults leak larger sizes and a serif into pages, and caused the same bug in two rounds.                                         | Open                        | Human     | gitbook, underconsideration               |
| **Type scale.** Raised twice. Candidate lives in `port-to-suede-css.css`, built on hand-picked steps. It has no built-in ratio between sizes, and how to address that is undecided. | Candidate in use, undecided | Human     | ticket-table, gitbook, underconsideration |
| **Spacing system.** Candidate lives in `port-to-suede-css.css`. Text-heavy pages also need spacing tied to line height, which the candidate does not provide.                       | Candidate in use, undecided | Human     | gitbook, underconsideration               |
| **Real components.** suede has almost none. The human wants to address this very soon.                                                                                              | Open, known issue           | Human     | gitbook                                   |
| **Colour system.** Harmony keeps contrast predictable across hues but feels limiting. May need replacing.                                                                           | Open, approach undecided    | Human     | ticket-table, gitbook                     |
| **Recipes.** Composition patterns, named in the suede docs and not built.                                                                                                           | Open, not built             | Undecided | gitbook                                   |

## Not ready

- **Sketch interpretation.** May need its own skill. Don't build or test it until output quality improves.

## Out of scope

- **Typeface and large-type tightening.** Letter spacing was copied from GitBook's typeface and is removed from the scale test. Whether large type needs tightening depends on the typeface, so it stays out of the type scale.
- **Illustration and detail.** Not required. Placeholders are fine if they take up the space the real thing would, for layout.
