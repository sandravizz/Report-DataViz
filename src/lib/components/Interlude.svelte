<!-- A full-screen text pause between two figure runs, in the DEMO's voice
     rather than the report's: a chapter can show the same figure twice
     (finished, then rebuilt step by step) and nothing else on screen says so.
     Same column geometry and tinted surface as a chapter — a second geometry
     mid-report reads as a glitch — with only the muted kicker (chapters' is
     primary) marking it as commentary. -->
<script>
  let { kicker, title, paragraphs = [] } = $props();
</script>

<section
  class="flex min-h-screen items-center bg-base-200 font-sans text-base-content"
>
  <div class="mx-auto w-[88vw] py-24 lg:my-auto lg:ml-[calc(43%-400px)] lg:w-200">
    {#if kicker}
      <p class="mb-3 text-xs font-medium tracking-wide text-base-content/50 uppercase">
        {kicker}
      </p>
    {/if}
    <h2 class="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
    {#each paragraphs as paragraph (paragraph)}
      <p class="mt-4 text-lg leading-relaxed text-base-content/80">{paragraph}</p>
    {/each}
  </div>
</section>
