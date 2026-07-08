<script>
  import BarChartPanelHorizontal from "./charts/BarChartPanelHorizontal.svelte";
  import LineChartPanel from "./charts/LineChartPanel.svelte";
  import GroupedBarChartPanel from "./charts/GroupedBarChartPanel.svelte";
  import StackedAreaChartPanel from "./charts/StackedAreaChartPanel.svelte";
  import StackedColumnChartPanel from "./charts/StackedColumnChartPanel.svelte";
  import StackedBarChartPanelHorizontal from "./charts/StackedBarChartPanelHorizontal.svelte";
  import DiagramPanel from "./charts/DiagramPanel.svelte";

  let { pair } = $props();
</script>

<!--
  Mounted imperatively into a standalone DOM node outside the scrollytelling
  layout (see ChartDisplay's printPair) purely for window.print(). The report
  page relies on sticky/fixed/absolute positioning to drive the scroll
  animation, which prints very badly (collapsed sticky containers produce
  dozens of blank pages). Reusing the same chart panel components here, laid
  out in plain document flow, sidesteps that entirely instead of fighting it.
-->
<div class="mx-auto flex h-[7.2in] w-[10in] flex-col p-8 font-sans text-base-content">
  <div class="mb-1 text-xs tracking-wide text-base-content/50 uppercase">
    {pair.number}
  </div>
  <div class="mb-2 text-xl leading-normal font-medium text-base-content">
    {pair.title}
  </div>
  <div class="mb-6 text-sm text-base-content">
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
    {:else if pair.kind === "stacked-bar"}
      <StackedBarChartPanelHorizontal {pair} />
    {:else if pair.kind === "diagram"}
      <DiagramPanel {pair} />
    {/if}
  </div>

  <div class="mt-6 text-xs tracking-wide text-base-content/50">
    {pair.source}
  </div>
</div>
