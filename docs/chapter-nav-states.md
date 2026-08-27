# Chapter navigation: dot states and row tone

Portable across report branches. Two components show the same chapter list and
must look identical: `ChapterRail.svelte` (the left dot rail, desktop only) and
the "Table of Contents" dropdown in `Header.svelte`. A reader sees both, so a
rule applied to one and not the other is immediately visible as a bug.

## The three dot states

The dot carries the whole state model. There are three, and each is told apart
by **fill and air**, never by an added edge.

| State | Geometry | Paint |
| --- | --- | --- |
| Idle | 10px (`h-2.5 w-2.5`) | hollow — `border-[1.5px] border-base-content/35`, transparent fill |
| Hover | ~6px core (`scale-[0.6]`) inside a ~5px halo | accent fill, border goes `accent` so it vanishes, plus `ring-[9px] ring-accent/25` |
| Current | 12px (`h-3 w-3`) | bare `bg-accent`, no ring, no halo |

```html
<span
  class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {isCurrent
    ? 'h-3 w-3 bg-accent'
    : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover:scale-[0.6] group-hover:border-accent group-hover:bg-accent group-hover:ring-[9px] group-hover:ring-accent/25'}"
></span>
```

Why it is built this way:

- **Hover inverts the current dot's proportions, it does not approach them.**
  The first version kept the dot at 10px and just filled it in with a halo
  around it — accent-plus-air next to accent-alone, only 2px apart in size.
  That read as a slightly dressed-up version of the current dot, and at a
  glance the two states were hard to tell apart. Shrinking the core to a
  pinpoint while widening the halo makes them opposites instead: **the current
  chapter is mostly ink, a hovered one is mostly air.**
- **The halo, not a stroke, is what separates hover from current.** A grey ring
  left around a green fill reads as dirt at 10px, and any visible outline reads
  as an edge drawn *on top of* the dot rather than a dot that has filled in.
- **The shrink is a `scale` transform, never smaller `h`/`w`.** The dot is a
  flex item next to the chapter title; changing its box would slide the title
  ~4px left on every hover. A transform costs no layout.
- **The ring's px value is pre-multiplied.** A ring scales with the element it
  is on, so `ring-[9px]` at `scale-[0.6]` paints a ~5px band. Ask for the band
  you want, then divide by the scale.
- **The border turns `accent` on hover rather than being removed.** Dropping
  `border-width` would resize the content box and make the dot jump; recolouring
  it to the fill keeps the geometry and hides the edge.
- **The current dot never gets a halo or a stroke.** Both were tried: the halo
  doubled the active row's visual weight and turned it into a sticker; the
  stroke read as an outline. Size plus solid fill is enough.

## What counts as hovering a chapter

The dot lights for the whole chapter **including its figures**. The wrapper
holding the chapter button and its nested figure list carries `group/chapter`,
and the dot keys off that:

```html
<div class="group/chapter flex flex-col">   <!-- rail; <li> in the header -->
  <button class="group ...">   <!-- chapter row: dot + title -->
  <ul>   <!-- figure rows -->
```

Hovering any figure row lights its chapter's dot. That is the only thing tying a
figure back to the chapter it belongs to while the panel is open — without it
the nested list floats free of the rail.

The chapter **title** stays on the button's own unnamed `group`, so hovering a
figure lights the dot without also darkening the chapter heading above it. Two
groups, two reaches: `group/chapter` for the dot, `group` for the title.

## No current state in the header

The header dropdown has no "current" state — it is a destination list, not a
position indicator. Its dots are idle-or-hover only, with exactly the classes
above, and the same `group/chapter` reach.

## One resting tone per row

**Nothing inside an unselected row may be darker or bolder than the rest of it.**
Selection is the only thing that changes a row's tone.

That means the figure number is plain text, sharing the row's colour and weight:

```html
{chart.number}
{chart.title}
```

Not `<span class="font-medium">`, not `<span class="opacity-70">`. At 12px a
second weight or a second tint inside an already de-emphasized row does not read
as hierarchy — it reads as two colours, and the panel loses its single resting
tone. The figure number is already set apart by position (it comes first) and by
the accent connector line down the left of the group.

**And the rule holds across rows, not just within one.** Chapters and their
figures share ONE resting alpha. They had drifted apart — chapters at `/55` and
figures at `/70`, or `/45` on some branches — which put the nested figure rows a
step *darker* than the chapter headings they sit under: sub-items reading
stronger than their own parent. One panel, one resting tone.

The shared value is the branch's quiet-text alpha from
[type-rendering.md](type-rendering.md), taken as the *higher* of that and
whatever the rows already carried, so no row ever gets lighter than it was:

| branch | resting alpha | on the panel |
| --- | --- | --- |
| `iw` | `/70` | 4.49:1 |
| `main` | `/70` | 5.00:1 |
| `kiel-institute` | `/70` | 6.14:1 |
| `template` | `/65` | 5.21:1 |
| `findevlab` | `/55` | 4.76:1 |

`/55` was 3.04:1 on `iw` and 3.29:1 on `main` — the lightest text left anywhere
in those reports, and below the floor every other caption now clears. On
`findevlab`'s pure-black ink the same `/55` already measured 4.76:1, which is
why it stays: the number was never the rule.

Resting and selected tones:

| Row | Idle | Hover | Current |
| --- | --- | --- | --- |
| Chapter title | branch resting alpha, `text-base` | `text-base-content` | `font-semibold text-primary` |
| Figure row | branch resting alpha, `text-sm` | `text-base-content` | `font-medium text-primary` |

## Panel width and size

`w-96`, not `w-72`. At `w-72` the title had 224px — about 32 characters at
`text-sm` — and a German chapter title runs past 55, so nearly every row wrapped
to two lines and the panel read as a wall of text. `w-96` gives it 320px, and at
`text-base` that is ~40 characters, so short and mid-length titles sit on one
line and only the longest still turns.

Sizes come up one step with it: chapter titles `text-sm` → `text-base`, figure
rows `text-xs` → `text-sm`. A 12px row in a de-emphasized tone was asking a lot
of a reader scanning a nav.

There is room to go further: the rail starts at `left-9` and the chart at `40%`,
so at the 1400px breakpoint a `w-96` panel still ends 140px clear of the plot.

## Applying to a branch

Both files are per-branch copies, so the change is made branch by branch, and
the branches do not all paint the dot in the same token. Whatever a branch uses
for its **current** dot is its selected colour, and hover uses that same colour:

| Branch | Selected colour | Notes |
| --- | --- | --- |
| `main` | `accent` (bright green) | halo at `/25` |
| `kiel-institute` | `accent` (orange) | halo at `/25` |
| `iw` | `accent` (amber) over a `border-primary` stroke | the amber is light on both surfaces the rail crosses, so it keeps its hairline stroke in *both* the hover and the current state; the halo is still what separates them. The stroke scales with the core, so on hover it paints at ~0.9px — a hairline, which is all it needs to be |
| `findevlab` | `primary` (navy) | halo at `/15` — a dark fill needs a fainter halo than a bright one, and it stays `/15` at the wider band |
| `template` | `base-content` | halo at `/10`; this rail is deliberately colourless, greys and near-black only |

`scale-[0.6]` and `ring-[9px]` are the same everywhere; only the colour and the
halo's opacity are per-branch. The opacities did not all move when the band
widened: `/30` dropped to `/25` because a wide band of saturated accent at 30%
started to read as a second dot, while the already-faint `/15` and `/10` needed
the extra area to stay visible at all.

`findevlab` and `template` already had the halo — on the *current* dot. Applying
this model moves it: the current dot loses its ring and hover gains one.

Branches whose header TOC is a plain link list, with no dots (`fdl`, `iea`,
`findevlab`), need no change there.
