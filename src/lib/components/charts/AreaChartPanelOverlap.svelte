<script>
  import { AnnotationPoint, AnnotationRange, Area, AreaChart } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelAnnotation, areaFillOpacity, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // Figures whose desktop ticks sit too close for a phone axis (e.g. an
  // extra end-of-series year beside a regular tick) pass a sparser
  // `xTicksMobile` set; otherwise the shared half-century fallback applies.
  const xTicks = $derived(
    innerWidth < 1024 && pair.xTicksMobile
      ? pair.xTicksMobile
      : halfCenturyTicksOnMobile(pair.xTicks, innerWidth)
  );

  // Datawrapper-style overlapping areas (layerchart's default series layout —
  // NOT stacked): every series is drawn from the baseline, so where they
  // overlap the washes blend. All washes use the shared theme opacity —
  // de-emphasis comes from the series *color* (a muted tint) and a thinner
  // `lineWidth`, not from a weaker fill. List the de-emphasized series first —
  // later series paint on top.
  const areaStyle = (s) => ({
    curve: curveMonotoneX,
    fillOpacity: areaFillOpacity,
    line: { curve: curveMonotoneX, strokeWidth: s.lineWidth ?? 2.5 },
  });

  // Same end-label convention as LineChartPanel: series opt in via `endLabel`
  // and get their name at the last observation instead of a legend.
  const endLabelAnnotations = $derived(
    pair.series.filter((s) => s.endLabel).map((s) => endLabelAnnotation(s, pair))
  );
  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...endLabelAnnotations], innerWidth)
  );
  // Figures without end labels can still reserve extra padding via
  // pair.padding (e.g. room for a callout ring anchored on the plot's edge).
  const padding = $derived(
    endLabelPadding(innerWidth, endLabelAnnotations.length > 0, { ...yLabelPadding, ...pair.padding })
  );
</script>

<svelte:window bind:innerWidth />

{#snippet chart()}
<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  legend={false}
  rule={false}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    xAxis: { ...xAxisProps, ticks: xTicks, format: pair.xTickFormat ?? formatYear },
    yAxis: { ...yAxisProps, ticks: pair.yTicks ?? excludeZeroTick, format: formatValue },
    tooltip:
      pair.valueSuffix || pair.tooltipHeaderFormat
        ? {
            ...(pair.valueSuffix && { item: { format: formatValue } }),
            ...(pair.tooltipHeaderFormat && {
              header: { format: pair.tooltipHeaderFormat },
            }),
          }
        : undefined,
  }}
>
  {#snippet marks({ context })}
    {#each context.series.visibleSeries as s (s.key)}
      <Area seriesKey={s.key} {...areaStyle(pair.series.find((p) => p.key === s.key) ?? s)} />
    {/each}
  {/snippet}
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks()}
    {#each pair.lineAnnotations ?? [] as annotation, i (i)}
      <ConnectorRule {...annotation} />
    {/each}
    {#each annotations as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
  {/snippet}
</AreaChart>
{/snippet}

{#if pair.legendItems}
  <!-- Manual legend below the plot, same markup as LineChartPanel's: figures
       that name their series here instead of via endLabel supply {label,
       color} entries. pl-9 matches yLabelPadding's 36px axis gutter so the
       swatches align with the plot's left edge. -->
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="min-h-0 flex-1">
      {@render chart()}
    </div>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-9 text-xs font-light">
      {#each pair.legendItems as item (item.label)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.label}</span>
        </div>
      {/each}
    </div>
  </div>
{:else}
  {@render chart()}
{/if}
