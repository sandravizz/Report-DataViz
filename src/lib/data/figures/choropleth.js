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
//
// `drop` leaves shapes off the map (a test on the feature): they are not
// drawn, not counted in the key's histogram, and the map is framed on what
// is left. The CSV download keeps every row.
export function choropleth(
  geojson,
  csv,
  key,
  { valueKey = "value", domain = [0, 100], label = "Index", drop = () => false } = {},
) {
  const values = new Map(parseFigureCsv(csv).map((d) => [d[key], d[valueKey]]));
  const features = geojson.features
    .filter((f) => !drop(f))
    .map((f) => ({
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

// PARIS INSIDE THE PÉRIPHÉRIQUE, for the IRIS maps (Sandra, 2026-11-15):
// the Bois de Boulogne and the Bois de Vincennes hang off the city's west
// and east sides and make up a third of the map's width, so on a phone the
// 987 units inside the ring were squeezed to almost nothing. Their five
// IRIS units ("Bois de Boulogne 1–3", "Bois de Vincennes 1–2") are left
// off: 1,719 residents between them (0.08% of Paris), and no income,
// household or housing figure at all. Pass as `drop`.
// The arrondissement and quartier maps keep the woods: there they are part
// of the 12th's and 16th's shapes, not shapes of their own.
export const isWood = (feature) => feature.properties.name.startsWith("Bois de ");
