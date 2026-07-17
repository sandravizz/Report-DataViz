import { colors, iea } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";

// From the IEA report "Ensuring a Skilled Renewable Energy and Energy
// Efficiency Workforce" (2026), p. 10: global energy workforce growth indexed
// to 2019 = 100. Values read off the published chart, to be replaced with the
// exact series if the client supplies the data table.
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

export default {
  title: "Solar PV Leads the Energy Workforce Boom",
  subtitle:
    "Global Energy Workforce Growth in Renewable Energy, Grids and Energy Efficiency, Index (2019 = 100), 2019–2024",
  description:
    "Solar PV employment grew about 60% between 2019 and 2024 — far ahead of wind (+24%), grids (+10%) and energy efficiency (+6%), which all recovered more slowly from the 2020 dip.",
  source:
    "Source: IEA (2026), Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce, CC BY 4.0",
  number: "Figure 2",
  kind: "line",
  xKey: "year",
  xTicks: years.map((y) => new Date(y, 0, 1)),
  xTickFormat: (d) => d.getFullYear(),
  // Index chart: the axis starts at the 90 baseline like the IEA original,
  // not at 0.
  yDomain: [90, 170],
  // Placeholder callout — to be refined once we decide what to emphasize.
  annotations: [
    circleCallout({
      x: new Date(2024, 0, 1),
      y: 160,
      filled: true,
      color: colors.sky,
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
  series: [
    { key: "Solar PV", endLabel: "Solar PV", value: "solar", color: colors.sky },
    { key: "Wind", endLabel: "Wind", value: "wind", color: iea.purple },
    { key: "Grids", endLabel: "Grids", value: "grids", color: iea.royal },
    {
      key: "Energy efficiency",
      endLabel: "Energy efficiency",
      value: "efficiency",
      color: colors.sage,
    },
  ],
  data,
};
