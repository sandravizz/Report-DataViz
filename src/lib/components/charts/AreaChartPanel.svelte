<script>
  import { AnnotationPoint, AnnotationRange, AreaChart } from "layerchart";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelAnnotation, areaFillOpacity, desktopTooltips, halfCenturyTicksOnMobile, yearTickFormat } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
  // Earliest year in the chart's own x domain, so the mobile year
  // abbreviation below knows which tick to keep spelled out in full.
  const firstTickYear = $derived(
    (pair.xTicks?.[0] ?? pair.data[0][pair.xKey]).getFullYear()
  );

  // Same end-label convention as LineChartPanel: series opt in via `endLabel`
  // and get their name at the last observation instead of a legend.
  const endLabelAnnotations = $derived(
    pair.series.filter((s) => s.endLabel).map((s) => endLabelAnnotation(s, pair, innerWidth))
  );
  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...endLabelAnnotations], innerWidth)
  );
  const padding = $derived(
    endLabelPadding(innerWidth, endLabelAnnotations.length > 0, yLabelPadding)
  );
</script>

<svelte:window bind:innerWidth />

<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  legend={false}
  rule={false}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    // A wash under a 2.5px top line, not a saturated block — the shared
    // theme opacity, same as every other area chart.
    area: { fillOpacity: areaFillOpacity },
    line: { strokeWidth: 2.5 },
    xAxis: { ...xAxisProps, ticks: halfCenturyTicksOnMobile(pair.xTicks, innerWidth), format: pair.xTickFormat ?? yearTickFormat(innerWidth, firstTickYear) },
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
