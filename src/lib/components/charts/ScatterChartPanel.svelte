<script>
  import { ScatterChart } from "layerchart";
  import { palette } from "$lib/colors";
  import { tickLabelProps, legendProps } from "$lib/chart-theme";

  let { pair } = $props();
</script>

<ScatterChart
  data={pair.data}
  x={pair.xKey}
  y={pair.yKey}
  c={pair.cKey}
  cRange={palette}
  legend={{ placement: "bottom" }}
  props={{
    points: { r: 6, fillOpacity: 0.85, strokeWidth: 0 },
    xAxis: { tickLabelProps },
    yAxis: { tickLabelProps },
    legend: legendProps,
  }}
/>
