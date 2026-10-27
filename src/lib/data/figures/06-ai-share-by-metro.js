import { parseFigureCsv } from "./parse-csv.js";
import { AI_SERIES } from "./05-ai-share-of-capital.js";
import { SOURCE } from "./01-capital-by-year.js";
// Carta, State of Private Markets Q1 2026, slide 43. Every segment is
// labelled on the slide except Austin's foundational sliver, which is the
// difference of two labels (60.0% total − 57.4% applied = 2.6%). Ordered as
// Carta ranks them, by total AI share.
import csv from "./csv/06-ai-share-by-metro.csv?raw";

// Short names on the axis — six full metro names do not fit under six bars
// on a phone, and every one has to stay (no thinning on a categorical axis).
// The tooltip spells them out.
const full = {
  "Bay Area": "Bay Area, CA",
  Austin: "Austin, TX",
  "Washington DC": "Washington, DC",
  Seattle: "Seattle, WA",
  Boston: "Boston, MA",
  "Los Angeles": "Los Angeles, CA",
};
const short = {
  "Bay Area": "Bay Area",
  Austin: "Austin",
  "Washington DC": "D.C.",
  Seattle: "Seattle",
  Boston: "Boston",
  "Los Angeles": "L.A.",
};

export default {
  title: "Bay Area #1, Austin #2, D.C. #3 for Investment in AI",
  subtitle:
    "Share of Capital Invested in AI Companies by Metro Area, %, Seed to Series E+, Q4 2025 to Q1 2026",
  description:
    "In the Bay Area 70.9% of capital went to AI, 21.2% to foundational models alone. Austin follows at 60.0%, almost all of it applied AI, then Washington, DC at 53.6%.",
  source: SOURCE,
  kind: "bar-stacked",
  xKey: "metro",
  xTickFormat: (d) => short[d] ?? d,
  tooltipHeaderFormat: (d) => full[d] ?? d,
  valueSuffix: "%",
  yTicks: [20, 40, 60],
  bandPadding: 0.35,
  // Wider bands than a year axis: the direct labels' leader lines start
  // half a band out.
  directLabelOffset: 44,
  // Same entities, same colours as the previous figure.
  series: AI_SERIES,
  data: parseFigureCsv(csv),
};
