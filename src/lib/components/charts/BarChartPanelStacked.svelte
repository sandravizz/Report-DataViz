<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, excludeZeroTick, desktopTooltips, yLabelPadding } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
</script>

<svelte:window bind:innerWidth />

<!-- The built-in legend overlays the plot area (and the x axis), so render
     the same manual bottom legend as LineChartPanel's legendItems block:
     below the plot, pl-9 matching yLabelPadding's axis gutter. -->
<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <BarChart
      data={pair.data}
      x={pair.xKey}
      series={pair.series}
      seriesLayout="stack"
      legend={false}
      rule={false}
      tooltipContext={desktopTooltips(innerWidth)}
      padding={defaultChartPadding(yLabelPadding)}
      props={{
        bars: { strokeWidth: 0 },
        xAxis: { ...xAxisProps, format: formatYear },
        yAxis: { ...yAxisProps, ticks: excludeZeroTick, format: formatValue },
        tooltip: pair.valueSuffix ? { item: { format: formatValue } } : undefined,
      }}
    />
  </div>
  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-9 text-xs font-light">
    {#each pair.series as item (item.key)}
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
        <span>{item.key}</span>
      </div>
    {/each}
  </div>
</div>
