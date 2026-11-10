// The métro inside the city of Paris (`kind: "metro"`, MetroPanel.svelte):
// Figure 4 zoomed in on the 20 arrondissements. The lines stop at their last
// station inside the city limits, only the stations inside them are kept, and
// the map is framed on Paris alone. Same sources as Figure 4.
import { geoContains } from "d3-geo";
// The CSV download (the map itself draws from the GeoJSON): one row per
// station per line, as drawn. Regenerate it if the stops file changes.
import csv from "./csv/5-paris-metro-centre.csv?raw";
import arrondissements from "../geo/paris-arrondissements.json";
import allLines from "../geo/paris-metro-lines.json";
import allStops from "../geo/paris-metro-stops.json";
import { termini } from "./metro-termini.js";

const stopFeatures = allStops.features.filter((stop) =>
  arrondissements.features.some((area) => geoContains(area, stop.geometry.coordinates)),
);

// The lines' station counts, redone for the stations inside Paris.
const stopsOnLine = (line) => stopFeatures.filter((stop) => stop.properties.line === line).length;

// Each line ENDS at its last station inside the city, where its badge sits
// (Sandra, 2026-11-10: the badge is the very end, no line after it): only the
// station-to-station segments with both ends inside Paris are drawn, so the
// short runs out to the city limits are gone. The morph (Figure 6) chains
// the same segments, so its lines start exactly as drawn here.
const inParis = (point) => arrondissements.features.some((area) => geoContains(area, point));
const insideParis = (seg) => inParis(seg[0]) && inParis(seg[seg.length - 1]);

const lines = {
  type: "FeatureCollection",
  features: allLines.features
    .map((f) => ({
      ...f,
      geometry: { ...f.geometry, coordinates: f.geometry.coordinates.filter(insideParis) },
      properties: { ...f.properties, stops: stopsOnLine(f.properties.line) },
    }))
    .filter((f) => f.geometry.coordinates.length > 0),
};
const stops = { type: "FeatureCollection", features: stopFeatures };

const ends = termini(lines);

export default {
  kind: "metro",
  title: "Placeholder: The Métro Inside Paris",
  subtitle: "Métro Lines and Stations Within the City of Paris, November 2026",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: Île-de-France Mobilités (Licence Ouverte); boundaries © Paris Open Data (ODbL)",
  data: stopFeatures,
  csv,
  base: arrondissements,
  lines,
  stops,
  ends,
  stopsLabel: "Stations in Paris",
  fit: arrondissements,
  clip: arrondissements,
  lineWeight: 1.4,
};
