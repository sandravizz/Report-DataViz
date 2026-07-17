<script>
  import { AnnotationPoint, BarChart } from "layerchart";
  import {
    xAxisProps,
    yAxisProps,
    excludeZeroTick,
    desktopTooltips,
    yLabelPadding,
    resolveAnnotations,
    endLabelPadding,
  } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // Category labels here are region names, not years — wrap them into the
  // band instead of truncating. The width tracks the band: ~100px bands on
  // the desktop column's fixed 800px, ~40px on a phone.
  const labelWidth = $derived(innerWidth < 1024 ? 40 : 90);

  const annotations = $derived(resolveAnnotations(pair.annotations ?? [], innerWidth));
  const padding = $derived(endLabelPadding(innerWidth, false, yLabelPadding));
</script>

<svelte:window bind:innerWidth />

<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <BarChart
      data={pair.data}
      x={pair.xKey}
      series={pair.series}
      seriesLayout="group"
      bandPadding={pair.bandPadding ?? 0.25}
      legend={false}
      rule={false}
      tooltipContext={desktopTooltips(innerWidth)}
      {padding}
      props={{
        bars: { strokeWidth: 0 },
        xAxis: {
          ...xAxisProps,
          tickLabelProps: {
            ...xAxisProps.tickLabelProps,
            width: labelWidth,
            truncate: false,
            lineHeight: "12px",
          },
        },
        yAxis: { ...yAxisProps, ticks: excludeZeroTick, format: formatValue },
        tooltip: pair.valueSuffix ? { item: { format: formatValue } } : undefined,
      }}
    >
      {#snippet aboveMarks()}
        {#each annotations as annotation, i (i)}
          <AnnotationPoint {...annotation} />
        {/each}
      {/snippet}
    </BarChart>
  </div>
  <!-- Grouped bars have no last-bar edge to hang direct labels from, so the
       color legend renders on every viewport (same block as the stacked
       panel's mobile fallback), ordered to match the bars. -->
  {#if pair.series.length > 1}
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-9 text-xs font-light">
      {#each pair.series as item (item.key)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.key}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
