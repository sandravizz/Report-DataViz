<script>
  // No individual authors credited — if a client wants an author line here,
  // names (and links) still to come.
  const authors = [];

  // Optional extra content (e.g. the abstract side note) rendered in a text
  // band directly below the hero; the chevron scrolls to it when present.
  let { children } = $props();
</script>

<!-- Hero, title left-aligned McKinsey/Global-Justice-Report style, with the
     square wind-turbine illustration on the right instead of a photo.
     Background is the same cream tint (base-200) used behind chapter titles
     further down the report, so the header can sit permanently in its
     contrast (dark-on-light) state — no scrim, no transparent phase. -->
<section class="relative flex min-h-screen flex-col bg-base-200 font-sans">
  <div
    class="mx-auto flex w-full max-w-350 flex-1 flex-col md:flex-row md:items-center md:gap-10"
  >
    <!-- Title block, left-aligned but nudged well in from the edge — the
         max-width container above plus this padding pull the whole
         title/illustration group toward the center of the page instead of
         hugging the viewport edges. Widened from 38%→48% of the row so the
         headline wraps across fewer, longer lines instead of squeezing into
         a narrow column with a big dead gap before the illustration.
         Padding/type shrink at the base (phone) tier only — sm/md/lg are
         untouched — so the whole hero has a chance of fitting one mobile
         screen instead of forcing a scroll before anything else is visible.
         The row switch is md (768), not lg (1024): at lg an iPad in
         portrait was still getting the stacked phone layout at sm-tier
         (already large) type and a full-width image stacked beneath it,
         which ran taller than the tablet's own screen. -->
    <div
      class="px-6 pt-4 pb-4 sm:px-10 sm:pt-8 sm:pb-8 md:w-[48%] md:shrink-0 md:py-0 md:pl-16 lg:pl-24"
    >
      <h1
        class="max-w-2xl font-display text-2xl leading-tight font-semibold text-balance text-base-content sm:text-4xl lg:text-5xl"
      >
        Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce
      </h1>
      {#if authors.length}
        <p class="mt-4 text-lg text-base-content/80 sm:mt-6 sm:text-xl">
          {#each authors as author, i (author.name)}
            <a href={author.href} class="link-hover underline-offset-4">{author.name}</a
            >{i < authors.length - 1 ? ", " : ""}
          {/each}
        </p>
      {/if}
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

    <!-- Row of wind turbines, fading toward the horizon, in a square frame.
         The SVG itself was recropped to remove the dead space it used to
         carry at its own edges, so this wrapper adds no padding of its own
         (padding on top of an already-padded graphic just shrank it further,
         worst on mobile) — it runs edge to edge and simply fills whatever
         width the flex layout gives it. -->
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
