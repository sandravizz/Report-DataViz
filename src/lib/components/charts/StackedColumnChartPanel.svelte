<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { tickLabelProps, legendProps } from "$lib/chart-theme";

  let { pair } = $props();

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  function wrapLabel(label) {
    const words = String(label).split(" ");
    if (words.length < 2) return label;
    const mid = Math.ceil(words.length / 2);
    return `${words.slice(0, mid).join(" ")}\n${words.slice(mid).join(" ")}`;
  }
</script>

<BarChart
  data={pair.data}
  x={pair.xKey}
  xScale={scaleBand()}
  series={pair.series}
  seriesLayout="stack"
  legend={{ placement: "bottom" }}
  tooltipContext={false}
  padding={pair.series.length > 4 ? defaultChartPadding({ legend: true, bottom: 44 }) : undefined}
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
