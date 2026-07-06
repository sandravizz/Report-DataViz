import { palette } from "$lib/colors";

export default {
  title: "North-South Transfers Are Smaller Than Colonial and Climate Damages",
  subtitle: "Annual Transfers 2026–2100, % of World GDP",
  description:
    "The North-South transfers induced by the Global Justice Fund (i.e. the extra wealth and income taxes paid and lower country dividends received by Europe and North America/Oceania) represent about 0.8% of world GDP on average between 2026 and 2100. This is significantly smaller than the corresponding annual transfers which should have been paid over the same period in order to compensate for the cumulated colonial and climate damages imposed by Europe and North America/Oceania between 1800 and 2025.",
  source:
    "Sources & series: gjp.wid.world (F18)",
  number: "Figure 18",
  kind: "bar",
  xKey: "item",
  yKey: "v",
  valueSuffix: "%",
  data: [
    { item: "GJF North-South\nTransfers", v: 0.8, color: "#20719E" },
    { item: "Reparation for\nColonial & Climate", v: 3.2, color: palette[3] },
    { item: "incl. Slavery\nDamages", v: 1.5, color: "#E58A70" },
    { item: "incl. Other Colonial\nDamages", v: 0.9, color: "#EFB5AA" },
    { item: "incl. Climate\nDamages", v: 0.8, color: "#EFB5AA" },
  ],
};
