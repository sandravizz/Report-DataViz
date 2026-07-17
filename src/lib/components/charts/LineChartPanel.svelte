<script>
  import { AnnotationPoint, AnnotationRange, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";

  let { pair, active = false } = $props();
  let innerWidth = $state(1024);

  // Scrolly draw-in: series flagged `drawIn` on the figure get their line
  // drawn left-to-right (and their end label / callouts faded in afterwards)
  // each time their step becomes the active one. All panels stay mounted and
  // crossfade, so this is driven by toggling classes on `active`, not by
  // mount transitions.
  const hasDrawIn = $derived(pair.series.some((s) => s.drawIn));
  const revealClass = $derived(
    active ? "lc-draw-reveal lc-draw-reveal-active" : "lc-draw-reveal"
  );
  const drawProps = (key) =>
    pair.series.find((s) => s.key === key)?.drawIn
      ? {
          // pathLength=1 normalizes the path so dasharray/dashoffset 1 span it.
          pathLength: 1,
          class: active ? "lc-line-draw lc-line-draw-active" : "lc-line-draw",
        }
      : {};

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
        // A drawn-in series' label waits for the line to finish drawing.
        const reveal = s.drawIn ? revealClass : undefined;
        return {
          x: last[pair.xKey],
          y: last[s.value],
          r: 4,
          label: s.endLabel,
          labelPlacement: "right",
          labelXOffset: 8,
          props: {
            circle: { fill: s.color, stroke: "none", class: reveal },
            label: {
              fill: s.color,
              class: reveal ? `text-xs font-light ${reveal}` : "text-xs font-light",
            },
          },
          mobile: endLabelMobileWrap,
        };
      })
  );
  const calloutAnnotations = $derived(
    resolveAnnotations(pair.annotations ?? [], innerWidth)
  );
  const endAnnotations = $derived(resolveAnnotations(endLabelAnnotations, innerWidth));
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
      {@const draw = drawProps(s.key)}
      <Spline seriesKey={s.key} {...casingStyle} {...draw} />
      <Spline seriesKey={s.key} {...lineStyle} {...draw} />
    {/each}
  {/snippet}
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks()}
    <!-- Figure-level callouts wait for the draw-in on steps that have one;
         end labels handle their reveal per-series via their own classes. -->
    <g class={hasDrawIn ? revealClass : undefined}>
      {#each calloutAnnotations as annotation, i (i)}
        <AnnotationPoint {...annotation} />
      {/each}
    </g>
    {#each endAnnotations as annotation, i (i)}
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

<style>
  /* Draw-in for scrolly reveal steps. With pathLength=1 the dash pattern spans
     the whole line, so animating dashoffset 1 → 0 wipes it in from the left.
     On leaving a step the reset must wait out ChartDisplay's 500ms panel
     crossfade — the outgoing panel is still visible, and an instant snap
     would make the already-drawn line blink out mid-fade. The 0s/500ms
     transition holds the line drawn until the panel is gone, then snaps the
     offset back so the animation replays on the next visit. */
  :global(path.lc-line-draw) {
    stroke-dasharray: 1 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 0s 500ms;
  }
  :global(path.lc-line-draw-active) {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1300ms cubic-bezier(0.65, 0, 0.35, 1) 250ms;
  }
  /* Labels/callouts tied to a drawn-in line fade in once the draw finishes.
     Same hold as the line above: stay visible through the panel crossfade,
     then snap to 0 once the panel is hidden. */
  :global(.lc-draw-reveal) {
    opacity: 0;
    transition: opacity 0s 500ms;
  }
  :global(.lc-draw-reveal-active) {
    opacity: 1;
    transition: opacity 450ms ease 1350ms;
  }
</style>
