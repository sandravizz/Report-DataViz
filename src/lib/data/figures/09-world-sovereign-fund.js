import { quarterCenturyTicks } from "$lib/chart-theme";
import { palette } from "$lib/colors";
import { textCallout } from "../annotation-presets.js";

export default {
  title: "A World Sovereign Fund to Reorient Investment",
  subtitle: "World Capital Stock as % of World GDP, 1980–2100",
  description:
    "The World Sovereign Fund is set to stabilize its assets at about 60% of world GDP over the 2030-2100 period, i.e. about 10% of the world capital stock. Initial asset accumulation in 2026-2035 is made possible by reinvesting a large part of global tax revenue, especially the global wealth tax on very top wealth holders (billionaires and centimillionaires).",
  source: "Sources & series: gjp.wid.world (F9)",
  number: "Figure 9",
  kind: "stacked-area",
  xKey: "year",
  xTicks: quarterCenturyTicks(1980, 2100),
  valueSuffix: "%",
  areaEndLabels: true,
  series: [
    {
      key: "World Sovereign Fund",
      endLabel: "World Sovereign Fund",
      value: "wsf",
      color: palette[3],
    },
    {
      key: "Public Wealth (non-WSF)",
      endLabel: "Public Wealth",
      value: "publicWealth",
      // palette[6] (light gray) was nearly invisible against the page
      // background; sky blue keeps this thin band legible.
      color: palette[5],
    },
    {
      key: "Private Wealth",
      endLabel: "Private Wealth",
      value: "privateWealth",
      // palette[0] (pale blush) was nearly invisible against the page
      // background; lavender gray gives this dominant band real contrast
      // without competing with the fund's coral.
      color: palette[4],
    },
  ],
  annotations: [
    textCallout({
      x: new Date(2095, 0, 1),
      y: 30,
      inverted: true,
      label: "Stabilizes at ~60% of world GDP",
      labelPlacement: "left",
      labelProps: { textAnchor: "end" },
      mobile: {
        props: { label: { truncate: false, width: 100 } },
      },
    }),
  ],
  data: [
    {
      year: new Date(1980, 0, 1),
      wsf: 0,
      publicWealth: 94,
      privateWealth: 242,
    },
    {
      year: new Date(1985, 0, 1),
      wsf: 0,
      publicWealth: 85,
      privateWealth: 265,
    },
    {
      year: new Date(1990, 0, 1),
      wsf: 0,
      publicWealth: 72,
      privateWealth: 300,
    },
    {
      year: new Date(1995, 0, 1),
      wsf: 0,
      publicWealth: 62,
      privateWealth: 330,
    },
    {
      year: new Date(2000, 0, 1),
      wsf: 0,
      publicWealth: 58,
      privateWealth: 355,
    },
    {
      year: new Date(2005, 0, 1),
      wsf: 0,
      publicWealth: 60,
      privateWealth: 390,
    },
    {
      year: new Date(2010, 0, 1),
      wsf: 0,
      publicWealth: 55,
      privateWealth: 405,
    },
    {
      year: new Date(2015, 0, 1),
      wsf: 0,
      publicWealth: 60,
      privateWealth: 435,
    },
    {
      year: new Date(2020, 0, 1),
      wsf: 0,
      publicWealth: 67,
      privateWealth: 466,
    },
    {
      year: new Date(2025, 0, 1),
      wsf: 0,
      publicWealth: 65,
      privateWealth: 470,
    },
    {
      year: new Date(2030, 0, 1),
      wsf: 30,
      publicWealth: 62,
      privateWealth: 465,
    },
    {
      year: new Date(2035, 0, 1),
      wsf: 58,
      publicWealth: 60,
      privateWealth: 458,
    },
    {
      year: new Date(2040, 0, 1),
      wsf: 60,
      publicWealth: 62,
      privateWealth: 455,
    },
    {
      year: new Date(2050, 0, 1),
      wsf: 60,
      publicWealth: 70,
      privateWealth: 448,
    },
    {
      year: new Date(2060, 0, 1),
      wsf: 60,
      publicWealth: 85,
      privateWealth: 442,
    },
    {
      year: new Date(2070, 0, 1),
      wsf: 60,
      publicWealth: 95,
      privateWealth: 435,
    },
    {
      year: new Date(2080, 0, 1),
      wsf: 60,
      publicWealth: 105,
      privateWealth: 430,
    },
    {
      year: new Date(2090, 0, 1),
      wsf: 60,
      publicWealth: 115,
      privateWealth: 425,
    },
    {
      year: new Date(2100, 0, 1),
      wsf: 60,
      publicWealth: 120,
      privateWealth: 420,
    },
  ],
};
