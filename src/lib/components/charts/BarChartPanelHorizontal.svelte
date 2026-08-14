<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { tickLabelProps, yAxisProps, mutedTickLabelProps } from "$lib/chart-theme";
  import { brand } from "$lib/colors";

  let { pair } = $props();

  let innerWidth = $state(1024);
  const formatValue = (d) => `${d.toFixed(1)}${pair.valueSuffix ?? ""}`;

  // Category labels are long: a generous width-based wrap gutter (the bars can
  // spare it) rather than hard \n breaks.
  const labelGutter = $derived(innerWidth < 1024 ? 110 : 180);

  // Bar value labels read as oversized on mobile's narrow bars.
  const valueLabelProps = $derived({
    ...tickLabelProps,
    class: innerWidth < 1024 ? "text-[10px] font-light" : tickLabelProps.class,
  });
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
      bandPadding={pair.bandPadding ?? 0.2}
      axis="y"
      grid={false}
      rule={true}
      legend={false}
      labels
      padding={defaultChartPadding({ left: labelGutter, right: 40 })}
      props={{
        bars: { strokeWidth: 0 },
        rule: { stroke: brand.gray, opacity: 0.5, strokeWidth: 1 },
        yAxis: {
          ...yAxisProps,
          tickLabelProps: {
            ...mutedTickLabelProps,
            textAnchor: "start",
            dx: -labelGutter,
            width: labelGutter,
            truncate: false,
            lineHeight: "12px",
          },
        },
        labels: { ...valueLabelProps, format: formatValue },
        tooltip: { item: { format: formatValue } },
      }}
    />
  </div>
  <!-- Grouped bars have no free spot for per-series direct labels, so a
       color legend renders on every viewport, kept snug (pt-1.5) so mobile's
       eight-category chart isn't squeezed for it. -->
  {#if pair.series.length > 1}
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-xs font-light">
      {#each pair.series as item (item.key)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.label ?? item.key}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
