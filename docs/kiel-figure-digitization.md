# Recovering a figure's data from its own pixels

*Written 2026-08-10, while reproducing Figures 3, 4 and 5 of the Kiel Institute's
Economic Outlook Nr. 133 (2026 | Q2).*

The Economic Outlook ships as a PDF whose charts are flat images. There is no data table,
no appendix series, and no download — but the chart itself is a faithful drawing of the
numbers, so the numbers can be read back out of it. This note records how, because the
same situation recurs on every report that arrives as a finished PDF.

The GREIX real-estate index, by contrast, does publish its series: `api.greixx.net/api-v1/`
serves them as JSON with no key (`cities/`, `property-types/`, then
`cities/metrics/?cities=&prop_types=&inflation=&data_index=&per_year=&from_year=&to_year=`).
Always look for that door first — an hour spent hunting for a data endpoint beats a day
of pixel archaeology, and the result is exact.

## The method

**1. Rasterize at 300 dpi.** `pdftoppm -png -r 300 -f 4 -l 5 report.pdf out/p`. At that
resolution a 900-pixel-tall plot area resolves an index point to about seven pixels, which
is finer than the line weight.

**2. Sample the legend swatches for exact series colours.** Crop the legend block, count
colours, take the saturated ones. This is the step that makes everything else reliable:
you are no longer matching "roughly orange", you are matching `(255, 106, 0)` exactly. It
also answers a question worth knowing on its own — this report draws every figure in three
colours, the brand orange, the brand blue, and a pale tint of that blue.

**3. Find the axis frame by run length, not by darkness.** Text is darker than an axis
rule and there is far more of it. Scan for the longest *contiguous* dark run in each row
and column; the plot frame is the only thing in a figure that runs for hundreds of pixels
unbroken.

**4. Calibrate from tick pixels.** Detect the short marks just outside the frame, group
adjacent rows, and pair the resulting positions with the printed labels. Never assume
even spacing from the first and last tick alone — this is where a chart silently ends up
off by a constant.

**5. Trace each series column by column.** For every x, take the pixels closest to the
target colour, and *reject any pixel that is closer to a background reference than to the
target* — cream page, white, black text, the grey gridlines. That test removes gridlines
and anti-aliasing fringes far more reliably than a fixed distance threshold. Where several
disjoint runs match in one column, take the longest: that is the stroke, the others are
crossings and label fragments.

**6. Interpolate to the real observation dates.** Scan every pixel column, then sample the
resulting profile at each month's exact x. This beats sampling one column per month: it
averages out the stroke's own width and fills the columns where one line passes under
another.

## Validating — the part that is not optional

A digitized series can be the right shape at the wrong level and look completely
plausible. Check it against numbers the document states independently:

- **Figure 5's oil series** reads 2015 → $54, 2020 → $44, 2022 → $99, 2025 → $69 as annual
  averages. Real Brent annual averages are $52, $42, $99, $69. That agreement across
  fifteen years is what confirmed both the x calibration and the right-hand axis, and it
  is why the forecast band's start (May 2026, matching a report finalized on June 10) can
  be trusted too.
- **Figure 4's Africa & Middle East bar** for March reads 75.1 against a text that says
  industrial production there "collapsed by almost one quarter". Bars are the easy case:
  a flat top on a calibrated axis.
- **Figure 3** is the honest failure. Its digitized world-trade series gives February 2026
  at +6.8 percent year on year where the report's text says 7.6 percent. Roughly one index
  point at the top of a spike — the line is 4 pixels thick and the peak is a single
  month — but not zero. So the figure reproduces the *shape* from these values while every
  rate quoted in the surrounding copy is the report's own stated number, and the source
  note says the series was digitized.

That last point is the rule this note exists for: digitized values are for drawing, stated
values are for claiming. Never compute a headline number out of traced pixels and present
it as the report's.

## What the reproduction needed beyond the data

Two additions to the template, both in the figure files' reach:

- `bar-grouped` (`BarChartPanelGrouped.svelte`) — clustered vertical bars on a truncated
  axis. LayerChart plants a bar's foot at `yDomain[0]` rather than at zero, so the
  published chart's 65–105 axis works without clipping tricks.
- `secondaryAxis` on a line figure — a second y axis in different units. There is one y
  scale, so the figure pre-projects the right-hand series into the left-hand domain and
  keeps the raw value alongside it; the right axis relabels that same scale (ticks given
  as left-domain positions, `format` converting each back). The two axes cannot drift
  apart because there is only ever one. The default tooltip formats every row with one
  formatter, so a dual-unit figure swaps in its own, reading each series' raw value off
  the hovered datum.
