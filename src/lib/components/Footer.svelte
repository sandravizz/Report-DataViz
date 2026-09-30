<!-- Colophon only: FDL's imprint and a small production credit, on the
     chapter ground — the report simply ends.

     LAYOUT "D, bottom bar" (picked 2026-09-29 from five endings): one slim
     row across the full width on the HEADER's 24px margins (px-6), so the
     page closes on the same frame it opens on — imprint left, credit right,
     under a faint full-width hairline. NO LOGO: the fixed header already
     shows it right above, and a second one read as the logo twice. The
     space above is the last text block's own bottom padding (py-28 at lg).
     Below md the two lines stack, left-aligned.

     `disclosure` is an optional snippet for report-specific licensing text,
     kept out of the credit line so it stays visually secondary. -->
<script>
  let { disclosure } = $props();
</script>

<!-- No hairline (2026-09-30): the ending screen's engraved band runs right
     down to the footer, and a rule under the image read as a line cutting
     it off. -->
<footer class="bg-base-200 font-sans text-base-content">
  <div
    class="flex flex-col gap-1.5 px-6 pt-4.5 pb-5.5 md:flex-row md:items-baseline md:justify-between md:gap-6"
  >
    <!-- FDL's own imprint, as findevlab.org's footer gives it. -->
    <p class="text-[0.8125rem] leading-relaxed text-base-content/70">
      © 2026 Finance for Development Lab<span class="mx-1.5 text-base-content/55">·</span>48
      boulevard Jourdan, 75014 Paris
    </p>

    <!-- Production credit, deliberately the quietest line on the page: small,
         /55 (the lowest step that clears 4.5:1), a hairline underline that
         only turns accent on hover. -->
    <p class="text-xs text-base-content/55">
      Web development and data visualization by
      <a
        href="https://sandraviz.com"
        target="_blank"
        rel="noopener"
        class="underline decoration-base-content/30 decoration-1 underline-offset-2 hover:text-accent hover:decoration-accent"
        >Sandra Becker</a
      >
    </p>
  </div>

  {#if disclosure}
    <div class="px-6 pb-6 text-[10px] leading-relaxed text-base-content/55 md:text-[11px]">
      {@render disclosure()}
    </div>
  {/if}
</footer>
