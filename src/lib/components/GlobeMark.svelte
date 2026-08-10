<script>
  /* Decorative stand-in for the report's cover illustration: a wireframe
     globe (the graticule's evenly divided segments standing in for the
     equality half of the subtitle) sitting inside a dashed ring — the
     planetary boundary. Line art only, so it inherits `currentColor` from
     whatever wraps it and can be dialled down with an opacity utility
     instead of shipping a second, lighter asset. Geometry is exact rather
     than eyeballed: the globe's radius is 78, so a latitude drawn dy from
     the centre spans ±sqrt(78² − dy²) — 64.4 at dy 44 — which keeps every
     chord landing precisely on the sphere's outline. */
  let { class: className = '' } = $props();
</script>

<svg
  viewBox="0 0 240 240"
  fill="none"
  stroke="currentColor"
  stroke-width="1"
  aria-hidden="true"
  class={className}
>
  <!-- Planetary boundary -->
  <circle cx="120" cy="120" r="106" stroke-dasharray="2 7" />

  <!-- Sphere -->
  <circle cx="120" cy="120" r="78" />

  <!-- Meridians: the outline, two foreshortened ellipses, and the
       degenerate rx=0 case, which is just the polar axis. -->
  <ellipse cx="120" cy="120" rx="52" ry="78" />
  <ellipse cx="120" cy="120" rx="26" ry="78" />
  <line x1="120" y1="42" x2="120" y2="198" />

  <!-- Latitudes -->
  <line x1="42" y1="120" x2="198" y2="120" />
  <line x1="55.6" y1="76" x2="184.4" y2="76" />
  <line x1="55.6" y1="164" x2="184.4" y2="164" />
</svg>
