import { colors, fdl } from "$lib/colors";
import { circleCallout, projectionRange } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
// From the IDA_GIZ_KAdequacyModel presentation (slide 15), exact series from
// the chart's data table, rounded to 2 decimals. The CSV codes each row as
// replenishment period + year within it ("IDA18-2"); every period has three
// yearly values except IDA19, which was shortened to two when IDA20 was
// advanced a year as part of the COVID response.
import csv from "./csv/02-ida-objective.csv?raw";

// First fiscal year of each replenishment period, used to place the period
// codes on the chart's (hidden) fiscal-year time axis: IDA17 FY15-17,
// IDA18 FY18-20, IDA19 FY21-22, IDA20 FY23-25, IDA21 FY26-28, IDA22 FY29-31.
const periodStartYears = {
  IDA17: 2015,
  IDA18: 2018,
  IDA19: 2021,
  IDA20: 2023,
  IDA21: 2026,
  IDA22: 2029,
};

const periodByStartYear = Object.fromEntries(
  Object.entries(periodStartYears).map(([period, year]) => [year, period])
);

const data = parseFigureCsv(csv).map((row) => {
  const [period, seq] = row.period.split("-");
  return { ...row, year: new Date(periodStartYears[period] + +seq - 1, 0, 1) };
});

export default {
  title: "The Objective: Maintaining IDA's Disbursement Pace",
  subtitle: "IDA Disbursements by Financing Window, USD Billion, IDA17–IDA22",
  description:
    "The IDA ambition is maintaining an overall disbursement pace similar to the past 10 years. The IDA cliff is flat or declining disbursements.",
  source: "Sources & series: to be confirmed",
  number: "Figure 3",
  kind: "line",
  xKey: "year",
  xTicks: Object.values(periodStartYears).map((y) => new Date(y, 0, 1)),
  xTickFormat: (d) => periodByStartYear[d.getFullYear()] ?? "",
  // The x axis is really period-year codes, not calendar years, so the
  // tooltip header shows e.g. "IDA19 · Year 2" instead of the fiscal year.
  tooltipHeaderFormat: (d) => {
    const row = data.find((r) => r.year.getTime() === d.getTime());
    return row ? row.period.replace("-", " · Year ") : "";
  },
  rangeAnnotations: [
    projectionRange({ x: [new Date(2026, 0, 1), new Date(2031, 0, 1)] }),
  ],
  // Placeholder callout — to be refined once we decide what to emphasize.
  annotations: [
    circleCallout({
      x: new Date(2026, 0, 1),
      y: 15.15,
      filled: true,
      color: fdl.slate,
      label: "The ambition: sustain the pace of the past decade",
      labelPlacement: "top-left",
      labelXOffset: 24,
      labelYOffset: 28,
      link: { type: "swoop" },
      labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
      mobile: {
        props: { label: { width: 150, truncate: false } },
      },
    }),
  ],
  series: [
    {
      key: "Concessional loans",
      endLabel: "Concessional",
      value: "concessional",
      color: fdl.slate,
    },
    {
      key: "Blended loans",
      endLabel: "Blended",
      value: "blended",
      color: colors.sage,
    },
    { key: "Grants", endLabel: "Grants", value: "grants", color: colors.sky },
    {
      key: "Non-concessional loans",
      endLabel: "Non-concessional",
      value: "nonconcessional",
      color: colors.coral,
    },
  ],
  data,
};
