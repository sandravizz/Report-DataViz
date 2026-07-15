<script>
  import { AnnotationPoint, AnnotationRange, AreaChart } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // Same end-label convention as LineChartPanel: series opt in via `endLabel`
  // and get their name at the last observation instead of a legend.
  const endLabelAnnotations = $derived(
    pair.series
      .filter((s) => s.endLabel)
      .map((s) => {
        const last = pair.data.findLast((d) => d[s.value] != null);
        return {
          x: last[pair.xKey],
          y: last[s.value],
          r: 4,
          label: s.endLabel,
          labelPlacement: "right",
          labelXOffset: 8,
          props: {
            circle: { fill: s.color, stroke: "none" },
            label: { fill: s.color, class: "text-xs font-light" },
          },
          mobile: endLabelMobileWrap,
        };
      })
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
    // A wash under a 2.5px top line, not a saturated block — the line does
    // the reading, the fill only signals "cumulative amount". Figures can
    // strengthen the wash via pair.fillOpacity.
    area: { fillOpacity: pair.fillOpacity ?? 0.05 },
    line: { strokeWidth: 2.5 },
    xAxis: { ...xAxisProps, ticks: halfCenturyTicksOnMobile(pair.xTicks, innerWidth), format: pair.xTickFormat ?? formatYear },
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
