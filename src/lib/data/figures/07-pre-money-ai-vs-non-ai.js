import { colors } from "$lib/colors";
import { formatNumber } from "$lib/format";
import { excludeZeroTick } from "$lib/chart-theme";
import { parseFigureCsv } from "./parse-csv.js";
import { SOURCE } from "./01-capital-by-year.js";
// Carta, State of Private Markets Q1 2026, slide 37: a heatmap table of
// pre-money valuations at the 25th, 50th and 75th percentile, by stage, for
// Q1 2025 and Q1 2026, in three blocks (non-AI, applied AI, foundational
// models). Every cell is printed on the slide, so the figure is exact.
// USD million.
import csv from "./csv/07-pre-money-ai-vs-non-ai.csv?raw";

const rows = parseFigureCsv(csv);

// THE STACK: a percentile is a position, not a share, so the three can't be
// stacked as they are (25th + 50th + 75th adds up to nothing). The series
// are LEVELS (`cumulative: true`): the panel stacks the step from each
// visible level to the one below it, so the segment edges land exactly on
// the percentiles and the bar's top is the highest one shown. The tooltip
// reads the levels themselves.
//
// Sequential, lightest at the bottom, one hue family: the 25th percentile in the
// report's main colour, the brand coral (the accent, as in the down-rounds
// bars and the West in the region figure), the 50th and 75th a small step
// deeper each, a nuance apart, and kept BRIGHT (Sandra, 2026-10-29:
// constant-chroma darker steps read muddy). Per step in OKLCH: −0.035
// lightness, +0.025 chroma, hue 6° toward red — #ff644b, #fd4746, both
// inside sRGB, unclipped (widened from −0.02/+0.015/4°, where two steps
// read the same). One measure, not three; named by the legend and the
// tooltip.
const SERIES = [
  // `legend`: the legend writes "percentile" once, on the last item, so it
  // fits one line on a phone.
  { key: "25th percentile", short: "25th", legend: "25th", value: "p25", color: colors.accent },
  { key: "50th percentile", short: "50th", legend: "50th", value: "p50", color: "#ff644b" },
  { key: "75th percentile", short: "75th", value: "p75", color: "#fd4746" },
];

const panel = (segment, label) => ({
  kind: "bar-grouped-stacked",
  label,
  xKey: "stage",
  x1Key: "period",
  x1Domain: [2025, 2026],
  // Gap between the 2025 and 2026 bars of a stage: 3% of a sub-band (panel
  // default 8%), so the pair reads closer together (Sandra, 2026-10-29):
  // ~1.5px on desktop, under 1px on phones, where the pair nearly touches.
  x1Padding: 0.03,
  // Gap between stages: 20% of a step (panel default 25%), so the bars
  // get the width; up from 15% so the stages separate a touch more
  // (Sandra, 2026-10-29).
  bandPadding: 0.2,
  series: SERIES,
  cumulative: true,
  // ONE y scale for all three panels by default, so heights compare;
  // the figure's "Individual scales" switch (DoubleChartPanel) lets each
  // panel fit its own tallest bar instead (Sandra, 2026-10-29). Either way
  // the scale refits to the levels the legend leaves visible.
  yNice: true,
  // Two gridlines a panel: three panels share one screen.
  yTicks: (scale) => excludeZeroTick(scale, 2),
  // Billions from 1B up, millions below — the axis rescales into either.
  // No "$" on every tick: the subtitle ends "in $" (Sandra, 2026-10-29).
  yTickFormat: (d) => (d >= 1000 ? `${formatNumber(d / 1000)}B` : `${formatNumber(d)}M`),
  // "10B" needs less of the right-hand label strip than the default 36px.
  yLabelRoom: 24,
  // Tooltip rounded so the table stays short (274M, 10.5B), and no "$":
  // the subtitle ends "in $".
  tooltipFormat: (d) =>
    d >= 1000 ? `${formatNumber(Math.round(d / 100) / 10)}B` : `${formatNumber(Math.round(d))}M`,
  valuePrefix: "$",
  valueSuffix: "M",
  // Phones: "Series A" does not fit under a pair of ~20px bars.
  xTickFormatShort: (d) => d.replace("Series ", "Ser. "),
  data: rows.filter((d) => d.segment === segment),
});

export default {
  // Short enough for one line on a phone.
  title: "Pre-Money Valuation: AI vs Non-AI",
  // Short: the title names the measure and the legend the percentiles;
  // "$" here instead of on every tick (Sandra, 2026-10-29). Phones drop the
  // year row, so their subtitle names the bar order instead of the stages.
  subtitle: "Seed to Series E+, Q1 2025 vs Q1 2026, in $",
  subtitleMobile: "Q1 2025 (Left Bar) vs Q1 2026 (Right Bar), in $",
  // The pattern, in the slide's own printed values (Sandra, 2026-10-29).
  description:
    "Foundational model companies are valued on a different scale from their first round. The gap is widest at Series C and D, where their median pre-money valuation in Q1 2026 was more than ten times that of applied AI or non-AI companies.",
  source: SOURCE,
  kind: "double",
  // One legend for all three panels, under the subtitle. Clicking a level
  // shows only the levels picked, in every panel at once.
  legend: true,
  scaleToggle: ["Same scale", "Own scale"],
  series: SERIES,
  panels: [
    panel("Non-AI", "Non-AI"),
    panel("AI Applied", "AI Applied"),
    panel("AI Foundational Models", "AI Foundational Models"),
  ],
};
