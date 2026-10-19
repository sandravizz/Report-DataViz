import { colors } from "$lib/colors";
import { parseQuarter, quarterDate, tooltipHeaderQuarter } from "$lib/chart-theme";
import { circleCallout, projectionRange } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
import { SOURCE } from "./01-capital-by-year.js";
// Carta, State of Private Markets Q1 2026, slide 19: every bar carries its
// value, so the series is exact. Drawn as a line rather than Carta's 29
// bars: the reading is the climb and the return, one path.
import csv from "./csv/03-down-rounds.csv?raw";

const data = parseFigureCsv(csv).map(({ period, downRounds }) => ({
  quarter: parseQuarter(period),
  downRounds,
}));
const last = data[data.length - 1];

export default {
  title: "Down Rounds Are Back to Pre-Boom Levels",
  subtitle:
    "Share of Rounds Raised at a Lower Valuation Than the Last Primary Round, %, Q1 2019–Q1 2026",
  description:
    "The down-round rate fell to 11.4% in Q1 2026 — back in line with 2019 and 2020. It had run between 18.0% and 22.2% through 2023 and 2024, the hangover from the valuation lows of 2022.",
  source: SOURCE,
  kind: "line",
  xKey: "quarter",
  valueSuffix: "%",
  // One tick per year, under its Q1 (yearTickFormat reads the ends).
  xTicks: data.filter((d) => d.quarter.getMonth() === 0).map((d) => d.quarter),
  yTicks: [5, 10, 15, 20],
  tooltipHeaderFormat: tooltipHeaderQuarter,
  // The era Carta's deck calls the "valuation reset" (slide 20), as a
  // plain slate wash with its name over it — no hatch: the hatch means
  // "projection" in this report, and these quarters are history.
  rangeAnnotations: [
    projectionRange({
      x: [quarterDate(2023, 1), quarterDate(2025, 4)],
      label: "Valuation reset",
      pattern: undefined,
      fill: "rgba(57, 64, 64, 0.07)",
    }),
  ],
  annotations: [
    circleCallout({
      x: last.quarter,
      y: last.downRounds,
      color: colors.accent,
      link: { type: "swoop" },
      label: "11.4% in Q1 2026, in line with 2019–2020",
      labelPlacement: "bottom-left",
      labelXOffset: 24,
      labelYOffset: 34,
      labelProps: {
        textAnchor: "end",
        verticalAnchor: "middle",
        width: 150,
        truncate: false,
        lineHeight: "14px",
      },
      mobile: {
        labelXOffset: 16,
        labelYOffset: 26,
        props: { label: { width: 100, lineHeight: "13px" } },
      },
    }),
  ],
  series: [{ key: "Down rounds", value: "downRounds", color: colors.accent }],
  data,
};
