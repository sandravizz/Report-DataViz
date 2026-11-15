// Paris by arrondissement (20) — a choropleth (`kind: "choropleth"`,
// ChoroplethPanel.svelte), after LayerChart's GeoPath choropleth example.
//
// DATA (2026-11-15): residents per arrondissement, INSEE census 2022
// (population municipale, P22_POP), the newest census with figures down to
// IRIS. Figures 1–3 are ONE dataset at three levels: the IRIS file
// ("Population en 2022 — Base infracommunale (Iris)", insee.fr/fr/
// statistiques/8647014) summed up to quartiers and arrondissements, so all
// three maps add up to the same 2,113,705.
//
// Boundaries: Paris Open Data, "Arrondissements" (opendata.paris.fr, ODbL),
// slimmed to id + name, coordinates rounded to 5 decimals (~1 m). Feature
// ids are the arrondissement numbers 1–20.
import csv from "./csv/1-paris-arrondissements.csv?raw";
import geojson from "../geo/paris-arrondissements.json";
import { choropleth, thousands } from "./choropleth.js";

export default {
  ...choropleth(geojson, csv, "arrondissement", { valueKey: "population", domain: [0, 250000], label: "Residents" }),
  legendFormat: thousands,
  title: "Population by Arrondissement",
  subtitle: "Residents of the 20 Arrondissements, 2022",
  description:
    "The people live in the outer half: every arrondissement from the 11th to the 20th counts well over 100,000 residents, the 15th the most of all. The four at the centre, the oldest part of Paris, are home to fewer than 100,000 between them.",
  source: "Source: INSEE, Census 2022; map © Paris Open Data",
};
