// Paris by IRIS (992) — the most detailed level with official statistics:
// INSEE's small census units of ~2,000 residents each. Detailed on desktop;
// on a phone the shapes get too small to tap one by one.
//
// DATA (2026-11-15): residents per IRIS, INSEE census 2022 (P22_POP). INSEE
// publishes IRIS figures as decimals (they are estimates); here they are
// rounded to whole residents so that the IRIS of each arrondissement add up
// exactly to its census population (largest remainder). Same total as
// Figures 1 and 2; see 1-paris-arrondissements.js.
//
// Boundaries: IGN/INSEE IRIS 2024, via Opendatasoft "georef-france-iris"
// (Licence Ouverte / Etalab), simplified (~3 m). Feature ids are the
// 9-digit IRIS codes.
import csv from "./csv/3-paris-iris.csv?raw";
import geojson from "../geo/paris-iris.json";
import { choropleth, thousands } from "./choropleth.js";

export default {
  ...choropleth(geojson, csv, "iris", { valueKey: "population", domain: [0, 5000], label: "Residents" }),
  legendFormat: thousands,
  title: "Population by IRIS",
  subtitle: "Residents of the 992 IRIS Census Units, 2022",
  description:
    "At the finest level the map evens out, by design: an IRIS is drawn to hold about 2,000 residents, so most units land in the same two classes. What shows instead is where almost nobody lives: the Bois de Boulogne, the big parks, the Seine and the canal basins.",
  source: "Source: INSEE, Recensement de la population 2022; map © IGN/INSEE",
  // A hairline between ~1,000 small shapes; a 1px gap would grey the map.
  strokeWidth: 0.4,
};
