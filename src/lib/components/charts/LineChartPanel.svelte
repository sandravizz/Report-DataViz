<script>
  import { AnnotationPoint, AnnotationRange, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // FT-style line treatment: monotone smoothing (rounds corners without
  // overshooting the data) plus round joins/caps. Each line is drawn twice in
  // the marks snippet below — a surface-colored casing under the colored
  // stroke — so crossings read as "in front of" instead of spaghetti.
  const lineStyle = {
    curve: curveMonotoneX,
    strokeWidth: 2.5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  };
  const casingStyle = {
    ...lineStyle,
    stroke: "var(--color-base-100)",
    strokeWidth: 6.5,
  };

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // There is no built-in legend; series that opt in via an explicit
  // `endLabel` get their name at the end of the line instead, and right
  // padding is reserved for them. Series without `endLabel` (e.g.
  // de-emphasized background lines) get neither — charts where the series
  // list would make a useless legend supply `legendItems` below instead.
  const endLabelAnnotations = $derived(
    pair.series
      .filter((s) => s.endLabel)
      .map((s) => {
        // A series can end before the x-domain does (null cells in the CSV),
        // so anchor its label to its own last observation, not the last row.
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

{#snippet chart()}
<LineChart
  data={pair.data}
  x={pair.xKey}
  yDomain={pair.yDomain}
  series={pair.series}
  legend={false}
  rule={false}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    xAxis: { ...xAxisProps, ticks: halfCenturyTicksOnMobile(pair.xTicks, innerWidth), format: pair.xTickFormat ?? formatYear },
    yAxis: { ...yAxisProps, ticks: excludeZeroTick, format: formatValue },
    // Tooltip rows show the same unit suffix as the y-axis (e.g. "28%");
    // figures whose x values aren't plain years (e.g. figure 2's IDA period
    // codes) override the header via `tooltipHeaderFormat`.
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
       same text size and swatch scale; pl-9 matches yLabelPadding's 36px
       axis gutter so the swatches align with the plot's left edge. -->
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="min-h-0 flex-1">
      {@render chart()}
    </div>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-9 text-xs font-light">
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
