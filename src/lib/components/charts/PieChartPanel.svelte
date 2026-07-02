<script>
  import { PieChart } from "layerchart";
  import { legendProps } from "$lib/chart-theme";

  let { pair } = $props();
</script>

<PieChart
  data={pair.data}
  key={pair.key}
  value={pair.value}
  c="color"
  legend={{ placement: "bottom" }}
  props={{
    legend: legendProps,
  }}
/>
