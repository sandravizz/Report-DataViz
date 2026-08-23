<script>
  import { AnnotationPoint, AnnotationRange, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, chartSurface, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";
  import { colors, gridLine } from "$lib/colors";

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
  // rather than spaghetti. De-emphasized series get a hairline weight (1px) and a
  // much thinner, translucent casing: at figure 2's eight overlapping lines,
  // full-width opaque halos wash the chart out in white, and anything heavier
  // competes with the one line the reader is meant to follow.
  //
  // Stroke widths are the template branch's (2 / 2.5). Casing is stated as the
  // SHOULDER — the white showing on each side — rather than as a total width,
  // because that is the thing being judged. The template runs a 1.25px
  // shoulder on mobile and 2px on desktop; 2px is what read as too heavy once
  // figure 2's region lines went dark, so the mobile figure is now used at
  // both breakpoints.
  const strokeWidth = (deemphasized, mobile) =>
    deemphasized ? 1 : mobile ? 2 : 2.5;
  const shoulder = (deemphasized) => (deemphasized ? 0.375 : 1.25);
  const lineStyle = (deemphasized) => ({
    curve: curveMonotoneX,
    strokeWidth: strokeWidth(deemphasized, innerWidth < 1024),
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
  function casingWidth(deemphasized, innerWidth) {
    return strokeWidth(deemphasized, innerWidth < 1024) + shoulder(deemphasized) * 2;
  }
  // A series is de-emphasized by virtue of being painted in one of the two
  // greys — no separate flag in the figure data. `quiet` is here as well as
  // `quietLine` so a figure that reaches for the bar-chart grey still gets the
  // thin treatment rather than a full-weight 2.5px line.
  const deemphasizedColors = [colors.quiet, colors.quietLine];
  // Emphasis, not list order, decides what ends up on top: a de-emphasized
  // series painted after a full-weight one would lay its casing across it
  // (figure 2's eight region lines nicking the world line where they cross).
  // A stable partition — greys first, emphasized last — keeps every other
  // ordering decision (including the draw-in ordering below) intact.
  const emphasizedLast = (series) => [
    ...series.filter((s) => deemphasizedColors.includes(s.color)),
    ...series.filter((s) => !deemphasizedColors.includes(s.color)),
  ];
  // The line being drawn in on this step is the new information, so it goes on
  // top of the lines already standing rather than under them (figure 13b's
  // middle 40% arriving beneath the top 10% it crosses). The template branch
  // reversed the list here instead, because its step figures name the new
  // series first; this branch's `stepSeries` appends it last, so ordering it
  // explicitly — rather than reversing — holds either way. Read off
  // `pair.series` for the same reason `drawProps` does: `drawIn` is our own
  // field, not one LayerChart carries through `visibleSeries`.
  const isDrawIn = (key) => Boolean(pair.series.find((s) => s.key === key)?.drawIn);
  const drawnLast = (series) => [
    ...series.filter((s) => !isDrawIn(s.key)),
    ...series.filter((s) => isDrawIn(s.key)),
  ];
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
    // A figure can pin exact y ticks (pair.yTicks); otherwise the scale's own
    // candidates minus 0. Either way the same values go to the grid below —
    // LayerChart's Grid defaults to 4 y ticks of its own, which leaves the
    // gridlines landing between the axis labels on most domains.
    yAxis: { ...yAxisProps, ticks: pair.yTicks ?? excludeZeroTick, format: formatValue },
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
    grid: { stroke: gridLine, yTicks: pair.yTicks },
  }}
>
  {#snippet marks({ context })}
    {#each emphasizedLast(hasDrawIn ? drawnLast(context.series.visibleSeries) : context.series.visibleSeries) as s (s.key)}
      {@const draw = drawProps(s.key)}
      {@const deemphasized = deemphasizedColors.includes(s.color)}
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
       a few {label, color} entries summarizing the groupings. No left padding:
       it lines up with the figure title and subtitle, flush with the panel's
       left edge, rather than with the plot area inside yLabelPadding's gutter.

       Positioned absolutely at `bottom-full` rather than as a flex row above
       the chart, for two reasons: in flow it ate ~30px off the plot, so a
       figure with a legend was visibly shorter than every figure without one;
       and out of flow it can sit in the air ChartDisplay already leaves under
       the subtitle (mb-10/lg:mb-20) instead of pushing the plot down. Nothing
       else lives in that gap, and the PNG export reads the chart SVG only, so
       it is unaffected. -->
  <div class="relative flex min-w-0 flex-1 flex-col">
    <div class="absolute inset-x-0 bottom-full mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-light lg:mb-8">
      {#each pair.legendItems as item (item.label)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.label}</span>
        </div>
      {/each}
    </div>
    <div class="min-h-0 flex-1">
      {@render chart()}
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
