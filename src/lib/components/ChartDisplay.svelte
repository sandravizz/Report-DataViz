<script>
  import BarChartPanelHorizontal from "./charts/BarChartPanelHorizontal.svelte";
  import LineChartPanel from "./charts/LineChartPanel.svelte";
  import GroupedBarChartPanel from "./charts/GroupedBarChartPanel.svelte";
  import StackedAreaChartPanel from "./charts/StackedAreaChartPanel.svelte";
  import StackedColumnChartPanel from "./charts/StackedColumnChartPanel.svelte";
  import DiagramPanel from "./charts/DiagramPanel.svelte";

  let { pairs, activeIndex } = $props();

  let interpretationModal;
</script>

<div class="absolute top-20 left-1/2 w-[88vw] -translate-x-1/2 lg:left-[43%] lg:w-200">
  {#each pairs as pair, i (pair.title)}
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
          class="btn btn-ghost btn-xs gap-1 px-1.5 font-sans font-normal text-base-content/60"
          onclick={() => interpretationModal.showModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5">
            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
          </svg>
          Interpretation
        </button>
      </div>
      <div class="mb-1 font-sans text-base leading-snug font-medium text-base-content lg:mb-2 lg:text-xl lg:leading-normal">
        {pair.title}
      </div>
      <div class="mb-8 font-sans text-xs text-base-content lg:mb-6 lg:text-sm">
        {pair.subtitle}
      </div>

      <div class="flex min-h-0 flex-1 gap-6">
        {#if pair.kind === "bar"}
          <BarChartPanelHorizontal {pair} />
        {:else if pair.kind === "line"}
          <LineChartPanel {pair} />
        {:else if pair.kind === "grouped-bar"}
          <GroupedBarChartPanel {pair} />
        {:else if pair.kind === "stacked-area"}
          <StackedAreaChartPanel {pair} />
        {:else if pair.kind === "stacked-column"}
          <StackedColumnChartPanel {pair} />
        {:else if pair.kind === "diagram"}
          <DiagramPanel {pair} />
        {/if}
      </div>

      <div class="mt-3 font-sans text-xs tracking-wide text-base-content/50 lg:mt-6">
        {pair.source}
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
