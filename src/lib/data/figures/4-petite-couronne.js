// Paris inside the petite couronne: the 20 arrondissements set among the 122
// communes of Hauts-de-Seine (92), Seine-Saint-Denis (93) and Val-de-Marne
// (94), with the four département borders (Paris included) drawn on top in
// ink so the city reads as one shape inside its ring.
//
// PLACEHOLDER DATA (2026-11-04): seeded random values with a smooth spatial
// pattern, 5–95.
//
// Boundaries: communes and départements from IGN via Opendatasoft
// ("georef-france-commune", "georef-france-departement", Licence Ouverte),
// simplified (~6 m); arrondissements from Paris Open Data (ODbL). Feature
// ids: INSEE commune codes, and 75101–75120 for the arrondissements.
import csv from "./csv/4-petite-couronne.csv?raw";
import geojson from "../geo/petite-couronne.json";
import departements from "../geo/petite-couronne-departements.json";
import { choropleth } from "./choropleth.js";

export default {
  ...choropleth(geojson, csv, "area"),
  title: "Placeholder: Paris and the Petite Couronne",
  subtitle: "Random placeholder values for Paris's arrondissements and the surrounding communes, index 0–100",
  description: "Placeholder: what the map shows and the one pattern the reader should take from it.",
  source: "Source: random placeholder data; boundaries © IGN (Licence Ouverte), Paris Open Data (ODbL)",
  strokeWidth: 0.6,
  outline: departements,
};
