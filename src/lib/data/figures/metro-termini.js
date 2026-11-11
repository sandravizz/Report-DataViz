// Where each métro line ends, for the line badges a métro map puts at the
// end of every line (MetroPanel.svelte, Figures 4 and 5).
//
// A line is a MultiLineString of station-to-station segments. An end of a
// segment that no other segment shares is an end of the line, so a line with
// branches (7, 13) gets one badge per branch end and a loop (7bis) gets one.
// The track file has a few gaps of under 100 m where two segments should
// meet (lines 1, 13 and 14, 2026-11-10); two loose ends that close together
// are such a gap, not two ends of the line, and are dropped.
//
// `keep(segment)` (optional) keeps only some segments first: Figure 5 keeps
// those inside Paris, so its badges sit at the last station inside the city.
//
// The badge is centred exactly on the end (Sandra, 2026-11-10), with no
// station name beside it.
export const GAP = 0.0012; // degrees, ~90–130 m in Paris

export function termini(lines, keep = () => true) {
  return lines.features.flatMap((feature) => {
    const segments = feature.geometry.coordinates.filter(keep);
    const ends = new Map();
    for (const seg of segments) {
      for (const point of [seg[0], seg[seg.length - 1]]) {
        const key = point.join();
        const seen = ends.get(key);
        ends.set(key, seen ? { ...seen, count: seen.count + 1 } : { point, count: 1 });
      }
    }
    const loose = [...ends.values()].filter((e) => e.count === 1);
    const isGap = (e) =>
      loose.some(
        (o) => o !== e && Math.abs(o.point[0] - e.point[0]) < GAP && Math.abs(o.point[1] - e.point[1]) < GAP,
      );
    return loose
      .filter((e) => !isGap(e))
      .map((e, i) => ({
        id: `${feature.id}-end-${i}`,
        line: feature.properties.line,
        color: feature.properties.color,
        coordinates: e.point,
      }));
  });
}

