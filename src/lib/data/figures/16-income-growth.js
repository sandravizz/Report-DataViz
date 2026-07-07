import { palette } from "$lib/colors";

export default {
  title: "Large Majorities Benefit from Higher Income in All Regions",
  subtitle: "Population Shares by Monetary Income Growth, 2025–2100",
  description:
    "According to the Global Justice Platform, large majorities of the population in every region benefit from rising monetary income between 2025 and 2100. At the world level, 89% of the population double their income or more, 7% increase their income between 20% and 100%, 2% by 0-20% and 2% face an income decline.",
  source:
    "Sources & series: gjp.wid.world (F16)",
  number: "Figure 16",
  kind: "stacked-bar",
  xKey: "region",
  valueSuffix: "%",
  labelSeries: "large",
  series: [
    { key: "More than 100% Income Increase", value: "large", color: "#557A57" },
    { key: "20-100% Income Increase", value: "medium", color: palette[2] },
    { key: "0-20% Income Increase", value: "small", color: palette[6] },
    { key: "Income Decline", value: "decline", color: "#C04A3C" },
  ],
  data: [
    { region: "World", decline: 2, small: 2, medium: 7, large: 89 },
    { region: "Europe", decline: 6, small: 8, medium: 58, large: 28 },
    { region: "North America/Oceania", decline: 14, small: 16, medium: 45, large: 25 },
    { region: "Latin America", decline: 1, small: 1, medium: 3, large: 95 },
    { region: "Middle East/North Africa", decline: 1, small: 2, medium: 5, large: 92 },
    { region: "Sub-Saharan Africa", decline: 0, small: 0, medium: 1, large: 99 },
    { region: "Russia/Central Asia", decline: 2, small: 1, medium: 3, large: 94 },
    { region: "East Asia", decline: 1, small: 2, medium: 11, large: 86 },
    { region: "South & South-East Asia", decline: 0, small: 0, medium: 1, large: 99 },
  ],
};
