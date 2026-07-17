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
wipes in from the left over ~1.3s. Once the line arrives, its end label — and
any figure-level callout on that step — fades in. Scrolling to a step replays
its animation every time, in both scroll directions.

## The two halves

**1. Content: one figure file, several step objects.** The figure file builds
a shared `base` (data, axes, subtitle, source) and exports an array of steps
that spread it, each with its own `number`/`title`/`description` and a series
list. A helper flags the step's newcomer:

```js
const stepSeries = (newValue, values) =>
  allSeries
    .filter((s) => values.includes(s.value))
    .map((s) => ({ ...s, drawIn: s.value === newValue }));

// step 2b: grids is new, efficiency carries over
series: stepSeries("grids", ["grids", "efficiency"]),
```

`drawIn: true` is the whole contract between content and mechanism: a series
with the flag animates, everything else renders normally. The steps array is
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
- **Labels wait for the line.** The drawn-in series' end label/dot, and any
  figure-level callout on a draw-in step, are held at opacity 0
  (`lc-draw-reveal`) and fade in after the draw completes.
- **Leaving a step resets only after the crossfade.** The panels crossfade
  over 500ms, so the outgoing panel is still visible when it loses `active` —
  an instant reset would make its drawn line (and revealed labels) blink out
  mid-fade while the incoming panel's copy is still faint. The base
  `lc-line-draw` / `lc-draw-reveal` rules therefore carry a `0s 500ms`
  transition: the drawn state holds through the fade, then snaps back
  invisibly, ready to replay on the next visit. If the crossfade duration in
  `ChartDisplay.svelte` ever changes, change this hold to match.

## Tuning knobs

All in the `<style>` block at the bottom of `LineChartPanel.svelte`:

| Knob | Where | Default |
| --- | --- | --- |
| Draw duration | `lc-line-draw-active` transition | 1300ms |
| Draw start delay | same transition (3rd value) | 250ms |
| Label/callout fade delay | `lc-draw-reveal-active` transition | 1350ms |
| Reset hold on leaving | base `lc-line-draw` / `lc-draw-reveal` transitions | 500ms (= panel crossfade) |

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
