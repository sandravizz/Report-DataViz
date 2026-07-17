import { colors, iea } from "$lib/colors";

// From the IEA report "Ensuring a Skilled Renewable Energy and Energy
// Efficiency Workforce" (2026), p. 16: global renewable energy, grids and
// energy efficiency workforce by sector in the STEPS, million workers, 2024
// vs 2035. The 2024 power-sector splits (grids 8.5, solar PV 5.0, wind 1.7)
// and the 2035 growth rates (+25% grids, +14% solar PV, ~+2%/yr wind, +15%
// efficiency) come from the chapter text; the heat-pump split is read off the
// published chart, to be replaced with the exact series if the client
// supplies the data table.
const scenarioTickFormat = (d) =>
  d.getFullYear() === 2035 ? "2035 STEPS" : String(d.getFullYear());

const powerPanel = {
  subtitle: "Power Sector",
  kind: "bar-stacked",
  xKey: "year",
  xTickFormat: scenarioTickFormat,
  bandPadding: 0.4,
  // Grids is the biggest employer and the biggest mover (+25%), so it takes
  // the shared baseline and the featured blue.
  series: [
    { key: "Grids", value: "grids", color: colors.sky },
    { key: "Solar PV", value: "solar", color: iea.royal },
    { key: "Wind", value: "wind", color: iea.purple },
  ],
  data: [
    { year: new Date(2024, 0, 1), grids: 8.5, solar: 5.0, wind: 1.7 },
    { year: new Date(2035, 0, 1), grids: 10.6, solar: 5.7, wind: 2.1 },
  ],
};

const efficiencyPanel = {
  subtitle: "Energy Efficiency",
  kind: "bar-stacked",
  xKey: "year",
  xTickFormat: scenarioTickFormat,
  bandPadding: 0.4,
  // Mint is a fills-only brand color (see docs/iea-brand.md) — fine here as a
  // direct-labeled stacked segment.
  series: [
    { key: "Other efficiency", value: "other", color: colors.sage },
    { key: "Heat pumps", value: "heatPumps", color: iea.mint },
  ],
  data: [
    { year: new Date(2024, 0, 1), other: 13.4, heatPumps: 0.9 },
    { year: new Date(2035, 0, 1), other: 15.0, heatPumps: 1.4 },
  ],
};

export default {
  title: "5.6 Million More Clean Energy Jobs by 2035",
  subtitle:
    "Global Renewable Energy, Grids and Energy Efficiency Workforce by Sector in the STEPS, Million Workers, 2024–2035 — Power Sector",
  description:
    "Renewable energy, grids and energy efficiency employment rises from around 30 million jobs in 2024 to approximately 35 million by 2035 requiring efforts to attract more people to the energy sector and to train them.",
  source:
    "Source: IEA (2026), Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce, CC BY 4.0",
  number: "Figure 5",
  kind: "double",
  panels: [powerPanel, efficiencyPanel],
};
