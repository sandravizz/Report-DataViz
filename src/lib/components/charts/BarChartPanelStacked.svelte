<script>
  import { AnnotationPoint, AnnotationRange, BarChart, Labels, Link, Text } from "layerchart";
  import { xAxisProps, yAxisPropsInline, excludeZeroTick, desktopTooltips, yLabelPaddingInline, formatMillions, resolveAnnotations, endLabelPadding, endLabelMobileWrap, endLabelHalo, responsiveBandPadding, bandXScale, yearTickFormat, tooltipHeaderYear } from "$lib/chart-theme";
  import { ink, brand } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);
  const formatYear = $derived(
    pair.xTickFormat ?? yearTickFormat(innerWidth, pair.data[0][pair.xKey].getFullYear())
  );


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

  // Direct labels instead of a legend, on every viewport (house rule: end
  // labels never collapse into a bottom legend on mobile) — each series is
  // named beside its segment on the last bar, in its own color.
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

  // Bar total, above every bar (the full stack's sum, not a segment value).
  // Percent charts skip this — their total is always a flat, uninformative
  // 100%. Only the last bar spells out "million"/"thousand" (the headline
  // number); earlier bars are bare numbers rounded to one decimal, to avoid
  // surfacing floating-point summing noise. Sub-million bars are the
  // exception: rounding e.g. 0.95 to "1" would collide with the "1"
  // gridline, so those use formatMillions() too ("950 thousand").
  const round1 = (n) => Math.round(n * 10) / 10;
  const totalLabels = $derived.by(() => {
    if (pair.percent) return [];
    const lastIndex = pair.data.length - 1;
    return pair.data.map((d, i) => {
      const total = pair.series.reduce((sum, s) => sum + d[s.value], 0);
      const rounded = round1(total);
      const label =
        i === lastIndex || Math.abs(total) < 1 ? formatMillions(total, innerWidth) : String(rounded);
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

  // Growth arrow (opt-in via pair.growthArrow): connects the first and last
  // bars' totals, labeled with the absolute gain, so readers don't have to
  // subtract the totals themselves.
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
  // `hideYAxisMobile` drops the y axis below 1024 — the direct labels and
  // bar totals already carry the values, so inline ticks are pure clutter.
  const hideYAxis = $derived(pair.hideYAxisMobile && innerWidth < 1024);
  // Once hideYAxis drops the ticks there's nothing left to gutter for —
  // collapse padding to 0 so bars sit flush with the title's left edge.
  const padding = $derived(
    endLabelPadding(innerWidth, directLabelsActive, hideYAxis ? { left: 0 } : yLabelPaddingInline)
  );
  const bandPadding = $derived(responsiveBandPadding(innerWidth, pair.bandPadding ?? 0.2));
  // Passed alongside xScale only so BarChart sees a non-null bandPadding (its
  // flag to auto-baseline the value axis at 0); actual layout comes from xScale.
  const xScale = $derived(bandXScale(bandPadding));
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
  {bandPadding}
  {xScale}
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
    // Header is the year alone — the data is annual, so LayerChart's default
    // "1 January 2035" is precision the figures never had.
    tooltip: {
      header: { format: pair.tooltipHeaderFormat ?? tooltipHeaderYear },
      ...(pair.percent
        ? // Series carry share values; a total row (always 100%) is noise.
          { item: { format: "percentRound" }, hideTotal: true }
        : pair.valueSuffix
          ? { item: { format: formatValue } }
          : // Applies to both categories and the total row (same item config).
            { item: { format: (d) => d.toFixed(2) } }),
    },
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
    <!-- Offsetting by half the band width plus a gap starts the text just
         clear of the last bar's right edge; pair.endLabelGap widens it. -->
    {#each directLabels as annotation, i (i)}
      <AnnotationPoint
        {...annotation}
        labelXOffset={context.xScale.bandwidth() / 2 + (pair.endLabelGap ?? 6)}
      />
    {/each}
    <!-- Pulls the auto-centered band anchor back by half the bandwidth, to
         flush the label's left edge with the bar's left edge. -->
    {#each totalLabels as annotation, i (i)}
      <AnnotationPoint {...annotation} labelXOffset={-(context.xScale.bandwidth() / 2)} />
    {/each}
    {#if growthArrow}
      <!-- Bar-edge to bar-edge (not center to center), lifted clear of the
           bars' own total labels. Raw Link/Text, not AnnotationPoint, for
           full control over where the label lands. -->
      {@const lift = -10}
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
        stroke={brand.grayText}
        strokeWidth={1.5}
        fill="none"
        markerEnd={{ type: "triangle", size: 7 }}
      />
      <Text
        value={growthArrow.label}
        x={(sourceX + targetX) / 2 - 20}
        y={Math.min(sourceY, targetY) - 14}
        textAnchor="middle"
        verticalAnchor="end"
        fill={brand.grayText}
        class="text-xs font-light"
      />
    {/if}
  {/snippet}
</BarChart>
