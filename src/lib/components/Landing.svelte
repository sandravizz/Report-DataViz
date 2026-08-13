<script>
  // Optional extra content (e.g. the abstract side note) rendered in a text
  // band directly below the hero; the chevron scrolls to it when present.
  let { children } = $props();
</script>

<section class="relative flex flex-1 flex-col bg-base-200 font-sans">
  <!-- Stacked at every width rather than a text/image row. The illustration is
       a wide 2.15:1 landscape, so beside the headline it could only ever claim
       ~half the container; underneath it claims the full width and is limited
       by height instead. This section is a flex-1 child of `#top` in
       +page.svelte, so it fills the viewport height left over after the header
       rather than a flat 100vh stacked underneath it. -->
  <div
    class="mx-auto flex w-full max-w-350 flex-1 flex-col gap-4 px-6 py-4 sm:gap-6 sm:px-10 sm:py-6 md:px-16 lg:px-24"
  >
    <div>
      <h1
        class="max-w-2xl font-display text-2xl leading-tight font-semibold text-balance text-base-content sm:text-4xl lg:text-5xl"
      >
        Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce
      </h1>
      <p class="mt-4 text-lg text-base-content/80 sm:mt-6 sm:text-xl">
        Content &amp; data:
        <a
          href="https://www.iea.org"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">IEA</a
        > (2026)
      </p>
      <p class="mt-2 text-sm text-base-content/60 sm:text-base">
        Interactive design study ·
        <a
          href="https://www.sandraviz.com/"
          target="_blank"
          rel="noopener"
          class="underline underline-offset-4">SandraViz</a
        >
      </p>
    </div>

    <!-- Wind turbine illustration. It grows to claim whatever the headline and
         credit leave behind, but `#top` is `min-h-screen` — a floor, not a
         fixed height — so flex alone has no definite height to shrink the
         image against and its intrinsic 2.15:1 height would push the scroll
         chevron below the fold. The max-height is that missing ceiling: 22rem
         is roughly the fixed chrome (headline, credits, credit line, chevron,
         padding), so the image takes the rest of the viewport and no more. -->
    <!-- On phones the drawing is width-bound and its turbines get very small,
         so it bleeds past the section's horizontal padding to the screen
         edges; the credit keeps the padding so it stays aligned with the
         headline above. From sm up there is width to spare and both sit
         inside the normal column. -->
    <div class="-mx-6 flex min-h-0 flex-1 flex-col sm:mx-0">
      <!-- Two cuts of the same artwork: a wide 2.15:1 landscape and a
           near-square 0.92:1 portrait. `orientation: portrait` is literally
           "viewport width < height", so the tall cut serves phones held
           upright while any landscape window keeps the wide one. `<picture>`
           re-evaluates on resize and device rotation. -->
      <picture class="flex min-h-0 flex-1">
        <source
          srcset="/eolica-molino-viento-portrait.svg"
          media="(orientation: portrait)"
        />
        <img
          src="/eolica-molino-viento.svg"
          alt="Geometric illustration of a row of wind turbines"
          class="max-h-[calc(100vh-22rem)] min-h-0 w-full flex-1 object-contain sm:max-h-[calc(100vh-24rem)]"
        />
      </picture>
      <p class="mt-2 self-end px-6 text-xs text-base-content/60 sm:px-0">
        Illustration by Cristina Claverol
      </p>
    </div>
  </div>

  <!-- Extra content (the abstract side note) rendered below the hero;
       expanding it grows the hero downward. -->
  {#if children}
    <div class="mx-auto w-full max-w-3xl px-6 pb-8 text-base-content sm:px-10">
      {@render children()}
    </div>
  {/if}

  <a
    href="#charts"
    aria-label="Scroll to content"
    class="mx-auto mb-4 shrink-0 text-base-content/60 hover:text-base-content sm:mb-6"
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
</section>
