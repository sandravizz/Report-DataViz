<script>
  import { LineChart } from "layerchart";
  import { scaleLog } from "d3-scale";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, legendProps, legendPadding, yLabelPadding } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
</script>

<svelte:window bind:innerWidth />

<LineChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  yScale={pair.yScaleType === "log" ? scaleLog() : undefined}
  yDomain={pair.yDomain}
  legend={{ placement: "bottom-left" }}
  rule={false}
  tooltipContext={false}
  padding={legendPadding(pair.series.length, innerWidth, yLabelPadding)}
  props={{
    spline: { strokeWidth: 2.5 },
    xAxis: { ...xAxisProps, format: formatYear },
    yAxis: { ...yAxisProps, ticks: pair.yTicks, format: formatValue },
    legend: legendProps,
  }}
/>
