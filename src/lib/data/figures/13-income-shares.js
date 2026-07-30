import { colors } from "$lib/colors";
import { quarterCenturyTicks } from "$lib/chart-theme";
import { circleCallout, projectionRange } from "../annotation-presets.js";

// World series from the report's DataF2.13a14a tables (gjp.wid.world),
// sampled every 20 years plus 2025 (projection start) and key
// projection-era points.
const data = [
  { year: new Date(1800, 0, 1), top10: 50, middle40: 36, bottom50: 15 },
  { year: new Date(1820, 0, 1), top10: 50, middle40: 35, bottom50: 14 },
  { year: new Date(1840, 0, 1), top10: 52, middle40: 35, bottom50: 13 },
  { year: new Date(1860, 0, 1), top10: 55, middle40: 33, bottom50: 11 },
  { year: new Date(1880, 0, 1), top10: 57, middle40: 33, bottom50: 10 },
  { year: new Date(1900, 0, 1), top10: 59, middle40: 32, bottom50: 9 },
  { year: new Date(1920, 0, 1), top10: 57, middle40: 34, bottom50: 9 },
  { year: new Date(1940, 0, 1), top10: 53, middle40: 39, bottom50: 8 },
  { year: new Date(1960, 0, 1), top10: 51, middle40: 41, bottom50: 7 },
  { year: new Date(1980, 0, 1), top10: 53, middle40: 42, bottom50: 6 },
  { year: new Date(2000, 0, 1), top10: 58, middle40: 35, bottom50: 7 },
  { year: new Date(2020, 0, 1), top10: 51, middle40: 40, bottom50: 8 },
  { year: new Date(2025, 0, 1), top10: 52, middle40: 40, bottom50: 8 },
  { year: new Date(2030, 0, 1), top10: 44, middle40: 43, bottom50: 13 },
  { year: new Date(2040, 0, 1), top10: 36, middle40: 44, bottom50: 20 },
  { year: new Date(2050, 0, 1), top10: 27, middle40: 44, bottom50: 29 },
  { year: new Date(2060, 0, 1), top10: 25, middle40: 45, bottom50: 31 },
  { year: new Date(2080, 0, 1), top10: 21, middle40: 44, bottom50: 35 },
  { year: new Date(2100, 0, 1), top10: 18, middle40: 44, bottom50: 38 },
];

const allSeries = [
  { key: "Share of Top 10%", endLabel: "Top 10%", value: "top10", color: colors.sky },
  { key: "Share of Middle 40%", endLabel: "Middle 40%", value: "middle40", color: colors.sage },
  { key: "Share of Bottom 50%", endLabel: "Bottom 50%", value: "bottom50", color: colors.coral },
];

// Shared scaffold for the three reveal steps — only the visible lines and
// each step's title/description/annotations change while scrolling.
const base = {
  subtitle: "Global Income Shares in Post-Tax Income, 1800–2100",
  source: "Sources & series: gjp.wid.world (F13)",
  kind: "line",
  xKey: "year",
  valueSuffix: "%",
  xTicks: quarterCenturyTicks(1800, 2100),
  // Fixed across all three steps (matches the original single-panel chart's
  // auto-derived range) so the y axis holds still while a step's series
  // subset changes — an auto domain would shrink to whichever lines are
  // visible and rescale, jumping, on every step transition.
  yDomain: [0, 60],
  rangeAnnotations: [
    projectionRange({ x: [new Date(2025, 0, 1), new Date(2100, 0, 1)] }),
  ],
  data,
};

const stepSeries = (newValue, values) =>
  allSeries
    .filter((s) => values.includes(s.value))
    .map((s) => ({ ...s, drawIn: s.value === newValue }));

export const incomeSharesSteps = [
  {
    ...base,
    number: "Figure 13a",
    title: "The Top 10% Share Has Swung Widely, and Is Set to Shrink",
    description:
      "The world's top 10% has held 50–59% of post-tax income since 1800. Under the Global Justice Platform's projections, that share falls sharply after 2025 — from 52% in 2025 to 18% in 2100.",
    series: stepSeries("top10", ["top10"]),
  },
  {
    ...base,
    number: "Figure 13b",
    title: "The Middle 40% Holds Roughly Steady",
    description:
      "The middle 40%'s share has stayed in a narrower band, 32–45%, over the same two centuries. It's projected to rise only modestly, from 40% today to 44% by 2100.",
    series: stepSeries("middle40", ["top10", "middle40"]),
  },
  {
    ...base,
    number: "Figure 13c",
    title: "The Bottom 50% Overtakes the Top 10% Around 2050",
    description:
      "The bottom 50%'s share, squeezed to as little as 6% in the 1970s, is projected to grow more than fourfold — from 8% in 2025 to 38% in 2100 — overtaking the shrinking top 10% around 2050.",
    series: stepSeries("bottom50", ["top10", "middle40", "bottom50"]),
    annotations: [
      circleCallout({
        x: new Date(2050, 0, 1),
        y: 28,
        filled: true,
        color: colors.lavender,
        label: "Bottom 50% overtakes the top 10% around 2050",
        labelPlacement: "bottom-left",
        labelXOffset: 30,
        labelYOffset: 30,
        link: { type: "swoop" },
        labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
        // Narrow viewports: the one-line label is wider than the space left
        // of the point, so wrap it to 2 lines in the open region
        // below-left of the intersection. Text truncates at `width` unless
        // truncate is explicitly disabled — only then does `width` word-wrap.
        mobile: {
          labelXOffset: 20,
          labelYOffset: 36,
          props: { label: { width: 180, truncate: false } },
        },
      }),
    ],
  },
];
