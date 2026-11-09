<script>
  // Kind → panel dispatch, extracted from ChartDisplay so composite figures
  // (DoubleChartPanel) can render sub-panels without duplicating the chain.
  import BarChartPanelStacked from "./BarChartPanelStacked.svelte";
  import BarChartPanelGroupedStacked from "./BarChartPanelGroupedStacked.svelte";
  import AreaChartPanelStacked from "./AreaChartPanelStacked.svelte";
  import RangeChartPanel from "./RangeChartPanel.svelte";
  import ChoroplethPanel from "./ChoroplethPanel.svelte";
  import MetroPanel from "./MetroPanel.svelte";

  let { pair } = $props();
</script>

{#if pair.kind === "bar-stacked"}
  <BarChartPanelStacked {pair} />
{:else if pair.kind === "bar-grouped-stacked"}
  <BarChartPanelGroupedStacked {pair} />
{:else if pair.kind === "area-stacked"}
  <AreaChartPanelStacked {pair} />
{:else if pair.kind === "range"}
  <RangeChartPanel {pair} />
{:else if pair.kind === "choropleth"}
  <ChoroplethPanel {pair} />
{:else if pair.kind === "metro"}
  <MetroPanel {pair} />
{/if}
