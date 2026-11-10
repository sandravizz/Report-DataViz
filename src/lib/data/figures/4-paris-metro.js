// The Paris métro (`kind: "metro"`, MetroPanel.svelte): every line and every
// open station, drawn over the 20 arrondissements of Figure 1. The
// arrondissements are a quiet base here, with no values on them.
//
// REAL DATA, unlike Figures 1–3. Lines: Île-de-France Mobilités, "Tracés du
// réseau ferré d'Île-de-France" (Licence Ouverte), mode METRO: one segment per
// pair of neighbouring stations, simplified (~3 m). NOT "Tracés des lignes de
// transport en commun": its métro shapes include long stretches that are not
// the line's own route (line 6 ran along line 2's, 2026-11-08).
// Stations: Île-de-France Mobilités, "Emplacement des gares" (Licence
// Ouverte), mode METRO. One dot per station PER LINE, moved onto that line's
// drawn track (under 50 m, most under 2 m), so an interchange has one dot on
// each of its lines. Stations not yet open are left out (the four line 18
// stations dated 2026-12-01 at the time of the download, 2026-11-08).
// The CSV download (the map itself draws from the GeoJSON): one row per
// station per line, as drawn. Regenerate it if the stops file changes.
import csv from "./csv/4-paris-metro.csv?raw";
import arrondissements from "../geo/paris-arrondissements.json";
import lines from "../geo/paris-metro-lines.json";
import stops from "../geo/paris-metro-stops.json";
import { termini } from "./metro-termini.js";

export default {
  kind: "metro",
  title: "Placeholder: The Paris Métro",
  subtitle: "Métro Lines and Stations, November 2026",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: Île-de-France Mobilités (Licence Ouverte); boundaries © Paris Open Data (ODbL)",
  data: stops.features,
  csv,
  base: arrondissements,
  lines,
  stops,
  ends: termini(lines),
  // What the map is framed on: the whole network, so that no line or stop
  // runs off the edge. Paris sits in the middle with the suburbs around it.
  fit: {
    type: "FeatureCollection",
    features: [...arrondissements.features, ...lines.features, ...stops.features],
  },
};
