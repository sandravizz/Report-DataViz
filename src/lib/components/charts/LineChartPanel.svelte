<script>
  import { AnnotationLine, AnnotationPoint, AnnotationRange, Area, LineChart, Spline, Text } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelMobileWrap, endLabelHalo, desktopTooltips, halfCenturyTicksOnMobile, yearTickFormat, quarterTicks, quarterTickFormat, quarterXAxisProps, quarterAxisTick, yearLineOffset, twoLineXPadding } from "$lib/chart-theme";
  import { ink } from "$lib/colors";
  import { formatNumber } from "$lib/format";

  let { pair, active = false } = $props();
  let innerWidth = $state(1024);

  // Scrolly draw-in: a series flagged `drawIn` is drawn left-to-right (labels
  // and callouts fading in after) the first time its step goes active. Panels
  // stay mounted and crossfade, so this toggles classes on `active` rather
  // than using mount transitions.
  // One-shot per page load: `played` flips in the effect's CLEANUP — not its
  // body, so the first activation keeps its animating classes for the whole
  // run — and every later visit shows the finished state with no replay.
  // Full write-up: docs/scrolly-line-draw-in.md.
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
  // The diff band waits a beat longer than the labels — see lc-band-reveal.
  const bandRevealClass = $derived(
    played
      ? "lc-band-reveal lc-band-reveal-done"
      : active
        ? "lc-band-reveal lc-band-reveal-active"
        : "lc-band-reveal"
  );
  const drawProps = (key) =>
    pair.series.find((s) => s.key === key)?.drawIn
      ? {
          // pathLength=1 normalizes the path so dasharray/dashoffset 1 span it.
          pathLength: 1,
          class: drawClass,
        }
      : {};

  // The white casing that separates crossing lines reads too heavy at phone
  // sizes, so line and halo both thin down below 1024. Kept deliberately
  // narrow — one pixel of white per side is enough to read a crossing as
  // in-front/behind, and anything wider starts eating the colored lines
  // themselves wherever they run close together. See
  // docs/line-chart-casing.md.
  const lineStyle = $derived({
    curve: curveMonotoneX,
    strokeWidth: innerWidth < 1024 ? 2 : 2.5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
  const casingStyle = $derived({
    ...lineStyle,
    stroke: "var(--color-base-100)",
    strokeWidth: innerWidth < 1024 ? 3.5 : 4.5,
  });

  // Paint order for draw-in figures: the figure's own `series` order, which is
  // the order the steps add them in, so the newest line is drawn last (on
  // top). Anything LayerChart reports that the figure does not list (indexOf
  // -1) sorts to the front of the paint order, i.e. behind everything named.
  const markOrder = (visible) => {
    const order = pair.series.map((s) => s.key);
    return [...visible].sort(
      (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
    );
  };

  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;
  // The tooltip may pin its decimals (pair.tooltipDecimals) where the axis
  // rounds: an index reads 121,0 next to 93,4 in the readout, but "120,0" on a
  // gridline is a digit of noise.
  const formatTooltipValue = (d) =>
    `${formatNumber(d, pair.tooltipDecimals)}${pair.valueSuffix ?? ""}`;
  // Earliest year in the x domain, so the mobile year abbreviation knows which
  // tick to spell out. Derived, not const: steps swap `pair` under one panel.
  const firstTickYear = $derived(
    (pair.xTicks?.[0] ?? pair.data[0][pair.xKey]).getFullYear()
  );

  // A quarterly figure (pair.xQuarterly, ticks one per quarter) keeps only its
  // Q1 ticks and drops each year onto a second line under a hairline connector;
  // everything else keeps the plain year axis. The tick filter is the same at
  // every width — it is the DROPPED ROW that mobile has no room for, so below
  // lg quarterTickFormat writes the year plainly and the second line goes with
  // it, hence the innerWidth in twoLineXAxis.
  const quarterly = $derived(pair.xQuarterly === true);
  const xTicks = $derived(
    quarterly
      ? quarterTicks(pair.xTicks)
      : halfCenturyTicksOnMobile(pair.xTicks, innerWidth)
  );
  const xTickFormat = $derived(
    pair.xTickFormat ??
      (quarterly
        ? quarterTickFormat(innerWidth, firstTickYear)
        : yearTickFormat(innerWidth, firstTickYear))
  );
  const twoLineXAxis = $derived(quarterly && innerWidth >= 1024);

  // No built-in legend: a series with an explicit `endLabel` is named at the
  // end of its line (and right padding is reserved for it); one without gets
  // neither. Charts needing a summarizing legend pass `legendItems` below.
  const endLabelAnnotations = $derived(
    pair.series
      .filter((s) => s.endLabel)
      .map((s) => {
        // A series can end before the x-domain does, so anchor to its own
        // last observation rather than the last row.
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
          // Nudge (negative = up) for series whose end values sit close
          // enough that their labels would overlap.
          labelYOffset: s.endLabelYOffset ?? 0,
          props: {
            circle: { fill: s.color, stroke: "none", class: reveal },
            label: {
              ...endLabelHalo(innerWidth),
              fill: s.color,
              class: reveal ? `text-xs font-light ${reveal}` : "text-xs font-light",
            },
          },
          // Optional extra nudge for labels that wrap to two lines on mobile.
          mobile: { ...endLabelMobileWrap, ...s.endLabelMobile },
        };
      })
  );
  // The diff band's percentage label: plain text in the band's color, pulled
  // inward from its right edge so it sits inside the fill.
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
              // The band ends where the end labels land; on mobile's narrower
              // plot they crowd, so nudge this one down.
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
    endLabelPadding(innerWidth, endLabelAnnotations.length > 0, {
      ...yLabelPadding,
      ...(twoLineXAxis ? twoLineXPadding : {}),
    })
  );
</script>

<svelte:window bind:innerWidth />

<!-- The dropped-year x axis for quarterly figures. The format writes the year
     on a second line ("\n2018") and leaves the first line empty, so a tick puts
     no label at the axis at all — just a hairline connector running down to the
     year, which sits a row below in the body ink rather than the axis gray.
     Drawing that line here instead of letting Text render both is what buys the
     darker fill. props.x/props.y are the tick's foot on the plot, props.dy the
     axis's label gap; the connector stops quarterAxisTick.yearGap short of the
     year, which is the whole of how long it is. The lines[0] branch stays
     because the format is per-figure: one that does label its top line still
     gets it. -->
{#snippet quarterTickLabel({ props })}
  {@const lines = String(props.value ?? "").split("\n")}
  {#if lines[0]}
    <Text {...props} value={lines[0]} />
  {/if}
  {#if lines[1]}
    <line
      x1={props.x}
      y1={props.y}
      x2={props.x}
      y2={props.y + (props.dy ?? 0) + yearLineOffset - quarterAxisTick.yearGap}
      stroke={quarterAxisTick.stroke}
    />
    <Text {...props} value={lines[1]} fill={ink} dy={(props.dy ?? 0) + yearLineOffset} />
  {/if}
{/snippet}

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
    // The quarterly axis brings its own tick marks and lighter labels; every
    // other axis keeps the report's bare one.
    xAxis: {
      ...(twoLineXAxis ? quarterXAxisProps : xAxisProps),
      ticks: xTicks,
      format: xTickFormat,
      tickLabel: twoLineXAxis ? quarterTickLabel : undefined,
    },
    // A figure can pin exact y ticks (pair.yTicks); otherwise the scale's own
    // candidates minus 0. Either way the same values go to the grid below —
    // LayerChart's Grid defaults to 4 y ticks of its own, which leaves the
    // gridlines landing between the axis labels on most domains.
    yAxis: { ...yAxisProps, ticks: pair.yTicks ?? excludeZeroTick, format: formatValue },
    // Rows carry the figure's own number formatting, not layerchart's default
    // (which writes 102.4 on a page that writes 102,4). The header takes the
    // x-axis's words — a figure with a two-line or otherwise abbreviated axis
    // passes tooltipHeaderFormat to spell them out in one line. The total row
    // is off wherever summing the series means nothing, which for a line chart
    // is nearly always: pair.hideTooltipTotal.
    tooltip: {
      item: { format: formatTooltipValue },
      hideTotal: pair.hideTooltipTotal,
      ...(pair.tooltipHeaderFormat && {
        header: { format: pair.tooltipHeaderFormat },
      }),
    },
    // Explicit color, not LayerChart's default color-mix(currentColor …):
    // that CSS-variable chain is lost when the PNG export re-serializes the
    // SVG outside the page stylesheet, and gridlines rasterize solid black.
    // Same value it resolves to on screen: 10% of --color-base-content.
    grid: { stroke: "rgba(27, 65, 96, 0.1)", yTicks: pair.yTicks },
  }}
>
  {#snippet marks({ context })}
    <!-- Draw-in figures paint in the figure's own series order, which is also
         the order the steps introduce them in — so each step's new line lands
         on top of the ones already drawn, rather than sliding under them.
         LayerChart's own visibleSeries order follows the tooltip, which is not
         necessarily that, hence the explicit sort. -->
    {#each hasDrawIn ? markOrder(context.series.visibleSeries) : context.series.visibleSeries as s (s.key)}
      {@const draw = drawProps(s.key)}
      <Spline seriesKey={s.key} {...casingStyle} {...draw} />
      <Spline seriesKey={s.key} {...lineStyle} {...draw} />
    {/each}
  {/snippet}
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
    {#each pair.ruleAnnotations ?? [] as annotation, i (i)}
      <AnnotationLine {...annotation} />
    {/each}
    {#if pair.diffBand}
      <!-- Fill between this step's line and the previous one, revealed with
           the labels. Below the lines so their casings still read. -->
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
    <!-- Figure-level callouts wait for the draw-in; end labels handle their
         own reveal per series. -->
    <g class={hasDrawIn ? revealClass : undefined}>
      {#each calloutAnnotations as annotation, i (i)}
        <AnnotationPoint {...annotation} />
      {/each}
    </g>
    <!-- The band's label rides the band's later delay, not the callouts'. -->
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
  <!-- Manual legend for charts whose real series list would make a useless one
       (e.g. eight identical gray region lines): the figure supplies a few
       {label, color} entries summarizing the groupings. pl-9 matches
       yLabelPadding's 36px gutter so swatches align with the plot edge. -->
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
  /* With pathLength=1 the dash pattern spans the whole line, so animating
     dashoffset 1 → 0 wipes it in from the left. Leaving the step swaps
     `-active` for `-done`, pinning the drawn state with no transition. */
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
  /* Labels and callouts fade in once the draw finishes; `-done` shows them
     instantly on revisits. */
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
  /* The band waits ~600ms after the line lands (250ms delay + 1300ms). */
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
