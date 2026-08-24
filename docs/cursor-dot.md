# The accent cursor

`CursorDot.svelte` replaces the system pointer with a solid accent dot inside a
bigger translucent accent halo — **over the cover only**. Mounted once at the
top of `+page.svelte`; the report proper keeps the pointer the reader came with.

## Why it is scoped to the cover

This is the load-bearing decision, and it came from trying the alternative.
Two things that are true everywhere else on the report stop being true on the
Landing:

**Contrast.** On this theme the accent is `#0FFF95` at 1.3:1 on white. Over the
chapter ground or a white figure surface the dot needs a dark hairline to
survive at all, and that hairline is what makes it read as a bordered bead
rather than a mark. The cover is a black-and-white photograph under a
`black/50–65` scrim — uniformly dark, no bright patches — so the accent reads at
full strength with nothing propping it up.

**Cost.** The report proper is charts and long-form copy, and a cursor there
charges for both: a filled halo travels over the data, and hiding the system
pointer takes away the I-beam over running text and overrides a reader's
enlarged-pointer accessibility setting (macOS scales *CSS* cursors with that
setting; a cursor drawn in JavaScript ignores it). The cover has no charts and
no reading — a title, two credit links and a scroll arrow.

So the dot is a flourish on the title page, where it is free, and the report
pays none of it. This also keeps the palette rule intact: the accent is spent on
things that *point*, and the two credit links the cursor moves between are the
other place it is spent on this same screen.

## The zone

Landing.svelte's root `<section>` carries `data-accent-cursor`, and nothing else
in the report does. The component looks for that attribute rather than a
hard-coded id or class, so moving the zone — or giving a branch a second one —
is done in the markup and never in the component.

`cursor: none` is scoped to it too:

```css
html.has-dot-cursor [data-accent-cursor],
html.has-dot-cursor [data-accent-cursor] * { cursor: none !important; }
```

`*` and `!important` are both load-bearing: the cover's credit links are
anchors, and the UA stylesheet's `cursor: pointer` on those beats a plain
descendant rule. The `has-dot-cursor` class is put on `<html>` by the component
in `onMount`, never by a stylesheet — so a page that fails to hydrate keeps its
arrow instead of having no cursor at all.

## Links keep the hand

Inside the zone, anything pressable — `a, button, summary, [role="button"]` —
keeps the system pointer, and the dot hides while it is over one. A link has
one job, to say "this is clickable", and the hand is how it says it; swapping
that for a decorative dot spends a real affordance and buys nothing. Without
this the cover's two credit links read as plain text.

It takes two halves that must stay in step: a CSS rule that hands `cursor` back,
and `showsDotAt()` in the component, which hides the dot so the reader never
gets a hand and a dot at once. The CSS rule out-specifies the `cursor: none`
one on the strength of `:is()` — a group's specificity is its heaviest member,
here `[role="button"]`, which lands these at (0,3,1) against (0,2,1). Adding a
plain element to that group is free; adding one heavier than `[role="button"]`
would change the arithmetic.

## What the reader sees

A 9px solid accent dot centred in a 28px halo filled with `accent/35` — the same
translucent-accent value as the PNG button in `FigureFooter.svelte` and the
Interpretation button in `ChartDisplay.svelte`. That is three instances of one
number; change it in one and change it in all three.

There is no ink hairline on the halo. The ground under this cursor is always the
dark cover, so there is nothing for one to rescue and it would only muddy the
green.

**There is no animation and no lag.** An earlier version had the halo trail a
few frames behind and light up with the speed of the movement; on the page it
read as a smear following the pointer rather than as a cursor. A cursor is not a
thing that animates — it is a thing that is where the pointer is. Nothing here
transitions, eases, pulses or fades, and for the same reason there is no
`prefers-reduced-motion` check: there is no motion to reduce.

## Scrolling, which is the tricky part

The cover is full-bleed and it is the block the reader scrolls away from, so the
zone can be entered and left **with the pointer completely still** — and then no
pointer event fires at all. Handling only `pointermove` leaves the dot hanging
over the first chapter after a wheel scroll, and never brings it back when the
reader scrolls up to the cover again.

So `scroll` sets a `recheck` flag, and the next frame asks
`document.elementFromPoint(x, y)` what is actually under the pointer now. The
layer is `pointer-events: none`, so it never answers its own question.
`pointermove` does not need the lookup — the event already knows what it hit,
and `event.target.closest(ZONE)` is cheaper.

## Where it refuses to run

The gate is checked once in `onMount`:

```js
matchMedia("(any-hover: hover) and (pointer: fine)")
```

Both halves are wanted. `pointer: fine` alone still passes for a stylus, which
has no hover state, so the dot would sit stranded wherever the last tap landed.
When the gate fails the component renders nothing and the native cursor is never
hidden anywhere.

Removing the feature from a branch entirely is one line: delete `<CursorDot />`
from `+page.svelte`.

## Applying to a branch

The component itself is portable — it reads `--color-accent` and
`--color-base-*`, so it needs no edit. The **paint** is not portable, because
it is a contrast decision against a cover, and the covers are not alike. The
rule:

> The dot is whatever reads on that branch's cover; the halo is always the
> accent at 35%.

| Branch | Cover | Dot |
| --- | --- | --- |
| `main` | B/W photo under a `black/50–65` scrim, uniformly dark | `accent` — a bright green that needs nothing propping it up |
| `kiel-institute` | flat cream page, blue type, one orange chevron | `accent` — the orange is the only warm thing on screen |
| `findevlab` | sky/fjord photo, `black/20→65` scrim, white type | `accent` — the rust is the one saturated hue and is mid-dark, so it holds at 4.8:1 on the sky and 4.4:1 on the scrim |
| `iw` | rooftop photo, `black/55–70` plus a 0.58 radial, white type | `base-100` — IW's blue is ~3.7:1 on black; the dot takes the cover's own type colour instead |
| `template` | turbine illustration on `base-200`, light throughout | `base-content` — the accent is a light green and would disappear |

Two things follow from the table. A **light** accent needs a dark cover and a
**dark** accent needs a light one; where the cover and the accent are on the
same side of the ramp, the dot borrows the colour that cover already uses for
type. And on a photograph, what matters is not the accent's contrast on white
but its contrast across the photo's *range* — a mid-luminance accent survives
one, a light or dark one does not.

The halo is `accent/35` everywhere. Where the accent is dark and the cover is
dark (`iw`), that halo is subtle by construction; raising it on that branch is
fine, but raise it in `.cursor-halo` only — the two buttons that share the
number sit on white and have a different problem.

## Cost on the frame budget

Position never touches Svelte's reactivity — it is written straight to
`style.transform`. Only `visible` is state, and it changes when the pointer
enters or leaves the cover.

The two circles are **mounted once** and shown or hidden with a class rather
than added to and removed from the DOM. That keeps the refs stable, which is
what lets the rAF callback write a transform without ever racing a mount — an
`{#if}` around them means the first frame after the dot reappears can fire
against elements that do not exist yet, and paints it at the top-left corner.

Writes are batched to one per frame: `pointermove` and `scroll` both fire
several times between paints, and each write would otherwise cost a style
recalculation for a position about to be overwritten. There is no standing loop
— a frame is requested only in response to an event, so a still pointer on a
still page costs nothing.
