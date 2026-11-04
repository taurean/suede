---
name: design-page-layout
description: >
  How a page takes up the viewport and adapts across widths. Use when laying out a page or
  section, choosing between fluid, grid and breakpoint behaviour, or placing placeholders.
---

# Page layout

This skill owns how a page responds to its viewport. Which utility or layer implements a
layout belongs to `writing-css`.

**[DPL-1]** Go with the grain of the browser. Content is fluid and containers size from
their children, so things wrap when they run out of room. Use a limit like a maximum text
width where content would otherwise grow without end. Save breakpoints for structural
changes that wrapping can't make, like a sidebar becoming a menu.

**[DPL-2]** A page with deliberate columns uses a real grid. The grid sets the columns,
and content sizes itself inside them. DPL-1 doesn't replace it: content can't align
separate columns with each other.

**[DPL-3]** Content looks native to the page. Backgrounds and rules reach the viewport
edge, and past the page's maximum width only the content stops and centres. A page never
reads as a box floating on another page.

**[DPL-4]** Placeholders hold the space the real thing would take, so the layout stays
true. They don't need to imitate it. Keep them quiet, since they aren't the content.
