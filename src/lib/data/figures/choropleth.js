import { parseFigureCsv } from "./parse-csv.js";

// Joins a figure CSV (`<key>,…,value`) onto a GeoJSON FeatureCollection by
// feature id, so each shape carries its own value — the choropleth panel's
// `c` accessor and tooltip read it straight off the shape. Returns the
// fields every `kind: "choropleth"` figure shares; spread it into the figure
// and add its own title, subtitle, source and options.
export function choropleth(geojson, csv, key) {
  const values = new Map(parseFigureCsv(csv).map((d) => [d[key], d.value]));
  const features = geojson.features.map((f) => ({
    ...f,
    properties: { ...f.properties, value: values.get(f.id) ?? null },
  }));
  return {
    kind: "choropleth",
    // The figure's CSV as-is, for the CSV download beside the PNG one.
    csv,
    geojson: { type: "FeatureCollection", features },
    data: features,
    // Five equal classes over a fixed 0–100 domain (scaleQuantize), so the
    // legend reads in round steps: 20, 40, 60, 80.
    domain: [0, 100],
    legendTitle: "Index",
    valueLabel: "Index",
  };
}
