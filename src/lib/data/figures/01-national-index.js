import { iw } from "$lib/colors";
import { verticalRule } from "../annotation-presets.js";

// IW-Report 34/2026 "IW-Wohnindex Q2 2026", p. 6, Figure 2-1: hedonic price
// index for German residential property, 2022 Q1 = 100. Values digitized from
// the published chart's own pixel coordinates, not read off by eye, and
// cross-checked against the report's stated QoQ/YoY changes (p. 7) to within
// ~0.1-0.4pp. Replace with the exact series if IW supplies the data table.
const quarters = [];
for (let year = 2018; year <= 2026; year++) {
  const maxQ = year === 2026 ? 2 : 4;
  for (let q = 1; q <= maxQ; q++) quarters.push([year, q]);
}

// Index 16 is 2022 Q1, where every series must read exactly 100.0 by the
// chart's own definition. Keep that pinned if these numbers are adjusted.
const seriesValues = {
  miete: [
    88.6, 89.4, 90.2, 90.9, 91.3, 92.1, 92.7, 93.1, 93.8, 94.6, 95.1, 96.0,
    96.6, 97.4, 98.0, 99.0, 100.0, 101.2, 102.4, 103.4, 104.8, 106.0, 107.2,
    108.8, 110.4, 112.0, 113.0, 114.0, 115.4, 116.4, 117.3, 118.7, 119.6, 121.0,
  ],
  etw: [
    67.0, 68.2, 69.7, 71.2, 72.6, 74.4, 76.2, 78.0, 79.8, 82.0, 83.7, 85.8,
    88.9, 92.1, 94.8, 97.3, 100.0, 101.0, 99.4, 95.8, 94.1, 92.7, 91.2, 90.5,
    90.3, 91.0, 91.0, 90.3, 91.5, 92.7, 93.0, 93.2, 93.2, 93.4,
  ],
  ezfh: [
    63.0, 64.6, 66.0, 67.4, 68.7, 70.4, 72.1, 73.5, 74.9, 76.7, 79.2, 82.2,
    85.6, 89.4, 93.5, 97.1, 100.0, 102.1, 100.5, 96.9, 93.6, 92.1, 90.7, 89.4,
    88.9, 89.4, 89.7, 89.4, 91.0, 91.9, 92.5, 91.5, 91.8, 92.6,
  ],
};

const data = quarters.map(([year, q], i) => ({
  quarter: new Date(year, (q - 1) * 3, 1),
  miete: seriesValues.miete[i],
  etw: seriesValues.etw[i],
  ezfh: seriesValues.ezfh[i],
}));

// Shared by the static chart and the animated reveal below: same data, axes
// and copy — only which lines are visible changes.
const base = {
  title: "Mieten steigen weiter deutlich, Kaufpreise nur moderat",
  subtitle:
    "Entwicklung der inserierten Immobilienpreise, hedonisch, 2018 Q1–2026 Q2",
  description:
    "Die Angebotsmieten liegen 4,0 Prozent über dem Vorjahresquartal. Eigentumswohnungen (ETW) und Ein- und Zweifamilienhäuser (EZFH) verteuern sich dagegen nur um jeweils 0,8 Prozent — die Kaufpreise bewegen sich weitgehend seitwärts, nachdem sie seit Mitte 2022 erheblich zurückgegangen waren.",
  source: "Quelle: Institut der deutschen Wirtschaft",
  kind: "line",
  xKey: "quarter",
  xTicks: Array.from({ length: 9 }, (_, i) => new Date(2018 + i, 0, 1)),
  yDomain: [60, 130],
  yTicks: [60, 70, 80, 90, 100, 110, 120, 130],
  data,
};

const allSeries = [
  { key: "Miete", endLabel: "Miete", value: "miete", color: iw.steel },
  {
    key: "ETW",
    endLabel: "ETW",
    value: "etw",
    color: iw.navy,
    // ETW (93.4) and EZFH (92.6) end within a point of each other, so their
    // end labels would overlap — nudge ETW clear.
    endLabelYOffset: -14,
  },
  { key: "EZFH", endLabel: "EZFH", value: "ezfh", color: iw.gold },
];

// The index's base quarter. This carries the index definition now, so the
// subtitle no longer repeats it.
const indexBaseRule = verticalRule({
  x: new Date(2022, 0, 1),
  label: "Index: 2022 Q1 = 100",
});

export default {
  ...base,
  number: "Abbildung 2-1",
  series: allSeries,
  ruleAnnotations: [indexBaseRule],
};

// Each step shows `values`; `newValue` gets `drawIn`, which LineChartPanel
// animates left-to-right once the step is active. `stepLabel` is what the
// ChapterRail lists — the steps share one number and title, so without it the
// hover panel repeats the same row three times.
const stepSeries = (newValue, values) =>
  allSeries
    .filter((s) => values.includes(s.value))
    .map((s) => ({ ...s, drawIn: s.value === newValue }));

// The same chart as a 3-step scrolly reveal: rent (the headline) first, then
// each purchase-price series. Mechanism: docs/scrolly-line-draw-in.md.
export const nationalIndexAnimatedSteps = [
  {
    ...base,
    number: "Abbildung 2-1 (animiert)",
    stepLabel: "Schritt 1 — Angebotsmieten",
    series: stepSeries("miete", ["miete"]),
  },
  {
    ...base,
    number: "Abbildung 2-1 (animiert)",
    stepLabel: "Schritt 2 — Eigentumswohnungen",
    series: stepSeries("etw", ["miete", "etw"]),
  },
  {
    ...base,
    number: "Abbildung 2-1 (animiert)",
    stepLabel: "Schritt 3 — Ein- und Zweifamilienhäuser",
    series: stepSeries("ezfh", ["miete", "etw", "ezfh"]),
    // Only the final step carries the index-base rule.
    ruleAnnotations: [indexBaseRule],
  },
];
