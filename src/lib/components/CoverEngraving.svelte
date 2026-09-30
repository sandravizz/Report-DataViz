<script>
  import { onMount } from "svelte";

  // The cover image as a banknote-style LINE ENGRAVING, drawn live on a canvas
  // from the cover photo (static/cover.jpg — Preikestolen, CC0). The photo is
  // never shown: it is only sampled for tone. Each engraved line is a filled
  // ribbon whose thickness follows how dark the photo is at that point, and
  // which bows slightly with the tone so the rock reads with relief; a second,
  // steeper set of lines cross-hatches the deepest shadows only. Because it
  // is drawn at the box's real size, it stays sharp at every width.
  //
  // The lone figure is traced too, but at this scale it would be a few blurred
  // ribbons, so it is redrawn on top as a small solid silhouette in the accent
  // — a pointer, which is what the accent is reserved for — with one dashed
  // leader and a "2030" tag (the Carta-style annotation from the cover
  // studies).
  //
  // Colours come from the theme tokens at draw time, so the ink is the same
  // base-content as the title beside it.

  // PROPS (2026-09-30), so the ending screen can reuse the engraving with a
  // different crop — the defaults are the cover's, unchanged.
  //   crop    the part of the 2000×1329 photo to engrave, in photo px.
  //   focusU  horizontal centre (0..1 of the crop) of what stays in view when
  //           the box is narrower than the crop.
  //   fade    { left, right, top, bottom }: how far in (0..1 of the box) the
  //           engraving dissolves into the ground on each side. Omitted = the
  //           cover's own vignette (see draw()).
  //   label   the canvas's accessible description.
  let {
    crop = { x: 780, y: 120, w: 1220, h: 1209 },
    focusU = 0.46,
    fade = null,
    label = "Line engraving of a lone figure standing at the edge of a sheer cliff above a fjord",
  } = $props();

  let canvas = $state(null);

  // The cover crop holds the cliff tip, the figure and the fjord; everything
  // below is in 0..1 of the crop. The figure is fixed in PHOTO px and mapped
  // into whichever crop is set.
  const CROP = crop;
  const FIG_PX = { x: 1182, feet: 347, head: 284 };
  const FIG = {
    u: (FIG_PX.x - CROP.x) / CROP.w,
    feet: (FIG_PX.feet - CROP.y) / CROP.h,
    head: (FIG_PX.head - CROP.y) / CROP.h,
  };
  // Cover default: slightly left of middle, so the figure is never cut.
  const FOCUS_U = focusU;

  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  // Photo → darkness lookup (0 = paper, 1 = full ink), bilinear.
  function buildSampler(img) {
    const k = img.naturalWidth / 2000;
    const SW = 520;
    const SH = Math.round((SW * CROP.h) / CROP.w);
    const c = document.createElement("canvas");
    c.width = SW;
    c.height = SH;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.imageSmoothingQuality = "high";
    x.drawImage(img, CROP.x * k, CROP.y * k, CROP.w * k, CROP.h * k, 0, 0, SW, SH);
    const d = x.getImageData(0, 0, SW, SH).data;
    const dark = new Float32Array(SW * SH);
    for (let i = 0; i < SW * SH; i++) {
      const L = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
      // The bright sky drops out entirely; the fjord water is full ink.
      dark[i] = Math.pow(Math.min(1, Math.max(0, (1 - L - 0.26) / 0.64)), 0.9);
    }
    return (u, v) => {
      if (u < 0 || v < 0 || u >= 1 || v >= 1) return 0;
      const fx = u * (SW - 1);
      const fy = v * (SH - 1);
      const x0 = fx | 0;
      const y0 = fy | 0;
      const x1 = Math.min(SW - 1, x0 + 1);
      const y1 = Math.min(SH - 1, y0 + 1);
      const tx = fx - x0;
      const ty = fy - y0;
      const top = dark[y0 * SW + x0] * (1 - tx) + dark[y0 * SW + x1] * tx;
      const bot = dark[y1 * SW + x0] * (1 - tx) + dark[y1 * SW + x1] * tx;
      return top * (1 - ty) + bot * ty;
    };
  }

  // Cover-fit the crop into the W×H box.
  function photoMap(W, H) {
    const s = Math.max(W / CROP.w, H / CROP.h);
    const vw = W / (s * CROP.w);
    const vh = H / (s * CROP.h);
    const u0 = Math.max(0, Math.min(1 - vw, FOCUS_U - vw / 2));
    return {
      toUV: (x, y) => [u0 + (x / W) * vw, (y / H) * vh],
      toXY: (u, v) => [((u - u0) / vw) * W, (v / vh) * H],
    };
  }

  // Parallel strokes at `angle`; each stroke is a filled ribbon whose width
  // is thickFn(x, y), broken wherever it gets too thin to see.
  function hatch(ctx, W, H, angle, spacing, thickFn, bendFn) {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const nx = -dy;
    const ny = dx;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.hypot(W, H) / 2 + spacing;
    const step = 1.4;
    const minT = 0.14;
    for (let o = -R; o <= R; o += spacing) {
      let top = [];
      let bot = [];
      const flush = () => {
        if (top.length > 1) {
          ctx.beginPath();
          ctx.moveTo(top[0][0], top[0][1]);
          for (let i = 1; i < top.length; i++) ctx.lineTo(top[i][0], top[i][1]);
          for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
          ctx.closePath();
          ctx.fill();
        }
        top = [];
        bot = [];
      };
      for (let t = -R; t <= R; t += step) {
        const x = cx + nx * o + dx * t;
        const y = cy + ny * o + dy * t;
        if (x < 0 || y < 0 || x > W || y > H) {
          flush();
          continue;
        }
        const th = thickFn(x, y);
        if (th < minT) {
          flush();
          continue;
        }
        const b = bendFn ? bendFn(x, y) : 0;
        const px = x + nx * b;
        const py = y + ny * b;
        top.push([px - (nx * th) / 2, py - (ny * th) / 2]);
        bot.push([px + (nx * th) / 2, py + (ny * th) / 2]);
      }
      flush();
    }
  }

  // Carta-style tag: filled box, small square, mono caps.
  function tag(ctx, x, y, text, fill, size) {
    ctx.save();
    ctx.font = `500 ${size}px 'IBM Plex Mono', ui-monospace, monospace`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${(size * 0.12).toFixed(1)}px`;
    const padX = size * 0.8;
    const sq = size * 0.62;
    const gap = size * 0.6;
    const w = padX * 2 + sq + gap + ctx.measureText(text).width;
    const h = size * 2.1;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y - h / 2, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + padX, y - sq / 2, sq, sq);
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + padX + sq + gap, y + size * 0.05);
    ctx.restore();
  }

  function draw(sample) {
    if (!canvas) return;
    const box = canvas.getBoundingClientRect();
    const W = Math.max(1, Math.round(box.width));
    const H = Math.max(1, Math.round(box.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--color-base-content").trim() || "#000";
    const accent = css.getPropertyValue("--color-accent").trim() || "#c24c2c";

    // Soft vignette so the engraving dissolves into the ground at the foot
    // and, when it sits beside the title (md and up), on the text side.
    // A `fade` prop replaces this with its own edges.
    const beside = window.matchMedia("(min-width: 768px)").matches;
    const vignette = fade
      ? (x, y) =>
          (fade.left ? smooth(0, fade.left, x / W) : 1) *
          (fade.right ? smooth(1, 1 - fade.right, x / W) : 1) *
          (fade.top ? smooth(0, fade.top, y / H) : 1) *
          (fade.bottom ? smooth(1, 1 - fade.bottom, y / H) : 1)
      : (x, y) =>
          (beside ? smooth(0, 0.14, x / W) : 1) * smooth(1, 0.86, y / H) * smooth(0, 0.03, y / H);

    const map = photoMap(W, H);
    const s = Math.max(3.4, Math.min(6, W / 118));
    const tone = (x, y) => {
      const [u, v] = map.toUV(x, y);
      return sample(u, v) * vignette(x, y);
    };

    ctx.fillStyle = ink;
    hatch(
      ctx, W, H, -0.06, s,
      (x, y) => Math.pow(tone(x, y), 1.1) * s * 0.92,
      (x, y) => (tone(x, y) - 0.4) * s * 0.55,
    );
    hatch(ctx, W, H, 0.95, s * 1.15, (x, y) => {
      const t = tone(x, y);
      return t > 0.66 ? ((t - 0.66) / 0.34) * s * 0.6 : 0;
    });

    // The figure, crisp, in the accent.
    const [fx, fy] = map.toXY(FIG.u, FIG.feet);
    const [, hy] = map.toXY(FIG.u, FIG.head);
    const fh = fy - hy;
    const fw = Math.max(2.2, fh * 0.22);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(fx, hy + fw * 0.55, fw * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(fx - fw / 2, hy + fw * 1.1, fw, fh - fw * 1.1);

    // Leader and "2030" tag.
    const size = Math.max(10, Math.min(13, W / 48));
    const up = Math.max(28, H * 0.07);
    const run = Math.max(40, W * 0.12);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.25;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(fx, hy - 6);
    ctx.lineTo(fx, hy - up);
    ctx.lineTo(fx + run, hy - up);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillRect(fx - 3.5, hy - up - 3.5, 7, 7);
    tag(ctx, fx + run, hy - up, "2030", accent, size);
  }

  onMount(() => {
    let sample = null;
    let frame = 0;
    const redraw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => sample && draw(sample));
    };

    const img = new Image();
    img.onload = () => {
      sample = buildSampler(img);
      redraw();
    };
    img.src = "/cover.jpg";

    // The tag's mono face may arrive after the first draw.
    document.fonts?.load("500 12px 'IBM Plex Mono'").then(redraw);

    const ro = new ResizeObserver(redraw);
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  });
</script>

<canvas
  bind:this={canvas}
  role="img"
  aria-label={label}
  class="absolute inset-0 block h-full w-full"
></canvas>
