<script>
  // Carta's square-dot grid — the field of small coral squares on the
  // section-divider slides of the State of Private Markets deck, which frame
  // the title by leaving a window around it empty. Decorative only.
  //
  // `clear` is an element (the title block): every square whose cell
  // touches its box, grown by `clearPad` cells, is left out, so the window
  // always fits the text at any width and wraps to it as it reflows. The
  // grid is re-laid on resize of either the container or that element.
  //
  // Squares come in staggered from the window outwards (a 40ms step per
  // ring, capped) — CSS animation, so prefers-reduced-motion in
  // tailwind.css lands them at once.
  //
  // `lens` is the findevlab cover's ENGRAVER'S LENS carried over to the dots
  // (2026-10-19): a loupe follows the mouse, and the squares under it bulge
  // outward and swell, as if seen through a glass, with a faint rim for the
  // glass edge. It eases in, trails the pointer slightly and fades out when
  // the pointer leaves. Real mouse only, the same gate as CursorDot; with
  // prefers-reduced-motion it follows the pointer exactly, with no easing.
  let {
    color = "#ff7d55",
    clear = null,
    clearPad = 1,
    animate = true,
    lens = false,
  } = $props();

  let host = $state(null);
  let width = $state(0);
  let height = $state(0);
  let hole = $state(null);

  // Pitch and square size follow the slide's proportions (70px pitch, 7px
  // squares on a 1456px slide), held between phone and wide-screen limits.
  const pitch = $derived(Math.round(Math.min(70, Math.max(30, width / 21))));
  const size = $derived(Math.max(4, Math.round(pitch / 10)));

  $effect(() => {
    if (!host) return;
    const measure = () => {
      const box = host.getBoundingClientRect();
      width = box.width;
      height = box.height;
      if (clear) {
        const r = clear.getBoundingClientRect();
        hole = {
          x0: r.left - box.left,
          x1: r.right - box.left,
          y0: r.top - box.top,
          y1: r.bottom - box.top,
        };
      } else {
        hole = null;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    if (clear) ro.observe(clear);
    return () => ro.disconnect();
  });

  // Where the lens is and how strongly it shows (0 = gone, 1 = full).
  let loupe = $state({ x: 0, y: 0, str: 0 });
  // Radius about two and a half cells; MAG is the fisheye power, which also
  // sets how much the centre squares swell (up to 1 + MAG × 0.8).
  const radius = $derived(Math.max(90, Math.min(170, pitch * 2.6)));
  const MAG = 1.5;

  $effect(() => {
    if (!lens || !host) return;
    if (!window.matchMedia("(any-hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The working copy; written to `loupe` once a frame.
    const l = { x: 0, y: 0, str: 0, px: 0, py: 0, inside: false };
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
      loupe = { x: l.x, y: l.y, str: l.str };
      const settled = Math.abs(l.px - l.x) < 0.3 && Math.abs(l.py - l.y) < 0.3;
      if (l.str > 0 && !(l.inside && l.str > 0.99 && settled)) {
        frame = requestAnimationFrame(tick);
      }
    };
    // Read on window, so the title block over the grid never swallows it.
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      // Enter where the pointer is, rather than sliding in from the last exit.
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
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onOut);
      cancelAnimationFrame(frame);
    };
  });

  // Each square seen through the lens: pushed out along its line from the
  // lens centre (a fisheye, so the middle magnifies and the edge stays put)
  // and grown towards the centre. Outside the radius, untouched.
  const shown = $derived.by(() => {
    const { x: lx, y: ly, str } = loupe;
    if (str <= 0) return squares.map((sq) => ({ x: sq.x, y: sq.y, s: size }));
    return squares.map((sq) => {
      const cx = sq.x + size / 2 - lx;
      const cy = sq.y + size / 2 - ly;
      const d = Math.hypot(cx, cy);
      if (d >= radius) return { x: sq.x, y: sq.y, s: size };
      const t = d / radius;
      const k = 1 + str * ((1 + MAG) / (1 + MAG * t) - 1);
      const s = size * (1 + str * MAG * 0.8 * (1 - t) * (1 - t));
      return { x: lx + cx * k - s / 2, y: ly + cy * k - s / 2, s };
    });
  });

  const squares = $derived.by(() => {
    if (!width || !height) return [];
    const cols = Math.floor(width / pitch);
    const rows = Math.floor(height / pitch);
    // Centre the grid so the leftover margin is even on all sides.
    const ox = (width - (cols - 1) * pitch - size) / 2;
    const oy = (height - (rows - 1) * pitch - size) / 2;
    const pad = clearPad * pitch;
    const out = [];
    const cx = hole ? (hole.x0 + hole.x1) / 2 : width / 2;
    const cy = hole ? (hole.y0 + hole.y1) / 2 : height / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = ox + c * pitch;
        const y = oy + r * pitch;
        if (
          hole &&
          x + size > hole.x0 - pad &&
          x < hole.x1 + pad &&
          y + size > hole.y0 - pad &&
          y < hole.y1 + pad
        )
          continue;
        const ring = Math.max(Math.abs(x - cx), Math.abs(y - cy)) / pitch;
        out.push({ x, y, delay: Math.min(ring * 40, 600) });
      }
    }
    return out;
  });
</script>

<div bind:this={host} class="absolute inset-0 overflow-hidden" aria-hidden="true">
  <svg {width} {height} class="block">
    {#each squares as sq, i (i)}
      <rect
        x={shown[i].x}
        y={shown[i].y}
        width={shown[i].s}
        height={shown[i].s}
        fill={color}
        class={animate ? "dot-in" : ""}
        style:animation-delay="{sq.delay}ms"
      />
    {/each}
    <!-- The glass edge: a faint rim in the surrounding type's colour, not the
         coral, since it is the loupe and not a pointer. -->
    {#if loupe.str > 0.01}
      <circle
        cx={loupe.x}
        cy={loupe.y}
        r={radius - 0.5}
        fill="none"
        stroke="currentColor"
        stroke-opacity={0.22 * loupe.str}
      />
    {/if}
  </svg>
</div>

<style>
  .dot-in {
    opacity: 0;
    animation: dot-in 500ms ease-out forwards;
  }
  @keyframes dot-in {
    to {
      opacity: 1;
    }
  }
</style>
