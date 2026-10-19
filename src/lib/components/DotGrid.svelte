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
  let {
    color = "#ff7d55",
    clear = null,
    clearPad = 1,
    animate = true,
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
        x={sq.x}
        y={sq.y}
        width={size}
        height={size}
        fill={color}
        class={animate ? "dot-in" : ""}
        style:animation-delay="{sq.delay}ms"
      />
    {/each}
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
