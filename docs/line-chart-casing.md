# Line Chart Style: Casing at Overlaps

Line charts use the overlap treatment known from Financial Times / Economist charts: every line is drawn twice — a slightly wider stroke in the page background color underneath ("casing"), then the colored 2.5px line on top. Where lines cross, the casing of the upper line cuts a clean gap through the one below, so intersections read as *in front of / behind* instead of a spaghetti tangle. The same casing also gives lines a clean margin where they pass over the hatched projection bands.

On top of that, lines use `curveMonotoneX` smoothing (rounds corners without ever overshooting a data value) and round joins/caps.

![Line casing at overlaps](line-chart-overlap.png)

All of this lives in one place, `src/lib/components/charts/LineChartPanel.svelte`: the `lineStyle` / `casingStyle` constants and the `marks` snippet that renders the two strokes per series. Tuning knobs: casing width is `casingStyle.strokeWidth` (4.5 against a 2.5px line = a 1px halo per side, 3.5/2 below 1024). Keep it narrow: one pixel of white per side already reads as in-front/behind, and a wider halo starts to eat the colored lines wherever they run close together. Removing the `curve` property brings back straight segments while keeping the casing.
