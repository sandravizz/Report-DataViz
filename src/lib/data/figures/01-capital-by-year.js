import { colors } from "$lib/colors";
import { lineCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
// Carta, State of Private Markets Q1 2026, slide 6. Every value is one of the
// slide's own labels, so nothing here is digitized. The slide draws capital
// (line) and round counts (bars) on two y axes; the report splits them into
// this figure and the next, one measure each.
import csv from "./csv/01-capital-by-year.csv?raw";

const data = parseFigureCsv(csv);
const last = data[data.length - 1];

export const SOURCE = "Source: Carta 2026";

export default {
  title: "2025 Deals Keep Rolling In",
  subtitle: "Total Capital Invested by Year, USD Billion, Seed to Series G, 2018 to Q1 2026",
  description:
    "Capital invested peaked at $228.5B in 2021, fell to $79.7B in 2023 and climbed back to $137.8B in 2025, a year that is still growing: another $20B of 2025 deals was recorded in the last 12 weeks alone. 2026 counts the first quarter only, $30.4B so far.",
  source: SOURCE,
  kind: "bar-stacked",
  xKey: "year",
  yTicks: [50, 100, 150, 200],
  // One series: capital wears the accent here and in the AI figures, the
  // round counts wear slate (next figure) — Carta's own pairing on slide 6.
  series: [{ key: "Capital invested", value: "capital", color: colors.accent }],
  // The 2026 bar is a quarter, not a year; say so where it stands.
  annotations: [
    lineCallout({
      x: last.year,
      y: last.capital,
      r: 4,
      label: "Q1 only",
      labelPlacement: "top",
      // Close over the bar (2026-10-27): 28 left the note floating.
      labelYOffset: 14,
      labelProps: { textAnchor: "middle", verticalAnchor: "end", dx: 0, dy: -4 },
      // Phones: the bars are narrow, so the centred note ran into the 2025
      // bar beside it. Lower, and nudged right off that bar.
      mobile: { labelYOffset: 8, props: { label: { dx: 12 } } },
    }),
  ],
  data,
};
