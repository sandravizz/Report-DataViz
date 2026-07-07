import { palette } from "$lib/colors";

export default {
  title: "Towards Global Equality of Opportunities: Education",
  subtitle: "Education Expenditure per Capita, 2025 Euros PPP",
  description:
    "In 2025, per capita expenditure in education varies from 209 Euros in Sub-Saharan Africa to 4141 Euros in North America/Oceania (all amounts in PPP 2025 Euros). Gaps are even larger if we look at per children expenditure. In the global justice scenario, all countries are projected to converge to 8400 Euros in per capita expenditure by 2100.",
  source:
    "Sources & series: gjp.wid.world (F12)",
  number: "Figure 12",
  kind: "bar",
  xKey: "region",
  yKey: "v",
  valuePrefix: "€",
  data: [
    { region: "Sub-Saharan Africa", v: 209, color: palette[3] },
    { region: "South & South-East Asia", v: 425, color: palette[6] },
    { region: "Middle East & North Africa", v: 790, color: palette[6] },
    { region: "World", v: 897, color: palette[4] },
    { region: "East Asia", v: 921, color: palette[6] },
    { region: "Russia/Central Asia", v: 921, color: palette[6] },
    { region: "Latin America", v: 958, color: palette[6] },
    { region: "Europe", v: 2237, color: palette[6] },
    { region: "North America/Oceania", v: 4141, color: palette[3] },
    { region: "All Countries in 2100", v: 8400, color: palette[5] },
  ],
};
