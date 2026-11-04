// Paris by arrondissement (20) — a choropleth (`kind: "choropleth"`,
// ChoroplethPanel.svelte), after LayerChart's GeoPath choropleth example.
//
// PLACEHOLDER DATA (2026-11-04): the values are RANDOM (seeded, 5–95), so the
// map can be laid out before the real data arrives. Swap the CSV's `value`
// column for the real numbers and rewrite title, subtitle and source.
//
// Boundaries: Paris Open Data, "Arrondissements" (opendata.paris.fr, ODbL),
// slimmed to id + name, coordinates rounded to 5 decimals (~1 m). Feature
// ids are the arrondissement numbers 1–20.
import csv from "./csv/1-paris-arrondissements.csv?raw";
import geojson from "../geo/paris-arrondissements.json";
import { choropleth } from "./choropleth.js";

export default {
  ...choropleth(geojson, csv, "arrondissement"),
  title: "Placeholder: Paris by Arrondissement",
  subtitle: "Random placeholder values by arrondissement, index 0–100",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: random placeholder data; boundaries © Paris Open Data (ODbL)",
};
