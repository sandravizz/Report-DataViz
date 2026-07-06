import { palette } from "$lib/colors";
import { mutedLabel, projectionRange } from "../annotation-presets.js";

export default {
  title: "Financing Sustainable Convergence via Country Dividends",
  subtitle: "Country Dividends 2026–2100, % of World GDP",
  description:
    "Country dividends are allocated to each country on an equal per-capita basis and are used to finance climate investment and education and health expenditure. They represent about 5-8% of world GDP on average over the 2030-2050, with the same geographical distribution as the world population. The split of country dividends into climate investments, health expenditures and education expenditures is illustrative and to be decided by each country themselves.",
  source:
    "Sources & series: gjp.wid.world (F11)",
  number: "Figure 11",
  kind: "stacked-area",
  xKey: "year",
  valueSuffix: "%",
  series: [
    { key: "Education", value: "education", color: palette[5] },
    { key: "Health", value: "health", color: palette[2] },
    { key: "Climate Investments", value: "climate", color: palette[3] },
  ],
  rangeAnnotations: [
    // Value highlight, not a projection marker (the whole chart is projected):
    // label centered over the band, floating above the plot like the
    // "Projection →" labels on other figures.
    projectionRange({
      x: [new Date(2030, 0, 1), new Date(2050, 0, 1)],
      label: "≈5–8% of world GDP",
      labelPlacement: "top",
      labelYOffset: -4,
      props: { label: { ...mutedLabel, verticalAnchor: "end" } },
    }),
  ],
  data: [
    { year: new Date(2026, 0, 1), education: 0, health: 0, climate: 0 },
    { year: new Date(2028, 0, 1), education: 0.8, health: 1.2, climate: 1.5 },
    { year: new Date(2030, 0, 1), education: 1.4, health: 2.1, climate: 2.9 },
    { year: new Date(2033, 0, 1), education: 1.9, health: 2.9, climate: 4 },
    { year: new Date(2035, 0, 1), education: 2, health: 3, climate: 4.2 },
    { year: new Date(2038, 0, 1), education: 1.8, health: 2.8, climate: 3.9 },
    { year: new Date(2040, 0, 1), education: 1.6, health: 2.4, climate: 3.4 },
    { year: new Date(2045, 0, 1), education: 1.25, health: 1.9, climate: 2.7 },
    { year: new Date(2050, 0, 1), education: 1, health: 1.5, climate: 2 },
    { year: new Date(2060, 0, 1), education: 0.85, health: 1.25, climate: 1.75 },
    { year: new Date(2070, 0, 1), education: 0.75, health: 1.1, climate: 1.5 },
    { year: new Date(2080, 0, 1), education: 0.65, health: 0.95, climate: 1.3 },
    { year: new Date(2090, 0, 1), education: 0.55, health: 0.8, climate: 1.15 },
    { year: new Date(2100, 0, 1), education: 0.5, health: 0.7, climate: 1 },
  ],
};
