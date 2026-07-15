<script>
  // The IEA analysis page credits no individual authors — if the client wants
  // an author line here, names (and links) still to come.
  const authors = [];
</script>

<section class="flex min-h-screen flex-col px-6 pt-24 pb-10 font-sans text-base-content sm:px-10 lg:px-14">
  <div class="grid flex-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <div class="max-w-xl">
      <h1 class="font-display text-4xl leading-tight font-semibold sm:text-5xl">
        Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce
      </h1>
      {#if authors.length}
        <p class="mt-4 text-xl leading-snug text-base-content/80 sm:text-2xl">
          {#each authors as author, i (author.name)}
            <a href={author.href} class="link-hover underline-offset-4">{author.name}</a
            >{i < authors.length - 1 ? ", " : ""}
          {/each}
        </p>
      {/if}
      <p class="mt-4 text-xl leading-snug text-base-content/80 sm:text-2xl">
        <a
          href="https://www.iea.org"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">International Energy Agency</a
        >
      </p>
    </div>

    <!-- Placeholder cover: white IEA logo on the signature electric blue.
         Final cover image is an open client question (the report page uses an
         offshore wind farm photo). -->
    <div class="relative flex aspect-16/10 w-full items-center justify-center bg-primary">
      <img
        src="/iea-logo-white.svg"
        alt="IEA – International Energy Agency"
        class="w-2/5"
      />
    </div>
  </div>
</section>
