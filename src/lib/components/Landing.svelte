<script>
  import GlobeMark from './GlobeMark.svelte';
</script>

<section class="flex min-h-screen flex-col px-6 pt-24 pb-10 font-sans text-base-content sm:px-10 md:px-14">
  <div class="grid flex-1 items-center gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
    <div class="max-w-xl">
      <h1 class="text-4xl leading-tight font-semibold sm:text-5xl">
        The Global Justice Report
      </h1>
      <p class="mt-4 text-xl leading-snug text-base-content/80 sm:text-2xl">
        A Plan for Equality &amp; Prosperity Within Planetary Boundaries
      </p>
      <p class="mt-4 text-lg text-base-content/80 sm:mt-6 sm:text-xl">
        Content &amp; data:
        <a
          href="https://gjp.wid.world"
          target="_blank"
          rel="noopener"
          class="link-hover underline-offset-4">WID</a
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

    <div class="justify-self-center text-primary/20 md:justify-self-end">
      <GlobeMark class="w-44 sm:w-56 md:w-72 lg:w-80" />
    </div>
  </div>
</section>
