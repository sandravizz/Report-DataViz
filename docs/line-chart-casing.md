# Line Chart Style: Casing at Overlaps

Line charts use the overlap treatment known from Financial Times / Economist charts: every line is drawn twice — a wider stroke in the page background color underneath ("casing"), then the colored line on top (2.5px for a highlighted line, half that for a de-emphasized background series). Where lines cross, the casing of the upper line cuts a clean gap through the one below, so intersections read as *in front of / behind* instead of a spaghetti tangle. The same casing also gives lines a clean margin where they pass over the hatched projection bands.

On top of that, lines use `curveMonotoneX` smoothing (rounds corners without ever overshooting a data value) and round joins/caps.

![Line casing at overlaps](line-chart-overlap.png)

All of this lives in one place, `src/lib/components/charts/LineChartPanel.svelte`: the `lineStyle`/`casingStyle` functions (both take a `deemphasized` flag — true for series colored `colors.regionGray`, e.g. figure 2's eight region lines) and the `marks` snippet that renders the two strokes per series. Tuning knobs: line width is 2.5 for a highlighted line, 1.25 (half) for a de-emphasized one; casing width comes from `casingWidth(deemphasized, innerWidth)` — 6.5 (desktop) / 5 (mobile) highlighted, 2 / 1.6 de-emphasized, which would wash out in white if it carried a full-width opaque halo across that many overlapping lines — those also get `opacity: 0.7` on the casing. Removing the `curve` property brings back straight segments while keeping the casing.
