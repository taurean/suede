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
  Became: PDT-1, PDT-2, PDT-3 for text size, weight and icons. PDC-1 for colour, PDE-1 for elevation

- "lets update the /design-training skill to include doing this in the future except with numbered lists instead of bullets."
  Why: not stated
  Became: step 4 of the design-training skill

- "we can have a skill for product-design-typography. our guides should be split by type of work and discipline."
  Why: not stated
  Became: `product-design-typography`, and the design-training skill's section on where rules go

- "both should apply to product design (color and elevation). go ahead and update the conflict as you said as well."
  Why: not stated
  Became: PDC-1, PDE-1, and the split replacing the old test for proposing a new skill

- "they are different, yes. elevation is not used for emphasis."
  Why: not stated. Correcting my claim that colour and elevation both answer "how much emphasis".
  Became: PDE-1, in its own `product-design-elevation` skill

- "elevation is used to communicate relationship and focus. popovers communicate that this is related to the context it came from. modals capture attention during a different flow."
  Why: stated in the note itself
  Became: PDE-1

## gitbook

- "your version differs in lots of places. your text in buttons is bolder. in the top nav. the spacing is not correct in the hero. the text weight and size is very different in that notice at the top. theres a subtle background and border on the drift checks for every space bit. the toggles on the hero image look like a bug [Image #1] the set up your assistant heading is much larger and bolder than the get started with AI in the gibook site. the AI selector bit looks completely different. you didnt do that agent traffic checker thing. basically your version is extremely different. you should align it better."
  Why: not stated
  Became: waiting

- "something that you can do which helps is render your screenshots with a blur applied to help understand heiarchy and contrast, whitespace, and layout."
  Why: stated in the note itself
  Became: waiting

- "take a look at the differences in spacing between your stale page tracker and theirs. their supporting text is slightly lighter than yours, lower contrast. like under the headings I mean. spacing around "a system for accurate docs..." needs work. your cards in that section look completely different. your footers are entirely different. work section by section of the page and dont move on until you are happy with each one."
  Why: not stated
  Became: waiting

- "I hear you, this is the second time the scale issue was raised. we can go back to utopia.fyi and modify the scale or change our approach entirely."
  Why: not stated. Replying to my point that suede lacks a usable default type system.
  Became: `needs.md`

- "yeah, thats really bad. we need a spacing system for sure."
  Why: not stated
  Became: `needs.md`

- "yes, suede has little-to-no real components. thats a known issue. I would like to address it very very soon."
  Why: not stated
  Became: `needs.md`

- "we use harmony for our color tokens. I like it because you know exactly what the chroma contrast values will be while switching hues, but I do feel very limited by them. we may need a new system for color."
  Why: stated in the note itself
  Became: `needs.md`

- "maybe there would need to be a skill for interpreting a sketch. we are not ready to build and test that though, your output is still really really bad for now."
  Why: stated in the note itself
  Became: `needs.md`, not ready

- "Yes! I do want to come up with composition patterns. I was calling them recipes in the suede docs. that is not built."
  Why: not stated
  Became: `needs.md`

- "illustrations and detail is not something you will be required to produce, placeholders are fine as long as they genuinely take up the space the real thing should, for layout reasons."
  Why: stated in the note itself
  Became: `needs.md`, out of scope, waiting as a rule

- "yes, self-critique skills across many axis would be very valuable."
  Why: not stated
  Became: `needs.md`

- "section-by-section passes do seem needed, because I noticed the work quality would drop dramatically after a certain point when you work straight through a large task like this."
  Why: stated in the note itself
  Became: `needs.md`, waiting as a rule

- "the issue of this coming from just gitbook is a concern of mine. thats why we will go through it as if gitbook was the only source, and then do it again with new sources, chipping away at it like marble. I think we need to track known needed things."
  Why: stated in the note itself
  Became: `needs.md`

- "well look into utopia.fyi first. hybrid is very interesting. I do not want to use breakpoints almost ever btw."
  Why: not stated
  Became: waiting

- "so whats important btw is that I can design static mocks at min and max in figma for planning and have those tokens represented. those should cover the gamut between an iphone mini to an HD screen, so like 1440 I guess. past 1440, everything centers by default, and then I can have some exceptions that pull the whole 1440 container to the left or right edge, or something idk."
  Why: stated in the note itself
  Became: waiting, shapes the type and spacing test

- "how might it break? sizes can scale, they dont need to fall on whole numbers. browsers handle that gracefully."
  Why: stated in the note itself. Correcting my emphasis on whole-pixel values.
  Became: waiting

- "content should typically be fluid, containers typically being sized based on their children content."
  Why: not stated
  Became: waiting

- "what I just said is how rendered HTML works by default, so we are going "with the grain" of the browser as frank chimero once said. structural changes yes. go ahead."
  Why: stated in the note itself
  Became: waiting, shapes the type and spacing test

- "yo! this is looking good. UI should have a line height of 1 typically, when the intention is to always be one line of text. then we can have some other primatives for tight and loose. generally, the smaller the text the more spacing needs to go up a bit since its a ratio of text size and it gets hard to tell things apart. it inverts for very large text."
  Why: stated in the note itself
  Became: waiting, candidate tokens in `scale-tokens.css`

- "also, although the content of the page should follow the rules I said, the content should look like its natively living in the page. [Image #2] this looks odd on the edges."
  Why: not stated. Said about the 1440px window floating as a rounded box at a wider viewport.
  Became: waiting

- "I only meant line height."
  Why: not stated. Narrows the note about smaller text needing more spacing, after I had also applied it to letter spacing.
  Became: letter-spacing tokens removed from `scale-tokens.css`

- "go through and redo the gitbook stuff now"
  Why: not stated
  Became: `src/routes/training/scale-test/gitbook/`

- "what about a utility class to force the pill shape? I think all of this looks good. I'm surprised we need letterspacing. this might be a typeface issue which would be out of scope."
  Why: stated in the note itself
  Became: `u:radius-full` in the scale test, letter spacing removed, typeface listed as out of scope in `needs.md`

- "before we do that, we have more testing to do in this branch. I want to try converting another screenshot or web page, I want to do a sketch, and I want to see what you do purely with a text prompt. I want to see how close we are to you producing good outputs without all of this correction and explicit references."
  Why: stated in the note itself
  Became: waiting, sets the next tests

## underconsideration

- "text size really feels all over the place and is missing the rhythm that the real site has."
  Why: not stated. I traced it to links and date headings falling through to suede's larger defaults, and to spacing that doesn't follow the line height.
  Became: waiting

- "oh yeah, we can totally add more data-grid-columns."
  Why: not stated
  Became: `data-grid-columns="sixth"` in `port-to-suede-css.css`

- "there are some tinted-ish ones, like zinc or slate I think"
  Why: not stated. Correcting my claim that suede had no tinted dark option.
  Became: panel, news column, rules and placeholders use the slate scale

- "[Image #3] this bit looks busted. new column is fine."
  Why: not stated. About the news column's dark background extending above the panel beside the image. I read "new column" as the news column's colour being fine.
  Became: fixed, only the image overlaps the top edge

- "the thing I was flagging was the vertical positioning of "headline news" and the missing vertical break next to it that the real site has"
  Why: not stated. Corrects my reading of the previous note, where I fixed the column's background instead.
  Became: link centred in the top strip, faint band added beside it

- "ver very very dope. what can you learn from this?"
  Why: not stated
  Became: prompted the numbered list below

- "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 are all great and should show up in skills somewhere. idk the article issue yet. I dont understand 18. 19 is a good callout, idk how to address. 20 is known."
  Why: not stated. The numbers confirm my list: rhythm first (DTR-1), line height by job and size (DTR-2, DTR-3), the browser's grain (DPL-1), native page edges (DPL-3), section-by-section work (DSC-1), the blur check (DSC-2), placeholders holding space (DPL-4), checking existing tokens (DSC-4), small details (DSC-3), related sizes (DTR-4), spacing from line height (DTR-5), a real grid for deliberate columns (DPL-2), several kinds of check (DSC-2).
  Became: `design-type-rhythm`, `design-page-layout`, `design-self-critique`

- "I think this is where media queries might make sense. but only if changes to the grid use should change. the number of columns should not change."
  Why: not stated. Answers the `l:grid` question: the grid keeps its columns, and a media query may change how children span them.
  Became: waiting, resolves the `l:grid` need in `needs.md` once tried on a page

## drydown

Built from two sketches, prose notes and brand guide screenshots. The route was removed from the working tree before the clean-context test.

- Not a human note: the entry below comes from comparing that build with a human designer's version.
  Why: my own reading of the comparison, not yet confirmed by the human
  Became: `design-point-of-view`, `DSC-5`, `--text-6xl` and `--text-7xl`, all unconfirmed

- "before I answer, lets think about this. the next test is just a text prompt. and I think I am going to do it with the context wiped. so we should get everything into a state that we want it at to hopefully give you success."
  Why: stated in the note itself
  Became: scale moved to `port-to-suede-css.css`, conventions written into `writing-css`

- "I just raised your effort. go ahead and do whatever work is needed to prepare this environment, I'll be using this same worktree."
  Why: not stated
  Became: the preparation above, committed on this branch

- "I do have another prototype thing that I had built this morning and I have not given any visual design guidance yet. I have only given ux flow guidance. lets take what we learned here and update all of our skills and stuff as needed. then we'll do this again in a nother fresh test. this time I'll describe the project, provide screenshots of the current prototype, and provide some screens of design inspiration for reference."
  Why: stated in the note itself. A transcript of the clean-context test shows every design skill loaded and `writing-css` was read, and the page still broke its layout conventions, so the fix is a recipe and a verifier, not more wording.
  Became: `CSS-3` to `CSS-5`, `DSC-6` and its audit script, `design-from-references`, sharper `DPV` wording. All written on this go-ahead; the numbered list from the comparison was never answered individually.
