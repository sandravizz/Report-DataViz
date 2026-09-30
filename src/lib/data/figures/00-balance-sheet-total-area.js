import { colors } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
// IDA's balance-sheet total (liabilities + equity) drawn as an area, from the
// same CSV as the equity-share figure.
import csv from "./csv/01-equity-share.csv?raw";

const rows = parseFigureCsv(csv).map((d) => ({
  ...d,
  total: Math.round((d.liabilities + d.equity) * 10) / 10,
}));

// The 2024→2025 jump is the series' largest; computed from the data (like
// figure 2's callout) so the label survives a CSV update.
const prev = rows[rows.length - 2];
const last = rows[rows.length - 1];
const growth = Math.round(last.total - prev.total);

export default {
  title: "IDA's Balance Sheet Keeps Growing",
  subtitle: "IDA Total Assets, USD Billion, 2017–2025",
  description:
    "IDA's balance sheet grew from about USD 197 billion in 2017 to USD 281 billion in 2025 — an increase of more than 40% in eight years.",
  source: "Source: Finance for Development Lab (2026)",
  number: "Figure 1",
  kind: "area",
  xKey: "year",
  // Every USD 50 billion (the default step would be the same; kept explicit
  // so a CSV update can't change it).
  yTicks: [50, 100, 150, 200, 250, 300],
  // Opaque wash so the gridlines stop at the area instead of showing through
  // (see solidWash in chart-theme.js).
  solidWash: true,
  series: [{ key: "Total assets", value: "total", color: colors.accent }],
  // Circled point on the last observation (same emphasis mark as figures 3
  // and 4): the curve peaks at the top-right corner, so the label floats left
  // into the empty space above the area.
  annotations: [
    circleCallout({
      x: last.year,
      y: last.total,
      color: colors.accent,
      link: { type: "swoop" },
      label: `Biggest yearly growth: +USD ${growth} billion`,
      labelPlacement: "left",
      labelXOffset: 60,
      labelYOffset: 8,
      labelProps: {
        textAnchor: "end",
        verticalAnchor: "middle",
        width: 130,
        truncate: false,
        lineHeight: "14px",
      },
      mobile: {
        // Positive offset pushes the label left, clear of the r=12 ring —
        // a negative one lands the text anchor inside the circle.
        labelXOffset: 24,
        labelYOffset: 10,
        props: { label: { width: 100, lineHeight: "13px" } },
      },
    }),
  ],
  data: rows,
};
