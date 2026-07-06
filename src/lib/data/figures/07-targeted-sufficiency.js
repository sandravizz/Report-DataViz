import { palette } from "$lib/colors";

export default {
  title: "Targeted Sufficiency Can Be More Effective Than Large Uniform Degrowth",
  subtitle: "Projected Emissions & Temperature Under Fast Decarbonization (Gigatonnes GHG, Net CO2e)",
  description:
    "Targeted sufficiency, i.e. global convergence of all countries to 60k Euros 2025 PPP in per capita GDP by 2100, together with sectoral change, leads to 1.8°C temperature rise in 2100, i.e. less than the 1.9°C associated to large uniform degrowth (15k for all in 2100) but no structural change. Corresponding temperatures without sectoral change: 60k 2.2°C, 45k 2.1°C, 30k 2.0°C, 15k 1.9°C; with sectoral change: 1.8°C, 1.7°C, 1.7°C, 1.5°C.",
  source:
    "Sources & series: gjp.wid.world (F7)",
  number: "Figure 7",
  kind: "grouped-bar",
  xKey: "target",
  series: [
    { key: "withoutChange", label: "Without sectoral change", color: palette[6] },
    { key: "withChange", label: "With sectoral change", color: "#20719E" },
  ],
  data: [
    { target: "60k euros", withoutChange: 1945, withChange: 1075 },
    { target: "45k euros", withoutChange: 1733, withChange: 955 },
    { target: "30k euros", withoutChange: 1494, withChange: 776 },
    { target: "15k euros", withoutChange: 1198, withChange: 553 },
  ],
};
