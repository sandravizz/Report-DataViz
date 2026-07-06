<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import { palette } from "$lib/colors";
  import { tickLabelProps } from "$lib/chart-theme";

  let { pair } = $props();

  const hasPerRowColor = $derived(pair.data.every((d) => d.color));
</script>

<BarChart
  data={pair.data}
  x={pair.yKey}
  y={pair.xKey}
  yScale={scaleBand().paddingInner(0.2).paddingOuter(0)}
  xScale={scaleLinear().domain([0, max(pair.data, (d) => d[pair.yKey])])}
  xRange={({ width }) => [0, width]}
  orientation="horizontal"
  axis="y"
  tooltipContext={true}
  grid={false}
  labels
  padding={defaultChartPadding({ left: 90, right: 40 })}
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
      ...tickLabelProps,
      format: (d) => `${pair.valuePrefix ?? ""}${d}${pair.valueSuffix ?? ""}`,
    },
  }}
/>

