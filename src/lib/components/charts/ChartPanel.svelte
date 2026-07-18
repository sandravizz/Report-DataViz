<script>
  // Kind → panel dispatch, extracted from ChartDisplay so composite figures
  // (DoubleChartPanel) can render sub-panels without duplicating the chain.
  import BarChartPanelHorizontal from "./BarChartPanelHorizontal.svelte";
  import BarChartPanelStacked from "./BarChartPanelStacked.svelte";
  import LineChartPanel from "./LineChartPanel.svelte";
  import AreaChartPanel from "./AreaChartPanel.svelte";
  import AreaChartPanelOverlap from "./AreaChartPanelOverlap.svelte";
  import AreaChartPanelStacked from "./AreaChartPanelStacked.svelte";

  // `active` = this panel is the current scrolly step. Passed through from
  // ChartDisplay; only panels with draw-in behavior consume it.
  let { pair, active = false } = $props();
</script>

{#if pair.kind === "bar"}
  <BarChartPanelHorizontal {pair} />
{:else if pair.kind === "bar-stacked"}
  <BarChartPanelStacked {pair} />
{:else if pair.kind === "line"}
  <LineChartPanel {pair} />
{:else if pair.kind === "area"}
  <AreaChartPanel {pair} />
{:else if pair.kind === "area-overlap"}
  <AreaChartPanelOverlap {pair} {active} />
{:else if pair.kind === "area-stacked"}
  <AreaChartPanelStacked {pair} />
{/if}
