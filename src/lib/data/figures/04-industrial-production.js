// Figure 4 of the Kiel Institute's Economic Outlook Nr. 133 (2026 | Q2),
// "Global industrial production, January to March 2026" — index, December
// 2025 = 100, three monthly readings per country group.
//
// Bar tops read off the published chart pixel by pixel (see
// docs/kiel-figure-digitization.md). Bars are far easier to digitize exactly
// than lines — a flat top on a calibrated axis — so these values are good to
// about a twentieth of an index point, and the one the report states in its
// text (Africa & Middle East "collapsed by almost one quarter", here 75.1)
// lands where it should.

import { colors } from "$lib/colors";

export default {
  title: "Global Industrial Production, January to March 2026",
  subtitle: "Index, December 2025 = 100",
  description:
    "The war's effect on industrial production is severe but narrow. Industrial production, which includes raw material extraction, collapsed by almost one quarter in the Africa and Middle East region, which is dominated by the Gulf states. In the rest of the world — especially in advanced economies and in emerging Asia — only minor declines were recorded at most, and production generally continued to increase.",
  source:
    "Source: CPB, World Trade Monitor; Kiel Institute calculations. Monthly data, price- and seasonally adjusted. Values digitized from the published figure.",
  number: "Figure 4",
  kind: "bar-grouped",
  xKey: "group",
  // The published chart truncates its axis at 65–105: these are index points
  // around 100, and a zero baseline would hide every difference the figure
  // exists to show. Ticks match the original's 5-point steps.
  yDomain: [65, 105],
  yTicks: [65, 70, 75, 80, 85, 90, 95, 100, 105],
  series: [
    { key: "01/2026", value: "jan", color: colors.highlight },
    { key: "02/2026", value: "feb", color: colors.lightBlue },
    { key: "03/2026", value: "mar", color: colors.blue },
  ],
  data: [
    { group: "Advanced Econ.", jan: 99.9, feb: 100.5, mar: 100.45 },
    { group: "Emerging Econ.", jan: 100.55, feb: 101.34, mar: 98.11 },
    { group: "of which: China", jan: 101.09, feb: 102.23, mar: 102.18 },
    { group: "Rest of Asia", jan: 100.3, feb: 100.05, mar: 100.05 },
    { group: "Africa & Middle East", jan: 100.2, feb: 101.49, mar: 75.05 },
  ],
};
