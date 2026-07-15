import { fdl } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
// Identical to 01-equity-share.js in every way except the mark: the same
// 100% stacked composition rendered as a stacked area instead of stacked
// bars, so the two figures can be compared back to back.
import csv from "./csv/01-equity-share.csv?raw";

const rows = parseFigureCsv(csv).map((d) => {
  const total = d.liabilities + d.equity;
  return {
    ...d,
    equityShare: d.equity / total,
    liabilitiesShare: d.liabilities / total,
  };
});

const peak = rows.reduce((a, b) => (b.equityShare > a.equityShare ? b : a));
const last = rows[rows.length - 1];
const declinePp = Math.round((peak.equityShare - last.equityShare) * 100);

export default {
  title: "Equity's Share Is Large… but Declining",
  subtitle:
    "IDA Balance Sheet: Equity and Liabilities as Share of Total Assets, 2017–2025",
  description:
    "IDA's assets are financed mostly by equity, but equity's share is declining: from 80% of the balance sheet in 2017 (89% in 2018) to 73% in 2025, as liabilities grew from USD 39 billion to USD 77 billion.",
  source: "Sources & series: to be confirmed",
  number: "Figure 2",
  kind: "area-stacked",
  percent: true,
  xKey: "year",
  series: [
    { key: "Equity", value: "equityShare", color: fdl.camel },
    { key: "Liabilities", value: "liabilitiesShare", color: "#e2e7d4" },
  ],
  // Circled point on the equity/liabilities boundary at the last observation
  // (same emphasis mark as figures 3 and 4), with the label floating up into
  // the liabilities band.
  annotations: [
    circleCallout({
      x: last.year,
      y: last.equityShare,
      filled: true,
      color: fdl.camel,
      link: { type: "swoop" },
      label: `Equity share declined by ${declinePp}pp since its ${peak.year.getFullYear()} peak`,
      labelPlacement: "left",
      labelXOffset: 70,
      labelYOffset: -70,
      labelProps: {
        textAnchor: "middle",
        verticalAnchor: "top",
        width: 140,
        truncate: false,
        lineHeight: "14px",
      },
      mobile: {
        labelXOffset: 10,
        labelYOffset: -36,
        props: { label: { width: 100, lineHeight: "13px" } },
      },
    }),
  ],
  data: rows,
};
