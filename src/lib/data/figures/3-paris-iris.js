// Paris by IRIS (992) — the most detailed level with official statistics:
// INSEE's small census units of ~2,000 residents each. Detailed on desktop;
// on a phone the shapes get too small to tap one by one.
//
// PLACEHOLDER DATA (2026-11-04): seeded random values with a smooth spatial
// pattern, 5–95.
//
// Boundaries: IGN/INSEE IRIS 2024, via Opendatasoft "georef-france-iris"
// (Licence Ouverte / Etalab), simplified (~3 m). Feature ids are the
// 9-digit IRIS codes.
import csv from "./csv/3-paris-iris.csv?raw";
import geojson from "../geo/paris-iris.json";
import { choropleth } from "./choropleth.js";

export default {
  ...choropleth(geojson, csv, "iris"),
  title: "Placeholder: Paris by IRIS",
  subtitle: "Random placeholder values for 992 IRIS census units, index 0–100",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: random placeholder data; boundaries © IGN/INSEE (Licence Ouverte)",
  // A hairline between ~1,000 small shapes; a 1px gap would grey the map.
  strokeWidth: 0.4,
};
