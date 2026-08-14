<script>
  import { AnnotationPoint, AnnotationRange, Area, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, endLabelHalo, halfCenturyTicksOnMobile, yearTickFormat, tooltipHeaderYear } from "$lib/chart-theme";

  let { pair, active = false } = $props();
  let innerWidth = $state(1024);

  // Scrolly draw-in for series flagged `drawIn` (docs/scrolly-line-draw-in.md).
  // One-shot per page load: `played` flips on *leaving* a step (effect cleanup,
  // not body), so a revisit shows the finished state.
  const hasDrawIn = $derived(pair.series.some((s) => s.drawIn));
  let played = $state(false);
  $effect(() => {
    if (!active) return;
    return () => {
      played = true;
    };
  });
  // Each animation is a class triple: base (hidden), -active (running), -done
  // (finished, shown instantly). Delays live in the stylesheet below.
  const phase = (base) =>
    played ? `${base} ${base}-done` : active ? `${base} ${base}-active` : base;
  const revealClass = $derived(phase("lc-draw-reveal"));
  const drawClass = $derived(phase("lc-line-draw"));
  const bandRevealClass = $derived(phase("lc-band-reveal"));
  const drawProps = (key) =>
    pair.series.find((s) => s.key === key)?.drawIn
      ? { pathLength: 1, class: drawClass } // pathLength=1 so dashoffset 1 spans the whole path
      : {};

  // Casing (docs/line-chart-casing.md) thins on mobile — too heavy at phone size.
  const lineStyle = $derived({
    curve: curveMonotoneX,
    strokeWidth: innerWidth < 1024 ? 2 : 2.5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
  const casingStyle = $derived({
    ...lineStyle,
    stroke: "var(--color-base-100)",
    strokeWidth: innerWidth < 1024 ? 4.5 : 6.5,
  });

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
  // Derived, not a one-time const: steps swap `pair` under the same panel.
  const firstTickYear = $derived(
    (pair.xTicks?.[0] ?? pair.data[0][pair.xKey]).getFullYear()
  );

  // No built-in legend: series opting in via `endLabel` get their name at the
  // line's end instead. Charts needing a real one use `legendItems` below.
  const endLabelAnnotations = $derived(
    pair.series
      .filter((s) => s.endLabel)
      .map((s) => {
        // The series' own last observation, not the last row — a series can
        // end early (null cells in the CSV).
        const last = pair.data.findLast((d) => d[s.value] != null);
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
              ...endLabelHalo(innerWidth),
              fill: s.color,
              class: reveal ? `text-xs font-light ${reveal}` : "text-xs font-light",
            },
          },
          // A series can add its own mobile nudge (e.g. two close end values
          // that would overlap once labels wrap).
          mobile: { ...endLabelMobileWrap, ...s.endLabelMobile },
        };
      })
  );
  // Band's percentage label: bare text (r: 0 drops the circle), anchored
  // middle/middle by the default "center" placement on the point the band
  // already inset for it — a pixel nudge in x would pull the text off the
  // mid-line its y was measured on. dy cancels AnnotationPoint's own -2.
  const diffBandLabel = $derived(
    pair.diffBand
      ? {
          x: pair.diffBand.labelX,
          y: pair.diffBand.labelY,
          r: 0,
          label: pair.diffBand.label,
          props: {
            label: { fill: pair.diffBand.color, dy: 0, class: "text-xs font-medium" },
          },
        }
      : null
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
  {padding}
  props={{
    xAxis: { ...xAxisProps, ticks: halfCenturyTicksOnMobile(pair.xTicks, innerWidth), format: pair.xTickFormat ?? yearTickFormat(innerWidth, firstTickYear) },
    yAxis: { ...yAxisProps, ticks: excludeZeroTick, format: formatValue },
    // Nothing is stacked, so a summed "total" row would be meaningless; the
    // data is annual, so the header is the year alone.
    tooltip: {
      hideTotal: true,
      header: { format: pair.tooltipHeaderFormat ?? tooltipHeaderYear },
      ...(pair.valueSuffix && { item: { format: formatValue } }),
    },
    // Explicit color, not LayerChart's `color-mix(...currentColor...)`: on a
    // larger DOM the PNG export loses that chain and falls back to black.
    grid: { stroke: "rgba(34, 29, 24, 0.1)" },
  }}
>
  {#snippet marks({ context })}
    <!-- Reversed so each step's newly drawn line paints on top of the rest. -->
    {#each hasDrawIn ? [...context.series.visibleSeries].reverse() : context.series.visibleSeries as s (s.key)}
      {@const draw = drawProps(s.key)}
      <Spline seriesKey={s.key} {...casingStyle} {...draw} />
      <Spline seriesKey={s.key} {...lineStyle} {...draw} />
    {/each}
  {/snippet}
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
    {#if pair.diffBand}
      <!-- Below the lines so their casings still separate them from the fill. -->
      <Area
        y0={pair.diffBand.y0}
        y1={pair.diffBand.y1}
        curve={curveMonotoneX}
        fill={pair.diffBand.color}
        fillOpacity={0.3}
        class={bandRevealClass}
      />
    {/if}
  {/snippet}
  {#snippet aboveMarks()}
    <g class={hasDrawIn ? revealClass : undefined}>
      {#each calloutAnnotations as annotation, i (i)}
        <AnnotationPoint {...annotation} />
      {/each}
    </g>
    {#if diffBandLabel}
      <!-- Appears with the band, on its own later delay. -->
      <g class={bandRevealClass}>
        <AnnotationPoint {...diffBandLabel} />
      </g>
    {/if}
    {#each endAnnotations as annotation, i (i)}
      <AnnotationPoint {...annotation} />
    {/each}
  {/snippet}
</LineChart>
{/snippet}

{#if pair.legendItems}
  <!-- Manual legend for charts whose series list would be useless as one (many
       near-identical lines): {label, color} entries summarize the groups.
       pl-9 matches yLabelPadding's gutter. -->
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
  /* Draw-in for scrolly reveal steps — docs/scrolly-line-draw-in.md. */
  :global(path.lc-line-draw) {
    stroke-dasharray: 1 1;
    stroke-dashoffset: 1;
  }
  :global(path.lc-line-draw-active) {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1300ms cubic-bezier(0.65, 0, 0.35, 1) 250ms;
  }
  :global(path.lc-line-draw-done) {
    stroke-dashoffset: 0;
  }
  /* Callouts and band fade in identically; only the delay differs, since the
     band waits for the line it annotates to finish drawing. */
  :global(.lc-draw-reveal),
  :global(.lc-band-reveal) {
    opacity: 0;
  }
  :global(.lc-draw-reveal-done),
  :global(.lc-band-reveal-done),
  :global(.lc-draw-reveal-active),
  :global(.lc-band-reveal-active) {
    opacity: 1;
  }
  :global(.lc-draw-reveal-active) {
    transition: opacity 450ms ease 1350ms;
  }
  :global(.lc-band-reveal-active) {
    transition: opacity 450ms ease 2150ms;
  }
</style>
