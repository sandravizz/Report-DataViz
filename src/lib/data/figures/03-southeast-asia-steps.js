import { colors, iea } from "$lib/colors";

// From the IEA report "Ensuring a Skilled Renewable Energy and Energy
// Efficiency Workforce" (2026), p. 11: Southeast Asia's workforce by sector in
// the STEPS, million workers, for 2015, 2024 and the 2035 STEPS projection.
// Values read off the published chart (the 2035 total of 1.8 million is
// stated in the text), to be replaced with the exact series if the client
// supplies the data table.
const data = [
  { year: new Date(2015, 0, 1), efficiency: 0.42, grids: 0.4, wind: 0.01, solar: 0.12 },
  { year: new Date(2024, 0, 1), efficiency: 0.8, grids: 0.45, wind: 0.05, solar: 0.15 },
  { year: new Date(2035, 0, 1), efficiency: 0.98, grids: 0.55, wind: 0.12, solar: 0.15 },
];

export default {
  title: "Southeast Asia's Clean Energy Workforce Keeps Expanding",
  subtitle:
    "Southeast Asia's Renewable Energy, Grids and Energy Efficiency Workforce by Sector in the STEPS, Million Workers, 2015–2035",
  description:
    "In the STEPS, employment in renewable energy, grids and energy efficiency in Southeast Asia rises to 1.8 million workers by 2035.",
  source: "Source: IEA 2026",
  number: "Figure 3",
  kind: "bar-stacked",
  xKey: "year",
  // The middle bar is 2024 actuals; the last is the 2035 STEPS projection.
  xTickFormat: (d) => (d.getFullYear() === 2035 ? "2035 STEPS" : String(d.getFullYear())),
  // Efficiency is the region's biggest employer and the headline's subject,
  // so it sits on the shared baseline; the rest stack above it in size order.
  // Colors match Figure 2's sector palette one-to-one, so the same sector
  // wears the same hue across the line chart and this stack.
  series: [
    { key: "Efficiency", value: "efficiency", color: colors.sage },
    { key: "Grids", value: "grids", color: iea.royal },
    { key: "Wind", value: "wind", color: iea.purple },
    { key: "Solar PV", value: "solar", color: colors.sky },
  ],
  data,
};
