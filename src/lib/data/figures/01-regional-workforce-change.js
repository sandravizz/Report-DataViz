import { iea } from "$lib/colors";

const data = [
  { region: "India", clean: 6.0, economy: 3.2 },
  { region: "China", clean: 4.3, economy: -0.1 },
  { region: "Africa", clean: 4.0, economy: 2.3 },
  { region: "Central and South America", clean: 2.8, economy: 1.0 },
  { region: "Southeast Asia", clean: 2.0, economy: 0.8 },
  { region: "North America", clean: 1.2, economy: 0.6 },
  { region: "Other Asia Pacific", clean: 0.5, economy: 1.3 },
  { region: "Europe", clean: 0.2, economy: -0.4 },
];

export default {
  title: "Clean Energy Jobs growing",
  subtitle:
    "Average Annual Change in Workforce by Region, 2019–2024",
  description:
    "India leads regional employment growth by a wide margin, with clean energy jobs expanding 6.0% a year on average — nearly 40% faster than second-placed China's 4.3%, whose broader economy-wide workforce actually shrank slightly over the same period.",
  source: "Source: IEA 2026. Chart shape approximate; CC BY 4.0.",
  number: "Figure 1",
  kind: "bar-horizontal",
  xKey: "region",
  valueSuffix: "%",
  series: [
    {
      key: "clean",
      label: "Renewable energy, grids and energy efficiency",
      color: iea.regionTints[3],
    },
    { key: "economy", label: "Economy-wide", color: iea.regionTints[4] },
  ],
  data,
};
