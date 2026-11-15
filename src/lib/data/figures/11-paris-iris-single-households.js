// Paris by IRIS: share of ONE-PERSON HOUSEHOLDS — Figure 3's 992 units on
// a third measure, in the PINK ramp (Sandra, 2026-11-15).
//
// DATA (2026-11-15): INSEE census 2022, "Couples - Familles - Ménages en
// 2022 — Base infracommunale (Iris)" (insee.fr/fr/statistiques/8647008):
// households of one person (C22_MENPSEUL) as a share of all households
// (C22_MEN), in %, one decimal. Paris as a whole: 53.1%.
// A unit with fewer than 200 households has no share here (94 of the 992:
// parks, the Seine, office and station districts): its CSV cell is empty
// and the map draws it grey. The 200 is this report's own cut-off, not
// INSEE's: IRIS figures are estimates, and a share of a handful of
// households is noise.
//
// The file is numbered 11 (the next free number); the page numbers figures
// by reading order.
import csv from "./csv/11-paris-iris-single-households.csv?raw";
import geojson from "../geo/paris-iris.json";
import { choropleth, isWood } from "./choropleth.js";
import { sequentialPink } from "$lib/colors";

export default {
  ...choropleth(geojson, csv, "iris", { valueKey: "single_households_pct", domain: [30, 80], label: "One-person households", drop: isWood }),
  palette: sequentialPink,
  legendTitle: "One-person households, in %",
  legendFormat: (v) => `${v}%`,
  valueSuffix: "%",
  title: "People Living Alone by IRIS",
  subtitle: "Share of One-Person Households, 2022, in %",
  description:
    "Living alone is the norm in Paris: more than half of all households are one person. The pink is deepest in the centre and around the 5th and the 11th arrondissements, and palest in the 16th in the west and the 19th in the north-east. Grey units have too few households for a share.",
  source: "Source: INSEE, Recensement de la population 2022; map © IGN/INSEE",
  strokeWidth: 0.4,
};
