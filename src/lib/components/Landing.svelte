<script>
  // Optional extra content rendered below the hero (e.g. an abstract block).
  let { children } = $props();
</script>

<!-- Full-bleed hero (same treatment as the IW, FDL and IEA reports): the cover
     photo as background with the title block overlaid and centred.
     Header.svelte is absolutely positioned and floats transparently on top of
     this photo — it isn't fixed, so it scrolls away with the hero. -->
<!-- Cover: a container terminal seen from above (CC0, via Wikimedia Commons:
     File:Large cargo port (Unsplash).jpg — public domain dedication, no
     attribution required). The Global Justice Report has no cover photograph
     of its own; the port was chosen because the whole report is about the
     world economy as one system — trade, income convergence, and the
     material throughput that has to fit inside planetary boundaries. -->
<section class="relative flex min-h-screen flex-col font-sans">
  <img
    src="/cover.jpg"
    alt="A container terminal seen from above, stacked with freight containers and gantry cranes"
    class="absolute inset-0 h-full w-full object-cover"
  />
  <!-- Scrim: the photo carries bright container blocks throughout, so it
       darkens top (under the transparent header) and bottom (under the meta
       lines) more than the middle. -->
  <div class="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-black/65"></div>

  <div
    class="relative flex flex-1 flex-col items-center px-6 pt-20 pb-8 text-white sm:px-10"
  >
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <p class="text-sm font-medium tracking-wide text-white/75 uppercase">
        Global Justice Project
      </p>
      <h1
        class="mt-4 max-w-4xl font-display text-3xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl"
      >
        The Global Justice Report
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
        A Plan for Equality &amp; Prosperity Within Planetary Boundaries
      </p>
      <p class="mt-6 text-lg text-white/90 sm:text-xl">
        Content &amp; data:
        <a
          href="https://gjp.wid.world"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">WID</a
        > (2026)
      </p>
      <p class="mt-2 text-sm text-white/75 sm:text-base">
        Interactive design study ·
        <a
          href="https://www.sandraviz.com/"
          target="_blank"
          rel="noopener"
          class="underline underline-offset-4">SandraViz</a
        >
      </p>
    </div>

    <!-- Extra content at the bottom of the hero; expanding it grows the hero
         downward. -->
    {#if children}
      <div class="w-full max-w-3xl">
        {@render children()}
      </div>
    {/if}

    <a
      href="#ensuring-equality"
      aria-label="Scroll to content"
      class="mt-8 text-white/80 hover:text-white"
    >
      <svg
        class="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m5 9 7 7 7-7" />
      </svg>
    </a>
  </div>
</section>
