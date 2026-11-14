<script>
  // LINE SMALL MULTIPLES (paris-demo, 2026-11-10): one panel per group,
  // stacked, through LayerChart's own faceting — LineChart's `fy` splits the
  // rows into a column of panels that share the x and y scales, so the
  // panels compare. No hand-built grid: the panel names are the facet's own
  // headers (`facet.axis`), down the right edge like end labels, so the y
  // axis sits on the LEFT (chart-theme's yAxisLeftProps, the rule for charts
  // that name their series at the right). The x axis draws once, under the
  // bottom panel (LayerChart's per-panel edge rule).
  //
  // Figure fields: data (long rows), xKey (Dates), yKey, groupKey, groups
  // (panel order), colors (one per group, same order), groupLabel (group →
  // panel name). Optional: valueSuffix; xTicks (the labelled years, as
  // Dates, for a span too long to label every year — always ’yy between
  // full-year ends); yMax (the top of the y scale, so two figures can share
  // one scale); yTickCount (gridlines per panel, default 2); tickSuffix
  // (the y labels' suffix where it differs from the tooltip's valueSuffix);
  // annotations (callouts from annotation-presets.js, as on the other panels).
  //
  // ONE GROUP (2026-11-14): a single line needs no panel name, so the right
  // edge is free and the y labels go where the house rule puts them — at the
  // END of their gridlines, right-aligned, sitting on the line (yAxisProps).
  import { AnnotationPoint, LineChart } from "layerchart";
  import { xAxisProps, yAxisProps, yAxisLeftProps, plotXPadding, endLabelSpace, chartPadding, excludeZeroTick, resolveAnnotations, defaultYearTicks, yearTickFormat, tooltipHeaderYear, tooltipCard } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";
  import { TapTooltip } from "$lib/tapTooltip.svelte.js";
  import { ink } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;
  const formatTick = (d) => `${formatNumber(d)}${pair.tickSuffix ?? pair.valueSuffix ?? ""}`;
  // Several panels are named down the right edge; one panel is not named.
  const named = $derived(pair.groups.length > 1);

  // Year ticks from one panel's rows (every panel has the same years).
  const firstGroup = $derived(pair.data.filter((d) => d[pair.groupKey] === pair.groups[0]));
  const xTicks = $derived(pair.xTicks ?? defaultYearTicks(firstGroup, pair.xKey, innerWidth));
  // Each panel is short, so two gridlines each (a lone tall panel asks for more).
  const yTicks = (scale) => excludeZeroTick(scale, pair.yTickCount ?? 2);

  // The left strip holds the y labels; the names sit in the chart's right
  // padding, outside the plot, so the plot's own right strip stays narrow.
  const xPadding = $derived(named ? [plotXPadding(innerWidth, true)[0], 6] : plotXPadding(innerWidth));
  const padding = $derived(named ? chartPadding({ right: endLabelSpace(innerWidth) }) : chartPadding());

  const annotations = $derived(resolveAnnotations(pair.annotations ?? [], innerWidth));

  let context = $state();
  // Tooltip pins on click/tap (lib/tapTooltip.svelte.js).
  const tip = new TapTooltip(() => context);
</script>

<svelte:window bind:innerWidth />

<div class="relative min-w-0 flex-1">
  <LineChart
    data={pair.data}
    x={pair.xKey}
    y={pair.yKey}
    c={pair.groupKey}
    cDomain={pair.groups}
    cRange={pair.colors}
    fy={pair.groupKey}
    fyDomain={pair.groups}
    yDomain={[0, pair.yMax ?? null]}
    yNice
    facet={{
      paddingY: 0.35,
      tooltip: (d) => pair.groupLabel(d[pair.groupKey]),
      axis: named && {
        format: pair.groupLabel,
        tickLabelProps: { dx: 8, textAnchor: "start", verticalAnchor: "middle", fill: ink, class: "text-xs font-medium" },
      },
    }}
    legend={false}
    rule={false}
    {xPadding}
    {padding}
    bind:context
    tooltipContext={tip.props}
    props={{
      spline: { strokeWidth: 2 },
      xAxis: {
        ...xAxisProps,
        ticks: xTicks,
        format: !pair.xTicks && innerWidth >= 1024 ? (d) => String(d.getFullYear()) : yearTickFormat(xTicks),
      },
      yAxis: { ...(named ? yAxisLeftProps : yAxisProps), ticks: yTicks, format: formatTick },
      grid: { yTicks },
      tooltip: { ...tooltipCard(tooltipHeaderYear), item: { format: formatValue } },
    }}
  >
    {#snippet aboveMarks()}
      {#each annotations as annotation, i (i)}
        <AnnotationPoint {...annotation} />
      {/each}
    {/snippet}
  </LineChart>
</div>
