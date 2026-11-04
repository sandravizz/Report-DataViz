// Paris by quartier administratif (80, four per arrondissement) — the
// recommended middle level: four times the detail of the arrondissements,
// every shape still big enough to tap on a phone.
//
// PLACEHOLDER DATA (2026-11-04): seeded random values with a smooth spatial
// pattern (a few random "hot spots" plus noise), 5–95.
//
// Boundaries: Paris Open Data, "Quartiers administratifs"
// (opendata.paris.fr, ODbL), lightly simplified (~2 m). Feature ids are the
// quartier numbers 1–80.
import csv from "./csv/2-paris-quartiers.csv?raw";
import geojson from "../geo/paris-quartiers.json";
import { choropleth } from "./choropleth.js";

export default {
  ...choropleth(geojson, csv, "quartier"),
  title: "Placeholder: Paris by Quartier",
  subtitle: "Random placeholder values for the 80 quartiers administratifs, index 0–100",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: random placeholder data; boundaries © Paris Open Data (ODbL)",
};
