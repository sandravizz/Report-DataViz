<script>
  import { BarChart } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { xAxisProps, yAxisProps, tickLabelProps, stackedLegendProps, legendPadding, excludeZeroTick, desktopTooltips } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
  // Category labels are long; give them a generous left gutter and let them
  // word-wrap to fit it (bars can spare the width). Wrapping is width-based,
  // so labels reflow per breakpoint instead of relying on hard \n breaks.
  const labelGutter = $derived(innerWidth < 1024 ? 120 : 150);
</script>

<svelte:window bind:innerWidth />

<BarChart
  data={pair.data}
  y={pair.xKey}
  yScale={scaleBand().paddingInner(0.2).paddingOuter(0)}
  orientation="horizontal"
  series={pair.series}
  seriesLayout="stack"
  legend={{ placement: "bottom-left" }}
  rule={false}
  tooltipContext={desktopTooltips(innerWidth)}
  labels={pair.labelSeries ? { seriesKey: pair.labelSeries } : false}
  padding={legendPadding(pair.series.length, innerWidth, { left: labelGutter })}
  props={{
    bars: { insets: { y: 4 }, strokeWidth: 0 },
    xAxis: { ...xAxisProps, ticks: pair.xTicks ?? excludeZeroTick, format: formatValue },
    yAxis: {
      ...yAxisProps,
      tickLabelProps: {
        ...tickLabelProps,
        textAnchor: "start",
        dx: -labelGutter,
        width: labelGutter - 12,
        truncate: false,
        lineHeight: "15px",
      },
    },
    labels: { class: "text-xs font-light", placement: "center", format: formatValue },
    legend: stackedLegendProps,
  }}
/>
