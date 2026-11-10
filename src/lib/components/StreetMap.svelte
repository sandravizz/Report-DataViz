<script>
  // The violet street map behind the cover, the chapter dividers and the
  // ending (paris-demo, option J of the cover studies, 2026-11-08): every
  // street in Paris in white hairlines, main roads in spring green, the Seine's
  // banks in white. It fills its positioned parent.
  //
  // THE LENS: a loupe follows the mouse (the same easing as DotGrid's), bends
  // the map under it and shows the street names there. Touch screens get no
  // lens: the map zooms in on one area as the page scrolls (drawZoom), away
  // from the text — on phones the upper part, with the text set at the bottom.
  //
  //   center  [lon, lat] at the middle of the box
  //   span    [lon, lat] degrees to fit; the box is covered, so one axis crops
  //   side    "left" or "right": the side that fades to plain violet for the
  //           text. Below md, where text runs full width, the whole map is
  //           toned down instead.
  //
  // Drawn only when it comes near the viewport, since there are several.
  import { onMount } from "svelte";
  import { brand } from "$lib/colors";
  import { loadStreets, pickLabels } from "$lib/street-map.js";

  //   credit  false where the page shows the OpenStreetMap credit itself
  let { center = [2.3475, 48.8585], span = [0.235, 0.1], side = "left", credit = true } = $props();

  let host = $state(null);
  let canvas = $state(null);

  const MAG = 1.5;
  const GROUND = brand.middle;
  const MAJOR = brand.accent;
  const MID = "rgba(255,255,255,.62)";
  const MINOR = "rgba(255,255,255,.34)";
  const WATER = "rgba(255,255,255,.9)";
  const WIDTHS = [1.7, 1.3, 0.85, 0.6];
  const colour = (rank) => (rank <= 1 ? MAJOR : rank === 2 ? MID : MINOR);
  const KX = Math.cos((48.86 * Math.PI) / 180) * 111320;
  const KY = 111320;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    let data = null;
    let base = null;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let u = 1;
    let ways = [];
    let water = [];
    const widths = new Map();

    const project = (c, s) => {
      const n = c.length / 2;
      const xs = new Float32Array(n);
      const ys = new Float32Array(n);
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      for (let i = 0; i < n; i++) {
        const x = (c[2 * i] - center[0]) * KX * s + W / 2;
        const y = H / 2 - (c[2 * i + 1] - center[1]) * KY * s;
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
    const trace = (g, w) => {
      g.moveTo(w.xs[0], w.ys[0]);
      for (let i = 1; i < w.n; i++) g.lineTo(w.xs[i], w.ys[i]);
    };

    const build = () => {
      if (!data) return;
      const box = host.getBoundingClientRect();
      if (!box.width || !box.height) return;
      W = box.width;
      H = box.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      u = Math.max(0.75, W / 1200);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const s = Math.max(W / (span[0] * KX), H / (span[1] * KY));
      ways = data.ways
        .map((w) => Object.assign(project(w.coords, s), { rank: w.rank, name: w.name }))
        .filter(inView);
      water = data.water.map((c) => project(c, s)).filter(inView);

      base = document.createElement("canvas");
      base.width = canvas.width;
      base.height = canvas.height;
      const g = base.getContext("2d");
      g.scale(dpr, dpr);
      g.lineCap = g.lineJoin = "round";
      g.fillStyle = GROUND;
      g.fillRect(0, 0, W, H);
      for (const rank of [3, 2, 1, 0]) {
        g.strokeStyle = colour(rank);
        g.lineWidth = WIDTHS[rank] * u;
        g.beginPath();
        for (const w of ways) if (w.rank === rank) trace(g, w);
        g.stroke();
      }
      g.strokeStyle = WATER;
      g.lineWidth = 1.4 * u;
      g.beginPath();
      for (const w of water) trace(g, w);
      g.stroke();
      // Below md the text runs full width, so the whole map is toned down.
      // Done in the canvas, not with an overlay, so the lens (drawn on top)
      // shows the map at full strength on phones too.
      if (!window.matchMedia("(min-width: 48rem)").matches) {
        g.globalAlpha = 0.6;
        g.fillStyle = GROUND;
        g.fillRect(0, 0, W, H);
        g.globalAlpha = 1;
      }
      if (onBuilt) onBuilt();
      else draw();
    };
    let onBuilt = null;

    // Street names inside the circle (lx, ly, R), placed through `toScreen`
    // (the lens's fisheye, or the touch zoom). The circle only limits where
    // names may go; nothing draws it.
    const drawLabels = (lx, ly, R, toScreen, alpha) => {
      const fontSize = Math.max(10.5, Math.min(14, 11 * u));
      const font = (rank) => `${rank <= 1 ? 700 : 500} ${fontSize}px Satoshi, sans-serif`;
      const measure = (name, rank) => {
        const key = rank + name;
        if (!widths.has(key)) {
          ctx.font = font(rank);
          widths.set(key, ctx.measureText(name).width);
        }
        return widths.get(key);
      };
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const label of pickLabels(ways, lx, ly, R, toScreen, measure, fontSize)) {
        ctx.save();
        ctx.translate(label.x, label.y);
        ctx.rotate(label.angle);
        ctx.font = font(label.rank);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = GROUND;
        ctx.strokeText(label.name, 0, 0);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(label.name, 0, 0);
        ctx.restore();
      }
      ctx.restore();
    };

    // TOUCH ZOOM (paris-demo, 2026-11-10): no lens on touch screens. The
    // whole map pushes in on one area as the page scrolls — Z runs 1 → 2.6
    // around the focus (fx, fy) — and that area's street names fade in.
    // Phones: the focus sits in the upper part of the box and the lower part,
    // where the text is, is toned down. From md it sits on the side away
    // from the text, which the CSS gradient already clears.
    const z = { Z: 1, fx: 0, fy: 0, phone: false };
    const drawZoom = () => {
      const { Z, fx, fy, phone } = z;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = GROUND;
      ctx.fillRect(0, 0, W, H);
      ctx.setTransform(dpr * Z, 0, 0, dpr * Z, dpr * fx * (1 - Z), dpr * fy * (1 - Z));
      const vx0 = fx - fx / Z;
      const vx1 = fx + (W - fx) / Z;
      const vy0 = fy - fy / Z;
      const vy1 = fy + (H - fy) / Z;
      const visible = (w) => w.x1 >= vx0 && w.x0 <= vx1 && w.y1 >= vy0 && w.y0 <= vy1;
      ctx.lineCap = ctx.lineJoin = "round";
      // Lines thicken a little as they come closer, not by the full zoom.
      const swell = (1 + 0.6 * (Z - 1)) / Z;
      for (const rank of [3, 2, 1, 0]) {
        ctx.strokeStyle = colour(rank);
        ctx.lineWidth = WIDTHS[rank] * u * swell;
        ctx.beginPath();
        for (const w of ways) if (w.rank === rank && visible(w)) trace(ctx, w);
        ctx.stroke();
      }
      ctx.strokeStyle = WATER;
      ctx.lineWidth = 1.4 * u * swell;
      ctx.beginPath();
      for (const w of water) if (visible(w)) trace(ctx, w);
      ctx.stroke();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (phone) {
        // GROUND is #rrggbb; both stops keep its colour so the fade never
        // passes through grey.
        const tone = ctx.createLinearGradient(0, H * 0.4, 0, H * 0.68);
        tone.addColorStop(0, GROUND + "00");
        tone.addColorStop(1, GROUND + "B8");
        ctx.fillStyle = tone;
        ctx.fillRect(0, 0, W, H);
      }

      const alpha = Math.max(0, Math.min(1, (Z - 1.25) / 0.5));
      if (alpha > 0) {
        const toScreen = (x, y) => {
          const sx = fx + (x - fx) * Z;
          const sy = fy + (y - fy) * Z;
          return [sx, sy, sx >= 0 && sx <= W && sy >= 0 && sy <= H ? 0 : 1];
        };
        const R = phone ? Math.min(W * 0.5, H * 0.28) : Math.min(W * 0.25, H * 0.4);
        drawLabels(phone ? W / 2 : fx, phone ? H * 0.3 : fy, R, toScreen, alpha);
      }
    };

    const l = { x: 0, y: 0, str: 0, px: 0, py: 0, inside: false };
    const radius = () => Math.max(90, Math.min(280, Math.min(W, H) * 0.32));

    const draw = () => {
      if (!base) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(base, 0, 0, W, H);
      if (l.str <= 0.002) return;
      const { x: lx, y: ly, str } = l;
      const R = radius();
      const lensPoint = (x, y) => {
        const cx = x - lx;
        const cy = y - ly;
        const d = Math.hypot(cx, cy);
        if (d >= R) return [x, y, 1];
        const t = d / R;
        const k = 1 + str * ((1 + MAG) / (1 + MAG * t) - 1);
        return [lx + cx * k, ly + cy * k, t];
      };
      const lensTrace = (w) => {
        if (w.x1 < lx - R || w.x0 > lx + R || w.y1 < ly - R || w.y0 > ly + R) return;
        let pen = false;
        for (let i = 0; i < w.n - 1; i++) {
          const ax = w.xs[i];
          const ay = w.ys[i];
          const bx = w.xs[i + 1];
          const by = w.ys[i + 1];
          if (Math.max(ax, bx) < lx - R || Math.min(ax, bx) > lx + R || Math.max(ay, by) < ly - R || Math.min(ay, by) > ly + R) {
            pen = false;
            continue;
          }
          const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 7));
          for (let k = 0; k <= n; k++) {
            const q = lensPoint(ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n);
            if (pen) ctx.lineTo(q[0], q[1]);
            else {
              ctx.moveTo(q[0], q[1]);
              pen = true;
            }
          }
        }
      };

      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, R, 0, 7);
      ctx.clip();
      ctx.fillStyle = GROUND;
      ctx.fillRect(lx - R, ly - R, R * 2, R * 2);
      ctx.lineCap = ctx.lineJoin = "round";
      const swell = 1 + str * 1.1;
      for (const rank of [3, 2, 1, 0]) {
        ctx.strokeStyle = colour(rank);
        ctx.lineWidth = WIDTHS[rank] * u * swell;
        ctx.beginPath();
        for (const w of ways) if (w.rank === rank) lensTrace(w);
        ctx.stroke();
      }
      ctx.strokeStyle = WATER;
      ctx.lineWidth = 1.4 * u * swell;
      ctx.beginPath();
      for (const w of water) lensTrace(w);
      ctx.stroke();

      drawLabels(lx, ly, R, lensPoint, Math.min(1, str * 1.3));
      ctx.restore();

      ctx.globalAlpha = str;
      ctx.strokeStyle = "rgba(255,255,255,.6)";
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
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        loadStreets().then((d) => {
          data = d;
          build();
          resizes.observe(host);
        });
      },
      { rootMargin: "400px" },
    );
    near.observe(host);

    let removeLens = () => {};
    if (window.matchMedia("(any-hover: hover) and (pointer: fine)").matches) {
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
      // Read on window, so the title over the map never swallows it.
      const onMove = (e) => {
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
      const onOut = () => {
        l.inside = false;
        if (!frame) frame = requestAnimationFrame(tick);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onOut);
      removeLens = () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onOut);
        cancelAnimationFrame(frame);
      };
    } else {
      // TOUCH: the zoom rides the scroll (drawZoom). Progress p runs 0 → 1 as
      // the map travels from the bottom of the viewport to off the top. A
      // cover sitting at the top of the page starts at p = 0.5, so it is
      // already part-way in, names showing, before anyone scrolls. Reduced
      // motion holds that middle frame.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let frame = 0;
      const place = () => {
        frame = 0;
        if (!base) return;
        const r = host.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom <= 0 || r.top >= vh) return;
        const p = reduce ? 0.5 : Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
        const ease = p * p * (3 - 2 * p);
        z.phone = !window.matchMedia("(min-width: 48rem)").matches;
        z.Z = 1 + 1.6 * ease;
        if (z.phone) {
          z.fx = W * (0.35 + 0.3 * p);
          z.fy = H * 0.3;
        } else {
          z.fx = W * (side === "right" ? 0.28 : 0.72);
          z.fy = H * (0.4 + 0.2 * p);
        }
        drawZoom();
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(place);
      };
      onBuilt = place;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      removeLens = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(frame);
      };
    }

    return () => {
      near.disconnect();
      resizes.disconnect();
      cancelAnimationFrame(resizeFrame);
      removeLens();
    };
  });
</script>

<div bind:this={host} class="absolute inset-0 overflow-hidden bg-secondary" aria-hidden="true">
  <canvas bind:this={canvas} class="absolute inset-0 h-full w-full"></canvas>
  <div
    class="absolute inset-0 hidden md:block"
    style:background="linear-gradient(to {side === 'right' ? 'left' : 'right'}, var(--color-secondary) 22%, transparent 58%)"
  ></div>
  <!-- The ODbL requires the credit wherever the map is shown. -->
  {#if credit}
    <span class="absolute bottom-1.5 text-[10px] leading-none text-white/85 {side === 'right' ? 'left-3' : 'right-3'}">
      © OpenStreetMap contributors
    </span>
  {/if}
</div>
