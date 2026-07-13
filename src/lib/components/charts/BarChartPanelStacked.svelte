<script>
  import { AnnotationPoint, BarChart, Labels } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, excludeZeroTick, desktopTooltips, yLabelPadding, resolveAnnotations, endLabelPadding } from "$lib/chart-theme";
  import { lineCallout } from "$lib/data/annotation-presets.js";
  import { ink } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // Direct labels instead of a legend on desktop (Datawrapper stacked-column
  // guidance, mirrored in the dataviz skill's stacked-bars reference): each
  // series is named beside its segment on the last bar, so reading order and
  // stack order agree with no legend eye travel. Mobile keeps the bottom
  // legend — the narrow viewport has no right margin to spare.
  const directLabelsActive = $derived(pair.series.length > 1 && innerWidth >= 1024);

  const directLabelAnnotations = $derived.by(() => {
    if (!directLabelsActive) return [];
    const last = pair.data[pair.data.length - 1];
    const total = pair.series.reduce((sum, s) => sum + last[s.value], 0);
    let cum = 0;
    return pair.series.map((s) => {
      const mid = cum + last[s.value] / 2;
      cum += last[s.value];
      // Datawrapper-style connector: a thin muted leader line from the bar's
      // edge to the label instead of free-floating text.
      return lineCallout({
        x: last[pair.xKey],
        // Segment midpoint of the last bar; stackExpand normalizes to 0–1,
        // so percent charts divide the running position by the bar total.
        y: pair.percent ? mid / total : mid,
        // Half a band (~30px at the desktop column's fixed 800px) plus a
        // 2px gap starts the line just off the last bar's right edge.
        r: 32,
        label: s.key,
        labelPlacement: "right",
        labelXOffset: 22,
        labelProps: { verticalAnchor: "middle" },
      });
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

  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...directLabelAnnotations], innerWidth)
  );
  const padding = $derived(endLabelPadding(innerWidth, directLabelsActive, yLabelPadding));
</script>

<svelte:window bind:innerWidth />

<!-- The built-in legend overlays the plot area (and the x axis), so render
     the same manual bottom legend as LineChartPanel's legendItems block:
     below the plot, pl-9 matching yLabelPadding's axis gutter. -->
<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
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
      {#snippet aboveMarks()}
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
      {/snippet}
    </BarChart>
  </div>
  <!-- A single series needs no legend — the subtitle already names it. On
       desktop the direct labels above replace the legend entirely; the legend
       only renders as the mobile fallback. -->
  {#if pair.series.length > 1 && !directLabelsActive}
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-9 text-xs font-light">
      {#each pair.series as item (item.key)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.key}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
