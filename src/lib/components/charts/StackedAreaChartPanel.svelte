<script>
  import { AnnotationLine, AnnotationPoint, AnnotationRange, AreaChart } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, stackedLegendProps, legendPadding, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap } from "$lib/chart-theme";
  import { annotationLabel } from "$lib/data/annotation-presets.js";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // With areaEndLabels the legend is dropped; series that opt in via an
  // explicit `endLabel` get their name at the end of their band's top edge
  // instead (that edge is already drawn, in the series color, by the area's
  // own `line` stroke below) — same pattern as LineChartPanel's
  // lineEndLabels, but positioned at the cumulative (stacked) value rather
  // than the raw series value.
  const endLabelAnnotations = $derived(
    pair.areaEndLabels
      ? (() => {
          const last = pair.data[pair.data.length - 1];
          let cumulative = 0;
          return pair.series
            .map((s) => {
              cumulative += last[s.value] ?? 0;
              return { series: s, y: cumulative };
            })
            .filter(({ series: s }) => s.endLabel)
            .map(({ series: s, y }) => ({
              x: last[pair.xKey],
              y,
              r: 4,
              label: s.endLabel,
              labelPlacement: "right",
              labelXOffset: 8,
              props: {
                circle: { fill: s.color, stroke: "none" },
                label: annotationLabel,
              },
              mobile: endLabelMobileWrap,
            }));
        })()
      : []
  );
  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...endLabelAnnotations], innerWidth)
  );
  const padding = $derived(
    pair.areaEndLabels
      ? endLabelPadding(innerWidth, endLabelAnnotations.length > 0, yLabelPadding)
      : legendPadding(pair.series.length, innerWidth, yLabelPadding)
  );
</script>

<svelte:window bind:innerWidth />

<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  seriesLayout="stack"
  legend={pair.areaEndLabels ? false : { placement: "bottom-left" }}
  rule={false}
  tooltipContext={false}
  {padding}
  props={{
    area: { fillOpacity: 0.9, line: { strokeWidth: 1 } },
    xAxis: { ...xAxisProps, ticks: pair.xTicks, format: formatYear },
    yAxis: { ...yAxisProps, ticks: pair.yTicks ?? excludeZeroTick, format: formatValue },
    legend: stackedLegendProps,
  }}
>
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks()}
    {#each pair.lineAnnotations ?? [] as annotation, i (i)}
      <AnnotationLine {...annotation} />
    {/each}
    {#each annotations as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
  {/snippet}
</AreaChart>
