// TEST (Sandra, 2026-11-14): line 1 on the métro story's street map, read
// through the cover's lens (`kind: "metro-lens"`, MetroLensPanel.svelte) —
// move the mouse and the loupe shows the street names, as on the landing
// page, and the names of line 1's stations. In a chapter of its own, to see
// how it looks; nothing else depends on it.
//
// The line and its stations are Figure 5's (the métro inside Paris); the
// streets, water and parks are the landing page's OpenStreetMap files.
import parisMetroCentre from "./5-paris-metro-centre.js";

const LINE = "1";
const line = parisMetroCentre.lines.features.find((f) => f.properties.line === LINE);

export default {
  kind: "metro-lens",
  // Alone in its section: one extra scroll of pinned time, to try the lens.
  holdVh: 80,
  title: "Test: Line 1 Under the Lens",
  subtitle: "Line 1 and Its Stations on the Street Map of Paris",
  description:
    "A test. Move the mouse over the map: the lens shows the street names, as on the cover, and the names of line 1's stations.",
  source: "Source: Île-de-France Mobilités; map © OpenStreetMap contributors",
  lines: [line],
  stations: parisMetroCentre.stops.features
    .filter((stop) => stop.properties.line === LINE)
    .map((stop) => ({
      name: stop.properties.name,
      coordinates: stop.geometry.coordinates,
      color: line.properties.color,
    })),
  // What the map shows: Paris without the two woods, [[west, south], [east, north]].
  fit: [
    [2.2517, 48.8156],
    [2.4163, 48.9022],
  ],
};
