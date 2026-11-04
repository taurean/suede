# Critique log

The human's notes, newest last. Format is defined in `SKILL.md`, steps 5 and 6.

```
## <round slug>

- "<their words, verbatim>"
  Why: <their reason, or "not stated">
  Became: <rule ID, or "waiting">
```

## ticket-table

- "I agree regarding element selectors."
  Why: agreeing with my proposal: an element selector fits when the tag already says what the thing is, like `kbd` and `small`, and a class fits when a `span` needs a name. Their own reason not stated.
  Became: waiting

- "wrapper elements are totally fine. they should only get class names if they have styles, and they should only have styles if they cant reasonably be covered with existing utility classes and data-attributes."
  Why: not stated
  Became: CSS-1

- "_generally_ custom properties work like an API for a class, a thing that can be tweaked with some guard rails basically. its also useful when the value has some semantic meaning that is being used somewhere that would otherwise make it hard to understand."
  Why: stated in the note itself
  Became: waiting

- "by guard rail, its typically enough that we're stating where the value will be used such as which property."
  Why: refines the note above, and corrects my claim that `--action-*` had no guard rails
  Became: waiting

- "I see, yeah I like that I think."
  Why: not stated. Said about using Bits UI's `child` snippet so an element stays in the component's own markup and its styles stay scoped.
  Became: CSS-2

- "yeah, that makes sense. lets clean that up to align this new information."
  Why: approving CSS-2 and aligning the recipe, `CLAUDE.md` and `SuedeButton` with it
  Became: CSS-2

- "we should not have to mention button explicitly because: 1. ideally we are using SuedeButton everywhere and 2. when an exception is needed, the previous rules already point to that solution."
  Why: stated in the note itself
  Became: CSS-2 wording, exception removed

- "agreed, I really dont like it. lets remove it."
  Why: about the CUBE bracket convention in class lists. Their own reason not stated beyond disliking it; I had argued the `u:` and `l:` prefixes already show the layer.
  Became: removed from `writing-css`

- "the idea behind the --hue-z*-* thing was so that it was clear which sets of contextual colors lived together. that may not be perfect and need some work. I agree that muted is likely to be needed."
  Why: stated in the note itself
  Became: waiting

- "sounds good, I'm into that suggestion. I do think we need a --hue-white and --hue-black for the extremes, they are useful."
  Why: approves giving every z-layer set the same shape (`bg`, `fg`, `muted`, `border`). The reason for white and black: "they are useful" for the extremes.
  Became: waiting, a suede-css change for the human

- "we can create a global "port-to-suede-css" style css file with our additions, wrapped in @layers"
  Why: not stated
  Became: `src/lib/styles/port-to-suede-css.css`

- "yes to text size, yes to weight, yes to strong color is rare, yes to elevation is subtle and has a purpose and I would add is rare. yes icons match text."
  Why: not stated. Confirming my observations of the reference: one text size does most of the work and hierarchy comes from colour and placement; weight stays quiet and headers use muted colour and a tinted background instead of bold; near-black, red and blue each have one narrow job; surfaces separate through small tonal shifts and hairlines; icons are about 16px with a light stroke and sit with the label. Fixed heights and identifiers stepping back were not confirmed.
  Became: PDT-1, PDT-2, PDT-3 for text size, weight and icons. PDC-1 and PDC-2 for colour and elevation

- "lets update the /design-training skill to include doing this in the future except with numbered lists instead of bullets."
  Why: not stated
  Became: step 4 of the design-training skill

- "we can have a skill for product-design-typography. our guides should be split by type of work and discipline."
  Why: not stated
  Became: `product-design-typography`, and the design-training skill's section on where rules go

- "both should apply to product design (color and elevation). go ahead and update the conflict as you said as well."
  Why: not stated
  Became: PDC-1, PDC-2, and the split replacing the old test for proposing a new skill
