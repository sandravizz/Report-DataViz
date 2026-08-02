# Line Chart Style: Casing at Overlaps

Line charts use the overlap treatment known from Financial Times / Economist charts: every line is drawn twice — a wider stroke in the page background color underneath ("casing"), then the colored 2.5px line on top. Where lines cross, the casing of the upper line cuts a clean gap through the one below, so intersections read as *in front of / behind* instead of a spaghetti tangle. The same casing also gives lines a clean margin where they pass over the hatched projection bands.

On top of that, lines use `curveMonotoneX` smoothing (rounds corners without ever overshooting a data value) and round joins/caps.

![Line casing at overlaps](line-chart-overlap.png)

All of this lives in one place, `src/lib/components/charts/LineChartPanel.svelte`: the `lineStyle` constant, the `casingWidth`/`casingStyle` functions, and the `marks` snippet that renders the two strokes per series. Tuning knobs: casing width comes from `casingWidth(deemphasized, innerWidth)` — 6.5 (desktop) / 5 (mobile) for a highlighted line, 2 / 1.6 for a de-emphasized background series (`colors.regionGray`, e.g. figure 2's eight region lines, which would wash out in white if they all carried a full-width opaque halo); those also get `opacity: 0.7` on the casing. Removing the `curve` property brings back straight segments while keeping the casing.
