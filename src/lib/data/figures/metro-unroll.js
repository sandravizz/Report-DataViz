// A métro line prepared for the map-to-chart morph (MetroMorphPanel.svelte):
// every point of its track gets a number `u` from 0 to 1 that says how far
// along the line it is. In the morph, a point at u moves to the place u of
// the way across its line chart, so the line unrolls into the chart.
//
// `u` is the DISTANCE ALONG THE TRACK from the line's west end, as a share of
// the longest such distance. That one rule covers every shape of line, which
// is why all sixteen can morph (2026-11-11):
// - a plain line (most of them): u runs 0 → 1 from one end to the other;
// - a fork (13, at La Fourche): both branches count on from the fork, so
//   they close onto the same stretch of the chart line, like a zip;
// - a loop (7bis, 10 at Auteuil): its two halves count up from where the
//   loop starts and meet at its far side, so the loop folds flat.
// It replaces metro-chain.js, which walked the line as ONE run of points and
// so could only take lines with no fork and no loop.
//
// The track file stores a line as unordered station-to-station segments,
// with a few breaks of under 100 m (metro-termini.js). The order does not
// matter here: only the segments' end points are joined up (ends within GAP
// count as one), and each segment then morphs on its own.
//
// Returns the line's segments as lists of [longitude, latitude, u], with
// extra points added along the way (STEPS per line length), so the chart's
// kinks between two years are followed closely.
import { GAP } from "./metro-termini.js";

const STEPS = 160;
const lerp = (a, b, t) => a + (b - a) * t;

export function unroll(feature) {
  const segments = feature.geometry.coordinates;
  // Degrees of longitude are shorter than degrees of latitude: scale them,
  // so lengths compare as they do on the map.
  const squeeze = Math.cos((segments[0][0][1] * Math.PI) / 180);
  const span = (a, b) => Math.hypot((a[0] - b[0]) * squeeze, a[1] - b[1]);

  // The places where segments meet, and the segments between them.
  const nodes = [];
  const nodeOf = (point) => {
    let node = nodes.find(
      (n) => Math.abs(n.point[0] - point[0]) < GAP && Math.abs(n.point[1] - point[1]) < GAP,
    );
    if (!node) nodes.push((node = { point, links: 0, distance: Infinity }));
    return node;
  };
  const edges = segments.map((seg) => {
    const edge = {
      seg,
      a: nodeOf(seg[0]),
      b: nodeOf(seg[seg.length - 1]),
      length: seg.slice(1).reduce((sum, point, i) => sum + span(seg[i], point), 0),
    };
    if (edge.a !== edge.b) {
      edge.a.links++;
      edge.b.links++;
    }
    return edge;
  });

  // Every node's shortest distance along the track from `start`; returns
  // the node farthest away.
  const measureFrom = (start) => {
    for (const node of nodes) node.distance = Infinity;
    start.distance = 0;
    for (let changed = true; changed; ) {
      changed = false;
      for (const { a, b, length } of edges) {
        if (a.distance + length < b.distance) [b.distance, changed] = [a.distance + length, true];
        if (b.distance + length < a.distance) [a.distance, changed] = [b.distance + length, true];
      }
    }
    return nodes.reduce((far, n) => (Number.isFinite(n.distance) && n.distance > far.distance ? n : far), start);
  };

  // Start at the WEST end, so the line unrolls left to right like the years.
  // If the far side turns out to lie further west (line 10 inside Paris has
  // its one loose end in the east), start from there instead.
  const west = (list) => list.reduce((w, n) => (n.point[0] < w.point[0] ? n : w));
  const ends = nodes.filter((n) => n.links === 1);
  const start = west(ends.length ? ends : nodes);
  let far = measureFrom(start);
  if (far.point[0] < start.point[0]) far = measureFrom(far);
  const total = far.distance || 1;

  return edges
    .filter((edge) => Number.isFinite(edge.a.distance))
    .map(({ seg, a, b, length }) => {
      const u = (run) => lerp(a.distance, b.distance, run / (length || 1)) / total;
      const out = [[...seg[0], u(0)]];
      let run = 0;
      for (let i = 1; i < seg.length; i++) {
        const piece = span(seg[i - 1], seg[i]);
        const cuts = Math.ceil((piece / total) * STEPS);
        for (let c = 1; c <= cuts; c++) {
          const f = c / cuts;
          out.push([
            lerp(seg[i - 1][0], seg[i][0], f),
            lerp(seg[i - 1][1], seg[i][1], f),
            u(run + piece * f),
          ]);
        }
        run += piece;
      }
      return out;
    });
}
