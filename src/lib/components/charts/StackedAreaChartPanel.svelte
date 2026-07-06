<script>
  import { AreaChart } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { tickLabelProps, legendProps, legendPadding } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
</script>

<svelte:window bind:innerWidth />

<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  seriesLayout="stack"
  legend={{ placement: "bottom" }}
  tooltipContext={false}
  padding={legendPadding(pair.series.length, innerWidth)}
  props={{
    area: { fillOpacity: 0.9, line: { strokeWidth: 1 } },
    xAxis: { tickLength: 0, format: formatYear, tickLabelProps },
    yAxis: { tickLabelProps, format: formatValue },
    legend: legendProps,
  }}
/>
