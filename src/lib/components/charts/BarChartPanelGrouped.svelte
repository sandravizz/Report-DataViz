<script>
  /* Grouped vertical bars — one cluster per category, one bar per series.
     Added for the Economic Outlook's Figure 4 (three monthly readings of
     industrial production side by side per country group), which the
     horizontal single-series panel cannot express.

     Two things differ from BarChartPanelHorizontal beyond the orientation:
     colour comes from the *series* (each month has its own colour, shared
     across every cluster) rather than per datum, and the y axis starts at a
     non-zero baseline, because these are index values around 100 where a
     zero baseline would flatten every difference the figure is about. That
     truncation is the published chart's own choice — its axis runs 65 to 105
     — so `yDomain` is required from the figure rather than defaulted here. */
  import { BarChart, defaultChartPadding } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { xAxisProps, yAxisProps, yLabelPadding, desktopTooltips } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Category labels ("Africa & Middle East") are long and there are only a
  // handful of clusters, so wrap them under their group instead of rotating.
  const labelWidth = $derived(innerWidth < 1024 ? 62 : 96);
</script>

<svelte:window bind:innerWidth />

<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <BarChart
      data={pair.data}
      x={pair.xKey}
      xScale={scaleBand().paddingInner(0.28).paddingOuter(0.14)}
      yDomain={pair.yDomain}
      series={pair.series}
      seriesLayout="group"
      groupPadding={2}
      legend={false}
      grid={false}
      rule={false}
      tooltipContext={desktopTooltips(innerWidth)}
      padding={defaultChartPadding({ ...yLabelPadding, right: 8 })}
      props={{
        xAxis: {
          ...xAxisProps,
          tickLabelProps: {
            ...xAxisProps.tickLabelProps,
            width: labelWidth,
            truncate: false,
            lineHeight: "12px",
          },
        },
        yAxis: { ...yAxisProps, ticks: pair.yTicks },
        // Square corners, like the original. Bars rise from the domain
        // minimum rather than from zero (LayerChart clamps the bar's foot to
        // `yDomain[0]`), which is what makes the truncated axis safe here.
        bars: { strokeWidth: 0, rounded: "none", radius: 0 },
        tooltip: { hideTotal: true },
      }}
    />
  </div>

  <!-- The report puts its series key on one line above the plot; here it sits
       under it, matching the line panel's legend so both figures read alike. -->
  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-9 text-xs font-light">
    {#each pair.series as item (item.key)}
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
        <span>{item.label ?? item.key}</span>
      </div>
    {/each}
  </div>
</div>
