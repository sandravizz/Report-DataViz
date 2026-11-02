import { colors } from "$lib/colors";
import { parseFigureCsv } from "./parse-csv.js";
import { SOURCE } from "./01-capital-by-year.js";
// Carta, State of Private Markets Q1 2026, slide 27: the median and both
// quartiles are printed for every stage, so the figure is exact. USD million.
import csv from "./csv/04-post-money-by-stage.csv?raw";

export default {
  title: "Median Seed Post-Money $21M, Series D $540M",
  subtitle:
    "Post-Money Valuation by Stage, Median and 25th to 75th Percentile, USD Million, Q2 2025 to Q1 2026",
  description:
    "Over the last 12 months the median seed round was priced at $21M post-money and the median Series D at $540M. The spread widens with every stage: the middle half of Series D rounds runs from $164.9M to $1,446M.",
  source: SOURCE,
  kind: "range",
  yKey: "stage",
  range: ["p25", "p75"],
  median: "median",
  // The bars are a FILL under an ink-ringed dot and ink labels, so the
  // pale partner of the accent (1.97:1) is legal here — see colors.js.
  color: colors.accentSoft,
  xDomain: [0, 1500],
  xTicks: [0, 500, 1000, 1500],
  valuePrefix: "$",
  valueSuffix: "M",
  rangeLabel: "25th to 75th percentile",
  medianLabel: "Median",
  data: parseFigureCsv(csv),
};
