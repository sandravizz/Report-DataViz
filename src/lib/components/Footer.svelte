<!-- Colophon only (2026-09-28): a fine ink rule, FDL's logo and imprint,
     then a small production credit, on the chapter ground — the report simply
     ends. The "Read the full paper" close and its links were removed at
     Sandra's request.

     `disclosure` is an optional snippet for report-specific licensing text,
     kept out of the credit line so it stays visually secondary. -->
<script>
  let { disclosure } = $props();
</script>

<footer class="bg-base-200 font-sans text-base-content">
  <div class="mx-auto max-w-300 px-6 pt-16 pb-8 sm:px-10 md:pt-24">
    <div
      class="flex flex-col gap-4 border-t border-base-content pt-5 md:flex-row md:items-center md:justify-between md:gap-10"
    >
      <img
        src="/fdl-logo-black.svg"
        alt="FDL — Finance for Development Lab"
        class="h-7 w-auto shrink-0 self-start md:self-auto"
      />
      <!-- FDL's own imprint, as findevlab.org's footer gives it. -->
      <p class="text-sm leading-relaxed text-base-content/70 md:text-right">
        © 2026 Finance for Development Lab<br />
        48 boulevard Jourdan, 75014 Paris
      </p>
    </div>

    <!-- Production credit, deliberately the quietest line on the page: small,
         /55 (the lowest step that clears 4.5:1), a hairline underline that
         only turns accent on hover. -->
    <p class="mt-6 text-xs text-base-content/55 md:text-right">
      Web development and data visualization by
      <a
        href="https://sandraviz.com"
        target="_blank"
        rel="noopener"
        class="underline decoration-base-content/30 decoration-1 underline-offset-2 hover:text-accent hover:decoration-accent"
        >Sandra Becker</a
      >
    </p>

    {#if disclosure}
      <div class="mt-6 max-w-2xl text-[10px] leading-relaxed text-base-content/55 md:text-[11px]">
        {@render disclosure()}
      </div>
    {/if}
  </div>
</footer>
