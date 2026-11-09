// The métro inside the city of Paris (`kind: "metro"`, MetroPanel.svelte):
// Figure 4 zoomed in on the 20 arrondissements. The lines are cut at the city
// limits, only the stations inside them are kept, and the map is framed on
// Paris alone. Same sources as Figure 4.
import { geoContains } from "d3-geo";
import arrondissements from "../geo/paris-arrondissements.json";
import allLines from "../geo/paris-metro-lines.json";
import allStops from "../geo/paris-metro-stops.json";

const stopFeatures = allStops.features.filter((stop) =>
  arrondissements.features.some((area) => geoContains(area, stop.geometry.coordinates)),
);

// The lines' station counts, redone for the stations inside Paris.
const stopsOnLine = (line) => stopFeatures.filter((stop) => stop.properties.line === line).length;

const lines = {
  type: "FeatureCollection",
  features: allLines.features.map((f) => ({
    ...f,
    properties: { ...f.properties, stops: stopsOnLine(f.properties.line) },
  })),
};
const stops = { type: "FeatureCollection", features: stopFeatures };

export default {
  kind: "metro",
  title: "Placeholder: The Métro Inside Paris",
  subtitle: "Métro Lines and Stations Within the City of Paris, November 2026",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: Île-de-France Mobilités (Licence Ouverte); boundaries © Paris Open Data (ODbL)",
  data: stopFeatures,
  base: arrondissements,
  lines,
  stops,
  legendTitle: "Line",
  stopsLabel: "Stations in Paris",
  fit: arrondissements,
  clip: arrondissements,
  lineWeight: 1.4,
};
