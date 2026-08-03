<script>
  import { AnnotationPoint, AnnotationRange, LineChart, Spline } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, endLabelHalo, chartSurface, desktopTooltips, halfCenturyTicksOnMobile } from "$lib/chart-theme";
  import { colors } from "$lib/colors";

  let { pair, active = false } = $props();
  let innerWidth = $state(1024);

  // Scrolly draw-in for series flagged `drawIn` — see
  // docs/scrolly-line-draw-in.md for the full mechanism. One-shot per page
  // load: `played` flips on leaving an active state (in the effect's
  // cleanup, not its body) so a revisit shows the finished state instantly
  // instead of replaying.
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
  // A step's callout annotation (e.g. Figure 13c's "overtakes" marker) waits
  // a further ~1s after the line/end-labels land, on its own delay — see
  // lc-annotation-reveal's transition below.
  const annotationRevealClass = $derived(
    played
      ? "lc-annotation-reveal lc-annotation-reveal-done"
      : active
        ? "lc-annotation-reveal lc-annotation-reveal-active"
        : "lc-annotation-reveal"
  );

  // FT-style line treatment: monotone smoothing (rounds corners without
  // overshooting the data) plus round joins/caps. Each line is drawn twice in
  // the marks snippet below — a surface-colored casing under the colored
  // stroke — so crossings read as "in front of" instead of spaghetti.
  // De-emphasized background series (colors.regionGray, e.g. figure 2's eight
  // region lines) get half the line weight of a highlighted line, plus a
  // much thinner, slightly translucent casing — with that many overlapping
  // lines, full weight and a full-width opaque halo on every one washes the
  // chart out in white. Casing width also gets a further reduction on
  // mobile, same <1024 threshold as the rest of the report.
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

  // There is no built-in legend; series that opt in via an explicit
  // `endLabel` get their name at the end of the line instead, and right
  // padding is reserved for them. Series without `endLabel` (e.g.
  // de-emphasized background lines) get neither — charts where the series
  // list would make a useless legend supply `legendItems` below instead.
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
    // Explicit color, not LayerChart's default `color-mix(...currentColor...)`
    // — that CSS-variable chain is what the PNG export was losing on figure
    // 2's larger DOM (9 series' worth of casing strokes), falling back to a
    // solid black un-themed default instead of a faint 10%-opacity line.
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
