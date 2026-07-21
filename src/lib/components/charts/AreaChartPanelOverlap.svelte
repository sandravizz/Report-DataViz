<script>
  import { AnnotationPoint, AnnotationRange, Area, AreaChart } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import ConnectorRule from "./ConnectorRule.svelte";
  import { xAxisProps, yAxisProps, yLabelPadding, resolveAnnotations, excludeZeroTick, endLabelPadding, endLabelAnnotation, areaFillOpacity, desktopTooltips, halfCenturyTicksOnMobile, yearTickFormat } from "$lib/chart-theme";

  let { pair, active = false } = $props();
  let innerWidth = $state(1024);

  // Scrolly draw-in, same convention as the IEA report's LineChartPanel:
  // series flagged `drawIn` on the figure get wiped in left-to-right (line
  // and area wash together, via an animated clip inset) the first time their
  // step becomes the active one, with callouts fading in afterwards. All
  // panels stay mounted and crossfade, so this is driven by toggling classes
  // on `active`, not by mount transitions.
  //
  // One-shot per page load: `played` flips in the effect's cleanup (i.e. on
  // leaving the step), so the first activation keeps its animating classes
  // for its whole duration and every later visit shows the finished state.
  const hasDrawIn = $derived(pair.series.some((s) => s.drawIn));
  let played = $state(false);
  $effect(() => {
    if (!active) return;
    return () => {
      played = true;
    };
  });
  const wipeClass = $derived(
    played
      ? "ac-area-wipe ac-area-wipe-done"
      : active
        ? "ac-area-wipe ac-area-wipe-active"
        : "ac-area-wipe"
  );
  const revealClass = $derived(
    played
      ? "ac-draw-reveal ac-draw-reveal-done"
      : active
        ? "ac-draw-reveal ac-draw-reveal-active"
        : "ac-draw-reveal"
  );

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
  // Earliest year in the chart's own x domain, so the mobile year
  // abbreviation below knows which tick to keep spelled out in full.
  const firstTickYear = $derived(
    (pair.xTicks?.[0] ?? pair.data[0][pair.xKey]).getFullYear()
  );

  // Figures whose desktop ticks sit too close for a phone axis (e.g. an
  // extra end-of-series year beside a regular tick) pass a sparser
  // `xTicksMobile` set; otherwise the shared half-century fallback applies.
  const xTicks = $derived(
    innerWidth < 1024 && pair.xTicksMobile
      ? pair.xTicksMobile
      : halfCenturyTicksOnMobile(pair.xTicks, innerWidth)
  );

  // Datawrapper-style overlapping areas (layerchart's default series layout —
  // NOT stacked): every series is drawn from the baseline, so where they
  // overlap the washes blend. All washes use the shared theme opacity —
  // de-emphasis comes from the series *color* (a muted tint) and a thinner
  // `lineWidth`, not from a weaker fill. List the de-emphasized series first —
  // later series paint on top.
  const areaStyle = (s) => ({
    curve: curveMonotoneX,
    fillOpacity: areaFillOpacity,
    line: { curve: curveMonotoneX, strokeWidth: s.lineWidth ?? 2.5 },
  });

  // Same end-label convention as LineChartPanel: series opt in via `endLabel`
  // and get their name at the last observation instead of a legend.
  const endLabelAnnotations = $derived(
    pair.series.filter((s) => s.endLabel).map((s) => endLabelAnnotation(s, pair, innerWidth))
  );
  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...endLabelAnnotations], innerWidth)
  );
  // Figures without end labels can still reserve extra padding via
  // pair.padding (e.g. room for a callout ring anchored on the plot's edge).
  const padding = $derived(
    endLabelPadding(innerWidth, endLabelAnnotations.length > 0, { ...yLabelPadding, ...pair.padding })
  );
</script>

<svelte:window bind:innerWidth />

{#snippet chart()}
<AreaChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  legend={false}
  rule={false}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    xAxis: { ...xAxisProps, ticks: xTicks, format: pair.xTickFormat ?? yearTickFormat(innerWidth, firstTickYear) },
    yAxis: { ...yAxisProps, ticks: pair.yTicks ?? excludeZeroTick, format: formatValue },
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
      {@const spec = pair.series.find((p) => p.key === s.key) ?? s}
      <!-- Drawn-in series get their line and area wash wiped in together via
           the animated clip on the wrapping group. -->
      <g class={spec.drawIn ? wipeClass : undefined}>
        <Area seriesKey={s.key} {...areaStyle(spec)} />
      </g>
    {/each}
  {/snippet}
  {#snippet belowMarks()}
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks()}
    <!-- On draw-in steps every callout waits for the wipe to land, then
         fades in; figures without drawIn render them immediately. -->
    <g class={hasDrawIn ? revealClass : undefined}>
      {#each pair.lineAnnotations ?? [] as annotation, i (i)}
        <ConnectorRule {...annotation} />
      {/each}
      {#each annotations as annotation, i (i)}
        <AnnotationPoint {...annotation} />
      {/each}
    </g>
  {/snippet}
</AreaChart>
{/snippet}

{#if pair.legendItems}
  <!-- Manual legend below the plot, same markup as LineChartPanel's: figures
       that name their series here instead of via endLabel supply {label,
       color} entries. pl-9 matches yLabelPadding's 36px axis gutter so the
       swatches align with the plot's left edge. -->
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
  /* Left-to-right wipe for scrolly reveal steps: the clip inset animates from
     hiding the whole series group to revealing it, so the line and its area
     wash sweep in together (the area-chart counterpart of LineChartPanel's
     dashoffset draw on the IEA report). One-shot: leaving the step swaps
     `-active` for `-done`, which pins the revealed state with no transition —
     the series neither blinks out during the panel crossfade nor replays when
     the reader scrolls back. */
  :global(g.ac-area-wipe) {
    clip-path: inset(0 100% 0 0);
  }
  :global(g.ac-area-wipe-active) {
    clip-path: inset(0 0 0 0);
    transition: clip-path 1300ms cubic-bezier(0.65, 0, 0.35, 1) 250ms;
  }
  :global(g.ac-area-wipe-done) {
    clip-path: inset(0 0 0 0);
  }
  /* Callouts tied to a drawn-in series fade in once the wipe finishes
     (wipe ends at 250ms delay + 1300ms duration); `-done` shows them
     instantly on revisits. */
  :global(.ac-draw-reveal) {
    opacity: 0;
  }
  :global(.ac-draw-reveal-active) {
    opacity: 1;
    transition: opacity 450ms ease 1350ms;
  }
  :global(.ac-draw-reveal-done) {
    opacity: 1;
  }
</style>
