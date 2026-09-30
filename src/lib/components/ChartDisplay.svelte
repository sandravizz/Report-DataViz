<script>
  import ChartPanel from "./charts/ChartPanel.svelte";
  import DoubleChartPanel from "./charts/DoubleChartPanel.svelte";
  import FigureFooter from "./FigureFooter.svelte";

  let { pairs, activeIndex, inView = true } = $props();

  let interpretationModal;
  // One ref per pair, bound below — FigureFooter's download button walks
  // this element's LayerChart chart(s) to build the exported PNG.
  let figureRefs = $state([]);

  // Each figure shows its OWN number. Figures are numbered 1, 2, 3… in
  // reading order by +page.svelte. (This used to show only the prefix the
  // group's numbers shared — meant for "Figure 13a/13b" → "Figure 13" — which
  // for "Figure 1" + "Figure 2" left a bare "Figure" with no number.)
  // One step's worth of fill per chart, not raw scroll fraction: chart 1 of 3
  // lands the rail at 33%, chart 2 at 66%, the last chart always at a flat
  // 100% (rather than only reaching 100% at the very last pixel of the
  // pinned scroll range).
  let stepProgress = $derived((activeIndex + 1) / pairs.length);
</script>

<!-- Below lg the header is a fixed 56px bar: 3.5rem + 1rem air =
     top-[4.5rem] (was top-10 with no bar), height 100dvh-6rem so the 1.5rem
     under the figure is unchanged.
     lg: the header is FIXED there as a 72px bar (Header.svelte), so the
     figure starts below it: 4.5rem bar + 1.5rem air = top-24. The height
     gives up the same (6rem → 9rem) so the 3rem margin under the figure is
     unchanged.
     lg: CENTRED at --fig-w, with the chapter rail and the description column
     as equal side columns — see the symmetric layout variables in
     styles/tailwind.css. (Was left-[43%] w-200, off-centre.)
     Centred with inset-x-0 + mx-auto, NOT left-1/2 -translate-x-1/2: the
     translate moved the box by half its width, which at an odd pixel width
     is a half pixel — every label, title and source line in the figure then
     rendered between pixels and looked soft. Auto margins stay on whole
     pixels. -->
<div class="absolute inset-x-0 top-[4.5rem] mx-auto w-[88vw] lg:top-24 lg:w-(--fig-w)">
  <!-- Keyed by index: the bar/area comparison pair of Figure 1 shares one
       title, so titles are no longer unique. -->
  {#each pairs as pair, i (i)}
    <div
      class="absolute inset-x-0 top-0 flex h-[calc(100dvh-6rem)] flex-col transition-opacity duration-500 ease-[ease] lg:h-[calc(100svh-9rem)]"
      style:opacity={i === activeIndex ? 1 : 0}
      style:pointer-events={i === activeIndex ? "auto" : "none"}
      bind:this={figureRefs[i]}
    >
      <!-- mb-2 rather than mb-1 below lg: the Interpretation button (24px)
           is taller than the eyebrow text it shares
           the row with, so at 4px its bottom edge nearly touched the progress
           rail underneath.
           Only the mobile value moves — lg:mb-3 already had the room, and the
           button is hidden at that breakpoint anyway. -->
      <div class="mb-2 flex items-center justify-between gap-1 lg:mb-3">
        <!-- TABLET TYPE TIER. Everything in this figure stack jumped straight
             from the phone size to `lg:` — which is 1400px, not Tailwind's
             1024 — so the whole 768-1400 band rendered phone-sized type beside
             a tablet-sized chart: an 11px source line and a 12px subtitle under
             a 1000px-wide plot on an iPad. The md: steps below are TYPE ONLY;
             the scrolly mechanism (chart position, description column, the
             Interpretation button's lg:hidden) is untouched and stays on lg. -->
        <span class="min-w-0 flex-1 truncate font-sans text-xs tracking-wide text-base-content/55 uppercase md:text-sm">
          {pair.number}
        </span>
        <!-- THE INDEX BUTTON'S FILL (2026-09-30): same ink-6% soft fill,
             6px corners and hover/tap steps as Header.svelte's Index
             trigger, at 24px — the phone-size PNG button's height, so the
             figure's two controls match and neither shouts — holding the three-lines glyph (no word — keep the
             glyph). The report's buttons speak two words only:
             OUTLINE = download (PNG, Full report), SOFT FILL = opens
             something (Index, this).
             Phone/tablet only (lg:hidden): at lg the interpretation is the
             description column beside the figure. aria-label keeps the full
             name for screen readers. -->
        <button
          type="button"
          class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md bg-base-content/6 text-base-content transition-colors duration-200 hover:bg-base-content/10 active:bg-base-content/16 lg:hidden"
          aria-label="Interpretation"
          onclick={() => interpretationModal.showModal()}
        >
          <!-- Heroicons bars-3-bottom-left (24px stroke set): three stacked
               rules say "there is writing behind this", which is what the
               button opens. -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5"
          >
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </button>
      </div>

      <!-- Always-present reading-progress rail, not gated to multi-step
           figures — a single-chart figure is just a flat 100%. Sits above
           the title (McKinsey-style). Shown at every breakpoint, unlike the
           chapter rail (desktop-only). -->
      <div class="mb-3 h-px w-full shrink-0 overflow-hidden rounded-full bg-base-content/10 lg:mb-4">
        <div
          class="h-full rounded-full bg-base-content/50 transition-[width] duration-300 ease-out"
          style:width="{stepProgress * 100}%"
        ></div>
      </div>

      <div class="mb-1 font-sans text-base leading-snug font-medium text-base-content md:text-lg lg:mb-2 lg:text-xl lg:leading-normal">
        {pair.title}
      </div>
      <!-- The double figure pulls its half-height plots closer to the
           subtitles so each plot gets the reclaimed height; single figures
           keep the roomier gap. The double gap still fits its two-line band
           label, which overhangs the plot top by ~26px. -->
      <div
        class="{pair.kind === 'double'
          ? 'mb-7 lg:mb-8'
          : 'mb-10 lg:mb-12'} font-sans text-xs text-base-content md:text-sm lg:text-sm"
      >
        {pair.subtitle}
      </div>

      <div class="flex min-h-0 flex-1 gap-6">
        {#if pair.kind === "double"}
          <DoubleChartPanel {pair} />
        {:else}
          <!-- `active` tells the panel it is the current scrolly step (and
               the section is on screen), so draw-in animations start when
               the reader actually reaches it. -->
          <ChartPanel {pair} active={i === activeIndex && inView} />
        {/if}
      </div>

      <FigureFooter {pair} figureEl={figureRefs[i]} number={pair.number} progress={stepProgress} />
    </div>
  {/each}

  <dialog bind:this={interpretationModal} class="modal lg:hidden">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
      </form>
      <div class="mb-1 font-sans text-xs tracking-wide text-base-content/55 uppercase md:text-sm">
        {pairs[activeIndex].number}
      </div>
      <div class="mb-3 pr-6 font-sans text-base leading-snug font-medium text-base-content md:text-lg">
        {pairs[activeIndex].title}
      </div>
      <p class="font-sans text-sm leading-relaxed text-base-content md:text-base">
        <!-- HTML for the same reason as DescriptionColumn: the description may
             carry a `mark.accent-mark`. Authored copy from $lib/data/figures. -->
        {@html pairs[activeIndex].description}
      </p>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</div>
