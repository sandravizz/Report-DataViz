<script>
  // No individual authors credited — if a client wants an author line here,
  // names (and links) still to come.
  const authors = [];

  // Optional extra content (e.g. the abstract side note) rendered in a text
  // band directly below the hero; the chevron scrolls to it when present.
  let { children } = $props();
</script>

<!-- Full-bleed hero: two silhouetted figures on a tidal flat with wind
     turbines at sunset (photo by ZHENYU LUO on Unsplash, free license, no
     attribution required — chosen 2026-07-25 for the workforce + energy
     mood), title overlaid McKinsey-style. The image runs under the fixed
     translucent header. Source photo is portrait (2400x3600); object-position
     keeps the turbines/figures band (~28% down the frame) in view across
     wide desktop crops instead of the default center crop. -->
<section class="relative flex min-h-screen flex-col font-sans">
  <img
    src="/cover.jpg"
    alt="Two silhouetted people on a tidal flat at sunset, with wind turbines in the distance"
    class="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
  />
  <!-- Scrim: darkens toward the bottom where the text sits, so the white
       title stays legible on the bright sky/ocean photo. -->
  <div class="absolute inset-0 bg-linear-to-b from-black/20 via-black/25 to-black/65"></div>

  <div
    class="relative flex flex-1 flex-col items-center px-6 pt-24 pb-8 text-white sm:px-10"
  >
    <!-- Title block centered in the space above the abstract box. -->
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <h1
        class="max-w-4xl font-display text-3xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl"
      >
        Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce
      </h1>
      {#if authors.length}
        <p class="mt-6 text-lg text-white/90 sm:text-xl">
          {#each authors as author, i (author.name)}
            <a href={author.href} class="link-hover underline-offset-4">{author.name}</a
            >{i < authors.length - 1 ? ", " : ""}
          {/each}
        </p>
      {/if}
      <p class="mt-6 text-lg text-white/90 sm:text-xl">
        Content &amp; data:
        <a
          href="https://www.iea.org"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">IEA</a
        > (2026)
      </p>
      <p class="mt-2 text-sm text-white/75 sm:text-base">Interactive design study · SandraViz</p>
    </div>

    <!-- Extra content (the abstract side note) overlaid at the bottom of the
         hero; expanding it grows the hero downward. -->
    {#if children}
      <div class="w-full max-w-3xl">
        {@render children()}
      </div>
    {/if}

    <a
      href="#charts"
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
