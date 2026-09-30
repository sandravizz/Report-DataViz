<script>
  import { AnnotationPoint, AnnotationRange, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { xAxisProps, yAxisFor, yTicks, chartPadding, plotXPadding, resolveAnnotations, endLabelAnnotation, desktopTooltips, halfCenturyTicksOnMobile, defaultYearTicks, yearTickFormat, tooltipHeaderYear } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // The FT-style white casing that separates crossing lines reads too heavy
  // at phone plot sizes, so both the line and its halo thin down on mobile
  // (same <1024 threshold as the rest of the chart theme).
  const lineStyle = $derived({
    curve: curveMonotoneX,
    strokeWidth: innerWidth < 1024 ? 2 : 2.5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
  const casingStyle = $derived({
    ...lineStyle,
    stroke: "var(--color-base-200)",
    strokeWidth: innerWidth < 1024 ? 4.5 : 6.5,
  });

  // Thousands grouping and at most two decimals — $lib/format.js.
  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;
  // The ticks the x axis draws: the figure's own list, or one per year
  // (every other on mobile). yearTickFormat reads the ends off this list.
  const xTicks = $derived(
    halfCenturyTicksOnMobile(pair.xTicks, innerWidth) ??
      defaultYearTicks(pair.data, pair.xKey, innerWidth)
  );

  // There is no built-in legend; series that opt in via an explicit
  // `endLabel` get their name at the end of the line instead, and right
  // padding is reserved for them. Series without `endLabel` (e.g.
  // de-emphasized background lines) get neither — charts where the series
  // list would make a useless legend supply `legendItems` below instead.
  const endLabelAnnotations = $derived(
    pair.series.filter((s) => s.endLabel).map((s) => endLabelAnnotation(s, pair, innerWidth))
  );
  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...endLabelAnnotations], innerWidth)
  );
  // Series named at the right edge (end labels) own that edge, so the y
  // axis moves to the left; otherwise it sits at the right (plotXPadding).
  const namesOnRight = $derived(endLabelAnnotations.length > 0);
  const xPadding = $derived(plotXPadding(innerWidth, namesOnRight));
  const padding = chartPadding();
</script>

<svelte:window bind:innerWidth />

{#snippet chart()}
<LineChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  legend={false}
  rule={false}
  {xPadding}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    xAxis: { ...xAxisProps, ticks: xTicks, format: pair.xTickFormat ?? yearTickFormat(xTicks) },
    yAxis: { ...yAxisFor(namesOnRight), ticks: pair.yTicks ?? yTicks, format: formatValue },
    // Tooltip rows go through the same formatValue as the y-axis: unit
    // suffix (e.g. "28%"), thousands grouping, at most two decimals;
    // figures whose x values aren't plain years (e.g. figure 2's IDA period
    // codes) override the header via `tooltipHeaderFormat`.
    // Header is the year alone — the data is annual, so LayerChart's default
    // "1 January 2035" is precision the figures never had. A figure can still
    // override it with pair.tooltipHeaderFormat.
    tooltip: {
      header: { format: pair.tooltipHeaderFormat ?? tooltipHeaderYear },
      item: { format: formatValue },
    },
    // Explicit color, not LayerChart's default `color-mix(...currentColor...)`
    // — that CSS-variable chain is what the PNG export loses on a larger DOM
    // (several series' worth of casing strokes), falling back to a solid
    // black un-themed default instead of a faint 10%-opacity line.
    // Gridlines on exactly the y-axis ticks (the chart-level Grid otherwise
    // picks its own, fewer ticks and skips some labelled values).
    grid: { stroke: "rgba(0, 0, 0, 0.1)", yTicks: pair.yTicks ?? yTicks },
  }}
>
  {#snippet marks({ context })}
    {#each context.series.visibleSeries as s (s.key)}
      <Spline seriesKey={s.key} {...casingStyle} />
      <Spline seriesKey={s.key} {...lineStyle} />
    {/each}
  {/snippet}
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks()}
    {#each annotations as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
  {/snippet}
</LineChart>
{/snippet}

{#if pair.legendItems}
  <!-- Manual legend for charts whose real series list would make a useless
       legend (e.g. figure 2's eight identical gray region lines): the figure
       supplies a few {label, color} entries that summarize the groupings.
       Rendered below the plot like the built-in bottom-left legend, with the
       same text size and swatch scale; pl-3 matches chartPadding's 12px
       left edge so the swatches align with the plot's left edge. -->
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="min-h-0 flex-1">
      {@render chart()}
    </div>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-3 text-xs font-light">
      {#each pair.legendItems as item (item.label)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.label}</span>
        </div>
      {/each}
    </div>
  </div>
{:else}
  {@render chart()}
{/if}
