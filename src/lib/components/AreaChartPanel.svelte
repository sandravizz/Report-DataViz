<script>
  import { AreaChart } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { timeFormat } from "d3-time-format";
  import { palette } from "$lib/colors";

  let { pair } = $props();

  const formatYear = timeFormat("%Y");
</script>

<AreaChart
  data={pair.data}
  x={pair.xKey}
  y={pair.yKey}
  series={[{ key: pair.subtitle, value: pair.yKey }]}
  xScale={scaleBand()}
  axis="x"
  props={{
    area: { fill: palette[5], fillOpacity: 0.3, line: { stroke: palette[5], fill: "none" } },
    xAxis: { tickLength: 0, format: formatYear, tickLabelProps: { fill: "rgba(42,38,89)", class: "text-xs font-light" } },
    tooltip: { item: { label: "" } },
  }}
/>
