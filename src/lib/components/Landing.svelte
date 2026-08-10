<!-- The Economic Outlook's own cover page, rebuilt for the screen: the same
     furniture in the same order (issue number top right, the two-line
     headline, the report title, the close date, then authors on the left and
     research group on the right), all in the cover's blue #194abb on the
     cream page, headline and title in Suisse Intl, the small print in Suisse
     Intl Mono.

     The wave is the institute's own cover artwork, lifted from page 1 of the
     PDF, with their "KIEL Institut" wordmark painted out of its bottom-left
     corner — on paper the wordmark is the cover's own signature, but here the
     header already carries the logo and a second one low on the page just
     read as clutter. (Nothing was lost: that corner of the artwork held no
     orange.) Its background is the same cream as base-100, so the strip has
     no visible edge.

     Everything is sized against the viewport's *height* as well as its width
     — `min(Nvw, Nvh)` inside each clamp — because a cover is one screenful by
     definition: on a short laptop the headline has to give way rather than
     push the author line off the bottom. -->
<section
  class="relative flex min-h-screen flex-col overflow-hidden bg-base-100 font-sans text-secondary"
>
  <img
    src="/kiel-cover-wave.png"
    alt=""
    aria-hidden="true"
    class="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] w-full object-cover object-bottom-left select-none sm:h-[27vh]"
  />

  <!-- Bottom padding matches the artwork's height, so `mt-auto` lands the
       author line just above the wave the way it does on the cover, rather
       than at the foot of the viewport underneath it. -->
  <div
    class="relative z-10 flex flex-1 flex-col px-[4%] pt-[clamp(7rem,16vh,11rem)] pb-[24vh] sm:pb-[29vh]"
  >
    <div class="flex items-start justify-between gap-6">
      <h1
        class="text-[clamp(2.5rem,min(8vw,12vh),7rem)] leading-[0.94] font-medium tracking-[-0.02em]"
      >
        Economic<br />Outlook
      </h1>
      <div class="shrink-0 pt-2 font-mono text-xs whitespace-nowrap sm:text-sm">
        Nr. 133, 2026 | Q2
      </div>
    </div>

    <p
      class="mt-[2.5vh] text-[clamp(1.25rem,min(3.6vw,5.2vh),3rem)] leading-[1.1] font-medium tracking-[-0.02em]"
    >
      World Economy in Summer 2026
    </p>

    <p class="mt-[4vh] text-base font-medium sm:text-lg">Finalized June 10, 2026</p>

    <div
      class="mt-auto flex flex-col gap-3 pt-[4vh] font-mono text-xs sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:text-sm"
    >
      <p class="max-w-md leading-relaxed">
        Klaus-Jürgen Gern, Stefan Kooths, Johanna Krohn, Wan-Hsin Liu und Jan Reents
      </p>
      <p class="leading-relaxed sm:text-right">
        Research Group<br />Business Cycles and Growth
      </p>
    </div>

    <p class="pt-4 font-mono text-xs text-secondary/70">
      Demo created by
      <a
        href="https://www.sandraviz.com/"
        target="_blank"
        rel="noopener"
        class="underline underline-offset-4">sandraviz.com</a
      >
    </p>
  </div>
</section>
