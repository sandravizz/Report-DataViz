<!-- A text pause between two figure runs, in the DEMO's voice rather than
     the report's: a chapter can show the same figure twice (finished, then
     rebuilt step by step) and nothing else on screen says so.
     Same centred column, type ramp and tinted surface as a chapter — a second
     geometry mid-report reads as a glitch — with only the muted kicker
     (chapters' is primary) marking it as commentary.

     And the same HEIGHT rule as a chapter, which is the whole layout in one
     line: TEXT IS AS TALL AS ITS TEXT, FIGURES ARE ONE SCREEN AND STICKY.
     So no min-h-screen and no vertical centring here — those would pad this
     block out to a viewport it does not need and make it behave like a
     figure. It is the scrolling connective tissue between two pinned runs;
     the reader scrolls through it once and it is gone. -->
<script>
  // `id` makes this an anchor the ChapterRail can jump to — it opens the second
  // figure run, so the reader lands on the explanation, not mid-animation.
  let { id = undefined, kicker, title, paragraphs = [] } = $props();
</script>

<!-- The fade to the white figure surface at either end is painted on this
     block's own background rather than as spacer divs around it, so a long
     ramp costs no height — same technique and same 35%/65% stops as a chapter
     in +page.svelte. -->
<section
  {id}
  class="bg-base-200 font-sans text-base-content"
  style="background-image:linear-gradient(to bottom,#ffffff 0%,var(--color-base-200) 35%,var(--color-base-200) 65%,#ffffff 100%)"
>
  <!-- max-w-200 caps the reading column at the same 800px the desktop
       layout uses. Without it the column is 88vw the whole way up to the
       1400px breakpoint, so a 1399px window sets 18px type across 1231px
       — about 130 characters a line, against the 55–75 that is comfortable
       to read. The cap bites from ~909px upward; below that 88vw still
       governs, so the phone column is exactly as it was. -->
  <div class="mx-auto w-[88vw] max-w-200 py-16 lg:w-200 lg:py-28">
    {#if kicker}
      <p class="mb-3 text-xs font-medium tracking-wide text-base-content/70 uppercase">
        {kicker}
      </p>
    {/if}
    <h2 class="font-display text-3xl font-bold sm:text-4xl lg:text-5xl lg:leading-[1.08]">
      {title}
    </h2>
    <!-- Same rhythm as a chapter: a wide gap under the heading, a tighter one
         between paragraphs. No accent mark here — the underline is reserved
         for the report's own findings, and this block is the demo talking. -->
    {#each paragraphs as paragraph, i (i)}
      <p
        class="text-lg leading-relaxed text-base-content lg:text-xl {i === 0
          ? 'mt-8 lg:mt-10'
          : 'mt-4'}"
      >
        {paragraph}
      </p>
    {/each}
  </div>
</section>
