<!-- The Economic Outlook's own cover page, rebuilt for the screen: the same
     furniture in the same order (issue number top right, the two-line
     headline, the report title, the close date, then authors on the left and
     research group on the right), all in the cover's blue #194abb on the
     cream page, headline and title in Suisse Intl, the small print in Suisse
     Intl Mono.

     The wave is the institute's own cover artwork, lifted from page 1 of the
     PDF — the "KIEL Institut" wordmark is part of that image, bottom left,
     exactly as it is on the cover. On paper it occupies the bottom half of a
     portrait A4; a landscape browser window cannot hold those proportions, so
     it is anchored to the bottom edge, full width, and cropped from the top,
     which keeps both its dense lower half and the wordmark. -->
<section
  class="relative flex min-h-screen flex-col overflow-hidden bg-base-100 font-sans text-secondary"
>
  <img
    src="/kiel-cover-wave.png"
    alt=""
    aria-hidden="true"
    class="pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] w-full object-cover object-bottom-left select-none sm:h-[46vh]"
  />

  <!-- The bottom padding is the artwork's own height, so `mt-auto` lands the
       author line just above the wave the way it does on the cover, rather
       than at the foot of the viewport underneath it. -->
  <div
    class="relative z-10 flex flex-1 flex-col px-[4%] pt-24 pb-[38vh] sm:pt-28 sm:pb-[46vh]"
  >
    <div class="flex items-start justify-between gap-6">
      <h1
        class="text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.94] font-medium tracking-[-0.02em]"
      >
        Economic<br />Outlook
      </h1>
      <div class="shrink-0 pt-2 font-mono text-xs whitespace-nowrap sm:text-sm">
        Nr. 133, 2026 | Q2
      </div>
    </div>

    <p
      class="mt-[3vh] text-[clamp(1.35rem,3.9vw,3.4rem)] leading-[1.1] font-medium tracking-[-0.02em]"
    >
      World Economy in Summer 2026
    </p>

    <p class="mt-[6vh] text-base font-medium sm:text-xl">Finalized June 10, 2026</p>

    <div
      class="mt-auto flex flex-col gap-4 pt-[6vh] font-mono text-xs sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:text-sm"
    >
      <p class="max-w-md leading-relaxed">
        Klaus-Jürgen Gern, Stefan Kooths, Johanna Krohn, Wan-Hsin Liu und Jan Reents
      </p>
      <p class="leading-relaxed sm:text-right">
        Research Group<br />Business Cycles and Growth
      </p>
    </div>

    <p class="pt-6 font-mono text-xs text-secondary/70">
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
