<script>
  import BarChartPanelHorizontal from "./charts/BarChartPanelHorizontal.svelte";
  import LineChartPanel from "./charts/LineChartPanel.svelte";
  import ScatterChartPanel from "./charts/ScatterChartPanel.svelte";
  import PieChartPanel from "./charts/PieChartPanel.svelte";
  import DonutChartPanel from "./charts/DonutChartPanel.svelte";
  import GroupedBarChartPanel from "./charts/GroupedBarChartPanel.svelte";
  import StackedBarChartPanel from "./charts/StackedBarChartPanel.svelte";

  let { pairs, activeIndex } = $props();
</script>

<div class="absolute top-10 left-1/2 w-[88vw] -translate-x-1/2 lg:top-20 lg:left-[43%] lg:w-200">
  {#each pairs as pair, i (pair.title)}
    <div
      class="absolute inset-0 transition-opacity duration-500 ease-[ease]"
      style:opacity={i === activeIndex ? 1 : 0}
      style:pointer-events={i === activeIndex ? "auto" : "none"}
    >
      <div class="mb-1 font-sans text-sm tracking-wide text-base-content/50 uppercase lg:hidden">
        {pair.number}
      </div>
      <div class="mb-2 text-xl font-sans font-medium text-base-content">
        {pair.title}
      </div>
      <div class="mb-6 font-sans text-sm text-base-content">
        {pair.subtitle}
      </div>

      <div class="flex h-[52vh] gap-6 lg:h-134">
        {#if pair.kind === "bar"}
          <BarChartPanelHorizontal {pair} />
        {:else if pair.kind === "line"}
          <LineChartPanel {pair} />
        {:else if pair.kind === "scatter"}
          <ScatterChartPanel {pair} />
        {:else if pair.kind === "pie"}
          <PieChartPanel {pair} />
        {:else if pair.kind === "donut"}
          <DonutChartPanel {pair} />
        {:else if pair.kind === "grouped-bar"}
          <GroupedBarChartPanel {pair} />
        {:else if pair.kind === "stacked-bar"}
          <StackedBarChartPanel {pair} />
          <BarChartPanelHorizontal {pair} />
        {/if}
      </div>

      <div class="mt-6 font-sans text-xs text-base-content/50">
        {pair.source}
      </div>
    </div>
  {/each}
</div>
