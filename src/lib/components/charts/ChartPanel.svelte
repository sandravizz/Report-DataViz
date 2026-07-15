<script>
  // Kind → panel dispatch, extracted from ChartDisplay so composite figures
  // (DoubleChartPanel) can render sub-panels without duplicating the chain.
  import BarChartPanelHorizontal from "./BarChartPanelHorizontal.svelte";
  import BarChartPanelStacked from "./BarChartPanelStacked.svelte";
  import LineChartPanel from "./LineChartPanel.svelte";
  import AreaChartPanel from "./AreaChartPanel.svelte";
  import AreaChartPanelStacked from "./AreaChartPanelStacked.svelte";

  let { pair } = $props();
</script>

{#if pair.kind === "bar"}
  <BarChartPanelHorizontal {pair} />
{:else if pair.kind === "bar-stacked"}
  <BarChartPanelStacked {pair} />
{:else if pair.kind === "line"}
  <LineChartPanel {pair} />
{:else if pair.kind === "area"}
  <AreaChartPanel {pair} />
{:else if pair.kind === "area-stacked"}
  <AreaChartPanelStacked {pair} />
{/if}
