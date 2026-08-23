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
| Hover | 10px | accent fill, border goes `accent` so it vanishes, plus `ring-4 ring-accent/30` |
| Current | 12px (`h-3 w-3`) | bare `bg-accent`, no ring, no halo |

```html
<span
  class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {isCurrent
    ? 'h-3 w-3 bg-accent'
    : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover:border-accent group-hover:bg-accent group-hover:ring-4 group-hover:ring-accent/30'}"
></span>
```

Why it is built this way:

- **The halo is what separates hover from current**, not a stroke. A grey ring
  left around a green fill reads as dirt at 10px, and any visible outline reads
  as an edge drawn *on top of* the dot rather than a dot that has filled in.
  Hover = accent with air around it. Current = accent alone.
- **The border turns `accent` on hover rather than being removed.** Dropping
  `border-width` would resize the content box and make the dot jump; recolouring
  it to the fill keeps the geometry and hides the edge.
- **The ring is drawn outside the box**, so the halo costs no layout and nothing
  in the row shifts. `transition-all duration-200` animates fill and halo
  together.
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

Resting and selected tones, the same in both components:

| Row | Idle | Hover | Current |
| --- | --- | --- | --- |
| Chapter title | `text-base-content/55` | `text-base-content` | `font-semibold text-primary` |
| Figure row | `text-base-content/70` | `text-base-content` | `font-medium text-primary` |

## Applying to a branch

Both files are per-branch copies, so the change is made branch by branch, and
the branches do not all paint the dot in the same token. Whatever a branch uses
for its **current** dot is its selected colour, and hover uses that same colour:

| Branch | Selected colour | Notes |
| --- | --- | --- |
| `main` | `accent` (bright green) | halo at `/30` |
| `kiel-institute` | `accent` (orange) | halo at `/30` |
| `iw` | `accent` (amber) over a `border-primary` stroke | the amber is light on both surfaces the rail crosses, so it keeps its hairline stroke in *both* the hover and the current state; the halo is still what separates them |
| `findevlab` | `primary` (navy) | halo at `/15` — a dark fill needs a fainter halo than a bright one |
| `template` | `base-content` | halo at `/10`; this rail is deliberately colourless, greys and near-black only |

`findevlab` and `template` already had the halo — on the *current* dot. Applying
this model moves it: the current dot loses its ring and hover gains one.

Branches whose header TOC is a plain link list, with no dots (`fdl`, `iea`,
`findevlab`), need no change there.
