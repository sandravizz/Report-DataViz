import { colors, iea } from "$lib/colors";
import { lineCallout } from "../annotation-presets.js";

// From the IEA report "Ensuring a Skilled Renewable Energy and Energy
// Efficiency Workforce" (2026), p. 6: average annual change of the renewable
// energy, grids and energy efficiency workforce vs the economy-wide workforce
// by region, 2019-2024. Values read off the published chart, to be replaced
// with the exact series if the client supplies the data table.
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
  kind: "bar-grouped",
  xKey: "region",
  valueSuffix: "%",
  annotations: [
    // Interpretation callout (not report text): India leads on both measures.
    lineCallout({
      x: "India",
      y: 6.0,
      r: 8,
      label: "In India clean energy jobs grew almost twice as fast as the economy-wide workforce",
      labelPlacement: "top-right",
      labelXOffset: 26,
      labelYOffset: 10,
      labelProps: { textAnchor: "start", verticalAnchor: "middle", width: 220, truncate: false },
      mobile: {
        labelXOffset: 12,
        labelYOffset: 6,
        props: { label: { width: 130, lineHeight: "13px" } },
      },
    }),
  ],
  series: [
    {
      key: "Renewable energy, grids and energy efficiency",
      value: "clean",
      color: colors.sky,
    },
    { key: "Economy-wide", value: "economy", color: iea.gray },
  ],
  data,
};
