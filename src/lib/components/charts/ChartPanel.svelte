<script>
  // Kind → panel dispatch, kept out of ChartDisplay so adding a chart type is
  // a one-file change and any future composite figure can reuse the chain
  // rather than duplicate it. main only has bar-horizontal and line figures
  // today; a report with grouped/stacked bars or line-multiples would add
  // those imports and branches here the same way template does.
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
