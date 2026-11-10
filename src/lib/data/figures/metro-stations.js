// The station marks of a métro map (MetroPanel.svelte), from the stops file's
// one point per station per line.
//
// A station on one line is a white dot on that line. A station where lines
// meet (same name, several lines) is one interchange mark: a white capsule
// with an ink outline, drawn from the two of its points that lie farthest
// apart, so it spans the lines it joins (Châtelet, ~325 m, is the longest).
// Its points sit on each line's own track, so they rarely coincide; when they
// do, the capsule is a round dot.
export function stationMarks(stops) {
  const byName = new Map();
  for (const stop of stops.features) {
    const name = stop.properties.name;
    byName.set(name, [...(byName.get(name) ?? []), stop]);
  }
  const singles = [];
  const interchanges = [];
  for (const [name, points] of byName) {
    if (points.length === 1) {
      singles.push(points[0]);
      continue;
    }
    let ends = [points[0], points[0]];
    let longest = -1;
    for (const a of points) {
      for (const b of points) {
        const [aLon, aLat] = a.geometry.coordinates;
        const [bLon, bLat] = b.geometry.coordinates;
        const d = Math.hypot((aLon - bLon) * Math.cos((aLat * Math.PI) / 180), aLat - bLat);
        if (d > longest) [ends, longest] = [[a, b], d];
      }
    }
    interchanges.push({
      type: "Feature",
      id: `interchange-${name}`,
      properties: { ...points[0].properties, lineList: points.map((p) => p.properties.line) },
      geometry: { type: "LineString", coordinates: ends.map((p) => p.geometry.coordinates) },
    });
  }
  return { singles, interchanges };
}
