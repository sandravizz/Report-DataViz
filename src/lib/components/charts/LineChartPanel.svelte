<script>
  import { AnnotationPoint, AnnotationRange, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, endLabelHalo, chartSurface, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";
  import { colors } from "$lib/colors";

  let { pair, active = false } = $props();
  let innerWidth = $state(1024);

  // Scrolly draw-in for series flagged `drawIn` — full mechanism in
  // docs/scrolly-line-draw-in.md. One-shot per page load: `played` flips in
  // the effect's CLEANUP, not its body, so a revisit lands on the finished
  // state instantly instead of replaying.
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
  const drawProps = (key) =>
    pair.series.find((s) => s.key === key)?.drawIn
      ? { pathLength: 1, class: drawClass } // pathLength=1 so dashoffset 1 spans the whole path
      : {};
  // A step's callout (e.g. Figure 13c's "overtakes" marker) waits a further
  // ~1s after the lines and end labels land — see lc-annotation-reveal below.
  const annotationRevealClass = $derived(
    played
      ? "lc-annotation-reveal lc-annotation-reveal-done"
      : active
        ? "lc-annotation-reveal lc-annotation-reveal-active"
        : "lc-annotation-reveal"
  );

  // FT-style line treatment — full rationale in docs/line-chart-casing.md.
  // Each line is drawn twice in the marks snippet below (surface-colored
  // casing under the colored stroke) so crossings read as "in front of"
  // rather than spaghetti. De-emphasized series get half the weight and a
  // much thinner, translucent casing: at figure 2's eight overlapping lines,
  // full-width opaque halos wash the chart out in white.
  const lineStyle = (deemphasized) => ({
    curve: curveMonotoneX,
    strokeWidth: deemphasized ? 1.25 : 2.5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
  function casingWidth(deemphasized, innerWidth) {
    const mobile = innerWidth < 1024;
    if (deemphasized) return mobile ? 1.6 : 2;
    return mobile ? 5 : 6.5;
  }
  const casingStyle = (deemphasized) => ({
    ...lineStyle(deemphasized),
    stroke: chartSurface,
    strokeWidth: casingWidth(deemphasized, innerWidth),
    opacity: deemphasized ? 0.7 : 1,
  });

  const formatYear = timeFormat("%Y");
  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;

  // In place of a built-in legend, series opting in with an `endLabel` get
  // their name at the line's end, with right padding reserved for it. Series
  // without one (e.g. de-emphasized background lines) get nothing; charts
  // whose series list makes a useless legend supply `legendItems` instead.
  const endLabelAnnotations = $derived(
    pair.series
      .filter((s) => s.endLabel)
      .map((s) => {
        const last = pair.data[pair.data.length - 1];
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
          mobile: endLabelMobileWrap,
        };
      })
  );
  const calloutAnnotations = $derived(resolveAnnotations(pair.annotations ?? [], innerWidth));
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
    xAxis: { ...xAxisProps, ticks: halfCenturyTicksOnMobile(pair.xTicks, innerWidth), format: formatYear },
    yAxis: { ...yAxisProps, ticks: excludeZeroTick, format: formatValue },
    // Tooltip header shows just the year (no month/day, since the data has
    // no finer granularity); rows show the same unit suffix as the y-axis
    // (e.g. "28%"), as whole numbers.
    tooltip: {
      header: { format: formatYear },
      item: { format: formatValue },
      hideTotal: pair.hideTooltipTotal,
    },
    // Explicit color, not LayerChart's `color-mix(...currentColor...)` default
    // — the PNG export loses that CSS-variable chain and falls back to solid
    // black instead of a faint 10% line.
    grid: { stroke: "rgba(0, 0, 0, 0.1)" },
  }}
>
  {#snippet marks({ context })}
    {#each hasDrawIn ? [...context.series.visibleSeries].reverse() : context.series.visibleSeries as s (s.key)}
      {@const draw = drawProps(s.key)}
      {@const deemphasized = s.color === colors.regionGray}
      <Spline seriesKey={s.key} {...casingStyle(deemphasized)} {...draw} />
      <Spline seriesKey={s.key} {...lineStyle(deemphasized)} {...draw} />
    {/each}
  {/snippet}
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks()}
    <g class={hasDrawIn ? annotationRevealClass : undefined}>
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
  <!-- Manual legend for charts whose series list would make a useless one
       (e.g. figure 2's eight identical gray region lines): the figure supplies
       a few {label, color} entries summarizing the groupings. pl-9 matches
       yLabelPadding's 36px gutter so swatches align with the plot's left edge. -->
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
  /* Draw-in for scrolly reveal — see docs/scrolly-line-draw-in.md for the
     full mechanism and tuning knobs. */
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
  :global(.lc-annotation-reveal) {
    opacity: 0;
  }
  :global(.lc-annotation-reveal-active) {
    opacity: 1;
    transition: opacity 450ms ease 2350ms;
  }
  :global(.lc-annotation-reveal-done) {
    opacity: 1;
  }
</style>
