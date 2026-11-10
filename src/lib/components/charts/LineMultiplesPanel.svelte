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
  // panel name). Optional: valueSuffix.
  import { LineChart } from "layerchart";
  import { xAxisProps, yAxisLeftProps, plotXPadding, endLabelSpace, chartPadding, excludeZeroTick, defaultYearTicks, yearTickFormat, tooltipHeaderYear, tooltipCard } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";
  import { TapTooltip } from "$lib/tapTooltip.svelte.js";
  import { ink } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;

  // Year ticks from one panel's rows (every panel has the same years).
  const firstGroup = $derived(pair.data.filter((d) => d[pair.groupKey] === pair.groups[0]));
  const xTicks = $derived(defaultYearTicks(firstGroup, pair.xKey, innerWidth));
  // Each panel is short, so two gridlines each.
  const yTicks = (scale) => excludeZeroTick(scale, 2);

  // The left strip holds the y labels; the names sit in the chart's right
  // padding, outside the plot, so the plot's own right strip stays narrow.
  const xPadding = $derived([plotXPadding(innerWidth, true)[0], 6]);
  const padding = $derived(chartPadding({ right: endLabelSpace(innerWidth) }));

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
    yDomain={[0, null]}
    yNice
    facet={{
      paddingY: 0.35,
      tooltip: (d) => pair.groupLabel(d[pair.groupKey]),
      axis: {
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
        format: innerWidth >= 1024 ? (d) => String(d.getFullYear()) : yearTickFormat(xTicks),
      },
      yAxis: { ...yAxisLeftProps, ticks: yTicks, format: formatValue },
      grid: { yTicks },
      tooltip: { ...tooltipCard(tooltipHeaderYear), item: { format: formatValue } },
    }}
  />
</div>
