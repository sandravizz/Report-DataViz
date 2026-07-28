import { iea } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";

const years = [2019, 2020, 2021, 2022, 2023, 2024];
const seriesValues = {
  solar: [100, 97.5, 121, 137, 151, 160],
  wind: [100, 97.5, 106, 113, 120.5, 124],
  grids: [100, 99.5, 101, 104, 107, 110],
  efficiency: [100, 97, 99, 101, 103, 106],
};

const data = years.map((year, i) => ({
  year: new Date(year, 0, 1),
  solar: seriesValues.solar[i],
  wind: seriesValues.wind[i],
  grids: seriesValues.grids[i],
  efficiency: seriesValues.efficiency[i],
}));

const allSeries = [
  { key: "Solar PV", endLabel: "Solar PV", value: "solar", color: iea.solar },
  { key: "Wind", endLabel: "Wind", value: "wind", color: iea.wind },
  {
    key: "Grids",
    endLabel: "Grids",
    value: "grids",
    color: iea.grids,
    endLabelMobile: { labelYOffset: -6 },
  },
  {
    key: "Energy efficiency",
    endLabel: "Energy efficiency",
    value: "efficiency",
    color: iea.efficiency,
    endLabelMobile: { labelYOffset: 6 },
  },
];

// Shared scaffold for the four reveal steps: same data, axes and subtitle, so
// only the visible lines (and the step's own title/description) change while
// scrolling.
const base = {
  subtitle:
    "Global Energy Workforce Growth Index (2019 = 100), 2019–2024",
  source: "Source: IEA 2026. Chart shape approximate; CC BY 4.0.",
  kind: "line",
  xKey: "year",
  xTicks: years.map((y) => new Date(y, 0, 1)),
  yDomain: [90, 170],
  data,
};

const stepSeries = (newValue, values) =>
  allSeries
    .filter((s) => values.includes(s.value))
    .map((s) => ({ ...s, drawIn: s.value === newValue }));

const diffBand = (upperValue, lowerValue) => {
  const last = data[data.length - 1];
  const gap = Math.round(last[upperValue] - last[lowerValue]);
  return {
    y1: upperValue,
    y0: lowerValue,
    color: allSeries.find((s) => s.value === upperValue).color,
    label: `+${gap}%`,
    labelX: last.year,
    labelY: (last[upperValue] + last[lowerValue]) / 2,
  };
};

export const workforceGrowthIndexSteps = [
  {
    ...base,
    number: "Figure 2a",
    title: "Efficiency Jobs Grew Slowly",
    description:
      "Energy efficiency employment grew just 6% between 2019 and 2024 — a shallow dip in 2020 followed by a slow, steady recovery.",
    series: stepSeries("efficiency", ["efficiency"]),
  },
  {
    ...base,
    number: "Figure 2b",
    title: "Grid Employment Edged Ahead",
    description:
      "Grid employment barely dipped in 2020 and grew 10% by 2024 — a touch faster than energy efficiency, but still in the slow lane.",
    series: stepSeries("grids", ["grids", "efficiency"]),
    diffBand: diffBand("grids", "efficiency"),
  },
  {
    ...base,
    number: "Figure 2c",
    title: "Wind Pulled Clearly Ahead of the Pack",
    description:
      "Wind employment grew 24% between 2019 and 2024, clearly outpacing grids (+10%) and energy efficiency (+6%) after the 2020 dip.",
    series: stepSeries("wind", ["wind", "grids", "efficiency"]),
    diffBand: diffBand("wind", "grids"),
  },
  {
    ...base,
    number: "Figure 2d",
    title: "Solar PV Leads the Workforce",
    description:
      "Solar PV employment grew about 60% between 2019 and 2024 — far ahead of wind (+24%), grids (+10%) and energy efficiency (+6%), which all recovered more slowly from the 2020 dip.",
    series: stepSeries("solar", ["solar", "wind", "grids", "efficiency"]),
    diffBand: diffBand("solar", "wind"),
    annotations: [
      circleCallout({
        x: new Date(2024, 0, 1),
        y: 160,
        filled: true,
        color: iea.solar,
        label: "Solar PV jobs up 60% since 2019",
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
  },
];

// The full four-line chart stays the canonical "Figure 2" for anything that
// wants a single figure.
export default workforceGrowthIndexSteps[workforceGrowthIndexSteps.length - 1];
