<script>
  import { ArcChart } from "layerchart";
  import { legendProps } from "$lib/chart-theme";

  let { pair } = $props();
</script>

<ArcChart
  data={pair.data}
  key={pair.key}
  value={pair.value}
  innerRadius={0.65}
  cornerRadius={3}
  padAngle={0.01}
  legend={{ placement: "bottom" }}
  props={{
    legend: legendProps,
  }}
/>
