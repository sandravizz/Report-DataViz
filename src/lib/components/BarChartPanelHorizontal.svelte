<script>
  import { BarChart, Labels, defaultChartPadding } from "layerchart";

  let { pair } = $props();
</script>

<BarChart
  data={pair.data}
  x={pair.yKey}
  y={pair.xKey}
  orientation="horizontal"
  axis={false}
  labels
  padding={defaultChartPadding({ left: 4, right: 40 })}
  series={[
    {
      key: pair.product,
      value: pair.yKey,
      color: "#6E63A8",
      props: { insets: { y: 4 }, strokeWidth: 0 },
    },
  ]}
  props={{
    labels: { class: "text-xs font-light", fill: "rgba(42,38,89)" },
  }}
>
  {#snippet aboveMarks()}
    <Labels x={() => 8} value={pair.xKey} class="text-xs font-light fill-[#FEFCFD] stroke-none" />
  {/snippet}
</BarChart>
