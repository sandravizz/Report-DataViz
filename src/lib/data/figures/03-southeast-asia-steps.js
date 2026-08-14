import { iea } from "$lib/colors";
import { projectionRange } from "../annotation-presets.js";

const data = [
  { year: new Date(2015, 0, 1), efficiency: 0.42, grids: 0.4, wind: 0.01, solar: 0.12 },
  { year: new Date(2024, 0, 1), efficiency: 0.8, grids: 0.45, wind: 0.05, solar: 0.15 },
  { year: new Date(2035, 0, 1), efficiency: 0.98, grids: 0.55, wind: 0.12, solar: 0.15 },
];

export default {
  title: "Workforce Keeps Expanding",
  subtitle:
    "Southeast Asia's Energy Workforce by Sector in the STEPS, Million Workers, 2015 to 2035",
  description:
    "In the STEPS, employment in renewable energy, grids and energy efficiency in Southeast Asia rises to 1.8 million workers by 2035.",
  source: "Source: IEA 2026. Chart shape approximate; CC BY 4.0.",
  number: "Figure 3",
  kind: "bar-stacked",
  xKey: "year",
  // Default 5-step ticks would include 0.5, landing inside the 2015 bar.
  yTicks: [1, 1.5, 2],
  hideYAxisMobile: true, // direct labels + bar totals already carry the values
  endLabelGap: 20, // extra gap between the last bar and its direct labels
  xTickFormat: (d) => (d.getFullYear() === 2035 ? "2035 STEPS" : String(d.getFullYear())),
  // Efficiency (the biggest employer) sits on the baseline; colors match
  // Figure 2's sector palette one-to-one.
  series: [
    { key: "Efficiency", value: "efficiency", color: iea.efficiency },
    { key: "Grids", value: "grids", color: iea.grids },
    { key: "Wind", value: "wind", color: iea.wind },
    { key: "Solar PV", value: "solar", color: iea.solar },
  ],
  data,
  // 2035 is the STEPS projection, not an observation.
  rangeAnnotations: [
    projectionRange({ x: [new Date(2035, 0, 1), new Date(2035, 0, 1)], label: "Projection" }),
  ],
};
