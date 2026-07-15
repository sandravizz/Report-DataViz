<script>
  import { AnnotationPoint, AnnotationRange, Area, AreaChart } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";

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
  // overlap the washes blend. Unlike AreaChartPanel, emphasis is per series:
  // each entry can set `fillOpacity` and `lineWidth` so one share carries a
  // strong wash while the background series stays a light context band. List
  // the de-emphasized series first — later series paint on top.
  const areaStyle = (s) => ({
    curve: curveMonotoneX,
    fillOpacity: s.fillOpacity ?? 0.1,
    line: { curve: curveMonotoneX, strokeWidth: s.lineWidth ?? 2.5 },
  });

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
