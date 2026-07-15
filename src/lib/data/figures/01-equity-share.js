import { iea } from "$lib/colors";
import { lineCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
// From the IDA_GIZ_KAdequacyModel presentation (slide 10): IDA balance sheet
// in USD billion, read off the slide's bar labels (values there in USD
// million). Liabilities + equity sum to total assets, so the stack's height
// traces the balance sheet total.
import csv from "./csv/01-equity-share.csv?raw";

// Shares computed up front so the callout below can state the peak→last
// decline straight from the data instead of hardcoding it.
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
  kind: "bar-stacked",
  // 100% stacked: bars normalized per year, y axis in percent; the tooltip
  // still reports the underlying USD billion values and their total.
  percent: true,
  xKey: "year",
  // Stack order: first series sits at the bottom. Equity carries the story,
  // so it sits at the bottom in the strong teal; liabilities de-emphasized
  // in light gray on top. Series point at the share fields so the tooltip reports
  // percentages (the 100% layout renders the same either way).
  series: [
    { key: "Equity", value: "equityShare", color: iea.teal },
    { key: "Liabilities", value: "liabilitiesShare", color: iea.grayLight },
  ],
  data: rows,
};
