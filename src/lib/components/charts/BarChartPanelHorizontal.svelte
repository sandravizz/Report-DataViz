<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import { palette } from "$lib/colors";
  import { tickLabelProps, yAxisProps } from "$lib/chart-theme";

  let { pair } = $props();

  let innerWidth = $state(1024);

  const hasPerRowColor = $derived(pair.data.every((d) => d.color));
  // Category labels are long; give them a generous left gutter and let them
  // word-wrap to fit it (bars can spare the width). Wrapping is width-based,
  // so labels reflow per breakpoint instead of relying on hard \n breaks.
  const labelGutter = $derived(innerWidth < 1024 ? 150 : 200);
</script>

<svelte:window bind:innerWidth />

<BarChart
  data={pair.data}
  x={pair.yKey}
  y={pair.xKey}
  yScale={scaleBand().paddingInner(0.2).paddingOuter(0)}
  xScale={scaleLinear().domain([0, max(pair.data, (d) => d[pair.yKey])])}
  xRange={({ width }) => [0, width]}
  orientation="horizontal"
  axis="y"
  tooltipContext={false}
  grid={false}
  rule={false}
  labels
  padding={defaultChartPadding({ left: labelGutter, right: 40 })}
  {...hasPerRowColor
    ? { c: pair.xKey, cRange: pair.data.map((d) => d.color) }
    : {}}
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
      tickLabelProps: {
        ...tickLabelProps,
        textAnchor: "start",
        dx: -labelGutter,
        width: labelGutter,
        truncate: false,
        // Axis defaults tick labels to an 11px line height, which is tighter
        // than the 12px text-xs font and makes wrapped lines overlap.
        lineHeight: "12px",
      },
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
