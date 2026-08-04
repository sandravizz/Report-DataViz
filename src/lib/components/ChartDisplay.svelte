<script>
  import ChartPanel from "./charts/ChartPanel.svelte";
  import DoubleChartPanel from "./charts/DoubleChartPanel.svelte";
  import FigureFooter from "./FigureFooter.svelte";

  let { pairs, activeIndex, inView = true } = $props();

  let interpretationModal;
  // One ref per pair, bound below — FigureFooter's download button walks
  // this element's LayerChart chart(s) to build the exported PNG.
  let figureRefs = $state([]);

  // Multi-step figures (here "Abbildung 2-1" plus its three animated steps)
  // show the shared prefix only — "Abbildung 2-1" — instead of cycling the
  // per-step suffix; the progress rail below the header carries the "how far
  // along" signal instead. A one-pair group has nothing to strip, so it falls
  // back to the full number.
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
  // One step's worth of fill per chart, not raw scroll fraction: chart 1 of 4
  // lands the rail at 25%, chart 2 at 50%, the last chart always at a flat
  // 100% (rather than only reaching 100% at the very last pixel of the
  // pinned scroll range).
  let stepProgress = $derived((activeIndex + 1) / pairs.length);
</script>

<div class="absolute top-10 left-1/2 w-[88vw] -translate-x-1/2 lg:top-12 lg:left-[43%] lg:w-200">
  <!-- Keyed by index, not by number or title: the animated steps of
       Abbildung 2-1 deliberately share both. -->
  {#each pairs as pair, i (i)}
    <div
      class="absolute inset-x-0 top-0 flex h-[calc(100dvh-4rem)] flex-col transition-opacity duration-500 ease-[ease] lg:h-[calc(100svh-6rem)]"
      style:opacity={i === activeIndex ? 1 : 0}
      style:pointer-events={i === activeIndex ? "auto" : "none"}
      bind:this={figureRefs[i]}
    >
      <div class="mb-1 flex items-center justify-between gap-1 lg:mb-3">
        <span class="min-w-0 flex-1 truncate font-sans text-xs tracking-wide text-base-content/50 uppercase">
          {headerLabel}
        </span>
        <button
          class="btn btn-ghost btn-xs shrink-0 gap-1 px-1.5 font-sans text-xs font-normal tracking-wide text-base-content/50 normal-case lg:hidden"
          onclick={() => interpretationModal.showModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5">
            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
          </svg>
          Interpretation
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

      <div class="font-display mb-1 text-base leading-snug font-bold text-base-content lg:mb-2 lg:text-xl lg:leading-normal">
        {pair.title}
      </div>
      <div class="mb-6 font-sans text-xs text-base-content lg:mb-12 lg:text-sm">
        {pair.subtitle}
      </div>

      <div class="flex min-h-0 flex-1 gap-6">
        {#if pair.kind === "double"}
          <DoubleChartPanel {pair} />
        {:else}
          <!-- `active` tells the panel it is the current scrolly step (and
               the section is actually on screen) — line charts use it to
               trigger the draw-in animation of series flagged `drawIn`. -->
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
      <p class="font-sans text-sm leading-relaxed text-base-content">
        {pairs[activeIndex].description}
      </p>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</div>
