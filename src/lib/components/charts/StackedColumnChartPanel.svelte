<script>
  import { BarChart } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { tickLabelProps, legendProps, legendPadding } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  function wrapLabel(label) {
    const words = String(label).split(" ");
    if (words.length < 2) return label;
    const mid = Math.ceil(words.length / 2);
    return `${words.slice(0, mid).join(" ")}\n${words.slice(mid).join(" ")}`;
  }
</script>

<svelte:window bind:innerWidth />

<BarChart
  data={pair.data}
  x={pair.xKey}
  xScale={scaleBand()}
  series={pair.series}
  seriesLayout="stack"
  legend={{ placement: "bottom" }}
  tooltipContext={false}
  padding={legendPadding(pair.series.length, innerWidth)}
  props={{
    bars: { insets: { x: 4 }, strokeWidth: 0 },
    xAxis: {
      tickLength: 0,
      format: wrapLabel,
      tickLabelProps,
    },
    yAxis: { tickLabelProps, format: formatValue },
    legend: legendProps,
  }}
/>
