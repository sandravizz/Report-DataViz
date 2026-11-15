// Paris by IRIS: share of HOME OWNERS — Figure 3's 992 units on a fourth
// measure, in the BLUE ramp (Sandra, 2026-11-15: owners or renters, "as
// you want to put it" — owners, the smaller group, so the dark areas are
// the exception).
//
// DATA (2026-11-15): INSEE census 2022, "Logement en 2022 — Base
// infracommunale (Iris)" (insee.fr/fr/statistiques/8647012): main homes
// occupied by their owner (P22_RP_PROP) as a share of all main homes
// (P22_RP), in %, one decimal. Paris as a whole: 33.4% (61.9% rent, 18.0%
// of all main homes are rented social housing, the rest are housed free).
// A unit with fewer than 200 main homes has no share here (91 of the 992):
// its CSV cell is empty and the map draws it grey — this report's own
// cut-off, as in 11-paris-iris-single-households.js.
//
// The file is numbered 12 (the next free number); the page numbers figures
// by reading order.
import csv from "./csv/12-paris-iris-owners.csv?raw";
import geojson from "../geo/paris-iris.json";
import { choropleth, isWood } from "./choropleth.js";
import { sequentialBlue } from "$lib/colors";

export default {
  ...choropleth(geojson, csv, "iris", { valueKey: "owners_pct", domain: [10, 60], label: "Owner-occupied", drop: isWood }),
  palette: sequentialBlue,
  legendTitle: "Owner-occupied homes, in %",
  legendFormat: (v) => `${v}%`,
  valueSuffix: "%",
  title: "Home Owners by IRIS",
  subtitle: "Share of Owner-Occupied Main Homes, 2022, in %",
  description:
    "Paris rents: only about a third of households own the home they live in. Owning is most common in the 16th, 6th and 7th arrondissements and rarest on the eastern and southern edge, in the 13th, 19th and 20th. Grey units have too few homes for a share.",
  source: "Source: INSEE, Census 2022; map © IGN/INSEE",
  strokeWidth: 0.4,
};
