import { colors } from "$lib/colors";
import { parseFigureCsv } from "./parse-csv.js";
// From the IDA_GIZ_KAdequacyModel presentation (slide 10): IDA balance sheet
// in USD billion, read off the slide's bar labels (values there in USD
// million). Liabilities + equity sum to total assets, so the stack's height
// traces the balance sheet total.
import csv from "./csv/01-equity-share.csv?raw";

// Shares computed up front: the series below plot them directly.
const rows = parseFigureCsv(csv).map((d) => {
  const total = d.liabilities + d.equity;
  return {
    ...d,
    equityShare: d.equity / total,
    liabilitiesShare: d.liabilities / total,
  };
});

export default {
  title: "Equity's Share Is Large… but Declining",
  subtitle:
    "IDA Balance Sheet: Equity and Liabilities as Share of Total Assets, 2017–2025",
  description:
    "IDA's assets are financed mostly by equity, but equity's share is declining: from 80% of the balance sheet in 2017 (89% in 2018) to 73% in 2025, as liabilities grew from USD 39 billion to USD 77 billion.",
  source: "Source: Finance for Development Lab (2026)",
  number: "Figure 2",
  kind: "bar-stacked",
  // 100% stacked: bars normalized per year, y axis in percent; the tooltip
  // still reports the underlying USD billion values and their total.
  percent: true,
  xKey: "year",
  // Stack order: first series sits at the bottom. Equity carries the story,
  // so it sits at the bottom in the accent; liabilities recede to the palest
  // step of the neutral ramp on top — a fill, which is the only job `faint`
  // is allowed to do. (The comment here used to say "dark slate" and the code
  // said camel; both are gone.) Series point at the share fields so the
  // tooltip reports percentages.
  series: [
    { key: "Equity", value: "equityShare", color: colors.accent },
    { key: "Liabilities", value: "liabilitiesShare", color: colors.faint },
  ],
  data: rows,
};
