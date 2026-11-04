---
name: design-self-critique
description: >
  How to build a large page and check visual work before showing it. Use when building a
  page with several sections, or when reviewing rendered UI against a reference or brief.
---

# Design self-critique

This skill owns how visual work gets built up and checked. What the work should look like
belongs to the design skills it's checked against.

**[DSC-1]** Work section by section on a large page. Finish and check one section before
starting the next, because quality drops when a large page is built straight through.

**[DSC-2]** Critique a rendered screenshot, and use more than one kind of check, since
each one misses things:

- **Blur:** render the screenshot blurred to judge hierarchy, contrast, whitespace and
  layout. It can't show type ratios or small positioning bugs.
- **Measure:** read real positions and sizes from the page. It catches margin and alignment
  bugs that look plausible, and confirms whether a fix worked.
- **Audit type:** list every size and line height on the page. Strays show up immediately.

**[DSC-3]** Look at small details at full size. A link's position in a strip or a faint
band beside it can decide whether a page feels finished, and neither survives a blur.

**[DSC-4]** Before calling something a gap in the system, check what already exists. Read
the tokens and utilities, and report a gap only once none of them fits.

**[DSC-5]** Ask whether the page has a point of view. Name its idea, hero and signature
element under `DPV-1`, then ask what could be bolder. Correct and plain isn't finished.
Name each section's weakest choice and fix it before showing the page.

**[DSC-6]** Run the convention audit before showing a page, and again after the last fix:

```sh
bash .claude/skills/design-self-critique/audit.sh src/routes/your-page
```

Fix each finding, or name it as a deliberate exception in your report. Reading a rule
doesn't mean the code follows it, and the audit shows what actually happened.
