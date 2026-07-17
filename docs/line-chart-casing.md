# Line Chart Style: Casing at Overlaps

Line charts use the overlap treatment known from Financial Times / Economist charts: every line is drawn twice — a wider stroke in the page background color underneath ("casing"), then the colored 2.5px line on top. Where lines cross, the casing of the upper line cuts a clean gap through the one below, so intersections read as *in front of / behind* instead of a spaghetti tangle. The same casing also gives lines a clean margin where they pass over the hatched projection bands.

On top of that, lines use `curveMonotoneX` smoothing (rounds corners without ever overshooting a data value) and round joins/caps.

![Line casing at overlaps](line-chart-overlap.png)

All of this lives in one place, `src/lib/components/charts/LineChartPanel.svelte`: the `lineStyle` / `casingStyle` constants and the `marks` snippet that renders the two strokes per series. Tuning knobs: casing width is `casingStyle.strokeWidth` (6.5 = 2px halo per side), and removing the `curve` property brings back straight segments while keeping the casing.
