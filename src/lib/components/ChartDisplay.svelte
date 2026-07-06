<script>
  import BarChartPanelHorizontal from "./charts/BarChartPanelHorizontal.svelte";
  import LineChartPanel from "./charts/LineChartPanel.svelte";
  import GroupedBarChartPanel from "./charts/GroupedBarChartPanel.svelte";
  import StackedAreaChartPanel from "./charts/StackedAreaChartPanel.svelte";
  import StackedColumnChartPanel from "./charts/StackedColumnChartPanel.svelte";
  import DiagramPanel from "./charts/DiagramPanel.svelte";

  let { pairs, activeIndex } = $props();
</script>

<div class="absolute top-20 left-1/2 w-[88vw] -translate-x-1/2 lg:left-[43%] lg:w-200">
  {#each pairs as pair, i (pair.title)}
    <div
      class="absolute inset-x-0 top-0 flex h-[calc(100dvh-6rem)] flex-col transition-opacity duration-500 ease-[ease] lg:h-[calc(100svh-8rem)]"
      style:opacity={i === activeIndex ? 1 : 0}
      style:pointer-events={i === activeIndex ? "auto" : "none"}
    >
      <div class="mb-1 font-sans text-xs tracking-wide text-base-content/50 uppercase lg:hidden">
        {pair.number}
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
</div>
