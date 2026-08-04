<!-- A full-screen text pause between two figure runs, in the DEMO's own voice
     rather than the report's. It exists because a chapter can show the same
     figure twice (finished, then rebuilt step by step) and nothing else on
     screen says so: same title, same subtitle, same description column, only
     the figure number differs. Without this the second run reads as a new,
     emptier chart.
     Deliberately unlike a chapter: tinted surface (base-200, the footer's
     fill), narrower centred column, muted kicker instead of the chapters'
     primary one — so it is legible as commentary, not as IW's report text. -->
<script>
  let { kicker, title, paragraphs = [] } = $props();
</script>

<section
  class="flex min-h-screen items-center bg-base-200 font-sans text-base-content"
>
  <div class="mx-auto w-[88vw] max-w-3xl py-24">
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
