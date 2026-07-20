import { iea, ink, tint } from "$lib/colors";

// From the IEA report "Ensuring a Skilled Renewable Energy and Energy
// Efficiency Workforce" (2026), p. 14: global renewable energy, grids and
// energy efficiency workforce by region, million workers, 2019-2024. Values
// read off the published chart (China's ~10 million in 2024 is stated in the
// text), to be replaced with the exact series if the client supplies the
// data table. The report's five smallest regions (Southeast Asia, Central and
// South America, Africa, Other Asia Pacific, Rest of the world) are merged
// into one "Rest of world" segment here — nine stacked slivers would be
// unreadable at this size, and Figure 1 already carries the regional detail.
const years = [2019, 2020, 2021, 2022, 2023, 2024];
const seriesValues = {
  china: [8.1, 7.8, 8.5, 9.1, 9.7, 10.0],
  europe: [4.9, 4.8, 4.9, 5.0, 4.9, 4.8],
  india: [2.4, 2.4, 2.6, 2.8, 3.0, 3.2],
  northAmerica: [3.2, 3.1, 3.2, 3.3, 3.4, 3.4],
  rest: [7.2, 6.95, 7.2, 7.42, 7.65, 7.82],
};

const data = years.map((year, i) => ({
  year: new Date(year, 0, 1),
  china: seriesValues.china[i],
  europe: seriesValues.europe[i],
  india: seriesValues.india[i],
  northAmerica: seriesValues.northAmerica[i],
  rest: seriesValues.rest[i],
}));

// Figure 4a: the stacked column, unchanged — China's share of the whole
// regional stack.
export const workforceByRegionA = {
  title: "China Employs a Third of the Global Clean Energy Workforce",
  subtitle:
    "Energy Workforce by Region, Million Workers, 2019–2024",
  description:
    "China accounts for 34% of the global renewable energy, grids and energy efficiency workforce, and in the sector, it employed about 10 million people in 2024.",
  source: "Source: IEA 2026",
  number: "Figure 4a",
  kind: "bar-stacked",
  xKey: "year",
  // Mobile drops the y axis entirely — the stack's direct end labels and
  // per-bar totals already carry every value the ticks would, and at mobile
  // width the inline labels (see yAxisPropsInline) crowd the "Rest of world"
  // end label and the topmost bars.
  hideYAxisMobile: true,
  // The sector palette (Figures 2, 3 and 5) is the report's color code, so
  // the regions deliberately don't get hues of their own: the whole stack is
  // shades of the IEA electric blue, just distinct enough that each new
  // segment reads at a glance. China carries the story, so it sits on the
  // shared baseline in the full blue, fading upward to the merged "Rest of
  // world". With one hue the segment colors can't carry the labels, so
  // `directLabelFill` inks every end label black instead.
  directLabelFill: ink,
  series: [
    { key: "China", value: "china", color: iea.blue },
    { key: "Europe", value: "europe", color: tint(iea.blue, 0.75) },
    { key: "India", value: "india", color: tint(iea.blue, 0.55) },
    { key: "North America", value: "northAmerica", color: tint(iea.blue, 0.4) },
    { key: "Rest of world", value: "rest", color: tint(iea.blue, 0.25) },
  ],
  data,
};

// Figure 4b: same data, one small-multiple line chart per region — each
// region's own trajectory, side by side, instead of everyone's share of one
// stack. "Rest of world" is a merged catch-all bucket rather than a real
// region (see note above), so it's left out here; the other four are the
// report's actual geographies. Order follows the size of each region's 2024
// workforce, same as the stack in Figure 4a.
export const workforceByRegionB = {
  title: "China and India Keep Climbing While Europe and North America Flatten Out",
  subtitle:
    "Energy Workforce by Region, Million Workers, 2019–2024",
  description:
    "China and India's clean energy workforces grew steadily between 2019 and 2024, while Europe's stayed flat and North America's edged up only slightly.",
  source: "Source: IEA 2026",
  number: "Figure 4b",
  kind: "line-multiples",
  xKey: "year",
  xTicks: [years[0], years[years.length - 1]].map((y) => new Date(y, 0, 1)),
  // Shared y domain across all four panels — deliberately not auto-scaled per
  // panel, so a flat line in Europe reads as genuinely flat (not stretched to
  // fill its own axis) against China's actual climb. Explicit ticks (rather
  // than the default d3 step) keep the same four gridlines on every panel.
  yDomain: [2, 10],
  yTicks: [2, 4, 6, 8, 10],
  data,
  // Colors are the report's validated line-mark set (see colors.js) — each
  // panel is its own single-line chart, so there's no cross-panel legend to
  // keep straight; the label above each panel already names the region. This
  // does reuse hues that Figures 2, 3 and 5 use as a fixed sector code
  // (teal/purple/coral = Efficiency/Grids/Solar), but a same-family blue ramp
  // read as too flat to tell apart at a glance — legibility here wins over
  // avoiding the cross-figure hue overlap.
  panels: [
    { label: "China", value: "china", color: iea.blue },
    { label: "Europe", value: "europe", color: iea.teal },
    { label: "North America", value: "northAmerica", color: iea.purple },
    { label: "India", value: "india", color: iea.coral },
  ],
};

export default workforceByRegionA;
