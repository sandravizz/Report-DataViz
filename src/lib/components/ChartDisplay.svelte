<script>
  import ChartPanel from "./charts/ChartPanel.svelte";
  import DoubleChartPanel from "./charts/DoubleChartPanel.svelte";
  import FigureFooter from "./FigureFooter.svelte";

  let { pairs, activeIndex, inView = true } = $props();

  let interpretationModal;
  // One ref per pair, bound below — FigureFooter's download button walks
  // this element's LayerChart chart(s) to build the exported PNG.
  let figureRefs = $state([]);

  // Multi-step figures ("Figure 13a/13b/13c") show the shared prefix only —
  // "Figure 13" — since the progress rail already carries "how far along".
  // A one-pair group has nothing to strip and keeps its full number.
  function commonPrefixLength(strings) {
    if (strings.length < 2) return 0;
    let len = strings[0].length;
    for (const s of strings.slice(1)) {
      let i = 0;
      while (i < len && i < s.length && s[i] === strings[0][i]) i++;
      len = i;
    }
    return len;
  }
  let tabPrefixLength = $derived(commonPrefixLength(pairs.map((p) => p.number)));
  let tabPrefix = $derived(pairs[0]?.number.slice(0, tabPrefixLength).trim() ?? "");
  let headerLabel = $derived(pairs.length > 1 ? tabPrefix : (pairs[0]?.number ?? ""));
  // One step's worth of fill per chart, not raw scroll fraction: 1 of 3 fills
  // to 33%, 2 to 66%, and the last sits at a flat 100% rather than only
  // getting there on the final pixel of the pinned scroll range.
  let stepProgress = $derived((activeIndex + 1) / pairs.length);
</script>

<div class="absolute top-10 left-1/2 w-[88vw] -translate-x-1/2 lg:top-12 lg:left-[43%] lg:w-200">
  <!-- Keyed by index, not title — comparison pairs share one title. -->
  {#each pairs as pair, i (i)}
    <div
      class="absolute inset-x-0 top-0 flex h-[calc(100dvh-4rem)] flex-col transition-opacity duration-500 ease-[ease] lg:h-[calc(100svh-6rem)]"
      style:opacity={i === activeIndex ? 1 : 0}
      style:pointer-events={i === activeIndex ? "auto" : "none"}
      bind:this={figureRefs[i]}
    >
      <!-- mb-2 rather than mb-1 below lg: the Interpretation button is a 24px
           circle, taller than the eyebrow text it shares the row with, so at
           4px its bottom edge nearly touched the progress rail underneath.
           Only the mobile value moves — lg:mb-3 already had the room, and the
           button is hidden at that breakpoint anyway. -->
      <div class="mb-2 flex items-center justify-between gap-1 lg:mb-3">
        <span class="min-w-0 flex-1 truncate font-sans text-xs tracking-wide text-base-content/50 uppercase">
          {headerLabel}
        </span>
        <!-- Same device as FigureFooter's PNG button — accent wash at rest,
             full accent on hover, glyph one step stronger than the label — so
             the report has exactly one way of saying "this is a control". It
             matters more here than on PNG: this is the only route to the
             interpretation text below lg, and as flat grey caption text it did
             not read as pressable at all. Glyph only, in a 24px circle: any
             label at all — "Interpretation", "The read" — crowded the FIGURE
             eyebrow it shares the line with on a 330px phone, and the accent
             pill now carries the "this is pressable" signal on its own, so the
             words were doing less work than the room they took. 24px is the
             floor, not a target: it is already under the 44px touch guidance,
             so do not shrink it further. aria-label carries the name for
             screen readers. See docs/figure-footer-controls.md. -->
        <button
          class="btn btn-circle btn-ghost btn-xs shrink-0 bg-accent/25! text-base-content/75 hover:border-transparent! hover:bg-accent! hover:text-base-content hover:shadow-lg! lg:hidden"
          aria-label="Interpretation"
          onclick={() => interpretationModal.showModal()}
        >
          <!-- Heroicons bars-3-bottom-left, the 24px STROKE set — not the 20px
               solid set the rest of the report's glyphs come from. A filled
               disc reads as a stamp from an older generation of UI; at 1.5px
               the glyph sits at caption weight rather than shouting over the
               eyebrow. Three stacked rules are also the only glyph that says
               "there is writing behind this", which is what the button opens —
               an info circle would say "meta-information about the page". -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5 text-base-content"
          >
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </button>
      </div>

      <!-- Reading-progress rail above the title, on every figure (a
           single-chart one is just a flat 100%) and every breakpoint —
           unlike the chapter rail, which is desktop-only. -->
      <div class="mb-3 h-px w-full shrink-0 overflow-hidden rounded-full bg-base-content/10 lg:mb-4">
        <div
          class="h-full rounded-full bg-base-content/50 transition-[width] duration-300 ease-out"
          style:width="{stepProgress * 100}%"
        ></div>
      </div>

      <div class="mb-1 font-sans text-base leading-snug font-medium text-base-content lg:mb-2 lg:text-xl lg:leading-normal">
        {pair.title}
      </div>
      <div class="mb-10 font-sans text-xs text-base-content lg:mb-20 lg:text-sm">
        {pair.subtitle}
      </div>

      <div class="flex min-h-0 flex-1 gap-6">
        {#if pair.kind === "double"}
          <DoubleChartPanel {pair} />
        {:else}
          <!-- `active` gates the line chart draw-in animation (see
               docs/scrolly-line-draw-in.md). -->
          <ChartPanel {pair} active={i === activeIndex && inView} />
        {/if}
      </div>

      <FigureFooter {pair} figureEl={figureRefs[i]} number={headerLabel} progress={stepProgress} />
    </div>
  {/each}

  <dialog bind:this={interpretationModal} class="modal lg:hidden">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
      </form>
      <div class="mb-1 font-sans text-xs tracking-wide text-base-content/50 uppercase">
        {pairs[activeIndex].number}
      </div>
      <div class="mb-3 pr-6 font-sans text-base leading-snug font-medium text-base-content">
        {pairs[activeIndex].title}
      </div>
      <!-- HTML for the same reason as DescriptionColumn: the description may
           carry a `mark.accent-mark`. Authored copy from $lib/data/figures. -->
      <p class="font-sans text-sm leading-relaxed text-base-content">
        {@html pairs[activeIndex].description}
      </p>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</div>
