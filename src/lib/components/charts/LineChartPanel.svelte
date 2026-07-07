<script>
  import { AnnotationLine, AnnotationPoint, AnnotationRange, LineChart, defaultChartPadding } from "layerchart";
  import { scaleLog } from "d3-scale";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, legendProps, legendPadding, yLabelPadding, resolveAnnotations, excludeZeroTick } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // With lineEndLabels the legend is dropped; series that opt in via an
  // explicit `endLabel` get their name at the end of the line instead, and
  // right padding is reserved for them in place of legend rows. Series
  // without `endLabel` (e.g. de-emphasized background lines) get neither —
  // that's how lineEndLabels doubles as "hide the legend" for charts where
  // only one or two lines need identifying.
  const endLabelAnnotations = $derived(
    pair.lineEndLabels
      ? pair.series
          .filter((s) => s.endLabel)
          .map((s) => {
            const last = pair.data[pair.data.length - 1];
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
            };
          })
      : []
  );
  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...endLabelAnnotations], innerWidth)
  );
  const padding = $derived(
    pair.lineEndLabels
      ? defaultChartPadding(
          endLabelAnnotations.length ? { ...yLabelPadding, right: 80 } : yLabelPadding
        )
      : legendPadding(pair.series.length, innerWidth, yLabelPadding)
  );
</script>

<svelte:window bind:innerWidth />

<LineChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  yScale={pair.yScaleType === "log" ? scaleLog() : undefined}
  yDomain={pair.yDomain}
  legend={pair.lineEndLabels ? false : { placement: "bottom-left" }}
  rule={false}
  tooltipContext={false}
  {padding}
  props={{
    spline: { strokeWidth: 2.5 },
    xAxis: { ...xAxisProps, ticks: pair.xTicks, format: formatYear },
    yAxis: { ...yAxisProps, ticks: pair.yTicks ?? excludeZeroTick, format: formatValue },
    legend: legendProps,
  }}
>
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
    {#each pair.lineAnnotations ?? [] as annotation, i (i)}
      <AnnotationLine {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks()}
    {#each annotations as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
  {/snippet}
</LineChart>
