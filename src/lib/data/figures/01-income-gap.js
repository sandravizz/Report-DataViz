import { colors } from "$lib/colors";

export default {
  title: "Large Gaps in Average Monthly Income Between Regions",
  subtitle: "Monthly Gross National Disposable Income, 2025 Euros PPP",
  description:
    "Placeholder figure. In 2025, per capita monthly gross national incomes range from 290 Euros in Sub-Saharan Africa to 4,590 Euros in North America/Oceania. Incomes are projected to reach 5,000 Euros in all countries by 2100.",
  source:
    "Placeholder data — figure source to follow",
  number: "Figure 1",
  kind: "bar-horizontal",
  xKey: "region",
  yKey: "v",
  valuePrefix: "€",
  data: [
    { region: "Sub-Saharan Africa", v: 290, color: colors.red },
    { region: "South & South-East Asia", v: 720, color: colors.gray },
    { region: "Latin America", v: 1250, color: colors.gray },
    { region: "Middle East & North Africa", v: 1370, color: colors.gray },
    { region: "World", v: 1410, color: colors.teal },
    { region: "East Asia", v: 1830, color: colors.gray },
    { region: "Russia/Central Asia", v: 1950, color: colors.gray },
    { region: "Europe", v: 3590, color: colors.gray },
    { region: "North America/Oceania", v: 4590, color: colors.red },
    { region: "All Countries in 2100", v: 5000, color: colors.highlight },
  ],
};
