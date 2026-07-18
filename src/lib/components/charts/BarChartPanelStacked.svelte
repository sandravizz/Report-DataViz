<script>
  import { AnnotationPoint, BarChart, Labels } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, excludeZeroTick, desktopTooltips, yLabelPadding, resolveAnnotations, endLabelPadding, endLabelMobileWrap } from "$lib/chart-theme";
  import { ink } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Figures with scenario bars ("2035 STEPS") pass their own xTickFormat;
  // plain time-series columns keep the year default.
  const formatYear = pair.xTickFormat ?? timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // Direct labels instead of a legend, on every viewport (Datawrapper
  // stacked-column guidance, mirrored in the dataviz skill's stacked-bars
  // reference, plus the house rule that end labels never collapse into a
  // bottom legend on mobile): each series is named beside its segment on the
  // last bar in its own series color, mirroring the line charts' end labels.
  // The x offset is set at render time from the actual band width so the
  // label starts just over the bar's right edge on every figure.
  const directLabelsActive = $derived(pair.series.length > 1);

  const directLabelAnnotations = $derived.by(() => {
    if (!directLabelsActive) return [];
    const last = pair.data[pair.data.length - 1];
    const total = pair.series.reduce((sum, s) => sum + last[s.value], 0);
    let cum = 0;
    return pair.series.map((s) => {
      const mid = cum + last[s.value] / 2;
      cum += last[s.value];
      return {
        x: last[pair.xKey],
        // Segment midpoint of the last bar; stackExpand normalizes to 0–1,
        // so percent charts divide the running position by the bar total.
        y: pair.percent ? mid / total : mid,
        r: 0,
        label: s.key,
        labelPlacement: "right",
        props: {
          circle: { r: 0, stroke: "none", fill: "none" },
          // Labels wear the series color by default; figures whose segments
          // are shades of one hue (e.g. the region ramp) pass
          // `directLabelFill` to ink them all uniformly instead.
          label: {
            fill: pair.directLabelFill ?? s.color,
            verticalAnchor: "middle",
            class: "text-xs font-light",
          },
        },
        mobile: endLabelMobileWrap,
      };
    });
  });

  // In-bar value labels, driven by pair.barLabels:
  //   [{ series, value: (d) => string, position: "bottom" | "middle", fill }]
  // "bottom" anchors the number just above the baseline inside the bottom
  // segment; "middle" centers it in its own segment. `value` returns the
  // display string, so a percent chart can show absolute values.
  const barLabels = $derived.by(() =>
    (pair.barLabels ?? []).map((bl) => {
      const index = pair.series.findIndex((s) => s.key === bl.series);
      const yMid = (d) => {
        const below = pair.series.slice(0, index).reduce((sum, s) => sum + d[s.value], 0);
        const mid = below + d[pair.series[index].value] / 2;
        return pair.percent
          ? mid / pair.series.reduce((sum, s) => sum + d[s.value], 0)
          : mid;
      };
      return { ...bl, y: bl.position === "bottom" ? () => 0 : yMid };
    })
  );

  const annotations = $derived(resolveAnnotations(pair.annotations ?? [], innerWidth));
  const directLabels = $derived(resolveAnnotations(directLabelAnnotations, innerWidth));
  const padding = $derived(endLabelPadding(innerWidth, directLabelsActive, yLabelPadding));
</script>

<svelte:window bind:innerWidth />

<!-- pair.percent switches to a 100% stacked layout: bars are normalized
     per band (d3's stackOffsetExpand) and the y axis reads 0–100%, while
     the tooltip keeps the raw values plus their total. -->
<BarChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  seriesLayout={pair.percent ? "stackExpand" : "stack"}
  bandPadding={pair.bandPadding ?? 0.2}
  legend={false}
  rule={false}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    bars: { strokeWidth: 0 },
    xAxis: { ...xAxisProps, format: formatYear },
    yAxis: {
      ...yAxisProps,
      ticks: excludeZeroTick,
      format: pair.percent ? "percentRound" : formatValue,
    },
    tooltip: pair.percent
      ? // Series carry share values; a total row (always 100%) is noise.
        { item: { format: "percentRound" }, hideTotal: true }
      : pair.valueSuffix
        ? { item: { format: formatValue } }
        : undefined,
  }}
>
  {#snippet aboveMarks({ context })}
    <!-- placement="middle" honors the custom y accessor as-is; the dy
         lifts bottom-anchored numbers ~a line height into the bar. -->
    {#each barLabels as bl (bl.series)}
      <Labels
        seriesKey={bl.series}
        y={bl.y}
        value={bl.value}
        placement="middle"
        dy={bl.position === "bottom" ? -12 : 0}
        fill={bl.fill ?? ink}
        class="text-xs font-semibold"
      />
    {/each}
    {#each annotations as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
    <!-- The label's anchor is the last band's center; offsetting by half the
         band width plus a small gap starts the text just clear of the bar's
         right edge, whatever the figure's band count. -->
    {#each directLabels as annotation, i (i)}
      <AnnotationPoint {...annotation} labelXOffset={context.xScale.bandwidth() / 2 + 6} />
    {/each}
  {/snippet}
</BarChart>
