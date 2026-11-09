// Data and label placement for StreetMap.svelte.
//
// static/paris-streets.json: every named street in and around Paris
// (motorway to living_street) and the banks of the Seine, from
// © OpenStreetMap contributors (ODbL), downloaded 2026-11-08 with Overpass.
// Ways of one name are chained, simplified to ~5 m and stored as integer
// deltas in 1e-5 degrees from ORIGIN, as [rank, nameIndex, x0, y0, dx, dy, …].
// Rank: 0 motorway/trunk/primary, 1 secondary, 2 tertiary, 3 the rest.
//
// Fetched at run time and shared, so the ~740 KB never delays the first paint
// and the cover and chapter maps download it once.
const ORIGIN = [2.225, 48.805];

function decodeLine(row, start) {
  const out = [];
  let x = row[start];
  let y = row[start + 1];
  out.push(ORIGIN[0] + x / 1e5, ORIGIN[1] + y / 1e5);
  for (let i = start + 2; i < row.length; i += 2) {
    x += row[i];
    y += row[i + 1];
    out.push(ORIGIN[0] + x / 1e5, ORIGIN[1] + y / 1e5);
  }
  return out;
}

let streets;
export function loadStreets() {
  streets ??= fetch("/paris-streets.json")
    .then((r) => r.json())
    .then((d) => ({
      ways: d.ways.map((row) => ({ rank: row[0], name: d.names[row[1]], coords: decodeLine(row, 2) })),
      water: d.water.map((row) => decodeLine(row, 0)),
    }));
  return streets;
}

const MAX_LABELS = 16;
const lerp = (a, b, t) => a + (b - a) * t;

// The street names to show under the lens: each street's longest run inside
// it, main roads and long runs first, none overlapping. `ways` are projected
// to pixels, `lensPoint` is the fisheye, `measure(name, rank)` the text width.
export function pickLabels(ways, lx, ly, R, lensPoint, measure, fontSize) {
  const inner = R * 0.84;
  const candidates = [];
  for (const w of ways) {
    if (!w.name || w.x1 < lx - R || w.x0 > lx + R || w.y1 < ly - R || w.y0 > ly + R) continue;
    let run = [];
    let best = null;
    let bestLength = 0;
    const flush = () => {
      if (run.length > 1) {
        let length = 0;
        for (let i = 1; i < run.length; i++) length += Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1]);
        if (length > bestLength) {
          bestLength = length;
          best = run;
        }
      }
      run = [];
    };
    for (let i = 0; i < w.n; i++) {
      const ax = w.xs[i];
      const ay = w.ys[i];
      const last = i + 1 >= w.n;
      const bx = last ? ax : w.xs[i + 1];
      const by = last ? ay : w.ys[i + 1];
      const steps = last ? 1 : Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 8));
      for (let k = 0; k < steps; k++) {
        const q = lensPoint(lerp(ax, bx, k / steps), lerp(ay, by, k / steps));
        if (q[2] < 1 && Math.hypot(q[0] - lx, q[1] - ly) < inner) run.push(q);
        else flush();
      }
    }
    flush();
    if (best) candidates.push({ w, run: best, length: bestLength });
  }
  candidates.sort((a, b) => a.w.rank - b.w.rank || b.length - a.length);

  const placed = [];
  const seen = new Set();
  const taken = [];
  for (const c of candidates) {
    if (placed.length >= MAX_LABELS) break;
    if (seen.has(c.w.name)) continue;
    const textWidth = measure(c.w.name, c.w.rank);
    if (c.length < textWidth * 1.02) continue;

    // The middle of the run, then outwards until the chord fits the text.
    let walked = 0;
    let mid = c.run[0];
    let index = 1;
    for (; index < c.run.length; index++) {
      const step = Math.hypot(c.run[index][0] - c.run[index - 1][0], c.run[index][1] - c.run[index - 1][1]);
      if (walked + step >= c.length / 2) {
        mid = c.run[index];
        break;
      }
      walked += step;
    }
    let i0 = index;
    let i1 = index;
    let span = 0;
    while (span < textWidth && (i0 > 0 || i1 < c.run.length - 1)) {
      if (i0 > 0) i0--;
      if (i1 < c.run.length - 1) i1++;
      span = Math.hypot(c.run[i1][0] - c.run[i0][0], c.run[i1][1] - c.run[i0][1]);
    }
    if (span < textWidth * 0.9) continue;

    // Keep the text upright.
    let angle = Math.atan2(c.run[i1][1] - c.run[i0][1], c.run[i1][0] - c.run[i0][0]);
    if (angle > Math.PI / 2) angle -= Math.PI;
    if (angle < -Math.PI / 2) angle += Math.PI;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const points = [];
    for (let d = -textWidth / 2; d <= textWidth / 2; d += fontSize * 0.8) {
      points.push([mid[0] + cos * d, mid[1] + sin * d]);
    }
    if (points.some((p) => Math.hypot(p[0] - lx, p[1] - ly) > R - fontSize)) continue;
    if (points.some((p) => taken.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < fontSize * 1.25))) continue;

    taken.push(...points);
    seen.add(c.w.name);
    placed.push({ name: c.w.name, rank: c.w.rank, x: mid[0], y: mid[1], angle });
  }
  return placed;
}
