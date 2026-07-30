<script>
  // Kind → panel dispatch, extracted from ChartDisplay so composite figures
  // (DoubleChartPanel) can render sub-panels without duplicating the chain.
  // main only has bar-horizontal and line figures today; a future report
  // with grouped/stacked bars or line-multiples would add those imports and
  // branches here the same way template does.
  import BarChartPanelHorizontal from "./BarChartPanelHorizontal.svelte";
  import LineChartPanel from "./LineChartPanel.svelte";

  let { pair } = $props();
</script>

{#if pair.kind === "bar-horizontal"}
  <BarChartPanelHorizontal {pair} />
{:else if pair.kind === "line"}
  <LineChartPanel {pair} />
{/if}
