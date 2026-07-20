import { colors, iea, mintDark } from "$lib/colors";
import { projectionRange } from "$lib/data/annotation-presets.js";

// From the IEA report "Ensuring a Skilled Renewable Energy and Energy
// Efficiency Workforce" (2026), p. 16: global renewable energy, grids and
// energy efficiency workforce by sector in the STEPS, million workers, 2024
// vs 2035. The 2024 power-sector splits (grids 8.5, solar PV 5.0, wind 1.7)
// and the 2035 grids/solar growth rates (+25%, +14%) come from the chapter
// text; 2035 wind and the heat-pump split are read off the published chart
// (wind's stated "~2%/yr" alone undershoots the chart's own 2035 total by
// ~0.3 million, so the chart reading — not the approximate rate — wins),
// to be replaced with the exact series if the client supplies the data
// table. Totals: 2024 ≈29.5m, 2035 ≈35.1m — a +5.6m gain, matching the
// report's headline number.
const scenarioTickFormat = (d) =>
  d.getFullYear() === 2035 ? "2035 STEPS" : String(d.getFullYear());

// 2035 is a modeled scenario year, not an observation — both panels mark its
// bar with a hatched "Projection" band behind it (same visual language as
// annotation-presets' line-chart projection ranges, applied here to a single
// band on the bar chart's ordinal x scale).
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
  bandPadding: 0.4,
  // Grids is the biggest employer and the biggest mover (+25%), so it takes
  // the shared baseline, unchanged. Wind then solar stack above it — the
  // same bottom-to-top order as Figures 2 and 3 — each keeping its usual
  // hue: grids purple, wind royal, solar the brand coral (not blue — wind
  // now owns blue in this stack).
  series: [
    { key: "Grids", value: "grids", color: iea.purple },
    { key: "Wind", value: "wind", color: iea.royal },
    { key: "Solar PV", value: "solar", color: iea.coral },
  ],
  data: [
    { year: new Date(2024, 0, 1), grids: 8.5, solar: 5.0, wind: 1.7 },
    { year: new Date(2035, 0, 1), grids: 10.6, solar: 5.7, wind: 2.4 },
  ],
  rangeAnnotations: [projectionBand],
  // The title's headline gain ("5.6 million more jobs") splits across both
  // panels; each panel's own arrow shows its share of that total.
  growthArrow: true,
};

const efficiencyPanel = {
  subtitle: "Energy Efficiency",
  kind: "bar-stacked",
  xKey: "year",
  xTickFormat: scenarioTickFormat,
  bandPadding: 0.4,
  // Heat pumps use a shaded-down mint (mintDark) instead of the brand mint
  // itself — mint is fills-only (1.5:1 on white) and was unreadable as
  // direct-label text; the darker shade fixes both the segment and its label.
  series: [
    { key: "Other efficiency", value: "other", color: colors.sage },
    { key: "Heat pumps", value: "heatPumps", color: mintDark },
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
    "Global Energy Workforce by Sector in the STEPS, Million Workers, 2024–2035",
  description:
    "Renewable energy, grids and energy efficiency employment rises from around 30 million jobs in 2024 to approximately 35 million by 2035 requiring efforts to attract more people to the energy sector and to train them.",
  source: "Source: IEA 2026",
  number: "Figure 5",
  kind: "double",
  // Energy efficiency leads, matching every other figure's convention of
  // opening with the efficiency block before the power sector.
  panels: [efficiencyPanel, powerPanel],
};
