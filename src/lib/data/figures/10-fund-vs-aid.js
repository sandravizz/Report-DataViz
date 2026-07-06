import { palette } from "$lib/colors";

export default {
  title: "The Global Justice Fund Dwarfs Existing Development Aid",
  subtitle: "Annual Budget as % of World GDP",
  description:
    "GJF expenditures make 10.3% of world GDP per year on average over 2026-2060. GJF expenses consist of country dividends (allocated to each country on an equal per-capita basis) and gross investment flows accumulating into the World Sovereign Fund (WSF). This vastly exceeds total development aid (ODA, 0.3% of world GDP in 2025) or the combined budget of UN, IMF and WB (0.1% of world GDP in 2025).",
  source:
    "Sources & series: gjp.wid.world (F10)",
  number: "Figure 10",
  kind: "bar",
  xKey: "item",
  yKey: "v",
  valueSuffix: "%",
  data: [
    { item: "GJF Annual Expenditures\n(2026–2060)", v: 10.3, color: palette[3] },
    { item: "incl. Country\nDividends", v: 5.7, color: "#E58A70" },
    { item: "incl. WSF\nInvestment Flows", v: 4.6, color: "#EFB5AA" },
    { item: "Total Development\nAid (2025)", v: 0.3, color: palette[9] },
    { item: "Total Budget\nUN-IMF-WB (2025)", v: 0.1, color: palette[9] },
  ],
};
