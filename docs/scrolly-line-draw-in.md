# Scrolly Line Draw-In: Animating a Line Chart's Lines On First View

Ported from the `template`/`iea` branches, where the same mechanism also
drives a multi-step "reveal one new line per scroll step" treatment (see
those branches' own copy of this doc for the step/diffBand parts). On this
branch it's used in the simpler form: a figure's lines draw themselves in
from left to right the first time the reader scrolls to it, then hold their
finished state — no replay, no per-step reveal.

## What the reader sees

When a line figure's panel first becomes the active, on-screen figure, each
series flagged `drawIn` wipes in from the left over ~1.3s. Once a line
arrives, its end label fades in. The animation is **one-shot per page
load**: scrolling away and back shows the finished chart instantly, with no
replay.

## Content: flagging a series

In the figure's data file (e.g. `src/lib/data/figures/13-income-shares.js`),
add `drawIn: true` to any series that should animate in:

```js
series: [
  { key: "Share of Top 10%", endLabel: "Top 10%", value: "top10", color: colors.sky, drawIn: true },
  // ...
],
```

Series without the flag render normally, with no animation.

## Mechanism: an `active` flag plus CSS

- `ScrollySection.svelte` derives `inView`: true once the section is ~70% up
  the viewport. `activeIndex` alone isn't enough — it's already 0 while the
  section is still below the fold, which would let the animation finish
  before the reader ever sees it.
- `ChartDisplay.svelte` computes `active = i === activeIndex && inView` per
  panel and passes it to `ChartPanel.svelte`, which forwards it to
  `LineChartPanel.svelte` (the only consumer).
- `LineChartPanel.svelte` does the actual animation:
  - Series flagged `drawIn` get `pathLength={1}` (normalizes the path's
    coordinate length to exactly 1) and a class pair that transitions
    `stroke-dashoffset` from 1 to 0 — the line "draws" left to right.
  - The casing stroke (see `line-chart-casing.md`) gets the same classes, so
    it never wipes ahead of the colored line underneath.
  - The end label/dot for a `drawIn` series is held at `opacity: 0` until the
    draw completes, then fades in.
  - A step's callout annotation (e.g. Figure 13c's "overtakes" marker) waits
    on a separate, later delay than the end labels — a further ~1s pause
    after the line lands, via its own `lc-annotation-reveal` class pair.
  - A `played` flag flips in the `$effect` cleanup when the panel loses
    `active` (cleanup, not body, so the first activation keeps its animating
    classes for the full duration). From then on the panel wears `-done`
    classes (dashoffset 0, opacity 1, no transition), so a revisit shows the
    finished chart with no replay.

## Tuning knobs

Both in the `<style>` block at the bottom of `LineChartPanel.svelte`:

| Knob | Where | Default |
| --- | --- | --- |
| Draw duration | `lc-line-draw-active` transition | 1300ms |
| Draw start delay | same transition (3rd value) | 250ms |
| Label fade delay | `lc-draw-reveal-active` transition | 1350ms |
| Annotation fade delay | `lc-annotation-reveal-active` transition | 2350ms |

Keep the label fade delay ≈ draw delay + draw duration so labels land right
after the line does; the annotation delay adds a further ~1s pause on top so
a step's callout reads as a deliberate beat, not simultaneous with the line
landing. The `inView` threshold (0.7 × viewport height) is in
`ScrollySection.svelte`.

## Reusing it

Flag a series with `drawIn: true` in its figure file — nothing else. Figures
without the flag are untouched. Porting the step-by-step reveal (multiple
figures introducing one line at a time, with a diff band between steps) as
well means also porting the `hasDrawIn`-driven series reversal, `diffBand`
handling, and `lc-band-reveal` classes from the `template`/`iea` branches'
`LineChartPanel.svelte`.
