<script>
  import ChartPanel from "./charts/ChartPanel.svelte";
  import DoubleChartPanel from "./charts/DoubleChartPanel.svelte";

  let { pairs, activeIndex, inView = true } = $props();

  let interpretationModal;

  const figureFiles = {
    "Abbildung 2-1": "Abbildung2-1.png",
  };

  function figureImage(pair) {
    return `/figures/${figureFiles[pair.number]}`;
  }

  function downloadName(pair) {
    const slug = `${pair.number} ${pair.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${slug}.png`;
  }
</script>

<div class="absolute top-20 left-1/2 w-[88vw] -translate-x-1/2 lg:left-[43%] lg:w-200">
  <!-- Keyed by index: the bar/area comparison pair of Figure 1 shares one
       title, so titles are no longer unique. -->
  {#each pairs as pair, i (i)}
    <div
      class="absolute inset-x-0 top-0 flex h-[calc(100dvh-6rem)] flex-col transition-opacity duration-500 ease-[ease] lg:h-[calc(100svh-8rem)]"
      style:opacity={i === activeIndex ? 1 : 0}
      style:pointer-events={i === activeIndex ? "auto" : "none"}
    >
      <div class="mb-1 flex items-center justify-between lg:hidden">
        <span class="font-sans text-xs tracking-wide text-base-content/50 uppercase">
          {pair.number}
        </span>
        <button
          class="btn btn-ghost btn-xs gap-1 px-1.5 font-sans text-xs font-normal tracking-wide text-base-content/50 normal-case"
          onclick={() => interpretationModal.showModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5">
            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
          </svg>
          Interpretation
        </button>
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

      <div
        class="mt-3 flex flex-nowrap items-center justify-between gap-2 font-sans text-xs tracking-wide text-base-content/50 lg:mt-6"
      >
        <span>{pair.source}</span>
        <a
          class="btn btn-ghost btn-xs shrink-0 gap-1 px-1.5 font-sans text-xs font-normal tracking-wide text-base-content/50 normal-case"
          href={figureImage(pair)}
          download={downloadName(pair)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5">
            <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          PNG
        </a>
      </div>
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
