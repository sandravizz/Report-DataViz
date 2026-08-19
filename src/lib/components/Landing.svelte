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
  <!-- TWO scrims, because one couldn't do both jobs. The linear one darkens
       top and bottom, under the transparent header and the meta lines. -->
  <div class="absolute inset-0 bg-linear-to-b from-black/55 via-black/35 to-black/70"></div>
  <!-- ...and this one sits under the title block itself. The photo's brightest
       roof patches run straight through the middle of the frame, which is
       exactly where the small type sits: the h1 is big and bold enough to
       survive them, everything under it was not. A linear ramp strong enough
       to cover the middle flattened the photo everywhere else, so the cover
       is local instead — an ellipse centred slightly above the middle, faded
       out well before the frame edges so it never reads as a shape.
       It also carries the accent underlines: IW's blue is dark, so unlike
       white type it needs the ground under it to be darker still, which is
       what the 0.58 centre buys. -->
  <div
    class="absolute inset-0 bg-[radial-gradient(ellipse_64%_56%_at_50%_46%,rgb(0_0_0/0.58)_0%,rgb(0_0_0/0.34)_55%,transparent_78%)]"
  ></div>

  <div
    class="relative flex flex-1 flex-col items-center px-6 pt-20 pb-8 text-white sm:px-10"
  >
    <!-- The text-shadow is the third layer of the same job: it travels with
         the glyphs, so it works on the parts of the photo no scrim predicted.
         Kept soft (3px, 45%) — any harder and it reads as a drop shadow
         rather than as the type simply sitting clear of the background. -->
    <div
      class="flex flex-1 flex-col items-center justify-center text-center [text-shadow:0_1px_3px_rgb(0_0_0/0.45)]"
    >
      <p class="text-sm font-medium tracking-wide text-white/75 uppercase">
        IW-Report 34/2026
      </p>
      <h1
        class="mt-4 max-w-4xl font-display text-3xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl"
      >
        IW-Wohnindex Q2 2026
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-white sm:text-xl">
        Mehr Auswahl beim Kauf, anhaltender Druck auf dem Mietmarkt
      </p>
      <p class="mt-6 text-lg text-white sm:text-xl">
        {#each authors as author, i (author.name)}
          {author.name}{i < authors.length - 1 ? " / " : ""}
        {/each}
      </p>
      <!-- Underlined always rather than on hover, and the rule is IW's blue
           while the text stays white: `decoration-*` is what keeps them apart,
           since the underline paints in `currentColor` by default.
           The blue is a dark colour — 5.6:1 on white but only ~3.7:1 against
           black, less over a photo's mid-tones — so it gets 3px here rather
           than the 2px it wears on the light grounds below. Thickness is the
           only lever a rule has: it cannot get more contrast, so it gets more
           area. The scrim under this block is tuned to match (see above). -->
      <p class="mt-2 text-lg text-white sm:text-xl">
        <a
          href="https://www.iwkoeln.de"
          target="_blank"
          rel="noopener"
          class="underline decoration-accent decoration-[3px] underline-offset-4"
          >Institut der deutschen Wirtschaft</a
        >
      </p>
      <p class="mt-2 text-sm text-white/85 sm:text-base">20. Juli 2026 | Köln</p>
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
