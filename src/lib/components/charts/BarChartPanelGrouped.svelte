<script>
  /* Grouped vertical bars — one cluster per category, one bar per series.
     Added for the Economic Outlook's Figure 4 (three monthly readings of
     industrial production side by side per country group), which the
     horizontal single-series panel cannot express.

     Deliberately built as the plain LayerChart grouped-series example
     (layerchart.com/docs/components/BarChart, "group series") plus this
     report's axis theme, and nothing else: data, x, series, seriesLayout,
     bandPadding, legend. Two earlier hand-rolled additions were what kept
     the panel empty — a custom `xScale` and `groupPadding={2}`, where
     groupPadding is a d3 band padding *fraction* and 2 collapses every bar
     to zero width. Reach for a LayerChart prop before writing one.

     The one thing that isn't from the example is the y axis: it starts at a
     non-zero baseline, because these are index values around 100 where a zero
     baseline would flatten every difference the figure is about. That
     truncation is the published chart's own choice — its axis runs 65 to 105
     — so `yDomain` is required from the figure rather than defaulted here. */
  import { BarChart, defaultChartPadding } from "layerchart";
  import { xAxisProps, yAxisProps, yLabelPadding, desktopTooltips } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Category labels ("Africa & Middle East") are long and there are only a
  // handful of clusters, so wrap them under their group instead of rotating.
  const labelWidth = $derived(innerWidth < 1024 ? 62 : 96);

  // The legend is absolutely positioned inside the chart container, so it
  // lands on top of the plot unless the padding reserves a strip for it:
  // `legend: true` is what adds that strip (32px). The x tick labels wrap to
  // two lines here, which the 20px default bottom can't hold either.
  const padding = defaultChartPadding({
    ...yLabelPadding,
    right: 8,
    bottom: 36,
    legend: true,
  });
</script>

<svelte:window bind:innerWidth />

<BarChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  seriesLayout="group"
  bandPadding={0.2}
  yDomain={pair.yDomain}
  legend={{ placement: "bottom-left" }}
  grid={false}
  rule={false}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    xAxis: {
      ...xAxisProps,
      format: "none",
      tickLabelProps: {
        ...xAxisProps.tickLabelProps,
        width: labelWidth,
        truncate: false,
        lineHeight: "12px",
      },
    },
    yAxis: { ...yAxisProps, ticks: pair.yTicks },
    // Square corners and no outline, like the original — BarChart's own
    // default is a 1px black stroke on every bar. Bars rise from the domain
    // minimum rather than from zero (LayerChart clamps the bar's foot to
    // `yDomain[0]`), which is what makes the truncated axis safe here.
    bars: { rounded: "none", radius: 0, strokeWidth: 0 },
    // Sits in the space `defaultChartPadding({ legend: true })` reserves
    // below the axis, left-aligned with the plot rather than the container
    // (hence the 36px pad, matching yLabelPadding's gutter), and scaled down
    // from LayerChart's 16px swatch to the 10px dot the other panels use.
    legend: {
      class: "pl-9",
      classes: { swatch: "size-2.5", label: "font-light" },
    },
    tooltip: { header: { format: "none" }, hideTotal: true },
  }}
/>
