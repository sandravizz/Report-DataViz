<script>
  import { AnnotationPoint, AnnotationRange, BarChart, Labels } from "layerchart";
  import QuarterTickLabel from "./QuarterTickLabel.svelte";
  import { xAxisProps, yAxisFor, chartPadding, barLabelRoom, barXScale, yTicks, percentTicks, resolveAnnotations, yearTickFormat, tooltipHeaderYear, quarterTicks, tooltipHeaderQuarter, twoLineQuarterAxis, quarterAxisTicks, quarterAxisFormat, quarterXAxisProps, twoLineXPadding } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";
  import { lineCallout } from "$lib/data/annotation-presets.js";
  import { ink } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Thousands grouping and at most two decimals — $lib/format.js.
  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;

  // Direct labels instead of a legend on desktop (Datawrapper stacked-column
  // guidance, mirrored in the dataviz skill's stacked-bars reference): each
  // series is named beside its segment on the last bar, so reading order and
  // stack order agree with no legend eye travel. Mobile keeps the bottom
  // legend — the narrow viewport has no right margin to spare.
  // `pair.directLabels: false` keeps the legend at every width, which frees
  // the right edge for the y axis (namesOnRight below).
  const directLabelsActive = $derived(pair.series.length > 1 && pair.directLabels !== false && innerWidth >= 1024);

  const directLabelAnnotations = $derived.by(() => {
    if (!directLabelsActive) return [];
    const last = pair.data[pair.data.length - 1];
    const total = pair.series.reduce((sum, s) => sum + last[s.value], 0);
    let cum = 0;
    return pair.series.map((s) => {
      const mid = cum + last[s.value] / 2;
      cum += last[s.value];
      // Datawrapper-style connector: a thin muted leader line from the bar's
      // edge to the label instead of free-floating text.
      return lineCallout({
        x: last[pair.xKey],
        // Segment midpoint of the last bar; stackExpand normalizes to 0–1,
        // so percent charts divide the running position by the bar total.
        y: pair.percent ? mid / total : mid,
        // Half a band (~30px at the desktop column's fixed 800px) plus a
        // 2px gap starts the line just off the last bar's right edge.
        // Figures with fewer, wider bands pass their own half-band
        // (`directLabelOffset`) so the line still starts off the bar's edge.
        r: pair.directLabelOffset ?? 32,
        label: s.key,
        labelPlacement: "right",
        labelXOffset: 22,
        labelProps: { verticalAnchor: "middle" },
      });
    });
  });

  // In-bar value labels, driven by pair.barLabels:
  //   [{ series, value: (d) => string, position: "bottom" | "middle", fill }]
  // "bottom" anchors the number just above the baseline inside the bottom
  // segment; "middle" centers it in its own segment. `value` returns the
  // display string, so a percent chart can show absolute values.
  const barLabels = $derived.by(() =>
    (pair.barLabels ?? []).map((bl) => {
      const index = pair.series.findIndex((s) => s.key === bl.series);
      const yMid = (d) => {
        const below = pair.series.slice(0, index).reduce((sum, s) => sum + d[s.value], 0);
        const mid = below + d[pair.series[index].value] / 2;
        return pair.percent
          ? mid / pair.series.reduce((sum, s) => sum + d[s.value], 0)
          : mid;
      };
      return { ...bl, y: bl.position === "bottom" ? () => 0 : yMid };
    })
  );

  const annotations = $derived(
    resolveAnnotations([...(pair.annotations ?? []), ...directLabelAnnotations], innerWidth)
  );
  // A figure whose series are named at the right edge keeps its y axis on
  // the left — decided per figure, not per width, so the axis doesn't jump
  // sides when the direct labels give way to the mobile legend. The label
  // strips live in the band scale's outer padding (barXScale), so the
  // gridlines run on under the y labels as on the line charts.
  const namesOnRight = $derived(pair.series.length > 1 && pair.directLabels !== false);
  // The two-line quarter axis (`pair.quarterAxis`, chart-theme.js) needs a
  // second label row's worth of room under the plot, at every width (phones
  // draw the ticks, connectors and years, desktop adds Q2–Q4).
  const twoLineXAxis = $derived(pair.quarterAxis === true && twoLineQuarterAxis(innerWidth));
  const padding = $derived(chartPadding(twoLineXAxis ? twoLineXPadding(innerWidth) : {}));
  let context = $state();
  const xScale = $derived(
    barXScale(
      context?.width,
      pair.data.length,
      pair.bandPadding ?? 0.2,
      // `pair.endRoom`: a figure's own extra px after the last bar;
      // `pair.endRoomMobile` overrides it below lg (e.g. 0 when the note it
      // made room for is hidden on phones).
      barLabelRoom(innerWidth, namesOnRight, directLabelsActive).map((room, i) =>
        i === 1
          ? room + ((innerWidth < 1024 ? pair.endRoomMobile : undefined) ?? pair.endRoom ?? 0)
          : room
      )
    )
  );

  // The narrow mobile axis has no room for a year under every bar: label
  // every other band, counting back from the last bar so the latest year
  // always keeps its label. Desktop labels every band as before.
  // QUARTERLY figures (`pair.quarterly`, carta-demo) tick only each year's
  // Q1 band — see quarterTicks in chart-theme.js. CATEGORICAL figures (x is
  // a name, not a Date) label every band at every width: dropping every
  // other metro name on a phone would hide content, not thin an axis.
  const isTimeAxis = $derived(pair.data[0]?.[pair.xKey] instanceof Date);
  const xTicks = $derived(
    pair.quarterAxis
      ? (scale) => quarterAxisTicks(scale.domain(), innerWidth)
      : pair.quarterly
      ? (scale) => quarterTicks(scale.domain(), innerWidth)
      : innerWidth < 1024 && isTimeAxis
        ? (scale) => scale.domain().filter((_, i, all) => (all.length - 1 - i) % 2 === 0)
        : undefined
  );
  // The labels: a figure's own xTickFormat (categorical axes pass one),
  // else the shared year treatment, read off the ticks the axis draws.
  const xTickFormat = $derived(
    pair.xTickFormat ??
      (pair.quarterAxis
        ? quarterAxisFormat(pair.data.map((d) => d[pair.xKey]), innerWidth)
        : yearTickFormat(
        pair.quarterly
          ? quarterTicks(pair.data.map((d) => d[pair.xKey]), innerWidth)
          : pair.data.map((d) => d[pair.xKey])
      ))
  );

  // PER-BAR COLOUR (`pair.barColor`): one series whose bars split into two
  // inks by period — e.g. figure 3's valuation-reset quarters in the accent,
  // the rest in slate. Done with LayerChart's own colour scale (c / cDomain /
  // cRange): Bars falls back to cGet(d) when the series carries no colour,
  // so the series is passed without one.
  //   barColor: { by: (d) => key, domain: [key, …], range: [color, …] }
  const series = $derived(
    pair.barColor ? pair.series.map(({ color, ...s }) => s) : pair.series
  );
  const colorScale = $derived(
    pair.barColor
      ? { c: pair.barColor.by, cDomain: pair.barColor.domain, cRange: pair.barColor.range }
      : {}
  );
</script>

<svelte:window bind:innerWidth />

<!-- The two-line quarter axis's labels — see QuarterTickLabel.svelte. -->
{#snippet quarterTickLabel({ props })}
  <QuarterTickLabel {props} />
{/snippet}

<!-- The built-in legend overlays the plot area (and the x axis), so render
     the same manual bottom legend as LineChartPanel's legendItems block:
     below the plot, pl-3 matching chartPadding's 12px left edge. -->
<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <!-- pair.percent switches to a 100% stacked layout: bars are normalized
         per band (d3's stackOffsetExpand) and the y axis reads 0–100%, while
         the tooltip keeps the raw values plus their total. -->
    <BarChart
      data={pair.data}
      x={pair.xKey}
      {series}
      {...colorScale}
      seriesLayout={pair.percent ? "stackExpand" : "stack"}
      bandPadding={pair.bandPadding ?? 0.2}
      yDomain={pair.yDomain}
      {xScale}
      bind:context
      legend={false}
      rule={false}
      tooltipContext={true}
      {padding}
      props={{
        bars: { strokeWidth: 0 },
        xAxis: {
          ...(twoLineXAxis ? quarterXAxisProps : xAxisProps),
          ticks: xTicks,
          format: xTickFormat,
          tickLabel: twoLineXAxis ? quarterTickLabel : undefined,
        },
        yAxis: {
          ...yAxisFor(namesOnRight),
          ticks: pair.yTicks ?? (pair.percent ? percentTicks : yTicks),
          format: pair.percent ? "percentRound" : formatValue,
        },
        // Gridlines on exactly the y-axis ticks: LayerChart's chart-level Grid
        // otherwise picks its own (fewer) ticks and skips some labelled values.
        grid: { yTicks: pair.yTicks ?? (pair.percent ? percentTicks : yTicks) },
        // Header is the year alone — the data is annual, so LayerChart's
        // default "1 January 2035" is precision the figures never had.
        tooltip: {
          header: { format: pair.tooltipHeaderFormat ?? (pair.quarterly || pair.quarterAxis ? tooltipHeaderQuarter : tooltipHeaderYear) },
          ...(pair.percent
            ? // Series carry share values; a total row (always 100%) is noise.
              { item: { format: "percentRound" }, hideTotal: true }
            : { item: { format: formatValue } }),
        },
      }}
    >
      <!-- Range washes (`pair.rangeAnnotations`) sit behind the bars. On a
           band scale AnnotationRange runs from the first band's outer edge
           to the last one's, so a wash covers its bars whole. -->
      {#snippet belowMarks()}
        {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
          <AnnotationRange {...annotation} />
        {/each}
      {/snippet}
      {#snippet aboveMarks()}
        <!-- placement="middle" honors the custom y accessor as-is; the dy
             lifts bottom-anchored numbers ~a line height into the bar. -->
        {#each barLabels as bl (bl.series)}
          <Labels
            seriesKey={bl.series}
            y={bl.y}
            value={bl.value}
            placement="middle"
            dy={bl.position === "bottom" ? -12 : 0}
            fill={bl.fill ?? ink}
            class="text-xs font-semibold"
          />
        {/each}
        {#each annotations as annotation, i (i)}
          <AnnotationPoint {...annotation} />
        {/each}
      {/snippet}
    </BarChart>
  </div>
  <!-- A single series needs no legend — the subtitle already names it. On
       desktop the direct labels above replace the legend entirely; the legend
       only renders as the mobile fallback. -->
  {#if pair.series.length > 1 && !directLabelsActive}
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-3 text-xs font-light">
      {#each pair.series as item (item.key)}
        <div class="flex items-center gap-1.5">
          <span class="size-2.5 shrink-0 rounded-full" style:background-color={item.color}></span>
          <span>{item.key}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
