<script>
  // No cover photograph came with this Kurzreport, so the hero is a plain white
  // field (iwkoeln.de's own page background) with the title in brand blue,
  // rather than white type on a colored ground.
  const authors = [
    { name: "Pekka Sagner" },
    { name: "Michael Voigtländer" },
  ];

  // Optional extra content rendered below the hero (e.g. an abstract block).
  let { children } = $props();
</script>

<section class="relative flex min-h-screen flex-col bg-base-100 font-sans">
  <div
    class="relative flex flex-1 flex-col items-center px-6 pt-24 pb-8 text-base-content sm:px-10"
  >
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <p class="text-sm font-medium tracking-wide text-base-content/60 uppercase">
        IW-Report 34/2026
      </p>
      <h1
        class="mt-4 max-w-4xl font-display text-3xl leading-tight font-bold text-balance text-secondary sm:text-5xl lg:text-6xl"
      >
        IW-Wohnindex Q2 2026
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-base-content/80 sm:text-xl">
        Mehr Auswahl beim Kauf, anhaltender Druck auf dem Mietmarkt
      </p>
      <p class="mt-6 text-lg text-base-content/80 sm:text-xl">
        {#each authors as author, i (author.name)}
          {author.name}{i < authors.length - 1 ? " / " : ""}
        {/each}
      </p>
      <p class="mt-2 text-lg text-base-content/80 sm:text-xl">
        <a
          href="https://www.iwkoeln.de"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">Institut der deutschen Wirtschaft</a
        >
      </p>
      <p class="mt-2 text-sm text-base-content/60 sm:text-base">20. Juli 2026 | Köln</p>
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
      class="mt-8 text-base-content/50 hover:text-base-content"
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
