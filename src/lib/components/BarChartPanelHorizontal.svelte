<script>
  import { BarChart, Labels, defaultChartPadding } from "layerchart";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { palette } from "$lib/colors";

  let { pair } = $props();

  const hasPerRowColor = $derived(pair.data.every((d) => d.color));
</script>

<BarChart
  data={pair.data}
  x={pair.yKey}
  y={pair.xKey}
  yScale={scaleBand().paddingInner(0.2).paddingOuter(0)}
  xScale={scaleLinear().domain(extent(pair.data, (d) => d[pair.yKey]))}
  xRange={({ width }) => [0, width]}
  orientation="horizontal"
  axis={false}
  labels
  padding={defaultChartPadding({ left: 2, right: 40 })}
  {...hasPerRowColor ? { c: pair.xKey, cRange: pair.data.map((d) => d.color) } : {}}
  series={[
    {
      key: pair.subtitle,
      value: pair.yKey,
      color: hasPerRowColor ? undefined : palette[9],
      props: { insets: { y: 0 }, strokeWidth: 0 },
    },
  ]}
  props={{
    labels: {
      class: "text-xs font-light",
      fill: "rgba(42,38,89)",
      format: (d) => `${d}${pair.valueSuffix ?? ""}`,
    },
    tooltip: { item: { label: "" } },
  }}
>
  {#snippet aboveMarks()}
    <Labels x={() => 8} value={pair.xKey} class="text-xs font-light fill-[#FEFCFD] stroke-none" />
  {/snippet}
</BarChart>
