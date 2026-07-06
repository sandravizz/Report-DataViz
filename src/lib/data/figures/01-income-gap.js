import { palette } from "$lib/colors";

export default {
  title: "Large Gaps in Average Monthly Income Between Regions",
  subtitle: "Monthly Gross National Disposable Income, 2025 Euros PPP",
  description:
    "The Global Justice Platform aims to combine equality & prosperity for all countries with planetary habitability (global warming below 2°C). In 2025, per capita monthly gross national incomes range from 290 Euros in Sub-Saharan Africa to 4,590 Euros in North America/Oceania. Incomes are projected to reach 5,000 Euros in all countries by 2100.",
  source:
    "Sources & series: gjp.wid.world (F1)",
  number: "Figure 1",
  kind: "bar",
  xKey: "region",
  yKey: "v",
  valuePrefix: "€",
  data: [
    { region: "Sub-Saharan\nAfrica", v: 290, color: palette[3] },
    { region: "South &\nSouth-East\nAsia", v: 720, color: palette[6] },
    { region: "Latin America", v: 1250, color: palette[6] },
    { region: "Middle East &\nNorth Africa", v: 1370, color: palette[6] },
    { region: "World", v: 1410, color: palette[4] },
    { region: "East Asia", v: 1830, color: palette[6] },
    { region: "Russia/\nCentral Asia", v: 1950, color: palette[6] },
    { region: "Europe", v: 3590, color: palette[6] },
    { region: "North America/\nOceania", v: 4590, color: palette[3] },
    { region: "All Countries\nin 2100", v: 5000, color: palette[5] },
  ],
};
