import { quarterCenturyTicks } from "$lib/chart-theme";
import { palette } from "$lib/colors";
import { circleCallout, projectionRange } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
// Extracted from the report's DataF1.3 table (projected annual economic
// labour hours, SC scenario) — year + the 9 region columns, thousands
// separators stripped.
import csv from "./csv/02-work-hours.csv?raw";

export default {
  title: "Using Productivity Gains to Reduce Work Hours",
  subtitle: "Average Annual Labour Hours per Employed Individual, 1800–2100",
  description:
    "In the Sustainable Convergence scenario, annual labour hours decline from about 2100 to 1000 hours globally between 2025 and 2100 so as to reduce material production and consumption. Annual hours around 3000 ≈ 60 hours per week all year long; around 1000 ≈ 25 hours per week during 40 weeks (12 weeks in paid vacation).",
  source: "Sources & series: gjp.wid.world (F2)",
  number: "Figure 2",
  kind: "line",
  xKey: "year",
  xTicks: quarterCenturyTicks(1800, 2100),
  // The real legend would be eight identical gray swatches plus one blue, so
  // summarize the two groupings instead (desktop tooltips name each region).
  legendItems: [
    { label: "World", color: palette[5] },
    { label: "Regions", color: palette[6] },
  ],
  series: [
    { key: "Europe", value: "europe", color: palette[6] },
    {
      key: "North America/Oceania",
      value: "northAmericaOceania",
      color: palette[6],
    },
    { key: "Latin America", value: "latinAmerica", color: palette[6] },
    {
      key: "Middle East/North Africa",
      value: "middleEastNorthAfrica",
      color: palette[6],
    },
    { key: "Sub-Saharan Africa", value: "subSaharanAfrica", color: palette[6] },
    {
      key: "Russia/Central Asia",
      value: "russiaCentralAsia",
      color: palette[6],
    },
    { key: "East Asia", value: "eastAsia", color: palette[6] },
    {
      key: "South/South-East Asia",
      value: "southSoutheastAsia",
      color: palette[6],
    },
    { key: "World", value: "world", color: palette[5] },
  ],
  rangeAnnotations: [
    projectionRange({ x: [new Date(2025, 0, 1), new Date(2100, 0, 1)] }),
  ],
  annotations: [
    circleCallout({
      x: new Date(2025, 0, 1),
      y: 2100,
      filled: true,
      color: palette[5],
      label: "2,100 hours in 2025",
      labelPlacement: "right",
      labelXOffset: 30,
      labelYOffset: 10,
      link: { type: "beveled", radius: 15, sweep: "vertical-horizontal" },
      labelProps: { textAnchor: "start", verticalAnchor: "middle", dx: 4 },
      // Narrow viewports: "right" runs off-screen (2025 sits at ~75% of the
      // x-axis), so point upward into the empty area above the line bundle.
      mobile: {
        labelPlacement: "top",
        labelXOffset: 0,
        labelYOffset: 32,
        props: {
          label: {
            textAnchor: "middle",
            verticalAnchor: "end",
            dx: 0,
            truncate: false,
            width: 100,
          },
        },
      },
    }),
    circleCallout({
      x: new Date(2100, 0, 1),
      y: 1000,
      filled: true,
      color: palette[5],
      label: "1,000 hours by 2100",
      labelPlacement: "bottom-left",
      labelXOffset: 30,
      labelYOffset: 20,
      link: { type: "swoop" },
      labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
      mobile: {
        props: { label: { truncate: false, width: 100 } },
      },
    }),
  ],
  data: parseFigureCsv(csv),
};
