# suede-button-scaffold

## Task
Scaffold a Suede-wrapped bits-ui Button (`SuedeButton`) that demonstrates the boundary "bits-ui provides functionality, suede (stylebase + scoped CSS) provides style/content." Demo lives in Storybook only (no route page); four story variants (Primary, Disabled, As link, With class override). Goal: a learning scaffold the user can read top-to-bottom to internalize the bits-ui + stylebase + Svelte 5 runes pattern.

## Decisions
- **Storybook only, Button only** (Q1) — user explicitly dropped the Accordion from scope; route-page demo deferred.
- **Option C for the existing example stories** (Q2) — keep the auto-generated Storybook Button/Header/Page example content; name the new component `SuedeButton.svelte` (not `Button.svelte`) to avoid path collision. The user expects to delete the examples later.
- **Approach 2 for the wrapper prop pattern** (Q3) — full HTML attribute spread (`{...rest}`) over bits-ui's `Button.Root`. Plus **Option A** for the type issue: `Props = ButtonRootProps` (the bits-ui-exported union), with `{...rest as Record<string, unknown>}` as the local escape hatch on the spread line.
- **Utility classes + scoped `<style>` mix inside the component** (Q4, last user message) — `u:fs-1` font-size utility from stylebase in the `class` attribute; everything else (color, padding, radius, hover/active/disabled) in a scoped `<style>` block. Component is usable as-is with sensible defaults; user can override via `class`/`style` props or by adding their own scoped styles at the consumer.
- **Skip the spec doc** — this is a single-file scaffold; the brainstorming skill's "design can be short for truly simple projects" applies. Plan was presented in chat and approved.
- **Skip pnpm lint at the project level** — the project has 30+ files with pre-existing prettier drift (AGENTS.md, opencode.json, .opencode/*, .storybook/*, agent-notes/*, src/stories/{Button,Header,Page,Configure}.*, etc.). Reformatted only the two new files. Reformatting the rest is unrelated work and was deferred.

## Actions
- Read `package.json`, `src/app.css`, `src/routes/+page.svelte`, `src/lib/components/ui/` (empty), `src/stories/Button.stories.svelte` (already references non-existent `$lib/components/ui/Button.svelte`), `.storybook/{main,preview}.ts`, and bits-ui's `ButtonRootProps` type def at `node_modules/.pnpm/bits-ui@2.18.1_*/node_modules/bits-ui/dist/bits/button/types.d.ts` to confirm the `AnchorElement | ButtonElement` union shape that drives the rest-spread type issue.
- Read stylebase's `dist/stylebase.min.css` to map the utility surface: `u:fs-0..10` (font size), `l:{repel,river,root,waterfall,ui-list}` (layout), and CSS custom properties for the rest (no Tailwind-style atomic utilities for color/spacing/border-radius).
- Created deciduous goal node 67 with the user's verbatim prompt + planning refinements; branch `feat/install-bits-ui-stylebase`.
- Wrote `src/lib/components/ui/SuedeButton.svelte` — 5-line script (bits-ui import, `Props = ButtonRootProps`, `$props()` destructure pulling out `href`, `children`, `class: klass`, plus `...rest`); one `Button.Root` element with `{href}`, `{...rest as Record<string, unknown>}`, a template-literal `class` attribute (`suede-button u:fs-1${klass ? ' ' + klass : ''}`), and `{@render children?.()}` (children is possibly-undefined per `WithChildren`); `<style>` block with the visual defaults and `:hover`/`:active`/`:disabled`/`:[aria-disabled='true']` state rules. Plus `<!-- svelte-ignore css_unused_selector -->` to suppress the Svelte CSS-pruner warnings (the class name is in a template literal, invisible to static extraction).
- Wrote `src/stories/SuedeButton.stories.svelte` — `defineMeta` block with `title: 'UI/SuedeButton'`, autodocs tag, `onclick: fn()` default arg, and `argTypes` for `href` + `disabled`. Four `<Story>` blocks: Primary, Disabled, As link (`href="https://bits-ui.com"` exercises the polymorphic switch to `<a>`), With class override (`class="u:fs-3"` + inline `style` to show stylebase-utility + custom-style mixing).
- `pnpm check` (wrangler types + svelte-check) — **0 errors, 0 warnings on new code**. Two pre-existing errors remain in `src/stories/{Button,Accordion}.stories.svelte` (missing `$lib/components/ui/{Button,Accordion}.svelte`), pre-date this change, out of scope per option C.
- `pnpm prettier --write` on the two new files — reformatting accepted.
- `pnpm eslint` on the two new files — no errors. Whole-project `pnpm lint` flags 35 unrelated files with pre-existing prettier drift; not touched.
- Committed `c7c153b` — `feat(ui): scaffold SuedeButton (bits-ui + stylebase wrapper)`. Unstaged the pre-existing staged files (`.github/workflows/cleanup-decision-graphs.yml`, `.opencode/commands/serve-ui.md`) so the commit diff is exactly the two new files; the user can commit those separately.
- Created deciduous outcome node 70 with `--commit HEAD`; linked to action nodes 68 (wrapper) and 69 (story).

## Files touched
- `src/lib/components/ui/SuedeButton.svelte` — new (52 lines)
- `src/stories/SuedeButton.stories.svelte` — new (36 lines)

## Verification
- `pnpm check` — 0 errors / 0 warnings on the two new files. 2 pre-existing errors remain in `src/stories/{Button,Accordion}.stories.svelte`.
- `pnpm prettier --check` on new files — pass
- `pnpm eslint` on new files — pass
- `git log -1` — `c7c153b feat(ui): scaffold SuedeButton (bits-ui + stylebase wrapper)` on `feat/install-bits-ui-stylebase`

## Follow-ups / stubs
- **Pre-existing pnpm check errors**: `src/stories/Button.stories.svelte` and `src/stories/Accordion.stories.svelte` both import non-existent components. The working tree has those components deleted locally too (git shows them as `deleted: not staged`). When the user is ready to remove the example storybook content (their stated intent for "later"), `git rm` the two `.stories.svelte` files plus the deleted `src/lib/components/ui/{Button,Accordion,index}` files in one cleanup commit.
- **Pre-existing prettier drift** in 30+ files (AGENTS.md, opencode.json, .opencode/*, etc.). Not in scope for this change; consider a separate `chore(format): run prettier` commit.
- **CSS scope caveat**: the `<!-- svelte-ignore css_unused_selector -->` comment is currently scoped to the whole `<style>` block. If a future user adds a new rule with a class name that IS used statically in the template, the ignore is over-broad. Consider moving to per-rule ignore once more selectors exist.
- **The `{...rest as Record<string, unknown>}` cast** is a known escape hatch we discussed. If bits-ui ever exports a `WithoutButtonRest` helper, swap the cast for that. The cast preserves runtime behavior — every HTML attribute the consumer passes flows through to `Button.Root` correctly; the union is what blocks TypeScript, not what the runtime does.
- **`ref` is not forwarded** in this version of the wrapper. If a future consumer needs the underlying DOM element, add `let { ref = $bindable(null), ... }: Props = $props()` and `bind:this={ref}` on `<Button.Root>`. Deferred — keeping the scaffold minimal.
- **The `u:fs-1` utility is the only stylebase utility class used in the component** — the rest of the visual styling is in scoped CSS. If a future "Hybrid: global data-attribute CSS + per-component overrides" option (see deciduous node 64, the deferred revisit from the 341d364 commit) gets picked up, the mix here is the proof of concept.
- **Story variants are intentionally minimal** — no `play` interaction tests, no `decorators` for surrounding layout. Add those when the user wants to exercise click handlers / hover states / responsive behavior.
