<script>
  // Kind → panel dispatch, kept out of ChartDisplay so adding a chart type is
  // a one-file change and any future composite figure can reuse the chain
  // rather than duplicate it. This report draws on the line and bar-grouped
  // branches; bar-horizontal is kept from the template so a figure of that
  // kind needs no change here.
  import BarChartPanelHorizontal from "./BarChartPanelHorizontal.svelte";
  import BarChartPanelGrouped from "./BarChartPanelGrouped.svelte";
  import LineChartPanel from "./LineChartPanel.svelte";

  // `active` is only consumed by LineChartPanel, for its draw-in animation.
  let { pair, active = false } = $props();
</script>

{#if pair.kind === "bar-horizontal"}
  <BarChartPanelHorizontal {pair} />
{:else if pair.kind === "bar-grouped"}
  <BarChartPanelGrouped {pair} />
{:else if pair.kind === "line"}
  <LineChartPanel {pair} {active} />
{/if}
