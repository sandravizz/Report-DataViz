<script>
  import { AnnotationPoint, AnnotationRange, BarChart, Labels, Link, Text } from "layerchart";
  import { xAxisProps, yAxisPropsInline, excludeZeroTick, desktopTooltips, yLabelPaddingInline, formatMillions, resolveAnnotations, endLabelPadding, endLabelMobileWrap, endLabelHalo, responsiveBandPadding, yearTickFormat } from "$lib/chart-theme";
  import { ink, colors } from "$lib/colors";
  import { formatNumber } from "$lib/format";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Figures with scenario bars pass their own xTickFormat; plain time series
  // keep the year default (see yearTickFormat).
  const formatYear = $derived(
    pair.xTickFormat ?? yearTickFormat(innerWidth, pair.data[0][pair.xKey].getFullYear())
  );

  // Only the topmost tick spells out the unit ("14 million"); the rest are
  // bare numbers. yTicks() records that top value as a side effect, since
  // formatValue is called per tick with the value only.
  // The 5-count pairs with `yNice={5}` below so the axis reads in clean
  // 5-unit (or 0.5-unit) steps instead of d3's default increment.
  let maxYTick = 0;
  const yTicks = (scale) => {
    // A figure can pass its own array instead, e.g. to drop a tick that
    // always lands inside a bar and never gets a visible gridline.
    const vals = pair.yTicks ?? excludeZeroTick(scale, pair.percent ? undefined : 5);
    if (vals.length) maxYTick = Math.max(...vals);
    return vals;
  };
  const formatValue = (d) => {
    const label = d === maxYTick ? formatMillions(d) : formatNumber(Math.round(d * 1e6) / 1e6);
    return `${label}${pair.valueSuffix ?? ""}`;
  };

  // Direct labels instead of a legend, on every viewport: each series is named
  // beside its segment on the last bar, in its own color, mirroring the line
  // charts' end labels. The x offset comes from the actual band width at
  // render time.
  const directLabelsActive = $derived(pair.series.length > 1);

  const directLabelAnnotations = $derived.by(() => {
    if (!directLabelsActive) return [];
    const last = pair.data[pair.data.length - 1];
    const total = pair.series.reduce((sum, s) => sum + last[s.value], 0);
    let cum = 0;
    return pair.series.map((s) => {
      const mid = cum + last[s.value] / 2;
      cum += last[s.value];
      return {
        x: last[pair.xKey],
        // Segment midpoint of the last bar; stackExpand normalizes to 0–1.
        y: pair.percent ? mid / total : mid,
        r: 0,
        label: s.key,
        labelPlacement: "right",
        props: {
          circle: { r: 0, stroke: "none", fill: "none" },
          // Series color by default; figures whose segments are shades of one
          // hue pass `directLabelFill` to ink them uniformly.
          label: {
            ...endLabelHalo(innerWidth),
            fill: pair.directLabelFill ?? s.color,
            verticalAnchor: "middle",
            class: "text-xs font-light",
          },
        },
        mobile: endLabelMobileWrap,
      };
    });
  });

  // In-bar value labels from pair.barLabels:
  //   [{ series, value: (d) => string, position: "bottom" | "middle", fill }]
  // "bottom" sits just above the baseline, "middle" centers in the segment.
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

  // The full stack's sum above each bar, flush with its top-left corner and
  // inked like the other direct labels. Percent charts skip it (always 100%).
  // Only the last bar — the headline number — carries the unit; earlier bars
  // are bare, rounded to one decimal so floating-point addition noise doesn't
  // surface. Sub-million bars are the exception: rounding 0.95 to "1" would
  // read as an exact million and collide with the gridline, so those spell
  // out as "950 thousand".
  const round1 = (n) => Math.round(n * 10) / 10;
  const totalLabels = $derived.by(() => {
    if (pair.percent) return [];
    const lastIndex = pair.data.length - 1;
    return pair.data.map((d, i) => {
      const total = pair.series.reduce((sum, s) => sum + d[s.value], 0);
      const rounded = round1(total);
      const label = i === lastIndex || Math.abs(total) < 1 ? formatMillions(total) : formatNumber(rounded);
      return {
        x: d[pair.xKey],
        y: total,
        r: 0,
        label: `${label}${pair.valueSuffix ?? ""}`,
        labelPlacement: "top",
        props: {
          circle: { r: 0, stroke: "none", fill: "none" },
          // dy nudges the default -2 closer to the bar's top edge.
          label: { fill: ink, textAnchor: "start", dy: 2, class: "text-xs font-light" },
        },
      };
    });
  });

  // Opt-in via pair.growthArrow: a connector from the first bar's total to the
  // last, labeled with the gain — so a figure whose title promises a headline
  // number doesn't leave readers subtracting the two totals themselves.
  const growthArrow = $derived.by(() => {
    if (!pair.growthArrow || pair.percent || pair.data.length < 2) return null;
    const sumRow = (d) => pair.series.reduce((sum, s) => sum + d[s.value], 0);
    const round1 = (n) => Math.round(n * 10) / 10;
    const first = pair.data[0];
    const last = pair.data[pair.data.length - 1];
    const firstTotal = sumRow(first);
    const lastTotal = sumRow(last);
    return {
      x: first[pair.xKey],
      y: firstTotal,
      targetX: last[pair.xKey],
      targetY: lastTotal,
      // Same rounding as the total labels, so the printed gain always matches
      // the difference between the two printed totals.
      label: `+${round1(round1(lastTotal) - round1(firstTotal))}`,
    };
  });

  const annotations = $derived(resolveAnnotations(pair.annotations ?? [], innerWidth));
  const directLabels = $derived(resolveAnnotations(directLabelAnnotations, innerWidth));
  // `hideYAxisMobile` drops ticks, labels and gridlines below 1024, where the
  // inline ticks land on top of the bars and the direct labels already carry
  // the values.
  const hideYAxis = $derived(pair.hideYAxisMobile && innerWidth < 1024);
  // Y tick labels sit inside the plot (yAxisPropsInline), so one narrow gutter
  // fits every figure.
  const padding = $derived(endLabelPadding(innerWidth, directLabelsActive, yLabelPaddingInline));
  const bandPadding = $derived(responsiveBandPadding(innerWidth, pair.bandPadding ?? 0.2));
</script>

<svelte:window bind:innerWidth />

<!-- pair.percent switches to a 100% stacked layout: bars normalized per band,
     y axis 0–100%, tooltip keeps the raw values. -->
<BarChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  seriesLayout={pair.percent ? "stackExpand" : "stack"}
  {bandPadding}
  yDomain={pair.yDomain}
  yNice={pair.percent ? undefined : 5}
  legend={false}
  rule={false}
  grid={!hideYAxis}
  tooltipContext={desktopTooltips(innerWidth)}
  {padding}
  props={{
    bars: { strokeWidth: 0 },
    xAxis: { ...xAxisProps, format: formatYear },
    yAxis: {
      ...yAxisPropsInline(innerWidth),
      ticks: hideYAxis ? [] : yTicks,
      format: hideYAxis ? () => "" : pair.percent ? "percentRound" : formatValue,
    },
    tooltip: pair.percent
      ? // Series carry share values; a total row (always 100%) is noise.
        { item: { format: "percentRound" }, hideTotal: true }
      : pair.valueSuffix
        ? { item: { format: formatValue } }
        : undefined,
  }}
>
  {#snippet belowMarks()}
    <!-- Range band behind the bars, full plot height, over its own column. -->
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks({ context })}
    <!-- placement="middle" honors the custom y accessor; dy lifts
         bottom-anchored numbers a line height into the bar. -->
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
    <!-- Anchored at the last band's center, so half the band width plus a gap
         starts the text clear of the bar's right edge. -->
    {#each directLabels as annotation, i (i)}
      <AnnotationPoint {...annotation} labelXOffset={context.xScale.bandwidth() / 2 + 6} />
    {/each}
    <!-- AnnotationPoint auto-centers a band-scale x, so pull back half the
         bandwidth to flush the label with the bar's left edge. -->
    {#each totalLabels as annotation, i (i)}
      <AnnotationPoint {...annotation} labelXOffset={-(context.xScale.bandwidth() / 2)} />
    {/each}
    {#if growthArrow}
      <!-- A short hop in the gap between the bars — edge to edge, not center
           to center — so it reads as a beat rather than a banner across the
           chart. Both ends lift clear of the bars' own total labels. Raw
           Link/Text, not AnnotationPoint, so the label can be placed
           independently of the arrow's endpoints. -->
      {@const lift = -6}
      {@const sourceX = context.xScale(growthArrow.x) + context.xScale.bandwidth()}
      {@const sourceY = context.yScale(growthArrow.y) - lift}
      {@const targetX = context.xScale(growthArrow.targetX)}
      {@const targetY = context.yScale(growthArrow.targetY) - lift}
      <Link
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        type="swoop"
        stroke={colors.muted}
        strokeWidth={1.5}
        fill="none"
        markerEnd={{ type: "triangle", size: 7 }}
      />
      <Text
        value={growthArrow.label}
        x={(sourceX + targetX) / 2 - 20}
        y={Math.min(sourceY, targetY) + 4}
        textAnchor="middle"
        verticalAnchor="end"
        fill={colors.muted}
        class="text-xs font-light"
      />
    {/if}
  {/snippet}
</BarChart>
