import { colors } from "$lib/colors";
import { parseQuarter } from "$lib/chart-theme";
import { lineCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
import { SOURCE } from "./01-capital-by-year.js";
// Carta, State of Private Markets Q1 2026, slide 7: the round counts printed
// in each bar, so the series is exact. The slide's capital line is left out
// here — one measure per figure, no second y axis.
import csv from "./csv/02-rounds-by-quarter.csv?raw";

const data = parseFigureCsv(csv).map(({ period, rounds }) => ({
  quarter: parseQuarter(period),
  rounds,
}));
const peak = data.reduce((a, b) => (b.rounds > a.rounds ? b : a));

export default {
  title: "Round Counts Peaked in Late 2021",
  subtitle: "Total Rounds Raised by Quarter, Seed to Series E+, Q1 2018 to Q1 2026",
  description:
    "Rounds peaked at 2,291 in Q4 2021 and have held between roughly 1,150 and 1,550 a quarter since 2023. Q1 2026's 1,051 is a first count: deals are still coming in, and with them 2026 is already $2B ahead of 2025 year to date.",
  source: SOURCE,
  kind: "bar-stacked",
  quarterly: true,
  xKey: "quarter",
  bandPadding: 0.25,
  yTicks: [500, 1000, 1500, 2000],
  // Slate, as on Carta's slide: the count is the context to the capital
  // figure before it, not a second story.
  series: [{ key: "Rounds", value: "rounds", color: colors.strong }],
  annotations: [
    lineCallout({
      x: peak.quarter,
      y: peak.rounds,
      r: 2,
      label: "2,291 rounds in Q4 2021",
      labelPlacement: "right",
      labelXOffset: 22,
      labelProps: { verticalAnchor: "middle" },
      mobile: {
        labelXOffset: 12,
        props: { label: { width: 70, truncate: false, lineHeight: "13px" } },
      },
    }),
  ],
  data,
};
