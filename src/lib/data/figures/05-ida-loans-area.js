// Overlapping-area figure (Datawrapper-style): two IDA shares drawn as areas
// from the baseline — NOT stacked — with the
// emphasis flipped to the lower share. Grants carry the strong camel wash,
// disbursements recede to a light teal context band (the same strong/pale
// pairing as the equity/liabilities figure), so the grants catch-up since
// 2018 is the story the eye lands on. Not rendered on its own: 07 builds
// the scrolly steps from it.
import { colors } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
import csv from "./csv/03-ida-loans.csv?raw";

const rows = parseFigureCsv(csv);

// Disbursements are the context band and grants are the story, so the two
// sit at opposite ends of the report's ink range rather than on two hues:
// grants in the accent, disbursements on the palest step that is still legal
// for a labeled line.

// Annotation facts computed from the data: grants' share at its peak vs the
// 2018 low point ("more than doubled"), disbursements' latest value.
const grantsPeak = rows.reduce((a, b) => ((b.grants ?? 0) > (a.grants ?? 0) ? b : a));
const grantsBase = rows.find((d) => d.year.getFullYear() === 2018);
const lastDisb = rows.findLast((d) => d.disbursements != null);

// The two callouts are named exports so the scrolly steps variant
// (07-ida-loans-area-steps.js) can hand each series its own ring on the step
// that introduces it. The grants callout circles the 2022 peak, the
// disbursements callout their latest point — each ring in its own series'
// color, same style. Labels are short one-liners sitting just off their
// rings, tied on with a short swoop.
export const grantsCallout = circleCallout({
  x: grantsPeak.year,
  y: grantsPeak.grants,
  color: colors.accent,
  label: `Doubled since ${grantsBase.year.getFullYear()}`,
  labelPlacement: "top-left",
  labelXOffset: 16,
  labelYOffset: 20,
  link: { type: "swoop" },
  labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
  mobile: {
    labelXOffset: 10,
    labelYOffset: 16,
    props: { label: { width: 80, truncate: false, lineHeight: "13px" } },
  },
});
export const disbursementsCallout = circleCallout({
  x: lastDisb.year,
  y: lastDisb.disbursements,
  // The strong step, not the band's own `soft` — a 2.5:1 ring does not read.
  color: colors.strong,
  label: "Back above 40%",
  labelPlacement: "top-left",
  labelXOffset: 12,
  labelYOffset: 16,
  link: { type: "swoop" },
  labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
  mobile: {
    labelXOffset: 8,
    // 2024 sits near the top of the y domain, so the label rides lower
    // than on desktop to stay inside the plot — negative pulls it down
    // to roughly level with the ring.
    labelYOffset: -4,
    props: { label: { width: 80, truncate: false, lineHeight: "13px" } },
  },
});

export default {
  title: "IDA Grants Reach a Fifth of All Grants Received",
  subtitle:
    "IDA Share of All Disbursements and Grants Received by Eligible Countries, 2008–2024",
  description:
    "IDA grants more than doubled their share of all grants received by eligible countries — from ~10% in 2018 to ~22% in 2022 — while IDA loans returned to 40% of all disbursements in 2024.",
  source: "Source: Finance for Development Lab (2026)",
  number: "Figure 4",
  kind: "area-overlap",
  xKey: "year",
  valueSuffix: "%",
  // 2023 is ticked so the year where the grants series ends is readable off
  // the axis; on phones 2023+2024 would collide, so mobile drops 2024 (the
  // axis still ends there and the disbursements callout names it).
  xTicks: [2008, 2012, 2016, 2020, 2023, 2024].map((y) => new Date(y, 0, 1)),
  xTicksMobile: [2008, 2012, 2016, 2020, 2023].map((y) => new Date(y, 0, 1)),
  annotations: [grantsCallout, disbursementsCallout],
  // Background series first — later series paint on top of it.
  series: [
    {
      key: "Share of disbursements",
      endLabel: "Share of disbursements",
      value: "disbursements",
      color: colors.soft,
      // `soft` is too light to read as type; the end label steps down the
      // ramp to `strong` so the name of the series is always legible.
      endLabelColor: colors.strong,
      lineWidth: 2,
    },
    {
      key: "Grants / IDA",
      endLabel: "Grants / IDA",
      value: "grants",
      color: colors.accent,
      lineWidth: 2.5,
    },
  ],
  data: rows,
};
