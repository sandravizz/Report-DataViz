<script>
  // LinkedIn URLs still to come from the client — href="#" until then.
  const authors = [
    { name: "Mathilde Barras", href: "#" },
    { name: "Martin Kessler", href: "#" },
    { name: "Stephen Paduano", href: "#" },
  ];
</script>

<!-- Full-bleed hero (same treatment as the IEA report): the cover photo as
     background with the title block overlaid McKinsey-style. The image runs
     under the fixed translucent header. -->
<!-- Interim cover: lone figure on Preikestolen (CC0, via Wikimedia Commons:
     File:Preikestolen (Unsplash).jpg — public domain, no attribution needed).
     Final cover image is an open client question (docs/fdl-client-meeting.md). -->
<section class="relative flex min-h-screen flex-col font-sans">
  <img
    src="/cover.jpg"
    alt="A lone person standing at the edge of the Preikestolen cliff, high above a fjord"
    class="absolute inset-0 h-full w-full object-cover"
  />
  <!-- Scrim: darkens toward the bottom where the text sits, so the white
       title stays legible on the bright sky/fjord photo. -->
  <div class="absolute inset-0 bg-linear-to-b from-black/20 via-black/25 to-black/65"></div>

  <div
    class="relative flex flex-1 flex-col items-center px-6 pt-24 pb-8 text-white sm:px-10"
  >
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <h1
        class="max-w-4xl font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl"
      >
        IDA 2030: Cliff or no cliff?
      </h1>
      <!-- Narrower on mobile + nowrap per name so a surname never wraps alone. -->
      <p class="mt-6 max-w-xs text-lg text-white/90 sm:max-w-none sm:text-xl">
        {#each authors as author, i (author.name)}
          <a href={author.href} class="link-hover whitespace-nowrap underline-offset-4"
            >{author.name}</a
          >{i < authors.length - 1 ? ", " : ""}
        {/each}
      </p>
      <p class="mt-2 text-lg text-white/90 sm:text-xl">
        <a
          href="https://findevlab.org"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">Finance for Development Lab</a
        >
      </p>
      <!-- Placeholder publication date until the client confirms the real one. -->
      <p class="mt-2 text-sm text-white/75 sm:text-base">September 1, 2026 | Report</p>
    </div>

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
