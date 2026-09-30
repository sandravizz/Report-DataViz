<script>
  import { AnnotationPoint, AnnotationRange, AreaChart } from "layerchart";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisFor, yTicks, chartPadding, plotXPadding, resolveAnnotations, endLabelAnnotation, areaFillOpacity, desktopTooltips, halfCenturyTicksOnMobile, defaultYearTicks, solidWash, yearTickFormat, tooltipHeaderYear } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Thousands grouping and at most two decimals — $lib/format.js.
  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;
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
  // Series named at the right edge (end labels) own that edge, so the y
  // axis moves to the left; otherwise it sits at the right (plotXPadding).
  const namesOnRight = $derived(endLabelAnnotations.length > 0);
  const xPadding = $derived(plotXPadding(innerWidth, namesOnRight));
  const padding = chartPadding();
</script>

<svelte:window bind:innerWidth />

<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  legend={false}
  rule={false}
  {xPadding}
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
    yAxis: { ...yAxisFor(namesOnRight), ticks: pair.yTicks ?? yTicks, format: formatValue },
    // Gridlines on exactly the y-axis ticks: LayerChart's chart-level Grid
    // otherwise picks its own (fewer) ticks and skips some labelled values.
    grid: { yTicks: pair.yTicks ?? yTicks },
    // Header is the year alone — the data is annual, so LayerChart's default
    // "1 January 2035" is precision the figures never had. A figure can still
    // override it with pair.tooltipHeaderFormat.
    tooltip: {
      header: { format: pair.tooltipHeaderFormat ?? tooltipHeaderYear },
      item: { format: formatValue },
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
