import { parseFigureCsv } from "./parse-csv.js";
// Paris by arrondissement — a choropleth (`kind: "choropleth"`,
// ChoroplethPanel.svelte), after LayerChart's GeoPath choropleth example.
//
// PLACEHOLDER DATA (2026-11-04): the values are RANDOM (seeded, 5–95), so the
// map can be laid out before the real data arrives. Swap the CSV's `value`
// column for the real numbers and rewrite title, subtitle and source.
//
// Boundaries: Paris Open Data, "Arrondissements" (opendata.paris.fr, ODbL),
// slimmed to id + name and coordinates rounded to 5 decimals (~1 m), in
// src/lib/data/geo/paris-arrondissements.json. Feature ids are the
// arrondissement numbers 1–20, matched to the CSV's `arrondissement` column.
import csv from "./csv/1-paris-arrondissements.csv?raw";
import geojson from "../geo/paris-arrondissements.json";

const values = new Map(parseFigureCsv(csv).map((d) => [d.arrondissement, d.value]));

// Each feature carries its value, so the chart's `c` accessor and the
// tooltip read it straight off the shape.
const features = geojson.features.map((f) => ({
  ...f,
  properties: { ...f.properties, value: values.get(f.id) ?? null },
}));

export default {
  title: "Placeholder: Paris by Arrondissement",
  subtitle: "Random placeholder values by arrondissement, index 0–100",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: random placeholder data; boundaries © Paris Open Data (ODbL)",
  kind: "choropleth",
  geojson: { type: "FeatureCollection", features },
  // Five equal classes over a fixed 0–100 domain (scaleQuantize), so the
  // legend reads in round steps: 20, 40, 60, 80.
  domain: [0, 100],
  legendTitle: "Index",
  valueLabel: "Index",
  data: features,
};
