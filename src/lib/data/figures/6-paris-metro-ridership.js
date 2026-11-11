// Passengers per métro line over time — small multiples, reached by a
// scroll MORPH from Figure 5 (`kind: "metro-morph"`, MetroMorphPanel.svelte):
// the figure opens as Figure 5's map, the stations and badges fade, and
// EVERY line unrolls off the map into its own small line chart, in a grid
// sharing the year span and the passenger scale (all lines since 2026-11-11;
// six before). LineMultiplesPanel.svelte is the static version of the same
// data (`kind: "line-multiples"`). The map introduces the lines, this shows
// what they carry. Each panel's line wears its official colour, so it reads
// back to the map.
//
// DATA (2026-11-10): annual trips per line, millions, 2015–2025, from Omnil /
// Île-de-France Mobilités "Trafic annuel et journalier" 2025, sheet
// "2- Voyages annuels Métro" (source xlsx:
// https://omnil.cdn.prismic.io/omnil/ajFb3Y1P9HI4Uk5i_TCC_trafic_annuel_2025.xlsx).
// Counts entries from the street, surface network and RER; transfers between
// métro lines are NOT counted. Precision varies by year in the source (1 dp
// to 2017, 2 dp from 2018) and is kept as published. Line 14's new stations
// (Pleyel/Orly, 2024) are estimated from ticket validations. Title and
// description are still placeholders.
//
// 14 SERIES, 16 LINES: the source publishes 3bis inside "Ligne 3 (+3bis)" and
// 7bis inside "Ligne 7 (+7bis)" (their own figures exist from 2022 only). So
// the two short lines unroll into their parent's panel, which is named for
// both, and land under the parent's line.
import csv from "./csv/6-paris-metro-ridership.csv?raw";
import { parseFigureCsv } from "./parse-csv.js";
import parisMetroCentre from "./5-paris-metro-centre.js";
import { unroll } from "./metro-unroll.js";

// The CSV's line numbers parse as numbers; the map's are strings ("3bis").
const data = parseFigureCsv(csv).map((d) => ({ ...d, line: String(d.line) }));
// One panel per line in the CSV, in its order.
const groups = [...new Set(data.map((d) => d.line))];
const twins = { 3: "3bis", 7: "7bis" };

// The lines as Figure 5 draws them (inside Paris only), each with the panel
// it unrolls into and its track prepared for the morph (metro-unroll.js).
// In panel order, a twin before its parent, so the parent's line ends on top.
const tracks = parisMetroCentre.lines.features
  .map((feature) => {
    const { line, color } = feature.properties;
    return { line, color, panel: groups.indexOf(line.replace("bis", "")), strands: unroll(feature) };
  })
  .filter((track) => track.panel >= 0)
  .sort((a, b) => a.panel - b.panel || b.line.length - a.line.length);

export default {
  kind: "metro-morph",
  // The map the figure starts from: Figure 5, drawn exactly as there.
  map: parisMetroCentre,
  tracks,
  // A long hold after this figure goes active (default 60vh): the morph's
  // stages play through it — the full map, the stations and badges go, the
  // lines move, the axes appear — and the finished grid still gets ~40vh of
  // dwell. `stages` are fractions of this hold (132vh = 1.65 steps of 80vh):
  // change the two together.
  holdVh: 132,
  stages: {
    marksOutAt: 0.21, // 0.35 step: the full map, as Figure 5 left it
    morphStart: 0.3, //  0.15 step: the bare lines
    morphEnd: 0.94, //   ~1 step:   the lines move; the last one lands here
  },
  title: "Placeholder: Passengers by Métro Line",
  subtitle: "Trips per year by line, millions, 2015–2025",
  description: "Placeholder: what the panels show and the one pattern the reader should take from it.",
  source: "Source: Île-de-France Mobilités / Omnil, from RATP data",
  data,
  csv,
  xKey: "year",
  yKey: "passengers",
  groupKey: "line",
  groups,
  colors: groups.map((line) => tracks.find((track) => track.line === line).color),
  groupLabel: (line) => (twins[line] ? `Lines ${line} + ${twins[line]}` : `Line ${line}`),
  valueSuffix: "m",
};
