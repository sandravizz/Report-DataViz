import { colors } from "$lib/colors";
import { parseFigureCsv } from "./parse-csv.js";
// Carta, State of Private Markets Q1 2026, slide 35. The totals (34.6% …
// 60.7%) and the foundational-model shares for 2023–2026 are the slide's own
// labels. The foundational slivers for 2018–2022 carry no label on the slide
// and are READ OFF THE CHART (≤1%): they draw the bars, the copy never quotes
// them.
import csv from "./csv/05-ai-share-of-capital.csv?raw";

const data = parseFigureCsv(csv).map((d) => ({
  year: d.year,
  foundational: d.foundational,
  applied: Math.round((d.total - d.foundational) * 10) / 10,
}));

export const AI_SERIES = [
  // Stack order: first series at the bottom. The two AI series are ONE
  // group, so one hue at two steps: foundational models, the newer story,
  // in the accent at the base; applied AI in its pale partner on top.
  { key: "Foundational", value: "foundational", color: colors.accent },
  { key: "Applied", value: "applied", color: colors.accentSoft },
];

export default {
  title: "Over 60% of Capital Invested on Carta Went to AI",
  subtitle: "Share of Capital Invested in AI Companies, %, Seed to Series E+, 2018 to Q1 2026",
  description:
    "60.7% of the capital invested on Carta in Q1 2026 went to AI companies, the highest share recorded to date. Foundational model companies drove much of it: 14.2% of all capital, nearly a quarter of AI capital, up from 4.5% in 2023.",
  source:
    "Source: Carta, State of Private Markets: Q1 2026. Foundational shares for 2018 to 2022 read off the published chart.",
  kind: "bar-stacked",
  xKey: "year",
  valueSuffix: "%",
  yTicks: [20, 40, 60],
  series: AI_SERIES,
  data,
};
