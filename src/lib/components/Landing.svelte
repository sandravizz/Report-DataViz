<script>
  // LinkedIn URLs still to come from the client — href="#" until then.
  const authors = [
    { name: "Mathilde Barras", href: "#" },
    { name: "Martin Kessler", href: "#" },
    { name: "Stephen Paduano", href: "#" },
  ];
</script>

<section class="flex min-h-screen flex-col px-6 pt-24 pb-10 font-sans text-base-content sm:px-10 lg:px-14">
  <div class="grid flex-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <div class="max-w-xl">
      <h1 class="font-display text-4xl leading-tight font-semibold sm:text-5xl">
        IDA 2030: Cliff or no cliff?
      </h1>
      <p class="mt-4 text-xl leading-snug text-base-content/80 sm:text-2xl">
        {#each authors as author, i (author.name)}
          <a href={author.href} class="link-hover underline-offset-4">{author.name}</a
          >{i < authors.length - 1 ? ", " : ""}
        {/each}
      </p>
      <p class="mt-2 text-xl leading-snug text-base-content/80 sm:text-2xl">
        <a
          href="https://findevlab.org"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">Finance for Development Lab</a
        >
      </p>
      <!-- Placeholder publication date until the client confirms the real one. -->
      <p class="mt-6 text-base text-base-content/60 sm:text-lg">September 1, 2026</p>
    </div>

    <!-- Interim cover: lone figure on Preikestolen (CC0, via Wikimedia Commons:
         File:Preikestolen (Unsplash).jpg — public domain, no attribution needed).
         Final cover image is an open client question (docs/fdl-client-meeting.md). -->
    <!-- The edge feathering (mask-x/y) dissolves the photo's hard rectangle into
         the white page, echoing the transparent cover of the previous report. -->
    <div class="aspect-16/10 w-full">
      <img
        src="/cover.jpg"
        alt="A lone person standing at the edge of the Preikestolen cliff, high above a fjord"
        class="mask-x-from-80% mask-y-from-80% h-full w-full object-cover"
      />
    </div>
  </div>
</section>
