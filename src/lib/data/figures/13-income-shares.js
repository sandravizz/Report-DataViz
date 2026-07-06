import { palette } from "$lib/colors";
import { circleCallout, projectionRange } from "../annotation-presets.js";

export default {
  title: "Combining Between-Country & Within-Country Inequality Compression",
  subtitle: "Global Income Shares in Total Post-Tax Income, 1800–2100",
  description:
    "According to the Global Justice Platform, the share of the top 10% highest incomes in total posttax income in the world is projected to decline from 52% in 2025 to 18% in 2100. The share of the global bottom 50% in posttax income is projected to increase from 8% in 2025 to 38% in 2100, and for the middle 40% from 40% today to 44% in 2100.",
  source:
    "Sources & series: gjp.wid.world (F13)",
  number: "Figure 13",
  kind: "line",
  xKey: "year",
  valueSuffix: "%",
  lineEndLabels: true,
  rangeAnnotations: [
    projectionRange({ x: [new Date(2025, 0, 1), new Date(2100, 0, 1)] }),
  ],
  annotations: [
    circleCallout({
      x: new Date(2050, 0, 1),
      y: 28,
      filled: true,
      color: palette[3],
      label: "Bottom 50% overtakes the top 10% around 2050",
      labelPlacement: "bottom-left",
      labelXOffset: 30,
      labelYOffset: 30,
      link: { type: "swoop" },
      labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
      // Narrow viewports: the one-line label is wider than the space left of
      // the point, so wrap it to 2 lines in the open region below-left of
      // the intersection. Text truncates at `width` unless truncate is
      // explicitly disabled — only then does `width` word-wrap.
      mobile: {
        labelXOffset: 20,
        labelYOffset: 36,
        props: { label: { width: 180, truncate: false } },
      },
    }),
  ],
  series: [
    { key: "Share of Top 10%", endLabel: "Top 10%", value: "top10", color: palette[5] },
    { key: "Share of Middle 40%", endLabel: "Middle 40%", value: "middle40", color: palette[2] },
    { key: "Share of Bottom 50%", endLabel: "Bottom 50%", value: "bottom50", color: palette[3] },
  ],
  data: [
    { year: new Date(1800, 0, 1), top10: 50, middle40: 35, bottom50: 15 },
    { year: new Date(1820, 0, 1), top10: 51, middle40: 35, bottom50: 14 },
    { year: new Date(1840, 0, 1), top10: 53, middle40: 34, bottom50: 13 },
    { year: new Date(1860, 0, 1), top10: 55, middle40: 33, bottom50: 12 },
    { year: new Date(1880, 0, 1), top10: 57, middle40: 33, bottom50: 10 },
    { year: new Date(1900, 0, 1), top10: 60, middle40: 31, bottom50: 9 },
    { year: new Date(1920, 0, 1), top10: 56, middle40: 34, bottom50: 10 },
    { year: new Date(1940, 0, 1), top10: 53, middle40: 38, bottom50: 9 },
    { year: new Date(1960, 0, 1), top10: 54, middle40: 40, bottom50: 6 },
    { year: new Date(1980, 0, 1), top10: 53, middle40: 42, bottom50: 5 },
    { year: new Date(2000, 0, 1), top10: 58, middle40: 36, bottom50: 6 },
    { year: new Date(2020, 0, 1), top10: 52, middle40: 40, bottom50: 8 },
    { year: new Date(2030, 0, 1), top10: 47, middle40: 43, bottom50: 10 },
    { year: new Date(2040, 0, 1), top10: 34, middle40: 45, bottom50: 21 },
    { year: new Date(2050, 0, 1), top10: 28, middle40: 44, bottom50: 28 },
    { year: new Date(2060, 0, 1), top10: 25, middle40: 45, bottom50: 30 },
    { year: new Date(2080, 0, 1), top10: 21, middle40: 44, bottom50: 35 },
    { year: new Date(2100, 0, 1), top10: 18, middle40: 44, bottom50: 38 },
  ],
};
