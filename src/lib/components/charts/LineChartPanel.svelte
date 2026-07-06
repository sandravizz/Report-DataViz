<script>
  import { AnnotationPoint, LineChart, defaultChartPadding } from "layerchart";
  import { scaleLog } from "d3-scale";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, legendProps, legendPadding, yLabelPadding } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // With lineEndLabels the series names sit at the end of each line instead
  // of in a legend; reserve right padding for them in place of legend rows.
  const endLabelAnnotations = $derived(
    pair.lineEndLabels
      ? pair.series.map((s) => {
          const last = pair.data[pair.data.length - 1];
          return {
            x: last[pair.xKey],
            y: last[s.value],
            r: 4,
            label: s.endLabel ?? s.key,
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
  const annotations = $derived([...(pair.annotations ?? []), ...endLabelAnnotations]);
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
  tooltipContext={true}
  padding={pair.lineEndLabels
    ? defaultChartPadding({ ...yLabelPadding, right: 80 })
    : legendPadding(pair.series.length, innerWidth, yLabelPadding)}
  props={{
    spline: { strokeWidth: 2.5 },
    xAxis: { ...xAxisProps, format: formatYear },
    yAxis: { ...yAxisProps, ticks: pair.yTicks, format: formatValue },
    legend: legendProps,
  }}
>
  {#snippet aboveMarks()}
    {#each annotations as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
  {/snippet}
</LineChart>
