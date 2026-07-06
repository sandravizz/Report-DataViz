<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import { palette } from "$lib/colors";
  import { tickLabelProps, yAxisProps } from "$lib/chart-theme";

  let { pair } = $props();

  const hasPerRowColor = $derived(pair.data.every((d) => d.color));

  // Width of the category-label gutter left of the bars. Labels are
  // left-aligned at the container edge (dx cancels the gutter), Datawrapper-style.
  const labelGutter = 90;
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
  rule={false}
  labels
  padding={defaultChartPadding({ left: labelGutter, right: 40 })}
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
    yAxis: {
      ...yAxisProps,
      tickLabelProps: { ...tickLabelProps, textAnchor: "start", dx: -labelGutter },
    },
    labels: {
      ...tickLabelProps,
      format: (d) => `${pair.valuePrefix ?? ""}${d}${pair.valueSuffix ?? ""}`,
    },
    tooltip: {
      item: {
        label: "",
        color: null,
        format: (d) => `${pair.valuePrefix ?? ""}${d}${pair.valueSuffix ?? ""}`,
      },
    },
  }}
/>

