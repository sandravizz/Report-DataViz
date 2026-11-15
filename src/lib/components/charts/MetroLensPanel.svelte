<script>
  // TEST (Sandra, 2026-11-14, `kind: "metro-lens"`): the métro story's
  // street map with line 1 on it, read through THE COVER'S LENS — move the
  // mouse and a loupe bends the map under it and shows what is there: the
  // street names, exactly as on the landing page, and the names of line 1's
  // stations.
  //
  // The map is the light one of the métro story (colors.js' `streetMap`:
  // white hairline streets, pale water and parks). The lens, its easing and
  // the street-name placement are StreetMap.svelte's own (the cover), copied
  // here rather than shared so the cover cannot break over a test. If this
  // stays, the two should become one component.
  //
  // CUSTOM, flagged per the LayerChart-first rule: this is a <canvas>, like
  // the cover's map. LayerChart has no lens, and a lens has to bend the
  // streets, the line and the stations together, so they are all drawn in
  // the one canvas. No LayerChart tooltip, and the PNG export does not see
  // a canvas.
  //
  // Touch screens have no mouse to follow: a tap puts the lens there.
  //
  // Figure fields: lines (GeoJSON features: the métro line or lines to
  // draw, with `properties.color`), stations ([{ name, coordinates,
  // color }]), fit ([[west, south], [east, north]]: what the map shows).
  import { onMount } from "svelte";
  import { brand, streetMap } from "$lib/colors";
  import { loadLand, loadStreets, pickLabels } from "$lib/street-map.js";

  let { pair } = $props();

  let host = $state(null);
  let canvas = $state(null);

  const MAG = 1.5;
  const KX = Math.cos((48.86 * Math.PI) / 180) * 111320;
  const KY = 111320;
  // [layer, test on a street's rank]: side streets first, main roads on top.
  const LAYERS = [
    ["minor", (rank) => rank === 3],
    ["mid", (rank) => rank === 2],
    ["major", (rank) => rank <= 1],
  ];

  onMount(() => {
    const ctx = canvas.getContext("2d");
    let data = null;
    let land = null;
    let base = null;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let u = 1;
    let ways = [];
    let areas = { green: [], waterArea: [] };
    let tracks = [];
    let stations = [];
    const widths = new Map();

    const [[west, south], [east, north]] = pair.fit;
    const centre = [(west + east) / 2, (south + north) / 2];

    // Flat [lon, lat, lon, lat, …] → pixel arrays and their box.
    const project = (c, s) => {
      const n = c.length / 2;
      const xs = new Float32Array(n);
      const ys = new Float32Array(n);
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      for (let i = 0; i < n; i++) {
        const x = (c[2 * i] - centre[0]) * KX * s + W / 2;
        const y = H / 2 - (c[2 * i + 1] - centre[1]) * KY * s;
        xs[i] = x;
        ys[i] = y;
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
      return { n, xs, ys, x0, x1, y0, y1 };
    };
    const inView = (p) => p.x1 >= -300 && p.x0 <= W + 300 && p.y1 >= -300 && p.y0 <= H + 300;
    const flat = (points) => points.flat();
    const trace = (g, w, close = false) => {
      g.moveTo(w.xs[0], w.ys[0]);
      for (let i = 1; i < w.n; i++) g.lineTo(w.xs[i], w.ys[i]);
      if (close) g.closePath();
    };

    // Everything under the lens is drawn twice: flat (the base) and bent
    // (inside the lens). `path(g, w, close)` is the only difference.
    const paint = (g, path, swell, visible) => {
      g.fillStyle = streetMap.ground;
      g.fillRect(0, 0, W, H);
      for (const [layer, fill] of [["green", streetMap.green], ["waterArea", streetMap.waterArea]]) {
        if (!fill) continue;
        g.fillStyle = fill;
        g.beginPath();
        for (const polygon of areas[layer]) {
          if (!visible(polygon.box)) continue;
          for (const ring of polygon.rings) path(g, ring, true);
        }
        g.fill("evenodd");
      }
      g.lineCap = g.lineJoin = "round";
      for (const [layer, test] of LAYERS) {
        const [stroke, opacity, width] = streetMap[layer];
        g.strokeStyle = stroke;
        g.globalAlpha = opacity;
        g.lineWidth = width * u * swell;
        g.beginPath();
        for (const w of ways) if (test(w.rank) && visible(w)) path(g, w);
        g.stroke();
      }
      g.globalAlpha = 1;
      // The métro: a casing in the page ground, then the line, as a pair.
      const lineWidth = 3 * u * (1 + (swell - 1) * 0.5);
      for (const track of tracks) {
        for (const [stroke, width] of [[brand.ground, lineWidth + 3 * u], [track.color, lineWidth]]) {
          g.strokeStyle = stroke;
          g.lineWidth = width;
          g.beginPath();
          for (const part of track.parts) if (visible(part)) path(g, part);
          g.stroke();
        }
      }
      return lineWidth;
    };
    const dot = (g, x, y, r, color) => {
      g.beginPath();
      g.arc(x, y, r, 0, 7);
      g.fillStyle = color;
      g.fill();
      g.strokeStyle = brand.ground;
      g.lineWidth = 1.5 * u;
      g.stroke();
    };

    const build = () => {
      if (!data) return;
      const box = host.getBoundingClientRect();
      if (!box.width || !box.height) return;
      W = box.width;
      H = box.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      u = Math.max(0.75, Math.min(1.2, W / 1000));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      // The whole of `fit` inside the box, with a little air.
      const s = 0.94 * Math.min(W / ((east - west) * KX), H / ((north - south) * KY));

      ways = data.ways
        .map((w) => Object.assign(project(w.coords, s), { rank: w.rank, name: w.name }))
        .filter(inView);
      const polygons = (multi) =>
        (multi?.coordinates ?? [])
          .map((rings) => {
            const projected = rings.map((ring) => project(flat(ring), s));
            return { rings: projected, box: projected[0] };
          })
          .filter((polygon) => inView(polygon.box));
      areas = { green: polygons(land?.green), waterArea: polygons(land?.waterArea) };
      tracks = pair.lines.map((feature) => ({
        color: feature.properties.color,
        parts: feature.geometry.coordinates.map((part) => project(flat(part), s)),
      }));
      stations = pair.stations.map((station) => {
        const p = project(station.coordinates, s);
        return { ...station, x: p.xs[0], y: p.ys[0] };
      });

      base = document.createElement("canvas");
      base.width = canvas.width;
      base.height = canvas.height;
      const g = base.getContext("2d");
      g.scale(dpr, dpr);
      const lineWidth = paint(g, trace, 1, () => true);
      for (const station of stations) dot(g, station.x, station.y, lineWidth * 0.95, station.color);
      draw();
    };

    const l = { x: 0, y: 0, str: 0, px: 0, py: 0, inside: false };
    const radius = () => Math.max(90, Math.min(260, Math.min(W, H) * 0.34));

    const draw = () => {
      if (!base) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(base, 0, 0, W, H);
      if (l.str <= 0.002) return;

      const { x: lx, y: ly, str } = l;
      const R = radius();
      // The fisheye: [x, y, how far out (0 centre → 1 edge)].
      const lensPoint = (x, y) => {
        const cx = x - lx;
        const cy = y - ly;
        const d = Math.hypot(cx, cy);
        if (d >= R) return [x, y, 1];
        const t = d / R;
        const k = 1 + str * ((1 + MAG) / (1 + MAG * t) - 1);
        return [lx + cx * k, ly + cy * k, t];
      };
      const near = (w) => !(w.x1 < lx - R || w.x0 > lx + R || w.y1 < ly - R || w.y0 > ly + R);
      // A path bent by the lens, its segments cut small enough to curve.
      const bent = (g, w, close = false) => {
        for (let i = 0; i < w.n - 1; i++) {
          const ax = w.xs[i];
          const ay = w.ys[i];
          const bx = w.xs[i + 1];
          const by = w.ys[i + 1];
          const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 7));
          for (let k = i === 0 ? 0 : 1; k <= n; k++) {
            const q = lensPoint(ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n);
            if (i === 0 && k === 0) g.moveTo(q[0], q[1]);
            else g.lineTo(q[0], q[1]);
          }
        }
        if (close) g.closePath();
      };

      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, R, 0, 7);
      ctx.clip();
      const lineWidth = paint(ctx, bent, 1 + str * 1.1, near);

      // The stations inside the lens, a little larger, each with its name.
      const fontSize = Math.max(10.5, Math.min(14, 11 * u * 1.1));
      const inside = stations
        .map((station) => ({ station, q: lensPoint(station.x, station.y) }))
        .filter(({ q }) => q[2] < 0.92);
      for (const { station, q } of inside) dot(ctx, q[0], q[1], lineWidth * 1.1, station.color);

      // The street names, as on the cover (pickLabels): ink on a halo of the
      // map's ground.
      const font = (rank) => `${rank <= 1 ? 700 : 500} ${fontSize}px Satoshi, sans-serif`;
      const measure = (name, rank) => {
        const key = rank + name;
        if (!widths.has(key)) {
          ctx.font = font(rank);
          widths.set(key, ctx.measureText(name).width);
        }
        return widths.get(key);
      };
      ctx.globalAlpha = Math.min(1, str * 1.3);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      for (const label of pickLabels(ways, lx, ly, R, lensPoint, measure, fontSize)) {
        ctx.save();
        ctx.translate(label.x, label.y);
        ctx.rotate(label.angle);
        ctx.font = font(label.rank);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = streetMap.ground;
        ctx.strokeText(label.name, 0, 0);
        ctx.fillStyle = brand.ink;
        ctx.globalAlpha *= label.rank <= 1 ? 1 : 0.8;
        ctx.fillText(label.name, 0, 0);
        ctx.restore();
      }
      // The station names: bold, on a halo of the page ground, to the upper
      // right of their dot.
      ctx.textAlign = "left";
      ctx.font = `700 ${fontSize + 1}px Satoshi, sans-serif`;
      for (const { station, q } of inside) {
        const x = q[0] + lineWidth * 1.1 + 5;
        const y = q[1] - lineWidth * 1.1 - 4;
        ctx.lineWidth = 4;
        ctx.strokeStyle = brand.ground;
        ctx.strokeText(station.name, x, y);
        ctx.fillStyle = brand.ink;
        ctx.fillText(station.name, x, y);
      }
      ctx.restore();

      // The lens's rim.
      ctx.globalAlpha = str;
      ctx.strokeStyle = brand.ink;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(lx, ly, R - 0.5, 0, 7);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    let resizeFrame = 0;
    const resizes = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    });
    // Loaded when the figure comes near the viewport (the cover has usually
    // fetched the streets already). Without the land file the streets still
    // come.
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        Promise.all([loadStreets(), loadLand().catch(() => null)]).then(([d, areasData]) => {
          data = d;
          land = areasData;
          build();
          resizes.observe(host);
        });
      },
      { rootMargin: "400px" },
    );
    near.observe(host);

    // The lens eases towards the pointer and fades in and out (the cover's
    // numbers). Reduced motion: it jumps.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      frame = 0;
      l.str += ((l.inside ? 1 : 0) - l.str) * (reduce ? 1 : 0.12);
      if (l.inside) {
        const f = reduce ? 1 : 0.22;
        l.x += (l.px - l.x) * f;
        l.y += (l.py - l.y) * f;
      }
      if (!l.inside && l.str < 0.01) l.str = 0;
      draw();
      const settled = Math.abs(l.px - l.x) < 0.3 && Math.abs(l.py - l.y) < 0.3;
      if (l.str > 0 && !(l.inside && l.str > 0.99 && settled)) frame = requestAnimationFrame(tick);
    };
    const aim = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (!inside && !l.inside && !l.str) return;
      if (inside && l.str < 0.02) {
        l.x = x;
        l.y = y;
      }
      l.inside = inside;
      l.px = x;
      l.py = y;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const leave = () => {
      l.inside = false;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const mouse = window.matchMedia("(any-hover: hover) and (pointer: fine)").matches;
    if (mouse) {
      window.addEventListener("pointermove", aim, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
    } else {
      // Touch: a tap places the lens (a tap outside the map takes it away).
      window.addEventListener("pointerdown", aim, { passive: true });
    }

    return () => {
      near.disconnect();
      resizes.disconnect();
      cancelAnimationFrame(resizeFrame);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("pointerdown", aim);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  });
</script>

<!-- The map takes the figure's whole box. `aria-label` says what the canvas
     shows; the lens itself is a pointer effect with nothing to announce. -->
<div bind:this={host} class="relative min-w-0 flex-1 overflow-hidden" role="img" aria-label={pair.title}>
  <canvas bind:this={canvas} class="absolute inset-0 h-full w-full"></canvas>
</div>
