import { colors, carta } from "$lib/colors";
import { parseQuarter } from "$lib/chart-theme";
import { formatNumber } from "$lib/format";
import { parseFigureCsv } from "./parse-csv.js";
import { SOURCE } from "./01-capital-by-year.js";
// Carta, State of Private Markets Q1 2026, "60% of capital in Q1 went to the
// West region". Only the four Q1 values per region are printed on the slide
// (Q1 2023, 2024, 2025, 2026); those are exact. The nine quarters between
// carry no label and are READ OFF THE CHART (pixel-sampled from the slide,
// ±0.5 pt): they draw the bands, the copy never quotes them.
import csv from "./csv/08-capital-by-region.csv?raw";

// The four regions are the whole of each quarter's capital (they sum to
// 100), so Carta's four lines are drawn as one 100% stack. Shares as
// fractions for the panel's `percent` layout.
const data = parseFigureCsv(csv).map(({ period, west, northeast, south, midwest }) => ({
  quarter: parseQuarter(period),
  west: west / 100,
  northeast: northeast / 100,
  south: south / 100,
  midwest: midwest / 100,
}));

export default {
  title: "60% of Capital in Q1 Went to the West Region",
  subtitle: "Share of Total Capital Invested by Region, %, Seed to Series E+, Q1 2023 to Q1 2026",
  // The pattern, not the numbers (Sandra, 2026-10-29): the reader sees
  // the shares on the chart; the text says what they add up to.
  description:
    "The West's lead has widened: from about half of all capital in early 2023 to around 60% today. The Northeast stays second, while the South and Midwest share what is left.",
  source: SOURCE,
  kind: "area-stacked",
  percent: true,
  quarterly: true,
  xKey: "quarter",
  // One tick per year, under its Q1 (2023 ’24 ’25 2026), at every width:
  // four labels fit a phone.
  xTicks: data.map((d) => d.quarter).filter((d) => d.getMonth() === 0),
  // Steps of 20, so the title's 60% has its own gridline (Sandra,
  // 2026-10-29).
  yTicks: [0.2, 0.4, 0.6, 0.8, 1],
  // Names inside the bands at the first quarter, y axis on the right
  // (Sandra, 2026-10-29), at every width: phones too, no legend.
  insideLabels: true,
  // Rounded, hairline band edges and near-solid washes: the fills carry
  // the figure, and the West's coral matches the solid bars of the
  // down-rounds figure (0.9 on the cream = #ff8965 vs #ff7d55; Sandra,
  // 2026-10-29).
  smooth: true,
  strokeWidth: 0.5,
  fillOpacity: 0.9,
  // The slide's one decimal, not whole percents.
  tooltipFormat: (d) => `${formatNumber(Math.round(d * 1000) / 10)}%`,
  // Stack order: first series at the bottom. The West, the story, sits on
  // the baseline in the accent, so its share reads straight off the y axis;
  // the other three regions are context and walk down Carta's grey scale
  // in this array's order (not by size): halfway between gray-80 and
  // gray-70 (#818585, lighter than gray-80 itself: Sandra, 2026-10-29),
  // gray-70, then halfway
  // between gray-60 and gray-40 (#c3c5c5), since gray-60 sits too close
  // to gray-70 to tell apart. No black (Sandra, 2026-10-29: the jump from
  // the coral was too much), and no greys as pale as gray-40.
  // HIGHLIGHT BY WEIGHT (the kiel-institute line panel's treatment): the
  // West's edge at full weight, the context bands' edges a hairline in one
  // quiet grey. All four names semibold (Sandra, 2026-10-29).
  series: [
    {
      key: "West",
      value: "west",
      color: colors.accent,
      // Its name in the deck's dark red (Austin slide; Sandra, 2026-10-29):
      // 2.7:1 on the coral wash, against orange-80's 1.6:1.
      labelColor: carta.deckRed,
      props: { line: { strokeWidth: 2 } },
    },
    {
      key: "Northeast",
      value: "northeast",
      color: "#818585",
      // Ink on every grey band, as the panel's default (Sandra,
      // 2026-10-29).
      props: { line: { stroke: colors.soft } },
    },
    {
      key: "South",
      value: "south",
      color: colors.mid,
      props: { line: { stroke: colors.soft } },
    },
    {
      key: "Midwest",
      value: "midwest",
      color: "#c3c5c5",
      props: { line: { stroke: colors.soft } },
    },
  ],
  data,
};
