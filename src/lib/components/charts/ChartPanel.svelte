<script>
  // Kind → panel dispatch, kept out of ChartDisplay so adding a chart type is
  // a one-file change. This report needs only bar-horizontal and line; a
  // branch with grouped/stacked bars or line-multiples adds those imports and
  // branches here, the way `template` does.
  import BarChartPanelHorizontal from "./BarChartPanelHorizontal.svelte";
  import LineChartPanel from "./LineChartPanel.svelte";

  // `active` is only consumed by LineChartPanel, for its draw-in animation.
  let { pair, active = false } = $props();
</script>

{#if pair.kind === "bar-horizontal"}
  <BarChartPanelHorizontal {pair} />
{:else if pair.kind === "line"}
  <LineChartPanel {pair} {active} />
{/if}
