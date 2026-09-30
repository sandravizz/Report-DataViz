<script>
  import { AnnotationPoint, AnnotationRange, AreaChart } from "layerchart";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelAnnotation, areaFillOpacity, desktopTooltips, halfCenturyTicksOnMobile, defaultYearTicks, xAxisOverhang, yAxisRightProps, yAxisRightOverhang, solidWash, yearTickFormat, tooltipHeaderYear } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
  // The ticks the x axis draws: the figure's own list, or one per year
  // (every other on mobile). yearTickFormat reads the ends off this list.
  const xTicks = $derived(
    halfCenturyTicksOnMobile(pair.xTicks, innerWidth) ??
      defaultYearTicks(pair.data, pair.xKey, innerWidth)
  );

  // Same end-label convention as LineChartPanel: series opt in via `endLabel`
  // and get their name at the last observation instead of a legend.
  const endLabelAnnotations = $derived(
    pair.series.filter((s) => s.endLabel).map((s) => endLabelAnnotation(s, pair, innerWidth))
  );
  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...endLabelAnnotations], innerWidth)
  );
  // pair.yAxisRight moves the y labels to the right end of the gridlines
  // (see yAxisRightProps). The left label gutter is then not needed, and the
  // right-hand room for the labels comes from xPadding instead of padding,
  // so the gridlines and the x axis line run on underneath them.
  const padding = $derived(
    endLabelPadding(innerWidth, endLabelAnnotations.length > 0, pair.yAxisRight ? {} : yLabelPadding)
  );
</script>

<svelte:window bind:innerWidth />

<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  legend={false}
  rule={false}
  xPadding={pair.yAxisRight ? yAxisRightOverhang : xAxisOverhang}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    // A wash under a 2.5px top line, not a saturated block — the shared
    // theme opacity, same as every other area chart.
    // pair.solidWash swaps it for the same colour pre-mixed and opaque, so
    // the gridlines stop at the area (single-series figures only).
    area: pair.solidWash
      ? { fill: solidWash(pair.series[0].color), fillOpacity: 1 }
      : { fillOpacity: areaFillOpacity },
    line: { strokeWidth: 2.5, "stroke-linecap": "round", "stroke-linejoin": "round" },
    xAxis: { ...xAxisProps, ticks: xTicks, format: pair.xTickFormat ?? yearTickFormat(xTicks) },
    yAxis: { ...yAxisProps, ...(pair.yAxisRight && yAxisRightProps), ticks: pair.yTicks ?? excludeZeroTick, format: formatValue },
    // Header is the year alone — the data is annual, so LayerChart's default
    // "1 January 2035" is precision the figures never had. A figure can still
    // override it with pair.tooltipHeaderFormat.
    tooltip: {
      header: { format: pair.tooltipHeaderFormat ?? tooltipHeaderYear },
      ...(pair.valueSuffix && { item: { format: formatValue } }),
    },
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
