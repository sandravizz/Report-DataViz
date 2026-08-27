<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { tickLabelProps, yAxisProps, mutedTickLabelProps, desktopTooltips } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";

  let { pair } = $props();

  let innerWidth = $state(1024);

  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;

  // Category labels are long, so they get a generous left gutter and wrap to
  // fit it. Wrapping is width-based, so labels reflow per breakpoint.
  const labelGutter = $derived(innerWidth < 1024 ? 110 : 180);
</script>

<svelte:window bind:innerWidth />

<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <BarChart
      data={pair.data}
      y={pair.xKey}
      series={pair.series}
      seriesLayout="group"
      orientation="horizontal"
      bandPadding={pair.bandPadding ?? 0.25}
      axis="y"
      grid={false}
      rule={false}
      legend={false}
      labels
      tooltipContext={desktopTooltips(innerWidth)}
      padding={defaultChartPadding({ left: labelGutter, right: 40 })}
      props={{
        bars: { strokeWidth: 0 },
        yAxis: {
          ...yAxisProps,
          tickLabelProps: {
            ...mutedTickLabelProps,
            textAnchor: "start",
            dx: -labelGutter,
            width: labelGutter,
            truncate: false,
            // The axis default is 11px, tighter than text-xs, so wrapped
            // lines overlap.
            lineHeight: "12px",
          },
        },
        labels: { ...tickLabelProps, format: formatValue },
        tooltip: { item: { format: formatValue } },
      }}
    />
  </div>
  <!-- Grouped bars have no free spot for direct labels, so the legend renders
       on every viewport, ordered to match the bars. -->
  {#if pair.series.length > 1}
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs font-light">
      {#each pair.series as item (item.key)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.label ?? item.key}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
