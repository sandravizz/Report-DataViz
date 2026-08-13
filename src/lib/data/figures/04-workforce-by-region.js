import { iea, ink } from "$lib/colors";

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

export const workforceByRegionA = {
  title: "China Employs a Third of the Global Clean Energy Workforce",
  subtitle:
    "Energy Workforce by Region, Million Workers, 2019 to 2024",
  description:
    "China accounts for 34% of the global renewable energy, grids and energy efficiency workforce, and in the sector, it employed about 10 million people in 2024.",
  source: "Source: IEA 2026. Chart shape approximate; CC BY 4.0.",
  number: "Figure 4a",
  kind: "bar-stacked",
  xKey: "year",
  yTicks: [5, 10, 15, 20, 30],
  // Mobile's inline y labels would otherwise crowd the "Rest of world" end
  // label and topmost bars; direct labels + totals already carry the values.
  hideYAxisMobile: true,
  directLabelFill: ink,
  series: [
    { key: "China", value: "china", color: iea.regionTints[0] },
    { key: "Europe", value: "europe", color: iea.regionTints[1] },
    { key: "India", value: "india", color: iea.regionTints[2] },
    { key: "North America", value: "northAmerica", color: iea.regionTints[3] },
    { key: "Rest of world", value: "rest", color: iea.regionTints[4] },
  ],
  data,
};

// Figure 4b: same data, one small-multiple line chart per region instead of
// everyone's share of one stack. "Rest of world" is a merged catch-all, not
// a real region, so it's left out here.
export const workforceByRegionB = {
  title: "China and India Keep Climbing While Europe and North America Flatten Out",
  subtitle:
    "Energy Workforce by Region, Million Workers, 2019 to 2024",
  description:
    "China and India's clean energy workforces grew steadily between 2019 and 2024, while Europe's stayed flat and North America's edged up only slightly.",
  source: "Source: IEA 2026. Chart shape approximate; CC BY 4.0.",
  number: "Figure 4b",
  kind: "line-multiples",
  xKey: "year",
  xTicks: [years[0], years[years.length - 1]].map((y) => new Date(y, 0, 1)),
  // Shared, not auto-scaled per panel — so a flat Europe reads as genuinely
  // flat against China's actual climb.
  yDomain: [2, 10],
  yTicks: [2, 4, 6, 8, 10],
  data,
  panels: [
    { label: "China", value: "china", color: iea.regionTints[0] },
    { label: "Europe", value: "europe", color: iea.regionTints[1] },
    { label: "India", value: "india", color: iea.regionTints[2] },
    { label: "North America", value: "northAmerica", color: iea.regionTints[3] },
  ],
};

export default workforceByRegionA;