<script>
  import { AnnotationPoint, AnnotationRange, AreaChart, Labels } from "layerchart";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, excludeZeroTick, desktopTooltips, yLabelPadding, resolveAnnotations, endLabelPadding, areaFillOpacity } from "$lib/chart-theme";
  import { lineCallout } from "$lib/data/annotation-presets.js";
  import { ink } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // Same direct-label convention as BarChartPanelStacked: on desktop each
  // series is named beside its band at the last observation instead of a
  // legend; mobile falls back to the bottom legend. Figures can opt out via
  // directLabels: false (e.g. composite figures where the reserved right
  // padding would break x alignment with a sibling chart) — they get the
  // legend on every viewport instead.
  const directLabelsActive = $derived(
    pair.series.length > 1 && innerWidth >= 1024 && pair.directLabels !== false
  );

  const directLabelAnnotations = $derived.by(() => {
    if (!directLabelsActive) return [];
    const last = pair.data[pair.data.length - 1];
    const total = pair.series.reduce((sum, s) => sum + last[s.value], 0);
    let cum = 0;
    return pair.series.map((s) => {
      const mid = cum + last[s.value] / 2;
      cum += last[s.value];
      return lineCallout({
        x: last[pair.xKey],
        y: pair.percent ? mid / total : mid,
        // Unlike bars, the last observation sits on the plot's right edge,
        // so the leader line starts just off the point instead of half a
        // band away.
        r: 6,
        label: s.key,
        labelPlacement: "right",
        labelXOffset: 14,
        labelProps: { verticalAnchor: "middle" },
      });
    });
  });

  // Per-point value labels, same contract as BarChartPanelStacked's
  // pair.barLabels: "bottom" anchors just above the baseline, anything else
  // centers the number in its own band.
  const valueLabels = $derived.by(() =>
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

<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <!-- pair.percent switches to a 100% stacked layout, mirroring the
         stacked bar panel: bands normalized per x (stackExpand), y axis
         0–100%, tooltip keeps the raw values. Bands are a translucent wash
         under a full-color 2.5px top line, same shared theme opacity as the
         plain area panel. -->
    <AreaChart
      data={pair.data}
      x={pair.xKey}
      series={pair.series}
      seriesLayout={pair.percent ? "stackExpand" : "stack"}
      legend={false}
      rule={false}
      tooltipContext={desktopTooltips(innerWidth)}
      {padding}
      props={{
        area: {
          fillOpacity: areaFillOpacity,
          line: { strokeWidth: 2.5 },
        },
        xAxis: { ...xAxisProps, format: formatYear },
        yAxis: {
          ...yAxisProps,
          ticks: pair.yTicks ?? excludeZeroTick,
          format: pair.percent ? "percentRound" : formatValue,
        },
        tooltip: pair.percent
          ? { item: { format: "percentRound" }, hideTotal: true }
          : pair.valueSuffix
            ? { item: { format: formatValue } }
            : undefined,
      }}
    >
      {#snippet aboveMarks()}
        <!-- Unlike the plain area panel, range bands render above the marks:
             the stacked fills are opacity-1 blocks that would completely hide
             a belowMarks band, so the hatch sits on top as a light wash. -->
        {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
          <AnnotationRange {...annotation} />
        {/each}
        {#each pair.lineAnnotations ?? [] as annotation, i (i)}
          <ConnectorRule {...annotation} />
        {/each}
        {#each valueLabels as vl (vl.series)}
          <Labels
            seriesKey={vl.series}
            y={vl.y}
            value={vl.value}
            placement="middle"
            dy={vl.position === "bottom" ? -12 : 0}
            fill={vl.fill ?? ink}
            class="text-xs font-semibold"
          />
        {/each}
        {#each annotations as annotation, i (i)}
          <AnnotationPoint {...annotation} />
        {/each}
      {/snippet}
    </AreaChart>
  </div>
  <!-- Mobile legend fallback, identical to the stacked bar panel's. -->
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
