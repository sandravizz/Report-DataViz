# The accent cursor

`CursorDot.svelte` replaces the system pointer with a solid dot inside a bigger
translucent accent halo — **over the cover only**. Mounted once at the top of
`+page.svelte`; the report proper keeps the pointer the reader came with.

## Why it is scoped to the cover

**Cost.** The report proper is charts and long-form copy, and a cursor there
charges for both: a filled halo travels over the data, and hiding the system
pointer takes away the I-beam over running text and overrides a reader's
enlarged-pointer accessibility setting (macOS scales *CSS* cursors with that
setting; a cursor drawn in JavaScript ignores it). The cover has no charts and
no reading — a title, two credit links, an illustration and a scroll arrow.

So the dot is a flourish on the title page, where it is free, and the report
pays none of it. This also keeps the palette rule intact: the accent is spent on
things that *point*, and the two credit links the cursor moves between are the
other place it is spent on this same screen.

## The paint on this branch

The reference version on `main` is an **accent dot in an accent halo**, and
that works there for one reason: its cover is a black-and-white photograph
under a `black/50–65` scrim — uniformly dark, no bright patches — so a bright
accent reads at full strength with nothing propping it up.

This cover is the opposite. It is Cristina Claverol's turbine illustration on
`base-200`, light from edge to edge, and the accent is a light green (about
1.7:1 on white). An accent dot on it would need a dark hairline to survive, and
that hairline is what makes a dot read as a bordered bead rather than a mark.

So the dot takes **`base-content`** — the cover's own type colour, the ink the
headline and the credits are already set in — and the halo keeps the accent.
That is the portable rule:

> The dot is whatever reads on that branch's cover; the halo is always the
> accent at 35%.

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

## What the reader sees

A 9px solid `base-content` dot centred in a 28px halo filled with `accent/35` —
the same translucent-accent value as the PNG button in `FigureFooter.svelte`
and the Interpretation button in `ChartDisplay.svelte`. That is three instances
of one number; change it in one and change it in all three.

There is no hairline on the halo. The dot inside it already carries the edge,
and a stroke around a 28px translucent ring reads as a bordered bead.

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
