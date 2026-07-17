import { colors, iea } from "$lib/colors";

const data = [
  { region: "India", clean: 6.0, economy: 3.2 },
  { region: "China", clean: 4.3, economy: -0.1 },
  { region: "Africa", clean: 4.0, economy: 2.3 },
  { region: "Central and South America", clean: 2.8, economy: 1.0 },
  { region: "Southeast Asia", clean: 2.3, economy: 0.8 },
  { region: "North America", clean: 1.2, economy: 0.6 },
  { region: "Other Asia Pacific", clean: 0.5, economy: 1.3 },
  { region: "Europe", clean: 0.2, economy: -0.4 },
];

export default {
  title: "Clean Energy Jobs Outpace the Wider Economy",
  subtitle:
    "Average Annual Change in Renewable Energy, Grids and Energy Efficiency Workforce and Economy-Wide Workforce by Region, 2019–2024",
  description:
    "Since 2019, the energy sector added on average more than 1 million jobs annually, which marks a shift compared to the period between 2015 and 2019, when the sector created around 300 000 jobs per year on average.",
  source:
    "Source: IEA (2026), Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce, CC BY 4.0",
  number: "Figure 1",
  kind: "bar-horizontal",
  xKey: "region",
  valueSuffix: "%",
  // Grouped bars position each series on a band scale keyed by `key`, so
  // `key` must be the data field; the display name goes in `label` (used by
  // the legend and tooltip).
  series: [
    {
      key: "clean",
      label: "Renewable energy, grids and energy efficiency",
      color: colors.sky,
    },
    { key: "economy", label: "Economy-wide", color: iea.gray },
  ],
  data,
};
