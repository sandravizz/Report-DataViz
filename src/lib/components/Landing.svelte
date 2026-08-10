<script>
  // Anchor the chevron scrolls to — the first chapter, passed in from
  // +page.svelte so the cover never hardcodes a section id.
  let { nextId } = $props();
</script>

<!-- The Economic Outlook's cover, rebuilt for the screen as two columns: the
     whole text block set left, ranged flush in one column (issue number,
     two-line headline, report title, close date, authors, research group),
     and the institute's own cover artwork as a rectangle on the right. All of
     it in the cover's blue #194abb on the cream page — headline and title in
     Suisse Intl, the small print in Suisse Intl Mono.

     The artwork comes from page 1 of the PDF with their "KIEL Institut"
     wordmark painted out of its bottom-left corner: the header already
     carries the logo, and a second one read as clutter. Nothing was lost —
     that corner held no orange. Its background is the same cream as
     base-100, so the panel has no visible edge.

     The chevron is the same scroll cue the other report branches use, in the
     brand orange rather than the cover's blue: it is the one thing here that
     invites an action rather than asking to be read, and against a page of
     blue the orange is what makes it register. The text block sits low,
     justified to the bottom of its row, so the cue reads as the end of the
     cover rather than as something floating below it. -->

<section
  class="relative flex min-h-screen flex-col overflow-hidden bg-base-100 font-sans text-secondary"
>
  <div
    class="mx-auto flex w-full max-w-350 flex-1 flex-col justify-end gap-10 px-[4%] pt-28 pb-6 md:flex-row md:items-center md:gap-14 md:pt-24 md:pb-8"
  >
    <!-- Text column. Sizes clamp against viewport *height* as well as width
         (`min(Nvw, Nvh)`): a cover is one screenful by definition, so on a
         short laptop the headline gives way instead of pushing the block off
         the bottom. -->
    <div class="md:w-[54%] md:shrink-0">
      <p class="font-mono text-xs sm:text-sm">Nr. 133, 2026 | Q2</p>

      <h1
        class="mt-[3vh] text-[clamp(2.5rem,min(7vw,11vh),6rem)] leading-[0.94] font-medium tracking-[-0.02em]"
      >
        Economic<br />Outlook
      </h1>

      <p
        class="mt-[2.5vh] text-[clamp(1.2rem,min(3.1vw,4.6vh),2.5rem)] leading-[1.1] font-medium tracking-[-0.02em]"
      >
        World Economy in Summer 2026
      </p>

      <p class="mt-[3.5vh] text-base font-medium sm:text-lg">Finalized June 10, 2026</p>

      <div class="mt-[3.5vh] space-y-2 font-mono text-xs sm:text-sm">
        <p class="leading-relaxed">
          Klaus-Jürgen Gern, Stefan Kooths, Johanna Krohn, Wan-Hsin Liu und Jan Reents
        </p>
        <p class="leading-relaxed">Research Group Business Cycles and Growth</p>
      </div>

      <p class="mt-[3vh] font-mono text-xs text-secondary/70">
        Demo created by
        <a
          href="https://www.sandraviz.com/"
          target="_blank"
          rel="noopener"
          class="underline underline-offset-4">sandraviz.com</a
        >
      </p>
    </div>

    <!-- Artwork column. `object-cover` on a fixed-aspect panel so the wave
         keeps its own scale and crops rather than stretching; on phones it
         becomes a short band under the text. -->
    <div class="md:min-w-0 md:flex-1">
      <img
        src="/kiel-cover-wave.png"
        alt=""
        aria-hidden="true"
        class="pointer-events-none h-[22vh] w-full object-cover object-center select-none md:h-[62vh]"
      />
    </div>
  </div>

  <a
    href="#{nextId}"
    aria-label="Scroll to content"
    class="mx-auto mb-5 text-primary hover:text-primary/70 sm:mb-8"
  >
    <svg
      class="h-9 w-9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="m5 9 7 7 7-7" />
    </svg>
  </a>
</section>
