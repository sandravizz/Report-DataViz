<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { tickLabelProps, yAxisProps, mutedTickLabelProps, desktopTooltips } from "$lib/chart-theme";
  import { brand } from "$lib/colors";

  let { pair } = $props();

  let innerWidth = $state(1024);

  // toFixed(1) instead of the raw number: summed series values (see the
  // tooltip's "total" row) can land on float noise like 1.7999999999999998
  // (1.2 + 0.6), and toFixed also caps display to the one decimal the data
  // actually carries.
  const formatValue = (d) => `${d.toFixed(1)}${pair.valueSuffix ?? ""}`;

  // Category labels are long; give them a generous left gutter and let them
  // word-wrap to fit it (bars can spare the width). Wrapping is width-based,
  // so labels reflow per breakpoint instead of relying on hard \n breaks.
  const labelGutter = $derived(innerWidth < 1024 ? 110 : 180);

  // Bar value labels ("6%", "4.3%"...) read as oversized on mobile's narrow
  // bars; shrink below the tickLabelProps default (text-xs/12px) only under
  // the report's usual <1024 breakpoint.
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
      tooltipContext={desktopTooltips(innerWidth)}
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
  <!-- Grouped bars have no free spot for per-series direct labels, so the
       color legend renders on every viewport, ordered to match the bars.
       The chart above is flex-1 in a fixed-height column, so whatever the
       legend doesn't use goes straight to bar height — kept snug (pt-1.5,
       not pt-3) so mobile's eight-category chart isn't squeezed for a
       legend that doesn't need to sit far from the bars it labels. -->
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
