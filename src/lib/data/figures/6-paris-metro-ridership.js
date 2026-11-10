// Passengers per métro line over time — small multiples, reached by a
// scroll MORPH from Figure 5 (`kind: "metro-morph"`, MetroMorphPanel.svelte):
// the figure opens as Figure 5's map, the other lines and the stations fade,
// and these six lines unroll off the map into a two-column grid of line
// charts sharing the year span and the passenger scale. No axes or gridlines
// yet (Sandra, 2026-11-10: the effect first). LineMultiplesPanel.svelte is
// the static, axed version of the same data (`kind: "line-multiples"`).
// The map introduces the lines, this shows what they carry. Each panel's line wears its official
// colour, so it reads back to the map.
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
import csv from "./csv/6-paris-metro-ridership.csv?raw";
import { parseFigureCsv } from "./parse-csv.js";
import { geoContains } from "d3-geo";
import lines from "../geo/paris-metro-lines.json";
import arrondissements from "../geo/paris-arrondissements.json";
import parisMetroCentre from "./5-paris-metro-centre.js";
import { lineChain } from "./metro-chain.js";

// The CSV's line numbers parse as numbers; the map's are strings ("3bis").
const data = parseFigureCsv(csv).map((d) => ({ ...d, line: String(d.line) }));
const shown = [...new Set(data.map((d) => d.line))];
const featureOf = (line) => lines.features.find((f) => f.properties.line === line);
const colorOf = (line) => featureOf(line).properties.color;

// Each line's track inside Paris, end to end, west end first: what unrolls.
const inParis = (point) => arrondissements.features.some((area) => geoContains(area, point));
const chains = shown.map((line) =>
  lineChain(featureOf(line), (seg) => inParis(seg[0]) && inParis(seg[seg.length - 1])),
);

export default {
  kind: "metro-morph",
  // The map the figure starts from: Figure 5, drawn exactly as there.
  map: parisMetroCentre,
  chains,
  // A long hold after this figure goes active (default 60vh): the morph's
  // stages play through it — full map, the other lines go, a hold on the six
  // lines, the six move, the axes appear — and the finished grid still gets
  // ~40vh of dwell. MetroMorphPanel's stage fractions are fitted to this
  // (132vh = 1.65 steps of 80vh): change both together.
  holdVh: 132,
  title: "Placeholder: Passengers by Métro Line",
  subtitle: "Trips per year by line, millions, 2015–2025",
  description: "Placeholder: what the panels show and the one pattern the reader should take from it.",
  source: "Source: Île-de-France Mobilités / Omnil, from RATP data",
  data,
  csv,
  xKey: "year",
  yKey: "passengers",
  groupKey: "line",
  groups: shown,
  colors: shown.map(colorOf),
  groupLabel: (line) => `Line ${line}`,
  valueSuffix: "m",
};
