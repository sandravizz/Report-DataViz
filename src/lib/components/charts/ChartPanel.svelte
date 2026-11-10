<script>
  // Kind → panel dispatch, extracted from ChartDisplay so composite figures
  // (DoubleChartPanel) can render sub-panels without duplicating the chain.
  import BarChartPanelStacked from "./BarChartPanelStacked.svelte";
  import BarChartPanelGroupedStacked from "./BarChartPanelGroupedStacked.svelte";
  import AreaChartPanelStacked from "./AreaChartPanelStacked.svelte";
  import RangeChartPanel from "./RangeChartPanel.svelte";
  import ChoroplethPanel from "./ChoroplethPanel.svelte";
  import MetroPanel from "./MetroPanel.svelte";
  import LineMultiplesPanel from "./LineMultiplesPanel.svelte";
  import MetroMorphPanel from "./MetroMorphPanel.svelte";

  // progress: the figure's scroll progress (ChartDisplay), for scroll-driven
  // panels only.
  let { pair, progress = 1 } = $props();
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
{:else if pair.kind === "line-multiples"}
  <LineMultiplesPanel {pair} />
{:else if pair.kind === "metro-morph"}
  <MetroMorphPanel {pair} {progress} />
{/if}
