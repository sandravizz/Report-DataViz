<script>
  import { BarChart } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { tickLabelProps, legendProps } from "$lib/chart-theme";

  let { pair } = $props();

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
  seriesLayout="group"
  axis="x"
  legend={{ placement: "bottom" }}
  props={{
    bars: { insets: { x: 4 }, strokeWidth: 0, radius: 3 },
    xAxis: {
      tickLength: 0,
      format: wrapLabel,
      tickLabelProps,
    },
    legend: legendProps,
  }}
/>
