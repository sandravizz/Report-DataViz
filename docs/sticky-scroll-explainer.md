# How the sticky scroll sections work

Notes on the scrollytelling mechanics in this project — why sections stay pinned
while you scroll, what controls how long they stay pinned, and how the chart
animation is paced. Written 2026-07-05, after equalizing the title and chart
section stickiness.

## The core trick: a tall container with a sticky, screen-sized child

Every pinned section in this project uses the same pattern:

```html
<div style="height: 300vh">            <!-- the container (the "strip") -->
  <div class="sticky top-0 h-screen">  <!-- the pinned view (the "window") -->
    ...content...
  </div>
</div>
```

Picture the sticky element as a **window** (always exactly one screen tall,
`100vh`) sliding down a long **strip of paper** (the container). While the
window travels down the strip, whatever is inside it stays frozen on screen —
that is the sticky effect. When the window reaches the bottom of the strip,
`position: sticky` releases and the section scrolls away normally.

## Runway

**Runway = container height − 100vh.** It is the scroll distance during which
the content stays pinned.

- A `150vh` container → 50vh of runway → the content unpins after half a
  screen-height of scrolling. (This was the original title/intro behavior —
  it felt like you barely paused before hitting the charts.)
- A `560vh` container → 460vh of runway → you scroll four and a half
  screen-heights before the section lets go.

The pinning itself is identical in both cases; **only the runway length
differs**. If two sticky sections feel very different, compare their container
heights.

## How the runway drives the chart animation

In `ScrollySection.svelte`, scrolling through the runway is what advances the
charts. A `progress` value maps your position in the runway to `0 → 1`:

```js
progress = (scrollY - containerTop) / (containerHeight - vh)
activeIndex = Math.round(progress * (pairs.length - 1))
```

At the start of the runway you see chart 1; at the end, the last chart; the
swaps happen at evenly spaced points in between. So the runway length directly
controls the *pacing*: more runway = slower, calmer transitions; less runway =
snappier (and eventually too-fast) flipping.

## The "tail" problem (the old formula)

The container height used to be:

```
height = numberOfCharts × 120vh + 200vh
```

The flat `+200vh` was added regardless of how many charts a section had.
Worst case: a section with **one** chart got `1 × 120 + 200 = 320vh` of
container, i.e. **220vh of runway with nothing to animate** — you scrolled
more than two full screens while the picture stayed completely still. That
dead stretch is the **tail**, and it made chart sections feel far heavier than
the 50vh title sections.

## Transitions, not charts (the fix)

A **transition** is one chart swapping to the next. With *n* charts there are
only *n − 1* transitions; with 1 chart there are zero. The old formula bought
runway per **chart**, so it paid 120vh for a swap that never happened.

The new formula counts the actual swaps:

```
height = (numberOfCharts − 1) × 120vh + 200vh
```

- **1-chart section:** zero transitions → just the 200vh base → 100vh of
  runway, exactly matching the title sections.
- **3-chart section:** two transitions → 200 + 240 = 440vh → 340vh of runway,
  enough to pace both swaps with no dead tail.

The title/intro sections were changed from `h-[150vh]` to `h-[200vh]` at the
same time, doubling their pause from 50vh to 100vh and making the base feel of
both section types identical.

## Tuning knobs

| Feel | Knob | Where |
| --- | --- | --- |
| Title/intro pause length | `h-[200vh]` on the section | `src/routes/+page.svelte` |
| Chart section base pause | the `+ 200` constant | `src/lib/components/ScrollySection.svelte` |
| Speed of chart swaps | the `× 120` per-transition constant | `src/lib/components/ScrollySection.svelte` |

Rule of thumb: keep per-transition runway comfortably above ~80vh so readers
can absorb each chart before the next swap.
