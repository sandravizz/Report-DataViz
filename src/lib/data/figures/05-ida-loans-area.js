// Overlapping-area variant of 03-ida-loans.js (Datawrapper-style): the same
// two IDA shares drawn as areas from the baseline — NOT stacked — with the
// emphasis flipped to the lower share. Grants carry the strong camel wash,
// disbursements recede to a light teal context band (the same strong/pale
// pairing as the equity/liabilities figure), so the grants catch-up since
// 2018 is the story the eye lands on. The line version stays untouched.
import { fdl, tint } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
import csv from "./csv/03-ida-loans.csv?raw";

const rows = parseFigureCsv(csv);

// Disbursements keep their teal identity from the line figure, dimmed to the
// brand-sanctioned 75% white tint; grants keep their camel at full strength.
const tealMuted = tint(fdl.teal, 0.75);

// Annotation facts computed from the data: grants' share at its peak vs the
// 2018 low point ("more than doubled"), disbursements' latest value.
const grantsPeak = rows.reduce((a, b) => ((b.grants ?? 0) > (a.grants ?? 0) ? b : a));
const grantsBase = rows.find((d) => d.year.getFullYear() === 2018);
const lastDisb = rows.findLast((d) => d.disbursements != null);

export default {
  title: "IDA Grants Reach a Fifth of All Grants Received",
  subtitle:
    "IDA Share of All Disbursements and Grants Received by Eligible Countries, 2008–2024",
  description:
    "IDA grants more than doubled their share of all grants received by eligible countries — from ~10% in 2018 to ~22% in 2022 — while IDA loans returned to 40% of all disbursements in 2024.",
  source: "Sources & series: to be confirmed",
  number: "Figure 4",
  kind: "area-overlap",
  xKey: "year",
  valueSuffix: "%",
  // 2023 is ticked so the year where the grants series ends is readable off
  // the axis; on phones 2023+2024 would collide, so mobile drops 2024 (the
  // axis still ends there and the disbursements callout names it).
  xTicks: [2008, 2012, 2016, 2020, 2023, 2024].map((y) => new Date(y, 0, 1)),
  xTicksMobile: [2008, 2012, 2016, 2020, 2023].map((y) => new Date(y, 0, 1)),
  // The grants callout circles the 2022 peak, the disbursements callout their
  // latest point — each ring in its own series' color, same style. Labels are
  // short one-liners sitting just off their rings, tied on with a short swoop.
  annotations: [
    circleCallout({
      x: grantsPeak.year,
      y: grantsPeak.grants,
      color: fdl.camel,
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
    }),
    circleCallout({
      x: lastDisb.year,
      y: lastDisb.disbursements,
      // Full-strength teal, not the muted area tint — the ring needs to read.
      color: fdl.teal,
      label: "Back above 40%",
      labelPlacement: "top-left",
      labelXOffset: 12,
      labelYOffset: 16,
      link: { type: "swoop" },
      labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
      mobile: {
        labelXOffset: 8,
        labelYOffset: 12,
        props: { label: { width: 80, truncate: false, lineHeight: "13px" } },
      },
    }),
  ],
  // Background series first — later series paint on top of it.
  series: [
    {
      key: "Share of disbursements",
      endLabel: "Share of disbursements",
      value: "disbursements",
      color: tealMuted,
      // The muted tint is too light to read as type; the label keeps the
      // teal identity at full strength.
      endLabelColor: fdl.teal,
      lineWidth: 2,
    },
    {
      key: "Grants / IDA",
      endLabel: "Grants / IDA",
      value: "grants",
      color: fdl.camel,
      lineWidth: 2.5,
    },
  ],
  data: rows,
};
