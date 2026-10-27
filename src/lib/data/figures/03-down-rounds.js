import { colors } from "$lib/colors";
import { parseQuarter, quarterDate } from "$lib/chart-theme";
import { lineCallout, projectionRange } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
import { SOURCE } from "./01-capital-by-year.js";
// Carta, State of Private Markets Q1 2026, slide 19: every bar carries its
// value, so the series is exact. Drawn as Carta draws it — 29 quarterly
// bars, the valuation-reset quarters (2023–2025) in the accent — on the iw
// branch's two-line quarter axis (Q2 Q3 Q4, the year under each Q1).
import csv from "./csv/03-down-rounds.csv?raw";

const data = parseFigureCsv(csv).map(({ period, downRounds }) => ({
  quarter: parseQuarter(period),
  downRounds,
}));

const last = data[data.length - 1];

// The era Carta's deck calls the "valuation reset" (slide 20).
const inReset = (d) => {
  const year = d.quarter.getFullYear();
  return year >= 2023 && year <= 2025;
};

export default {
  title: "Down Rounds Are Back to Pre-Boom Levels",
  subtitle:
    "Share of Rounds Raised at a Lower Valuation Than the Last Primary Round, %, Q1 2019 to Q1 2026",
  description:
    "The down-round rate fell to 11.4% in Q1 2026, back in line with 2019 and 2020. It had run between 18.0% and 22.2% through 2023 and 2024, the hangover from the valuation lows of 2022.",
  source: SOURCE,
  kind: "bar-stacked",
  quarterAxis: true,
  xKey: "quarter",
  bandPadding: 0.25,
  // Room after the last bar for its note, before the y labels.
  endRoom: 32,
  // The note is hidden on phones, so no room is kept for it there.
  endRoomMobile: 0,
  valueSuffix: "%",
  // Up to 25%: headroom above the 22.2% peak for the boom-years label and
  // the last bar's note.
  yDomain: [0, 25],
  // No 25% line: the domain gives the headroom, the top stays open.
  yTicks: [5, 10, 15, 20],
  series: [{ key: "Down rounds", value: "downRounds" }],
  // The reset quarters in the accent, the rest in slate: one series, two
  // inks, as on Carta's slide: their coral and their black (2026-10-27).
  barColor: {
    by: (d) => (inReset(d) ? "reset" : "other"),
    domain: ["reset", "other"],
    range: [colors.accent, colors.strong],
  },
  // A light grey wash behind the coral bars, named over its top-left
  // corner — the same plain slate wash as the other figures' eras, no hatch
  // (the hatch means "projection" in this report).
  rangeAnnotations: [
    projectionRange({
      x: [quarterDate(2023, 1), quarterDate(2025, 4)],
      label: "Boom years",
      pattern: undefined,
      fill: "rgba(57, 64, 64, 0.07)",
    }),
  ],
  // The last bar's note: the title's claim, in
  // Carta's words ("back in line with 2019 and 2020 levels"). It sits right
  // at the bar's top, its text rising from there, so it stays between the
  // 10% and 15% y labels and can run on over the y-label strip.
  annotations: [
    lineCallout({
      x: last.quarter,
      y: last.downRounds,
      r: 2,
      lineProps: { type: "swoop" },
      label: "Back to pre-boom levels",
      labelPlacement: "top-right",
      labelXOffset: 2,
      labelYOffset: 14,
      labelProps: {
        textAnchor: "start",
        verticalAnchor: "end",
        width: 72,
        truncate: false,
        lineHeight: "14px",
      },
      // Not on phones (2026-10-27): no room beside the last bar, and it only
      // repeats the title.
      mobile: false,
    }),
  ],
  data,
};
