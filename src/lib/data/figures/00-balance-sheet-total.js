import { colors } from "$lib/colors";
import { parseFigureCsv } from "./parse-csv.js";
// Same balance-sheet data as 01-equity-share.js, but summed per year:
// liabilities + equity = total assets, so a plain bar traces the balance
// sheet total that the stacked figure's height only implies.
import csv from "./csv/01-equity-share.csv?raw";

export default {
  title: "IDA's Balance Sheet Keeps Growing",
  subtitle: "IDA Total Assets, USD Billion, 2017–2025",
  description:
    "IDA's balance sheet grew from about USD 197 billion in 2017 to USD 281 billion in 2025 — an increase of more than 40% in eight years.",
  source: "Sources & series: to be confirmed",
  number: "Figure 1",
  // A single series through the stacked renderer draws plain bars.
  kind: "bar-stacked",
  xKey: "year",
  series: [{ key: "Total assets", value: "total", color: colors.sky }],
  data: parseFigureCsv(csv).map((d) => ({
    ...d,
    total: Math.round((d.liabilities + d.equity) * 10) / 10,
  })),
};
