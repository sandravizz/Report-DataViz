import { colors } from "$lib/colors";
import { circleCallout } from "../annotation-presets.js";
import { parseFigureCsv } from "./parse-csv.js";
// From the IDA_GIZ_KAdequacyModel presentation (slide 4): IDA's share of all
// disbursements to eligible countries and IDA grants as a share of all grants
// received, in % (Grants / IDA has no 2024 observation yet).
import csv from "./csv/03-ida-loans.csv?raw";

export default {
  title: "The Largest Fund for Poor Countries",
  subtitle:
    "IDA Share of All Disbursements and Grants Received by Eligible Countries, 2008–2024",
  description:
    "IDA loans represent 40% of all disbursements to eligible countries. Its grants represent ~20% of all grants received.",
  source: "Sources & series: to be confirmed",
  number: "Figure 3",
  kind: "line",
  xKey: "year",
  valueSuffix: "%",
  xTicks: [2008, 2012, 2016, 2020, 2024].map((y) => new Date(y, 0, 1)),
  // Placeholder callouts on the latest points, mirroring the slide's two key
  // statements — to be refined once we decide what to emphasize.
  annotations: [
    circleCallout({
      x: new Date(2024, 0, 1),
      y: 40.35,
      filled: true,
      color: colors.sky,
      label: "Back above 40% of disbursements in 2024",
      labelPlacement: "top-left",
      labelXOffset: 20,
      labelYOffset: 24,
      link: { type: "swoop" },
      labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
      mobile: {
        props: { label: { width: 160, truncate: false } },
      },
    }),
    circleCallout({
      x: new Date(2022, 0, 1),
      y: 21.62,
      filled: true,
      color: colors.sage,
      label: "Grants reach ~20% of all grants received",
      labelPlacement: "bottom-left",
      labelXOffset: 24,
      labelYOffset: 24,
      link: { type: "swoop" },
      labelProps: { textAnchor: "end", verticalAnchor: "middle", dx: -4 },
      mobile: {
        props: { label: { width: 160, truncate: false } },
      },
    }),
  ],
  series: [
    {
      key: "Share of disbursements",
      endLabel: "Share of disbursements",
      value: "disbursements",
      color: colors.sky,
    },
    {
      key: "Grants / IDA",
      endLabel: "Grants / IDA",
      value: "grants",
      color: colors.sage,
    },
  ],
  data: parseFigureCsv(csv),
};
