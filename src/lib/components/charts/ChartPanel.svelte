<script>
  // Kind → panel dispatch, extracted from ChartDisplay so composite figures
  // (DoubleChartPanel) can render sub-panels without duplicating the chain.
  import BarChartPanelGrouped from "./BarChartPanelGrouped.svelte";
  import BarChartPanelHorizontal from "./BarChartPanelHorizontal.svelte";
  import BarChartPanelStacked from "./BarChartPanelStacked.svelte";
  import LineChartPanel from "./LineChartPanel.svelte";
  import LineChartPanelMultiples from "./LineChartPanelMultiples.svelte";

  // `active` = this panel is the current scrolly step. Passed through from
  // ScrollySection (via ChartDisplay); only LineChartPanel consumes it, for
  // the draw-in animation of series flagged `drawIn`.
  let { pair, active = false } = $props();
</script>

{#if pair.kind === "bar-grouped"}
  <BarChartPanelGrouped {pair} />
{:else if pair.kind === "bar-horizontal"}
  <BarChartPanelHorizontal {pair} />
{:else if pair.kind === "bar-stacked"}
  <BarChartPanelStacked {pair} />
{:else if pair.kind === "line"}
  <LineChartPanel {pair} {active} />
{:else if pair.kind === "line-multiples"}
  <LineChartPanelMultiples {pair} />
{/if}
