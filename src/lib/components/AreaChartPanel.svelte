<script>
  import { AreaChart } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { timeFormat } from "d3-time-format";

  let { pair } = $props();

  const formatYear = timeFormat("%Y");
</script>

<AreaChart
  data={pair.data}
  x={pair.xKey}
  y={pair.yKey}
  series={[{ key: pair.product, value: pair.yKey }]}
  xScale={scaleBand()}
  axis="x"
  props={{
    area: { fill: "#6E63A8", fillOpacity: 0.3, line: { stroke: "#6E63A8", fill: "none" } },
    xAxis: { tickLength: 0, format: formatYear, tickLabelProps: { fill: "rgba(42,38,89)", class: "text-xs font-light" } },
  }}
/>
