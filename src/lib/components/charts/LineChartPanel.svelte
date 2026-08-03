<script>
  import { AnnotationPoint, AnnotationRange, Area, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, endLabelHalo, desktopTooltips, halfCenturyTicksOnMobile, yearTickFormat } from "$lib/chart-theme";

  let { pair, active = false } = $props();
  let innerWidth = $state(1024);

  // Scrolly draw-in for series flagged `drawIn` — see docs/scrolly-line-draw-in.md
  // for the full mechanism. One-shot per page load: `played` flips on leaving
  // a step (in the effect's cleanup, not its body) so a revisit shows the
  // finished state instantly instead of replaying.
  const hasDrawIn = $derived(pair.series.some((s) => s.drawIn));
  let played = $state(false);
  $effect(() => {
    if (!active) return;
    return () => {
      played = true;
    };
  });
  const revealClass = $derived(
    played
      ? "lc-draw-reveal lc-draw-reveal-done"
      : active
        ? "lc-draw-reveal lc-draw-reveal-active"
        : "lc-draw-reveal"
  );
  const drawClass = $derived(
    played
      ? "lc-line-draw lc-line-draw-done"
      : active
        ? "lc-line-draw lc-line-draw-active"
        : "lc-line-draw"
  );
  // Diff band fades in a beat after the line lands, on its own delay.
  const bandRevealClass = $derived(
    played
      ? "lc-band-reveal lc-band-reveal-done"
      : active
        ? "lc-band-reveal lc-band-reveal-active"
        : "lc-band-reveal"
  );
  const drawProps = (key) =>
    pair.series.find((s) => s.key === key)?.drawIn
      ? { pathLength: 1, class: drawClass } // pathLength=1 so dashoffset 1 spans the whole path
      : {};

  // Casing (docs/line-chart-casing.md) thins down on mobile — it reads too
  // heavy at phone plot sizes.
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

  // No built-in legend: series that opt in via `endLabel` get their name at
  // the line's end instead. Charts needing a real legend use `legendItems` below.
  const endLabelAnnotations = $derived(
    pair.series
      .filter((s) => s.endLabel)
      .map((s) => {
        // Anchor to the series' own last observation, not the last row — a
        // series can end early (null cells in the CSV).
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
          // A series can opt into its own extra mobile nudge (e.g. two close
          // end values that would otherwise overlap once labels wrap).
          mobile: { ...endLabelMobileWrap, ...s.endLabelMobile },
        };
      })
  );
  // Diff band's percentage label: plain text, no circle or leader line.
  const diffBandAnnotations = $derived(
    pair.diffBand
      ? resolveAnnotations(
          [
            {
              x: pair.diffBand.labelX,
              y: pair.diffBand.labelY,
              r: 0,
              label: pair.diffBand.label,
              labelPlacement: "left",
              labelXOffset: 8,
              props: {
                circle: { r: 0, stroke: "none", fill: "none" },
                label: {
                  fill: pair.diffBand.color,
                  textAnchor: "end",
                  verticalAnchor: "middle",
                  class: "text-xs font-medium",
                },
              },
              // Nudge down on mobile, clear of the end-of-line labels the
              // band's own label would otherwise crowd.
              mobile: { labelYOffset: 8 },
            },
          ],
          innerWidth
        )
      : []
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
    xAxis: { ...xAxisProps, ticks: halfCenturyTicksOnMobile(pair.xTicks, innerWidth), format: pair.xTickFormat ?? yearTickFormat(innerWidth, firstTickYear) },
    yAxis: { ...yAxisProps, ticks: excludeZeroTick, format: formatValue },
    // Line charts plot trends (often an index), never a stack — a summed
    // "total" row is meaningless here, unlike the stacked bar tooltip.
    tooltip: {
      hideTotal: true,
      ...(pair.valueSuffix && { item: { format: formatValue } }),
      ...(pair.tooltipHeaderFormat && {
        header: { format: pair.tooltipHeaderFormat },
      }),
    },
    // Explicit color, not LayerChart's default `color-mix(...currentColor...)`
    // — that CSS-variable chain is what the PNG export loses on a larger DOM
    // (several series' worth of casing strokes), falling back to a solid
    // black un-themed default instead of a faint 10%-opacity line.
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
    <!-- Band's label appears with the band, on its own later delay. -->
    <g class={bandRevealClass}>
      {#each diffBandAnnotations as annotation, i (i)}
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
  <!-- Manual legend for charts whose real series list would be useless as
       one (e.g. many near-identical lines): a few {label, color} entries
       summarize the groupings instead. pl-9 matches yLabelPadding's gutter. -->
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
  /* Draw-in for scrolly reveal steps — see docs/scrolly-line-draw-in.md for
     the full mechanism and tuning knobs. */
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
  :global(.lc-draw-reveal) {
    opacity: 0;
  }
  :global(.lc-draw-reveal-active) {
    opacity: 1;
    transition: opacity 450ms ease 1350ms;
  }
  :global(.lc-draw-reveal-done) {
    opacity: 1;
  }
  :global(.lc-band-reveal) {
    opacity: 0;
  }
  :global(.lc-band-reveal-active) {
    opacity: 1;
    transition: opacity 450ms ease 2150ms;
  }
  :global(.lc-band-reveal-done) {
    opacity: 1;
  }
</style>
