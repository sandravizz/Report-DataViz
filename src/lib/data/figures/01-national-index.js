import { iw } from "$lib/colors";

// From the IW-Report 34/2026 "IW-Wohnindex Q2 2026" (Institut der deutschen
// Wirtschaft, 20.07.2026), p. 6, Figure 2-1: hedonic price index for German
// residential property, 2022 Q1 = 100. Values digitized from the published
// chart's own pixel coordinates (each series' line color was sampled from its
// legend swatch, then matched against the plot at each quarter's x position
// and converted back to a value via the y-axis gridline calibration) — not
// read off by eye. Cross-checked against the report's own stated QoQ/YoY
// percentage changes (p. 7), which it reproduces to within ~0.1-0.4
// percentage points. To be replaced with the exact series if IW supplies the
// underlying data table.
const quarters = [];
for (let year = 2018; year <= 2026; year++) {
  const maxQ = year === 2026 ? 2 : 4;
  for (let q = 1; q <= maxQ; q++) quarters.push([year, q]);
}

// Index 16 in each series below is 2022 Q1 — by the chart's own definition
// ("Index: 2022 Q1 = 100") every series must equal exactly 100.0 there. Keep
// that value pinned if these numbers are ever adjusted.
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

export default {
  title: "Mieten steigen weiter deutlich, Kaufpreise nur moderat",
  subtitle:
    "Entwicklung der inserierten Immobilienpreise, hedonisch, Index: 2022 Q1 = 100, 2018 Q1–2026 Q2",
  description:
    "Die Angebotsmieten liegen 4,0 Prozent über dem Vorjahresquartal. Eigentumswohnungen (ETW) und Ein- und Zweifamilienhäuser (EZFH) verteuern sich dagegen nur um jeweils 0,8 Prozent — die Kaufpreise bewegen sich weitgehend seitwärts, nachdem sie seit Mitte 2022 erheblich zurückgegangen waren.",
  source: "Quelle: Institut der deutschen Wirtschaft",
  number: "Abbildung 2-1",
  kind: "line",
  xKey: "quarter",
  xTicks: Array.from({ length: 9 }, (_, i) => new Date(2018 + i, 0, 1)),
  yDomain: [60, 130],
  yTicks: [60, 70, 80, 90, 100, 110, 120, 130],
  data,
  series: [
    { key: "Miete", endLabel: "Miete", value: "miete", color: iw.steel },
    { key: "ETW", endLabel: "ETW", value: "etw", color: iw.navy },
    { key: "EZFH", endLabel: "EZFH", value: "ezfh", color: iw.gold },
  ],
};
