// Paris without its two woods (Sandra, 2026-11-14): the Bois de Vincennes
// hangs off the 12th arrondissement's east side and the Bois de Boulogne
// off the 16th's west side. No métro runs through either, and framing the
// map on them costs a third of its width.
//
// Each wood is cut off along a straight line: the outline's vertices beyond
// the line are dropped, if they belong to a run that reaches deep into the
// wood (`far`) — so the two points where the outline crosses the line are
// joined by one straight edge, and a corner of the city that merely pokes
// past the line stays.
// - Vincennes: everything east of 2.4139°E; the edge runs north–south from
//   48.8336°N to 48.8248°N.
// - Boulogne: everything west of the line from the corner by Porte
//   d'Auteuil to the corner by Porte Maillot, both vertices of the outline.
//   Every station inside Paris is at least 200 m east of it.
import arrondissements from "../geo/paris-arrondissements.json";

const AUTEUIL = [2.25254, 48.84558];
const MAILLOT = [2.27978, 48.87865];
// How far a point is left of the line a → b (degrees², > 0 = left of it).
const leftOf = ([ax, ay], [bx, by], [px, py]) => (bx - ax) * (py - ay) - (by - ay) * (px - ax);

const woods = [
  { beyond: ([long]) => long > 2.4139, far: ([long]) => long > 2.43 },
  { beyond: (point) => leftOf(AUTEUIL, MAILLOT, point) > 2e-6, far: ([long]) => long < 2.24 },
];

function without(ring, { beyond, far }) {
  const open = ring.slice(0, -1);
  const out = open.map(beyond);
  if (!open.some(far) || !out.includes(false)) return ring;
  const start = out.indexOf(false);
  const kept = [];
  let run = [];
  const flush = () => {
    if (!run.some(far)) kept.push(...run);
    run = [];
  };
  for (let k = 0; k < open.length; k++) {
    const i = (start + k) % open.length;
    if (out[i]) run.push(open[i]);
    else {
      flush();
      kept.push(open[i]);
    }
  }
  flush();
  return [...kept, kept[0]];
}

export const parisCity = {
  ...arrondissements,
  features: arrondissements.features.map((feature) =>
    feature.geometry.type === "Polygon"
      ? {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates.map((ring) => woods.reduce(without, ring)),
          },
        }
      : feature,
  ),
};
