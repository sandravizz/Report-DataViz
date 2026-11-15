import { parseFigureCsv } from "./parse-csv.js";

// Joins a figure CSV (`<key>,…,<valueKey>`) onto a GeoJSON FeatureCollection
// by feature id, so each shape carries its own value — the choropleth
// panel's `c` accessor and tooltip read it straight off the shape. Returns
// the fields every `kind: "choropleth"` figure shares; spread it into the
// figure and add its own title, subtitle, source and options.
//
// `valueKey` is the CSV column to map; `domain` the colour scale's
// [min, max], cut into five equal classes (scaleQuantize) — pick a maximum
// that gives round steps, values beyond it take the darkest class.
export function choropleth(geojson, csv, key, { valueKey = "value", domain = [0, 100], label = "Index" } = {}) {
  const values = new Map(parseFigureCsv(csv).map((d) => [d[key], d[valueKey]]));
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
    domain,
    legendTitle: label,
    valueLabel: label,
    // The map's total, for copy that quotes it (the chapter's big number).
    total: features.reduce((sum, f) => sum + (f.properties.value ?? 0), 0),
  };
}

// Legend ticks for resident counts: 50,000 → "50k", so four ticks fit the
// small key. The tooltip keeps the full number.
export const thousands = (v) => (v >= 1000 ? `${v / 1000}k` : `${v}`);
