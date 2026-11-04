---
name: writing-css
description: >
  Write CSS and component markup for projects built on suede-css + Bits UI
  using the CUBE CSS methodology. Reach for layout utilities for rhythm,
  token-backed utility classes for typography, scoped `<style>` blocks for
  block-level visuals, and Bits UI primitives for any interactive element.
  Use when writing or editing `.svelte` markup, `<style>` blocks, files in
  `src/lib/styles/`, classes, data attributes, or any task involving styling,
  layout, or component composition in a suede-css-based project.
paths:
  - '**/*.svelte'
  - 'src/lib/styles/**'
  - '**/*.css'
---

# Writing CSS in a suede-css + Bits UI project

suede-css is a CUBE CSS implementation. The cascade layers are declared in the
order CUBE expects — `token → default → utility → layout` — so the methodology
is enforced by the cascade, not by convention. Each step is a pair: suede-css's
own layer (`suede-token`, `suede-default`, `suede-utility`, `suede-layout`)
followed by a bare project layer of the same role, so project CSS in `layout`
overrides `suede-layout` and nothing above it. Lean into that. Every line of CSS
in this stack should fall into one of the four CUBE layers, and most lines
should land in the layers suede-css already provides.

## Page structure

**[CSS-3]** Page columns come from `l:grid` and `data-grid-columns`, not local
`grid-template-columns`. The grid keeps its 12 columns at every width. A media query may
change how many columns a child spans, and may make a structural change that wrapping
can't, like hiding a sidebar. It never changes the number of columns. Local tracks and
`auto-fit` are fine inside a component, like a row of chips or a label and its value.

```svelte
<div class="l:grid">
	<div class="column" data-grid-columns="half">...</div>
	<div class="column" data-grid-columns="half">...</div>
</div>

<style>
	@media (max-width: 48rem) {
		.column {
			grid-column: span 12;
		}
	}
</style>
```

A grid nested in a grid brings its own gutter padding, so give the inner one
`padding-inline: 0`. Vertical rhythm comes from `l:waterfall` and `--waterfall-gap`.

**[CSS-4]** Sizes and colours come from tokens, on logical properties. Use `inline-size`
and `block-size`, `--border-w-*` for borders, `--text-*` for font sizes and `--gap-*`
for spacing. A display element sized to fill its container, like a footer wordmark, may
use container units and says so in a comment. Don't write a `clamp()` of your own to get
past the top of the scale.

**[CSS-5]** A `<style>` block stops at about 80 lines. Past that, split the page into
components with their inputs as props.

Other training pages under `src/routes/` don't set the pattern. This file does.

## The four layers

**Composition (suede-css `suede-layout` layer).** Page-level layout, rhythm, and flow.
Reach for these utilities before writing any layout CSS of your own:

- `l:grid` — 12-column grid. Pair with
  `[data-grid-columns="sixth|quarter|third|half|full"]` on direct children for
  span variants (this is the Exception pattern, see below). The attribute does
  nothing on a grandchild. The grid keeps its 12 columns at every width. Where
  columns need to stack, a media query changes only how many each child spans,
  as in `grid-column: span 12`. Row gaps are off by default, so set `row-gap`
  when children can stack.
- `l:root` — single centred container with max-width and gutter.
- `l:waterfall > *` — vertical rhythm; every direct child gets
  `margin-block-start: var(--waterfall-gap, 2em)`.
- `l:river > *` — horizontal flow; every direct child gets
  `margin-inline-start: var(--river-gap, 1em)`.
- `l:repel` — wrapping flexbox row with `justify-content: space-between` for the
  "logo on the left, actions on the right" pattern. Gap comes from
  `--repel-gap`.
- `l:ui-list` — inline horizontal list with bullets removed.

Override the `--river-gap` and `--waterfall-gap` custom properties on the parent
when the default rhythm is wrong; don't reach for a new utility.

**Utility (suede-css `suede-utility` layer).** One job, one class. Currently exposed:
`u:radius-full` (pill shape, any element), `u:fs-0` through `u:fs-10` (older fluid
sizes, mapped to `--fs-*`; new work uses `--text-*` instead),
`u:lh-ui|...|loose` (line heights, mapped to `--lh-*`),
`u:ff-content|heading|sans|serif|ui|mono` (font families, mapped to `--ff-*`),
and `u:visually-hidden`. Use these for typography
that varies per element rather than per block — e.g. `<h1 class="u:fs-7">`. If a
property needs a utility and suede-css doesn't ship one, add it to a
project-local CSS file in `src/lib/styles/` rather than hardcoding it. The
utility layer's job is to extend tokens, never to redefine them.

**Block (project's `<style>` block + scoped styles in `src/lib/styles/`).** This
is the layer suede-css deliberately hands off to the project. By the time you
reach a block, composition, utilities, and globals have done most of the work —
the block CSS should be **a handful of rules** that only apply in that context.
Hard cap at around 80 lines of CSS per block; if it's growing, the block is
solving more than one contextual problem and should split.

Block CSS draws from suede-css custom properties (`--hue-*`, `--space-*`,
`--ff-*`, `--fs-*`, `--lh-*`). It never hardcodes a colour, a spacing value, or
a font stack. The exception is shorthand that resolves through tokens
immediately: `color: white` on a saturated `--hue-blue-500` background is fine
because the contrast is what's being captured, not a colour value.

Global CSS — files in `src/lib/styles/` — goes in the project's `layout`
cascade layer (or higher) so it overrides suede-css. Scoped `<style>` blocks
stay unlayered: Svelte's hash class already confines them to the component, and
unlayered rules outrank every layer, so a page-level reset can't override the
rules a component depends on. If you find yourself adding `!important`, you're
either in the wrong layer or fighting the cascade — stop and check.

**Exception (data attributes).** Variations of a block — `reversed`,
`inactive`, `expanded` — use **data attributes, not modifier classes**. The
attribute hooks both CSS and JS cleanly:

```svelte
<article class="card" data-state="reversed">…</article>
```

```css
.card[data-state='reversed'] {
	flex-direction: column-reverse;
}
```

If a "variation" makes the component unrecognisable, that's a new block, not an
exception. Stop and split. Exception is for state changes and minor
rearrangements, not for a second design.

## Bits UI is the source of interactive primitives

The interactive vocabulary comes from Bits UI. Any interactive element whose
behaviour Bits UI implements (dialog, dropdown, tabs, accordion, tooltip, combobox,
checkbox, switch) uses its primitive. Bits UI's accessibility behaviour (keyboard
handling, ARIA wiring, focus management) is the point.

**[CSS-2]** Keep a component's elements in its own markup so its styles stay
scoped. When a Bits UI primitive offers a `child` snippet, use it and spread
`{...props}` onto your element. `:global` is the last resort.

```svelte
<Checkbox.Root bind:checked>
	{#snippet child({ props })}
		<button {...props} class="box">...</button>
	{/snippet}
</Checkbox.Root>
```

Forget the `{...props}` and you get a control that looks right and does nothing.

**A new interactive primitive is a human-shaped decision.** A new wrapper around
a new Bits UI headless component shapes the visual contract and ships with a
Storybook story (`CLAUDE.md`, "Storybook discipline"). Introducing one is
boundary movement — [STOP-2] applies. Stop and ask; don't add it because the
task happened to need it.

## Markup patterns

Inside a block, prefer letting HTML elements inherit rather than classing them.
If `.card` already styles headings via element selectors, don't add a class to
the `<h2>`. CUBE's whole point is that global + composition + utility have done
most of the work before the block ever loads.

## Tokens, in practice

- **Colour.** Two layers, and the order matters.

  **Semantic surface tokens first** — `--hue-z0-bg`, `--hue-z0-fg`,
  `--hue-z0-divider`, `--hue-z1-bg` and the rest of the z-layer set. Dark mode
  works because each one is a `light-dark()` pair resolved by `color-scheme`, so
  a component built on them adapts for free. `data-theme="light|dark"` forces a
  scheme on `<html>` or any subtree. On a subtree it only switches the tokens, so
  the themed element must paint its own background and text colour with the
  surface tokens (`--hue-z1-bg` / `--hue-z1-fg`). A component that reaches past them to a
  primitive renders identically in both themes — that's the bug, and it won't
  show up until someone switches.

  **Primitives second**, when no semantic token fits:
  `--hue-{name}-{50..950}`. Names: `red`, `orange`, `amber`, `yellow`, `lime`,
  `green`, `emerald`, `teal`, `cyan`, `lightBlue`, `blue`, `indigo`, `violet`,
  `purple`, `fuschia`, `pink`, `rose`, `slate`, `gray`, `zinc`, `neutral`,
  `stone`, `sand`, `olive`, `mauve`. The scale is OKLCH and perceptually
  uniform — lightness runs from about 98% at `50` to 19% at `950`, so the
  distance between two shades is predictable rather than a guess. `500` is the
  base vibrant shade. Never `color: #abc123`.

  **Each z-layer set has the same shape:** `bg`, `fg`, `muted`, `border`. Pick the
  set for the surface and stay in it. Reaching across sets is a smell.
  `--hue-z0-divider` is a heavier line, `color-mix` against `currentColor`.

  `--hue-white` and `--hue-black` name the extremes the scale stops short of.
  Additions on their way to suede-css live in `src/lib/styles/port-to-suede-css.css`.

  Dark surfaces with a tint come from the `slate` and `zinc` scales, whose `950` steps
  are dark and slightly blue. Check the scales before calling a colour a gap.

  Past the 0.15 chroma cap, a saturated brand or accent colour on a prototype goes in one
  clearly marked file beside the route, in the `token` layer. Promoting it is the human's call.

- **Spacing.** `--gap-{xs,sm,md,lg,xl}` are fixed at 4, 8, 12, 16 and 24px.
  `--gap-{2xl,3xl,4xl,5xl}` scale from 375px to 1440px, ending at 32, 48, 64 and
  112px. Apply via `padding`, `margin`, or `gap`, and let padding size controls
  and rows. `--space-*` is the older scale, kept for existing code.
- **Typography.** `--text-{xs,sm,md,lg,xl}` are fixed at 12, 14, 16, 18 and 20px.
  `--text-{2xl..7xl}` scale from 375px to 1440px, ending at 24, 32, 38, 48, 72 and
  96px. `--fs-*` is the older scale, kept for existing code. Line height is
  `--leading-ui` (1), `--leading-tight` or `--leading-loose`. Tight and loose
  resolve to a length, so set them on the same element as the font size, or a child
  with a different size inherits the wrong line. `--ff-{system,sans,serif,ui,content,
heading,old-style,didone-display,...}` for family. The `--ff-ui`, `--ff-content`,
  `--ff-heading`, `--ff-sans`, `--ff-serif` aliases are usually what you want. When
  a brief names a typeface the project doesn't have, use the closest stack and name
  the gap.
- **Page width.** `--page-max` is 1440px. Past it, content stops growing and centres.
  Set `--grid-max-width` on a parent to change a grid's ceiling.
- **Grid.** `--grid-max-width`, `--grid-gutter`, `--grid-columns`. Override on
  the parent when a section needs a different ceiling.
- **Flow gaps.** `--waterfall-gap`, `--river-gap`. Defaulted on the utility;
  override per-instance rather than redefining the utility.

If a token doesn't fit, flag it for the human to add at the source — suede-css,
or a project-local `--token-name` in the `token` cascade layer. Adding a token
changes a shared surface every other component reads, so it is boundary
movement: [STOP-2] applies. Don't redefine locally; the next reader will assume
the wrong source of truth.

## Scoped `<style>` block recipe

When a block needs scoped CSS — colours, sizing, a hover state — the recipe is:

1. Render a semantic HTML element in the component's own markup, through a Bits UI
   primitive's `child` snippet when one applies ([CSS-2]).
2. Apply a single block class plus any token-backed utilities (`u:fs-*`,
   `u:lh-*`).
3. In the scoped `<style>`, reference that class directly and tokens by name. Stay
   under ~80 lines. Don't wrap the block in `@layer`.

A working example is `src/lib/components/ui/SuedeButton.svelte` in any
suede-family project. The `--hue-blue-500` → `--hue-blue-600` hover transition, the
`[href]` exception for the link variant, the `:focus-visible` outline using a token:
that's the shape.

## When an element earns a class

**[CSS-1]** Wrapper elements are fine. A wrapper gets a class name only if it has
styles, and it has styles only if existing utility classes and data attributes
can't reasonably cover them.

## Common mistakes

- **Reaching for raw HTML where Bits UI implements the behaviour.** `<dialog>`
  instead of `Dialog.Root`, a hand-rolled checkbox. The accessibility is the point.
- **Using `:global` where `child` is available.** The primitive's element can be in
  your own markup, where a scoped rule reaches it ([CSS-2]).
- **Reaching past a semantic token to a primitive.** `background:
var(--hue-neutral-50)` where `var(--hue-z0-bg)` exists. It looks identical in
  light mode and is wrong in dark mode, which is why it survives review.
- **Hardcoding colours, spacing, or font stacks.** A `#hex` value, a `1rem`
  padding, a `font-family: Inter, sans-serif` declaration. Every one of these
  should be a token reference.
- **Adding `!important`.** Wrong cascade layer or specificity war. Move the rule
  to the `layout` layer or restructure the selector.
- **Modifier classes for state.** `.card--reversed`, `.card.is-active`. The data
  attribute is the Exception layer's hook for a reason — it works in JS too.
- **Block CSS growing past ~80 lines.** The block is solving two problems;
  split it.
- **Defining a design token in a scoped `<style>` block.** Tokens live in
  suede-css or in the `token` cascade layer. A `--my-color` declared inside a
  component is invisible to every other component.
- **Wrapping content with `l:grid` and then writing grid-column CSS.** The grid
  spans are data attributes on direct children: `[data-grid-columns="third"]`.
  The grid utility handles the rest.
- **Skipping the cascade layer declaration in a global stylesheet.** A file in
  `src/lib/styles/` that doesn't declare `@layer layout { … }` (or whatever
  layer) lands unlayered and wins by accident, not by intent. Declare the
  layer.
- **Letting suede's element defaults leak in.** Text inside `article` gets a serif at a
  larger size, headings get their own sizes, and `p` gets its own line height. Use a
  `div` for a short item in a list, keep `article` for long-form reading, and audit the
  rendered sizes.
- **Resetting elements in a scoped block and expecting a layout utility to win.** Unlayered
  scoped rules outrank every layer, so `p { margin: 0 }` removes the gaps `l:waterfall`
  would add. Reset in a lower layer, or leave out what the utility sets.
- **Layering a scoped `<style>` block.** Inside a layer, a component's own
  rules lose to any unlayered CSS on the page. Leave scoped blocks unlayered.

## What this skill doesn't cover

This file governs **where a rule goes** — which layer, which token, which
primitive. It does not govern **what the design should be**: which shade carries
which meaning, how much space a hierarchy needs, when a thing should be quieter
than the thing next to it. When a task needs that judgment and no skill covers
it, say so rather than picking a token and calling it a decision.
