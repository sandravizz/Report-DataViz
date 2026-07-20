<script>
  import { AnnotationPoint, AnnotationRange, BarChart, Labels, Link, Text } from "layerchart";
  import { timeFormat } from "d3-time-format";
  import { xAxisProps, yAxisPropsInline, excludeZeroTick, desktopTooltips, yLabelPaddingInline, formatMillions, resolveAnnotations, endLabelPadding, endLabelMobileWrap, endLabelHalo } from "$lib/chart-theme";
  import { ink, colors } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Figures with scenario bars ("2035 STEPS") pass their own xTickFormat;
  // plain time-series columns keep the year default.
  const formatYear = pair.xTickFormat ?? timeFormat("%Y");

  // Every bar-stacked figure's values are workers in millions, but spelling
  // "million" out on every tick is noisy repetition. Instead only the
  // topmost tick carries the unit ("14 million"); the rest render as bare
  // numbers, the way a chart labeled "in millions" would read. yTicks()
  // records the topmost value as a side effect each time the axis asks for
  // its tick list, so formatValue (called once per tick, value only — no
  // index) knows which one to spell out.
  //
  // The 5-count here is paired with `yNice={5}` below on <BarChart>: nice(5)
  // rounds the domain to a multiple of the step ticks(5) will land on, so
  // the axis reads in clean 5-unit steps ("5, 10, 15, 20") or, for the
  // smaller figures, 0.5-unit steps ("0.5, 1, 1.5, 2") — rather than
  // whatever odd increment d3's default tick count picks.
  let maxYTick = 0;
  const yTicks = (scale) => {
    // Most figures take the scale's own 5-step candidates; a figure can
    // instead pass its own array (e.g. to drop a tick that always lands
    // inside a bar and never gets a visible gridline of its own).
    const vals = pair.yTicks ?? excludeZeroTick(scale, pair.percent ? undefined : 5);
    if (vals.length) maxYTick = Math.max(...vals);
    return vals;
  };
  const formatValue = (d) => {
    const label = d === maxYTick ? formatMillions(d) : String(Math.round(d * 1e6) / 1e6);
    return `${label}${pair.valueSuffix ?? ""}`;
  };

  // Direct labels instead of a legend, on every viewport (Datawrapper
  // stacked-column guidance, mirrored in the dataviz skill's stacked-bars
  // reference, plus the house rule that end labels never collapse into a
  // bottom legend on mobile): each series is named beside its segment on the
  // last bar in its own series color, mirroring the line charts' end labels.
  // The x offset is set at render time from the actual band width so the
  // label starts just over the bar's right edge on every figure.
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
        // Segment midpoint of the last bar; stackExpand normalizes to 0–1,
        // so percent charts divide the running position by the bar total.
        y: pair.percent ? mid / total : mid,
        r: 0,
        label: s.key,
        labelPlacement: "right",
        props: {
          circle: { r: 0, stroke: "none", fill: "none" },
          // Labels wear the series color by default; figures whose segments
          // are shades of one hue (e.g. the region ramp) pass
          // `directLabelFill` to ink them all uniformly instead.
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

  // Bar total, above every bar — not a segment value but the full stack's
  // sum. Same visual language as the projection band's "Projection" label
  // (text-xs font-light, left-aligned, flush with the bar's top-left corner)
  // but inked black like every other direct label instead of that label's
  // muted gray. Percent charts report the share each series carries, not an
  // absolute count, so their total is a fixed, uninformative 100% — skipped.
  //
  // Spelling out "million"/"thousand" on every bar read as noisy repetition
  // (same call the y-axis ticks already made) — only the last bar, the
  // figure's headline number, carries the unit; earlier bars are bare
  // numbers, rounded to one decimal at most — summing floating-point series
  // values (e.g. 9.1 + 5.0 + 2.8 + 3.3 + 7.42) otherwise surfaces the raw
  // addition noise as two or more decimal places.
  // Sub-million bars are the exception: rounding e.g. 0.95 to one decimal
  // gives "1", which reads as an exact whole million and collides with the
  // "1" gridline — formatMillions() spells those out as "950 thousand"
  // instead, same as the last bar always does.
  const round1 = (n) => Math.round(n * 10) / 10;
  const totalLabels = $derived.by(() => {
    if (pair.percent) return [];
    const lastIndex = pair.data.length - 1;
    return pair.data.map((d, i) => {
      const total = pair.series.reduce((sum, s) => sum + d[s.value], 0);
      const rounded = round1(total);
      const label = i === lastIndex || Math.abs(total) < 1 ? formatMillions(total) : String(rounded);
      return {
        x: d[pair.xKey],
        y: total,
        r: 0,
        label: `${label}${pair.valueSuffix ?? ""}`,
        labelPlacement: "top",
        props: {
          circle: { r: 0, stroke: "none", fill: "none" },
          // dy nudges the default -2 down closer to the bar's top edge.
          label: { fill: ink, textAnchor: "start", dy: 2, class: "text-xs font-light" },
        },
      };
    });
  });

  // Growth arrow (opt-in via pair.growthArrow): a rounded connector from the
  // first bar's total to the last bar's total, labeled with the absolute
  // gain — figures whose title promises a headline number (e.g. "5.6
  // million more jobs") shouldn't leave readers to subtract the two totals
  // themselves to find it on the chart. Lifted clear of both bars' own total
  // labels in the template below, where the pixel scales are available.
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
      // Same rounding as the bars' own total labels, so the printed gain
      // always matches the difference between the two printed totals.
      label: `+${round1(round1(lastTotal) - round1(firstTotal))}`,
    };
  });

  const annotations = $derived(resolveAnnotations(pair.annotations ?? [], innerWidth));
  const directLabels = $derived(resolveAnnotations(directLabelAnnotations, innerWidth));
  // Figures with `hideYAxisMobile` drop the y axis (ticks, labels and
  // gridlines) below the 1024 breakpoint — the region stack's own end labels
  // and totals already carry the values, so the inline y ticks are pure
  // clutter once mobile's narrower plot has them landing on top of the bars.
  const hideYAxis = $derived(pair.hideYAxisMobile && innerWidth < 1024);
  // Y tick labels sit inside the plot now (see yAxisPropsInline), so the
  // same narrow gutter fits every figure regardless of label width.
  const padding = $derived(endLabelPadding(innerWidth, directLabelsActive, yLabelPaddingInline));
</script>

<svelte:window bind:innerWidth />

<!-- pair.percent switches to a 100% stacked layout: bars are normalized
     per band (d3's stackOffsetExpand) and the y axis reads 0–100%, while
     the tooltip keeps the raw values plus their total. -->
<BarChart
  data={pair.data}
  x={pair.xKey}
  series={pair.series}
  seriesLayout={pair.percent ? "stackExpand" : "stack"}
  bandPadding={pair.bandPadding ?? 0.2}
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
    <!-- Hatched projection band (e.g. a scenario year like "2035 STEPS")
         drawn behind the bars, full plot height, over that band's column. -->
    {#each pair.rangeAnnotations ?? [] as annotation, i (i)}
      <AnnotationRange {...annotation} />
    {/each}
  {/snippet}
  {#snippet aboveMarks({ context })}
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
    <!-- The label's anchor is the last band's center; offsetting by half the
         band width plus a small gap starts the text just clear of the bar's
         right edge, whatever the figure's band count. -->
    {#each directLabels as annotation, i (i)}
      <AnnotationPoint {...annotation} labelXOffset={context.xScale.bandwidth() / 2 + 6} />
    {/each}
    <!-- AnnotationPoint auto-centers a band-scale x, so the offset here pulls
         the anchor back by half the bandwidth to flush the label's left edge
         with the bar's left edge, same as the projection band's label edge. -->
    {#each totalLabels as annotation, i (i)}
      <AnnotationPoint {...annotation} labelXOffset={-(context.xScale.bandwidth() / 2)} />
    {/each}
    {#if growthArrow}
      <!-- Short hop that lives entirely in the gap between the two bars —
           from the first bar's right edge to the last bar's left edge, not
           bar-center to bar-center — so it reads as a beat between the bars
           rather than a banner across the whole chart. Both ends are lifted
           clear of the bars' own total labels ("14.3"/"16.4"); the label
           floats centered above the arc's peak. Same muted gray as the
           "Projection" band's own label, so the two annotations read as one
           family. Raw Link/Text (not AnnotationPoint) for full control over
           where the label lands, independent of the arrow's endpoints. -->
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
        stroke={colors.lavender}
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
        fill={colors.lavender}
        class="text-xs font-light"
      />
    {/if}
  {/snippet}
</BarChart>
