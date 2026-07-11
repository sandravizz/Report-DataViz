import { colors } from "$lib/colors";
import { parseFigureCsv } from "./parse-csv.js";
// From the IDA_GIZ_KAdequacyModel presentation (slide 10): IDA balance sheet
// in USD billion, read off the slide's bar labels (values there in USD
// million). Liabilities + equity sum to total assets, so the stack's height
// traces the balance sheet total.
import csv from "./csv/01-equity-share.csv?raw";

export default {
  title: "Equity's Share Is Large… but Declining",
  subtitle: "IDA Balance Sheet: Equity and Liabilities, USD Billion, 2017–2025",
  description:
    "IDA's assets are financed mostly by equity, but equity's share is declining: from 80% of the balance sheet in 2017 (89% in 2018) to 73% in 2025, as liabilities grew from USD 39 billion to USD 77 billion.",
  source: "Sources & series: to be confirmed",
  number: "Figure 1",
  kind: "bar-stacked",
  xKey: "year",
  // Stack order: first series sits at the bottom, matching the slide
  // (liabilities below, equity on top).
  series: [
    { key: "Liabilities", value: "liabilities", color: colors.coral },
    { key: "Equity", value: "equity", color: colors.sage },
  ],
  data: parseFigureCsv(csv),
};
