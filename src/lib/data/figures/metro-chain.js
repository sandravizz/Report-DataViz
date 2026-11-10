// One métro line as a single ordered run of points, end to end — what the
// map-to-chart morph (MetroMorphPanel.svelte) needs to unroll a line into a
// line chart. The track file stores a line as unordered station-to-station
// segments, so they are chained here: segment ends that meet (or come within
// GAP, the small breaks in the track file — see metro-termini.js) are joined,
// and the walk starts at the line's WEST end, so the line unrolls left to
// right like the chart's years.
//
// `keep(segment)` (optional) keeps only some segments first: the morph keeps
// those inside Paris, as Figure 5 draws them. Meant for lines without
// branches; on a branching line the walk follows the first branch it meets.
const GAP = 0.0012; // degrees, as metro-termini.js

export function lineChain(feature, keep = () => true) {
  const segments = feature.geometry.coordinates.filter(keep);
  const nodes = [];
  const nodeOf = (point) => {
    let node = nodes.find(
      (n) => Math.abs(n.point[0] - point[0]) < GAP && Math.abs(n.point[1] - point[1]) < GAP,
    );
    if (!node) nodes.push((node = { point, links: [] }));
    return node;
  };
  segments.forEach((seg, i) => {
    const a = nodeOf(seg[0]);
    const b = nodeOf(seg[seg.length - 1]);
    a.links.push({ i, to: b, coords: seg });
    b.links.push({ i, to: a, coords: [...seg].reverse() });
  });

  const ends = nodes.filter((n) => n.links.length === 1);
  let node = (ends.length ? ends : nodes).reduce((west, n) => (n.point[0] < west.point[0] ? n : west));
  const used = new Set();
  const chain = [node.point];
  for (;;) {
    const link = node.links.find((l) => !used.has(l.i));
    if (!link) break;
    used.add(link.i);
    chain.push(...link.coords.slice(1));
    node = link.to;
  }
  return chain;
}
