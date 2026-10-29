<script>
  import { AnnotationPoint, AnnotationRange, AreaChart, Labels } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisFor, yTicks, percentTicks, chartPadding, plotXPadding, resolveAnnotations, areaFillOpacity, solidWash, defaultYearTicks, yearTickFormat, tooltipHeaderYear, tooltipHeaderQuarter } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";
  import { lineCallout } from "$lib/data/annotation-presets.js";
  import { ink, carta } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Thousands grouping and at most two decimals — $lib/format.js.
  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;
  // One tick per year (every other on mobile), or the figure's own list
  // (e.g. each year's Q1 on a quarterly axis); yearTickFormat reads the
  // ends off this list.
  const xTicks = $derived(pair.xTicks ?? defaultYearTicks(pair.data, pair.xKey, innerWidth));

  // Same direct-label convention as BarChartPanelStacked: on desktop each
  // series is named beside its band at the last observation instead of a
  // legend; mobile falls back to the bottom legend. Figures can opt out via
  // directLabels: false (e.g. composite figures where the reserved right
  // padding would break x alignment with a sibling chart) — they get the
  // legend on every viewport instead.
  const directLabelsActive = $derived(
    pair.series.length > 1 && innerWidth >= 1024 && pair.directLabels !== false
  );

  // `insideLabels`: the names go INSIDE the bands instead, left-aligned
  // just in from the FIRST observation, in the ink — for
  // bands wide enough to hold a line of type. No leader lines, and the
  // right edge stays with the y axis. Ink, not the series colour: a label
  // inside a fill takes white or ink by the fill's luminance (dataviz skill,
  // marks-and-anatomy.md), and on these washes ink clears 5.7:1 or better
  // where white fails. A figure can still pass `labelColor`.
  // THE HALO is the band's own colour, not the page's: the wash pre-mixed
  // to an opaque tone (solidWash) and painted under the glyphs (paint-order:
  // stroke), so a gridline or band edge stops short of the letters without
  // a pale patch showing around them.
  // At EVERY width (Sandra, 2026-10-29): the bands have the room on a
  // phone too, so no legend fallback for these.
  const insideLabelsActive = $derived(pair.series.length > 1 && pair.insideLabels === true);
  const insideLabelAnnotations = $derived.by(() => {
    if (!insideLabelsActive) return [];
    const first = pair.data[0];
    const total = pair.series.reduce((sum, s) => sum + first[s.value], 0);
    let cum = 0;
    return pair.series.map((s) => {
      const mid = cum + first[s.value] / 2;
      cum += first[s.value];
      return {
        x: first[pair.xKey],
        y: pair.percent ? mid / total : mid,
        r: 0,
        label: s.key,
        labelPlacement: "right",
        labelXOffset: 10,
        props: {
          label: {
            textAnchor: "start",
            verticalAnchor: "middle",
            fill: s.labelColor ?? ink,
            stroke: solidWash(s.color, pair.fillOpacity ?? areaFillOpacity, carta.cream),
            strokeWidth: innerWidth < 1024 ? 3 : 6,
            // A series can set its own weight (`labelWeight`), so the one
            // the figure is about reads heavier than its context.
            // text-sm: the size of the small-multiple panel titles on
            // desktop (DoubleChartPanel's lg:text-sm); text-xs on phones,
            // as those titles, where the thinnest band is ~13px tall.
            // Phones: 11px, keeping the bold (Sandra 2026-10-29: semibold
            // at 12px read heavy in the thin bands).
            class: `${innerWidth < 1024 ? "text-[11px]" : "text-sm"} ${s.labelWeight ?? "font-semibold"}`,
          },
        },
      };
    });
  });

  const directLabelAnnotations = $derived.by(() => {
    if (!directLabelsActive || pair.insideLabels) return [];
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
    resolveAnnotations(
      [...(pair.annotations ?? []), ...directLabelAnnotations, ...insideLabelAnnotations],
      innerWidth
    )
  );
  // Direct labels own the right edge, so the y axis moves to the left
  // while they show; otherwise it sits at the right (plotXPadding).
  // Direct labels own the right edge, so the y axis moves to the left
  // while they show; inside labels leave it on the right.
  const namesOnRight = $derived(directLabelsActive && !pair.insideLabels);
  const xPadding = $derived(plotXPadding(innerWidth, namesOnRight));
  const padding = chartPadding();
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
      {xPadding}
      tooltipContext={true}
      {padding}
      props={{
        area: {
          // A figure can deepen its washes (`fillOpacity`).
          fillOpacity: pair.fillOpacity ?? areaFillOpacity,
          // `smooth`: rounded band edges, the line panel's curve.
          curve: pair.smooth ? curveMonotoneX : undefined,
          // A figure can thin the band edges (`strokeWidth`); a series can
          // recolour its own edge via `props.line` (LayerChart series props).
          line: { strokeWidth: pair.strokeWidth ?? 2.5 },
        },
        // Full years on desktop (2023 2024 2025 2026: room enough, Sandra
        // 2026-10-29); phones keep the ’yy middles.
        xAxis: {
          ...xAxisProps,
          ticks: xTicks,
          format: innerWidth >= 1024 ? (d) => String(d.getFullYear()) : yearTickFormat(xTicks),
        },
        yAxis: {
          ...yAxisFor(namesOnRight),
          ticks: pair.yTicks ?? (pair.percent ? percentTicks : yTicks),
          format: pair.percent ? "percentRound" : formatValue,
        },
        // Gridlines on exactly the y-axis ticks: LayerChart's chart-level Grid
        // otherwise picks its own (fewer) ticks and skips some labelled values.
        grid: { yTicks: pair.yTicks ?? (pair.percent ? percentTicks : yTicks) },
        // Header is the year alone — the data is annual, so LayerChart's
        // default "1 January 2035" is precision the figures never had.
        tooltip: {
          // Quarterly figures (`pair.quarterly`, carta-demo) name the quarter.
          header: { format: pair.tooltipHeaderFormat ?? (pair.quarterly ? tooltipHeaderQuarter : tooltipHeaderYear) },
          // `tooltipFormat` lets a figure keep the source's decimals
          // ("59.9%") where whole percents would round them away.
          ...(pair.percent
            ? { item: { format: pair.tooltipFormat ?? "percentRound" }, hideTotal: true }
            : { item: { format: formatValue } }),
        },
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
  {#if pair.series.length > 1 && !directLabelsActive && !insideLabelsActive}
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-3 text-xs font-light">
      {#each pair.series as item (item.key)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.key}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
