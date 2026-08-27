# Scrolly Line Draw-In: Revealing a Multi-Line Chart Step by Step

Notes on the progressive-reveal treatment for line charts — one figure split
into several scroll steps that add one line at a time, with each new line
drawing itself from left to right. Written 2026-07-17, when figure 2 (the
workforce growth index) became a four-step reveal. The mechanism is generic:
any line figure on any branch gets the effect the same way.

## What the reader sees

A multi-line chart enters the story one line at a time. Each scroll step is a
full figure (own number, title, and description in the scrolly columns), but
the chart underneath appears continuous: lines already on screen carry over
through the normal crossfade without re-animating, while the step's *new* line
wipes in from the left over ~1.3s — always painted **on top of** the lines
already there. Once the line arrives, its end label, any figure-level callout,
and the step's **difference band** (a transparent fill between the new line
and the previous step's line, with the gap written inside it) fade in. Moving
to the next step takes the band away with the panel crossfade before the next
line draws.

The animation is **one-shot per page load**: the first visit to a step plays
the draw-in; every later visit — most importantly scrolling back up — shows
the finished state instantly (line drawn, labels and band visible), with no
replay.

## The two halves

**1. Content: one figure file, several step objects.** The figure file builds
a shared `base` (data, axes, subtitle, source) and exports an array of steps
that spread it, each with its own `number`/`title`/`description` and a series
list. Give every step a `title` describing *its own* new line — the figure's
summarizing headline is only true once the last series is on screen, so it
belongs to the last step, not to all of them. A helper flags the step's newcomer:

```js
const stepSeries = (newValue, values) =>
  allSeries
    .filter((s) => values.includes(s.value))
    .map((s) => ({ ...s, drawIn: s.value === newValue }));

// step 2b: grids is new, efficiency carries over
series: stepSeries("grids", ["grids", "efficiency"]),
```

`drawIn: true` is the whole contract between content and mechanism: a series
with the flag animates, everything else renders normally. A step may also
carry a `diffBand` — the transparent gap fill between its new line and the
previous step's line:

```js
// { y1, y0, color, label, labelX, labelY } — built by a small helper in the
// figure file from the last data row, so the label (the 2024 gap, in
// percentage points of growth on this index chart) stays in sync with data.
diffBand: diffBand("wind", "grids"),
```

The band is filled with the new line's color at 0.3 opacity, revealed on its
own delay a beat after the labels, and lives only on its own step's panel, so
it disappears with the crossfade when the reader moves on.

Anything that frames the chart rather than commenting on one step — an index
base rule, a recession band, a target line — belongs on the shared `base`, not
on a single step. Rule and range annotations render in `belowMarks` with no
reveal class, so a rule on `base` is on screen from the first step, before any
line draws: the reader learns what the lines are indexed to *before* they start
moving, rather than after the last one lands. The steps array is
registered in `src/lib/data/index.js` and used directly as a section's
`charts` in `+page.svelte` — to ScrollySection it is just a sequence of
figures, like any other chapter. See
`src/lib/data/figures/02-workforce-growth-index.js` for the full example.

**2. Mechanism: an `active` flag plus CSS.** The moving parts live in the
shared components, so figure files never touch them:

- `ScrollySection.svelte` passes `inView` down: the first step counts as
  "active" (`activeIndex` 0) even while the section is still below the fold,
  so the flag only turns on once the section is ~30% up the viewport —
  otherwise step 1's line would finish drawing before the reader ever sees it.
- `ChartDisplay.svelte` computes `active = i === activeIndex && inView` per
  panel and hands it to `ChartPanel.svelte`, which forwards it to
  `LineChartPanel.svelte` (the only consumer).
- `LineChartPanel.svelte` does the actual animation, described next.

## How the draw-in works

All step panels are always mounted and crossfaded by opacity, so mount/enter
transitions can't drive the animation — it is driven by toggling classes on
`active` instead.

Series flagged `drawIn` get two things on their SVG paths:

- `pathLength=1`, which normalizes the path's coordinate length to exactly 1;
- a class pair driving a stroke-dash transition:

```css
path.lc-line-draw {
  stroke-dasharray: 1 1;   /* one dash as long as the whole path */
  stroke-dashoffset: 1;    /* shifted fully out of view */
}
path.lc-line-draw-active {
  stroke-dashoffset: 0;    /* slide the dash in → line draws left to right */
  transition: stroke-dashoffset 1300ms cubic-bezier(0.65, 0, 0.35, 1) 250ms;
}
```

Details that make it look right:

- **The casing animates in sync.** Every line is drawn twice (see
  `line-chart-casing.md`); both the background-colored casing stroke and the
  colored line get the same classes, so the casing never wipes over the lines
  underneath ahead of its own line.
- **The new line paints on top.** The marks snippet sorts a draw-in figure's
  visible series into the figure's own `series` order — which is the order the
  steps introduce them in — rather than trusting the order LayerChart hands
  back (that one follows the tooltip). Painting last = on top, so each step's
  newly drawn line lands above every line already on screen.
- **Labels wait for the line.** The drawn-in series' end label/dot and any
  figure-level callout are held at opacity 0 (`lc-draw-reveal`) and fade in
  after the draw completes. The diff band and its label use a separate class
  pair (`lc-band-reveal`) with a longer delay, so the band appears a beat
  after the line has landed rather than the instant it finishes.
- **The animation plays once.** A `played` flag flips in the `$effect`
  cleanup when a step loses `active` (cleanup, not body, so the first
  activation keeps its animating classes for its full duration). From then on
  the panel wears `-done` classes — dashoffset 0 and opacity 1 with no
  transition — so the drawn state holds through the outgoing crossfade
  instead of blinking out, and scrolling back to the step shows the finished
  chart with no replay.

## Tuning knobs

All in the `<style>` block at the bottom of `LineChartPanel.svelte`:

| Knob | Where | Default |
| --- | --- | --- |
| Draw duration | `lc-line-draw-active` transition | 1300ms |
| Draw start delay | same transition (3rd value) | 250ms |
| Label/callout fade delay | `lc-draw-reveal-active` transition | 1350ms |
| Band + band-label fade delay | `lc-band-reveal-active` transition | 2150ms |
| Band fill opacity | `Area` in `LineChartPanel.svelte` | 0.3 |

Keep the fade delay ≈ draw delay + draw duration so labels land right after
the line does. The `inView` threshold (0.7 × viewport height) is in
`ScrollySection.svelte`.

## Reusing it

- **Another figure on this branch:** flag series with `drawIn: true` in its
  figure file — nothing else. Figures without the flag are untouched.
- **Another branch:** the mechanism lives in `LineChartPanel.svelte`,
  `ChartPanel.svelte`, `ChartDisplay.svelte`, and `ScrollySection.svelte`
  (plus this file); the content pattern lives in the figure file. Port the
  component changes, then write the branch's own step figures.
