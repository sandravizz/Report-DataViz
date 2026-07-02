<script>
  import { LineChart } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { tickLabelProps, legendProps } from "$lib/chart-theme";

  let { pair } = $props();

  const formatYear = timeFormat("%Y");
</script>

<LineChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  legend={{ placement: "bottom" }}
  props={{
    spline: { strokeWidth: 2.5 },
    xAxis: { tickLength: 0, format: formatYear, tickLabelProps },
    yAxis: { tickLabelProps },
    legend: legendProps,
  }}
/>
