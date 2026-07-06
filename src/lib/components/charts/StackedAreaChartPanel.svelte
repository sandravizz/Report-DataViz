<script>
  import { AnnotationLine, AnnotationPoint, AnnotationRange, AreaChart } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, stackedLegendProps, legendPadding, yLabelPadding, resolveAnnotations } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
</script>

<svelte:window bind:innerWidth />

<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  seriesLayout="stack"
  legend={{ placement: "bottom-left" }}
  rule={false}
  tooltipContext={true}
  padding={legendPadding(pair.series.length, innerWidth, yLabelPadding)}
  props={{
    area: { fillOpacity: 0.9, line: { strokeWidth: 1 } },
    xAxis: { ...xAxisProps, format: formatYear },
    yAxis: { ...yAxisProps, format: formatValue },
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
    {#each resolveAnnotations(pair.annotations ?? [], innerWidth) as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
  {/snippet}
</AreaChart>
