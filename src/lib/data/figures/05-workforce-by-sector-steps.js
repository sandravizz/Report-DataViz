import { iea } from "$lib/colors";
import { projectionRange } from "$lib/data/annotation-presets.js";

const scenarioTickFormat = (d) =>
  d.getFullYear() === 2035 ? "2035 STEPS" : String(d.getFullYear());

const year2035 = new Date(2035, 0, 1);
const projectionBand = projectionRange({
  x: [year2035, year2035],
  label: "Projection",
});

const powerPanel = {
  subtitle: "Power Sector",
  kind: "bar-stacked",
  xKey: "year",
  xTickFormat: scenarioTickFormat,
  bandPadding: 0.6,
  hideYAxisMobile: true, // direct labels + bar totals already carry the values
  endLabelGap: 20, // extra gap between the last bar and its direct labels
  yDomain: [0, 25],
  series: [
    { key: "Grids", value: "grids", color: iea.grids },
    { key: "Wind", value: "wind", color: iea.wind },
    { key: "Solar PV", value: "solar", color: iea.solar },
  ],
  data: [
    { year: new Date(2024, 0, 1), grids: 8.5, solar: 5.0, wind: 1.7 },
    { year: new Date(2035, 0, 1), grids: 10.6, solar: 5.7, wind: 2.4 },
  ],
  rangeAnnotations: [projectionBand],
  // The title's headline gain splits across both panels; each arrow shows
  // its share of the total.
  growthArrow: true,
  hideOnMobile: true,
};

const efficiencyPanel = {
  subtitle: "Energy Efficiency",
  kind: "bar-stacked",
  xKey: "year",
  xTickFormat: scenarioTickFormat,
  bandPadding: 0.6,
  hideYAxisMobile: true,
  endLabelGap: 20,
  yDomain: [0, 25],
  series: [
    { key: "Other efficiency", value: "other", color: iea.efficiency },
    { key: "Heat pumps", value: "heatPumps", color: iea.heatPumps },
  ],
  data: [
    { year: new Date(2024, 0, 1), other: 13.4, heatPumps: 0.9 },
    { year: new Date(2035, 0, 1), other: 15.0, heatPumps: 1.4 },
  ],
  rangeAnnotations: [projectionBand],
  growthArrow: true,
};

export default {
  title: "5.6 Million More Clean Energy Jobs by 2035",
  subtitle:
    "Global Energy Workforce by Sector in the STEPS, Million Workers, 2024 to 2035",
  description:
    "Renewable energy, grids and energy efficiency employment rises from around 30 million jobs in 2024 to approximately 35 million by 2035 requiring efforts to attract more people to the energy sector and to train them.",
  source: "Source: IEA 2026. Chart shape approximate; CC BY 4.0.",
  number: "Figure 5",
  kind: "double",
  // Energy efficiency leads, matching every other figure's convention of
  // opening with the efficiency block before the power sector.
  panels: [efficiencyPanel, powerPanel],
};
