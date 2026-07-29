<script>
  // Optional extra content (e.g. the abstract side note) rendered in a text
  // band directly below the hero; the chevron scrolls to it when present.
  let { children } = $props();
</script>

<section class="relative flex flex-1 flex-col bg-base-200 font-sans">
  <div
    class="mx-auto flex w-full max-w-350 flex-1 flex-col md:flex-row md:items-center md:gap-10"
  >
    <!-- Row switch is md (768), not the report's usual lg (1024): at lg an
         iPad portrait still got the stacked phone layout, which ran taller
         than the tablet's own screen. This section is a flex-1 child of
         `#top` in +page.svelte, so it fills the viewport height left over
         after the header rather than a flat 100vh stacked underneath it. -->
    <div
      class="px-6 pt-4 pb-4 sm:px-10 sm:pt-8 sm:pb-8 md:w-[48%] md:shrink-0 md:py-0 md:pl-16 lg:pl-24"
    >
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
        Interactive design study · SandraViz
      </p>
    </div>

    <!-- Wind turbine illustration; the SVG is pre-cropped tight to its own
         content, so this wrapper adds no padding of its own. -->
    <div class="flex justify-center md:flex-1 md:justify-end">
      <img
        src="/windmill_row_grid_square.svg"
        alt="Illustration of a row of wind turbines receding toward the horizon"
        class="w-full"
      />
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
    class="mx-auto mb-4 text-base-content/60 hover:text-base-content sm:mb-8"
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
