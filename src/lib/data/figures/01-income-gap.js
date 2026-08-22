import { colors } from "$lib/colors";

export default {
  title: "Large Gaps in Average Monthly Income Between Regions",
  subtitle: "Monthly Gross National Disposable Income, 2025 Euros PPP",
  description:
    "The Global Justice Platform aims to combine equality & prosperity for all countries with planetary habitability (global warming below 2°C). In 2025, per capita monthly gross national incomes range from 290 Euros in Sub-Saharan Africa to 4,590 Euros in North America/Oceania. Incomes are projected to reach 5,000 Euros in all countries by 2100.",
  source:
    "Sources & series: gjp.wid.world (F1)",
  number: "Figure 1",
  kind: "bar-horizontal",
  xKey: "region",
  yKey: "v",
  valuePrefix: "€",
  data: [
    { region: "Sub-Saharan Africa", v: 290, color: colors.negative },
    { region: "South & South-East Asia", v: 720, color: colors.quiet },
    { region: "Latin America", v: 1250, color: colors.quiet },
    { region: "Middle East & North Africa", v: 1370, color: colors.quiet },
    { region: "World", v: 1410, color: colors.middle },
    { region: "East Asia", v: 1830, color: colors.quiet },
    { region: "Russia/Central Asia", v: 1950, color: colors.quiet },
    { region: "Europe", v: 3590, color: colors.quiet },
    { region: "North America/Oceania", v: 4590, color: colors.negative },
    { region: "All Countries in 2100", v: 5000, color: colors.positive },
  ],
};
