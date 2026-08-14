<script>
  import WindTurbinesWide from "./WindTurbinesWide.svelte";
  import WindTurbinesTall from "./WindTurbinesTall.svelte";

  // Optional extra content (e.g. an abstract) in a text band below the hero.
  let { children } = $props();

  // Shared by both cuts of the illustration so they can't drift apart. No
  // `object-contain`: that only applies to replaced elements, and an inline
  // <svg> already letterboxes itself via its default preserveAspectRatio.
  const art =
    "max-h-[calc(100vh-22rem)] min-h-0 w-full flex-1 sm:max-h-[calc(100vh-24rem)]";
</script>

<section class="relative flex flex-1 flex-col bg-base-200 font-sans">
  <!-- Stacked at every width, not a text/image row: the illustration is a wide
       2.15:1 landscape, so beside the headline it could only claim half the
       container; underneath it claims full width and is height-bound instead.
       flex-1 child of `#top`, so it fills the viewport height left over after
       the header rather than adding a flat 100vh under it. -->
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

    <!-- The illustration claims whatever the headline and credit leave behind,
         but `#top` is min-h-screen — a floor, not a fixed height — so flex has
         nothing definite to shrink against and the intrinsic 2.15:1 height
         would push the chevron below the fold. max-h is that missing ceiling:
         22rem ≈ the fixed chrome (headline, credits, chevron, padding).
         On phones it's width-bound and the turbines get small, so it bleeds
         past the horizontal padding to the screen edges; the credit keeps the
         padding to stay aligned with the headline. From sm up both sit in the
         normal column. -->
    <div class="-mx-6 flex min-h-0 flex-1 flex-col sm:mx-0">
      <!-- Two cuts of the same artwork: wide 2.15:1 and near-square 0.92:1.
           `orientation: portrait` is literally "width < height", so the tall
           cut serves upright phones while any landscape window keeps the wide
           one, re-evaluating on resize and rotation.
           Both are inlined as components rather than fetched from /static: a
           few kB gzipped in the HTML, versus a second round trip queued behind
           the CSS, JS and fonts — that wait, not the orientation swap, is what
           made the drawing arrive late on phones. -->
      <div class="flex min-h-0 flex-1">
        <WindTurbinesWide class="{art} portrait:hidden" />
        <WindTurbinesTall class="{art} landscape:hidden" />
      </div>
      <p class="mt-2 self-end px-6 text-xs text-base-content/60 sm:px-0">
        Illustration by Cristina Claverol
      </p>
    </div>
  </div>

  <!-- Extra content below the hero; expanding it grows the hero downward. -->
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
