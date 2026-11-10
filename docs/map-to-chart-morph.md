# Why the map-to-chart morph isn't plain LayerChart

Notes on the scroll transition in which métro lines leave the Paris map and
unroll into a grid of small-multiple line charts (paris-demo, Figure 6,
`MetroMorphPanel.svelte`). The house rule is to build every figure from
LayerChart's own components and props, so this explains which part of the
morph LayerChart can do and which part it can't. Written 2026-11-10 against
LayerChart 2.9.1.

## Short version

LayerChart can draw both ends of the transition: the map (`GeoPath` with a
projection) and the line charts (`LineChart`, with its `fy` facets for the
small multiples). It has nothing that moves a mark from one to the other,
for four reasons:

1. A chart works in one coordinate system at a time.
2. Its animation runs on a timer, not on the scroll position.
3. Its path animation matches drawing commands, not positions along the
   line.
4. The métro data is not one continuous line per métro line.

So the in-between shapes are computed in our own code. They are still drawn
with LayerChart's `Path`, `Circle` and `Text`, inside the same `Chart` as the
map.

## 1. One coordinate system per chart

A LayerChart `Chart` places its marks either through a **geo projection**
(`geo={{ projection, fitGeojson }}`: longitude/latitude → pixels) or through
**x/y scales** (`x`, `y`, `xDomain`, …: year/value → pixels). Each mark reads
one or the other.

No mark can be positioned "60% of the way between its map position and its
chart position". The map and the small multiples would be two separate
charts, each with its own coordinate system, and the only thing they share
is the screen.

**What we do:** both ends are worked out in **pixels** inside the map's own
`Chart`. The map end uses the chart's projection (`context.geo.projection`).
The chart end lays out the 2 × 3 panel grid and the shared y scale in the
same pixel space. A point that has a pixel position at both ends can then be
blended between them.

## 2. LayerChart's animation is time-based, not scroll-based

LayerChart does animate shapes: `Path` and `Spline` take a `motion` prop
(`"tween"` or `"spring"`). When a mark's data changes, it eases from the old
shape to the new one over a duration.

That is a **transition that plays once it starts**: it runs over a fixed time
from the moment the data changes. A scroll morph has to be **scrubbed**
instead. Its shape must be a direct function of the scroll position: halfway
down the scroll it is half-morphed, it stops when the reader stops, and it
runs backwards when they scroll up. `motion` has no setting for "be at 37%
now".

**What we do:** `ScrollySection` passes its unrounded scroll position down as
`progress` (0 → 1) to the figure (through `ChartDisplay` and `ChartPanel`),
and the panel computes the shape for exactly that value on every frame.
LayerChart only draws the result; no `motion` is involved.

## 3. Path animation matches commands, not positions along the line

Under `motion`, `Path` blends two shapes with `d3-interpolate-path`. That
library walks the two SVG `d` strings command by command and moves the n-th
point of one towards the n-th point of the other.

A metro line drawn on the map and the same line drawn as a chart have
different numbers of points, and their points don't correspond. Matching them
by command order gives a shape that folds in on itself. It doesn't look like
a line uncurling.

**What we do:** both shapes are resampled to the **same 160 points, evenly
spaced**:

- **map end:** spaced evenly by distance along the track;
- **chart end:** spaced evenly across the years, with values interpolated
  between the yearly data points.

Point k on the map then moves to point k on the chart, so the line's start
goes to the chart's first year and its end to the last.

## 4. The data isn't one continuous line per métro line

LayerChart draws the geometry exactly as it receives it. The track file
(IDFM) stores each line as a set of **unordered** station-to-station
segments, with a few small breaks of under 100 m. That draws correctly as a
map, but it has no start and no end, so there is nothing to unroll.

**What we do:** `src/lib/data/figures/metro-chain.js` chains the segments into
one ordered run of points:

- it joins segment ends that meet or nearly meet;
- it starts the walk at the line's **west** end, so every line unrolls left
  to right, like the years.

This step is data preparation, which is outside a chart library's job.

## What stays LayerChart

| Part | Built with |
| --- | --- |
| The map at the start (lines, stations, badges, fade) | `MetroPanel.svelte`: `Chart` with `geo`, `GeoPath`, `GeoPoint`, `Circle`, `Text`, `Group` |
| Projection used for the map end of the morph | the same `Chart`'s `context.geo.projection` |
| The moving lines | LayerChart `Path` with a computed `pathData` |
| Panel frames at the end (badge, name, gridlines, labels, years) | LayerChart `Circle`, `Text`, `Line`, `Group` |
| **Custom:** ordering the track, resampling, panel layout, blending by scroll | `metro-chain.js` and `MetroMorphPanel.svelte` |

## Pacing

The morph needs more scroll room than a figure normally gets. Figure 6 is
the last figure in its section and sets `holdVh: 132` (the default hold is
60vh). The position `ScrollySection` passes down keeps counting through that
hold, and `ChartDisplay` stretches the figure's 0 → 1 over it, leaving half a
step at the end to look at the finished grid.

Within that 0 → 1, `MetroMorphPanel` runs its stages one after another:

| Progress | What happens |
| --- | --- |
| 0 → 0.06 | the full map, as Figure 5 left it |
| at 0.06 | scroll 1: every other line, with its stations and badges, disappears in one quick timed fade (350ms, not scrubbed; reverses on the way back) |
| at 0.21 | scroll 2: the six lines' stations, interchanges and badges disappear the same way, leaving the bare lines |
| 0.3 → 0.94 | the six lines move into place with the scroll, one slightly after another |
| 0.92 → 1 | the panel frames fade in |

The fractions are fitted to the figure's `holdVh: 132` (1.65 steps of 80vh);
change the two together.

## The panel frames (titles, axes)

Once the lines have landed, each panel's frame fades in: a line badge and
name on top, y gridlines with labels (none for the top tick, which is only
headroom), and the years under the bottom row. The panels sit in the text
column, their left edge on the title's, not in the wider box the map bleeds
into.
The frame is drawn by the morph panel itself with LayerChart's `Line` and
`Text`, styled after `chart-theme.js`, so it uses exactly the same panel
layout the lines landed in.

The other route would be to cross-fade to the static, faceted `LineChart`
(`LineMultiplesPanel.svelte`). Its facet layout (padding, gaps, y-scale top)
would then have to match the morph's layout pixel for pixel, or the lines
would visibly jump at the swap.

## Prior art

Searched 2026-11-10. No ready-made code does this better, and nothing
found turns a metro line into a line chart. The closest examples:

- **Florian Ledermann, ["Transitions from maps to diagrams"](https://observablehq.com/@floledermann/transitions-from-maps-to-diagrams-part-1)**
  ([part 2](https://observablehq.com/@floledermann/transitions-from-maps-to-diagrams-part-2), 2018).
  - **Approach:** turns a street on a map into a straight line or a circle,
    by moving point n of one shape to point n of the other. Same idea as
    ours.
  - **Weaker spacing:** the target points are spaced by point number, not by
    distance along the street, so the movement is uneven where the map's
    points are dense or sparse.
  - **Timer-based,** not scroll-based.
  - **No licence stated:** borrow the idea, not the code.
- **Jules Blom, [Rotterdam morphing transit map](https://observablehq.com/@julesblm/rotterdam-morphing-transit-map)**
  (BSD-3; Amsterdam and The Hague versions too).
  - **Approach:** a geographic metro map turns into a schematic one, on a
    looping timer, with `d3-interpolate-path`.
  - **Hand-prepared data:** both versions of each line are prepared in
    advance as single ordered lines, so it skips what `metro-chain.js` does.
  - **Same known flaw:** its own to-do list includes "Improve interpolation
    of line B & A", the point-matching problem from section 3.
- **[flubber](https://github.com/veltman/flubber)** (MIT), the standard
  shape-morphing library.
  - **Scrubbable:** its interpolator takes a value from 0 to 1, so it could
    follow the scroll.
  - **Built for closed shapes:** it may move a shape's starting point to
    smooth the morph, which would break the left-to-right unrolling.
  - **Size and upkeep:** 53 kB, and no longer updated.
- **[syntagmatic, D3 shape-morphing notes](https://syntagmatic.github.io/d3-power-tools/skills/shape-morphing/SKILL.md)**
  name the same two routes: `d3-interpolate-path`, or resampling both shapes
  to a fixed number of points (ours).

`d3-interpolate-path` is already installed with LayerChart, and calling it
directly (`interpolatePath(a, b)(t)`) would follow the scroll. We don't use
it because it lines up the shorter path by adding points at its end, not
along its length, which makes the unrolling uneven.
