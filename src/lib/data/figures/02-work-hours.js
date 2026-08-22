import { quarterCenturyTicks } from "$lib/chart-theme";
import { colors } from "$lib/colors";
import { circleCallout, projectionRange } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
import csv from "./csv/02-work-hours.csv?raw";

const rows = parseFigureCsv(csv);

// The source CSV is model output at one row per year, and it is piecewise
// LINEAR: each series runs in straight ramps with a hard corner every ten
// years (europe climbs by exactly 25.5 hours a year from 1826 to 1835, then
// goes flat). At one point per year, curveMonotoneX has no room between
// points to curve, so it traces those ramps and their corners literally — the
// rounded linejoin on the stroke can only soften the very tip of a corner,
// which is invisible at a 2.5px line. Sampling by decade gives the curve
// something to interpolate through, which is what makes the lines read as
// drawn rather than as plotted. The cost is sub-decade wiggle (the ~15-hour
// bumps around 1985 and 2015, well under 1%); the shape is unchanged.
//
// 1845 is kept off the grid on purpose: it is the historical peak of every
// series, and a plain decade grid would cut the top off it. 2025 likewise —
// it is where the projection band starts and both callouts sit.
const keepYears = new Set([1845, 2025]);
const data = rows.filter((row) => {
  const year = row.year.getFullYear();
  return year % 10 === 0 || keepYears.has(year);
});

const regions = [
  { key: "Europe", value: "europe" },
  { key: "North America/Oceania", value: "northAmericaOceania" },
  { key: "Latin America", value: "latinAmerica" },
  { key: "Middle East/North Africa", value: "middleEastNorthAfrica" },
  { key: "Sub-Saharan Africa", value: "subSaharanAfrica" },
  { key: "Russia/Central Asia", value: "russiaCentralAsia" },
  { key: "East Asia", value: "eastAsia" },
  { key: "South/South-East Asia", value: "southSoutheastAsia" },
];

export default {
  title: "Using Productivity Gains to Reduce Work Hours",
  subtitle: "Average Annual Labour Hours per Employed Individual, 1800–2100",
  description:
    "In the Sustainable Convergence scenario, annual labour hours decline from about 2100 to 1000 hours globally between 2025 and 2100 so as to reduce material production and consumption. Annual hours around 3000 ≈ 60 hours per week all year long; around 1000 ≈ 25 hours per week during 40 weeks (12 weeks in paid vacation).",
  source: "Sources & series: gjp.wid.world (F2)",
  number: "Figure 2",
  kind: "line",
  xKey: "year",
  hideTooltipTotal: true,
  xTicks: quarterCenturyTicks(1800, 2100),
  // The peak of any series is 3,624 hours (Russia/Central Asia, 1845), so the
  // top of the plot sits just above it. Without an explicit domain LayerChart
  // nices up to 4,000 and a tenth of the panel is dead air.
  yDomain: [0, 3750],
  // Pinned, so the faint gridlines land on the same values as the axis labels
  // — LayerChart's Grid otherwise defaults to four y ticks of its own,
  // regardless of the axis, and rules a line only every other label.
  yTicks: [500, 1000, 1500, 2000, 2500, 3000, 3500],
  // The series list would make a useless legend (eight identical gray lines),
  // so the figure summarizes the two groupings itself.
  legendItems: [
    { label: "World", color: colors.middle },
    { label: "Regions", color: colors.quietLine },
  ],
  // World last, so it is drawn on top of the eight gray region lines.
  series: [
    ...regions.map((r) => ({ ...r, color: colors.quietLine })),
    { key: "World", value: "world", color: colors.middle },
  ],
  rangeAnnotations: [
    projectionRange({ x: [new Date(2025, 0, 1), new Date(2100, 0, 1)] }),
  ],
  annotations: [
    circleCallout({
      x: new Date(2025, 0, 1),
      y: 2100,
      filled: true,
      color: colors.middle,
      label: "2,100 hours in 2025",
      labelPlacement: "right",
      labelXOffset: 30,
      labelYOffset: 10,
      link: { type: "beveled", radius: 15, sweep: "vertical-horizontal" },
      labelProps: { textAnchor: "start", verticalAnchor: "middle", dx: 4 },
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
      color: colors.middle,
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
  data,
};
