import { colors, iea } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";

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

export default {
  title: "China Employs a Third of the Global Clean Energy Workforce",
  subtitle:
    "Global Renewable Energy, Grids and Energy Efficiency Workforce by Region, Million Workers, 2019–2024",
  description:
    "China accounts for 34% of the global renewable energy, grids and energy efficiency workforce, and in the sector, it employed about 10 million people in 2024.",
  source:
    "Source: IEA (2026), Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce, CC BY 4.0",
  number: "Figure 4",
  kind: "bar-stacked",
  xKey: "year",
  annotations: [
    circleCallout({
      x: new Date(2024, 0, 1),
      // Midpoint of China's 2024 segment, the story's subject on the baseline.
      y: 5,
      filled: true,
      color: colors.sky,
      label: "About 10 million people in China in 2024",
      labelPlacement: "top-left",
      labelXOffset: 40,
      labelYOffset: 40,
      link: { type: "swoop" },
      labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4, width: 180, truncate: false },
      mobile: {
        labelXOffset: 20,
        labelYOffset: 30,
        props: { label: { width: 110, lineHeight: "13px" } },
      },
    }),
  ],
  // China carries the story, so it sits on the shared baseline in the
  // featured blue; the merged "Rest of world" closes the stack in the muted
  // gray the brand reserves for de-emphasized series.
  series: [
    { key: "China", value: "china", color: colors.sky },
    { key: "Europe", value: "europe", color: iea.royal },
    { key: "India", value: "india", color: colors.sage },
    { key: "North America", value: "northAmerica", color: iea.purple },
    { key: "Rest of world", value: "rest", color: iea.gray },
  ],
  data,
};
