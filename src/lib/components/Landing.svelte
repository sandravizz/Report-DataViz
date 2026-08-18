<script>
  const authors = [
    { name: "Pekka Sagner" },
    { name: "Michael Voigtländer" },
  ];

  // Optional extra content rendered below the hero (e.g. an abstract block).
  let { children } = $props();
</script>

<!-- Full-bleed hero (same treatment as the FDL and IEA reports): the cover
     photo as background with the title block overlaid. Header.svelte is
     absolutely positioned and floats transparently on top of this photo — it
     isn't fixed, so it scrolls away with the hero. -->
<!-- Cover: residential roofs from directly above (CC0, via Wikimedia Commons:
     File:Residential building roofs (Unsplash).jpg — public domain, no
     attribution needed). No cover photograph came with the Kurzreport itself;
     the aerial was chosen because the top-down view shows many dwellings at
     once, which is what an index measures. -->
<section class="relative flex min-h-screen flex-col font-sans">
  <img
    src="/cover.jpg"
    alt="Blick von oben auf die Dächer eines dicht bebauten Wohnviertels"
    class="absolute inset-0 h-full w-full object-cover"
  />
  <!-- Scrim: the photo is dark overall but carries bright roof patches, so it
       darkens top (under the transparent header) and bottom (under the meta
       lines) more than the middle. -->
  <div class="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60"></div>

  <div
    class="relative flex flex-1 flex-col items-center px-6 pt-20 pb-8 text-white sm:px-10"
  >
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <p class="text-sm font-medium tracking-wide text-white/75 uppercase">
        IW-Report 34/2026
      </p>
      <h1
        class="mt-4 max-w-4xl font-display text-3xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl"
      >
        IW-Wohnindex Q2 2026
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
        Mehr Auswahl beim Kauf, anhaltender Druck auf dem Mietmarkt
      </p>
      <p class="mt-6 text-lg text-white/90 sm:text-xl">
        {#each authors as author, i (author.name)}
          {author.name}{i < authors.length - 1 ? " / " : ""}
        {/each}
      </p>
      <p class="mt-2 text-lg text-white/90 sm:text-xl">
        <a
          href="https://www.iwkoeln.de"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">Institut der deutschen Wirtschaft</a
        >
      </p>
      <p class="mt-2 text-sm text-white/75 sm:text-base">20. Juli 2026 | Köln</p>
    </div>

    <!-- Extra content at the bottom of the hero; expanding it grows the hero
         downward. -->
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
