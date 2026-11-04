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
