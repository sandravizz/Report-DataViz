// Paris by quartier administratif (80, four per arrondissement) — the
// middle level: four times the detail of the arrondissements, every shape
// still big enough to tap on a phone.
//
// DATA (2026-11-15): residents per quartier, INSEE census 2022, summed from
// the IRIS file (digits 6–7 of a Paris IRIS code are its quartier, 01–80).
// Same total as Figures 1 and 3; see 1-paris-arrondissements.js.
//
// Boundaries: Paris Open Data, "Quartiers administratifs"
// (opendata.paris.fr, ODbL), lightly simplified (~2 m). Feature ids are the
// quartier numbers 1–80.
import csv from "./csv/2-paris-quartiers.csv?raw";
import geojson from "../geo/paris-quartiers.json";
import { choropleth, thousands } from "./choropleth.js";

export default {
  ...choropleth(geojson, csv, "quartier", { valueKey: "population", domain: [0, 100000], label: "Residents" }),
  legendFormat: thousands,
  title: "Population by Quartier",
  subtitle: "Residents of the 80 Quartiers Administratifs, 2022",
  description:
    "Four quartiers per arrondissement, and the ring breaks up: on the edge, a handful of very large quartiers stand out from their neighbours. In the centre the quartiers are small in area and in number, around the Louvre and the Opéra only a few thousand residents each.",
  source: "Source: INSEE, Census 2022; map © Paris Open Data",
};
