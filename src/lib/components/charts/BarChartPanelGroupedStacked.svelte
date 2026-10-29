<script>
  // Grouped AND stacked bars: one band per category on x (`pair.xKey`, e.g.
  // the stage), split into sub-bands by `pair.x1Key` (e.g. the year), each
  // sub-band a stack of `pair.series`. All of it is LayerChart's own: `x1` /
  // `x1Domain` / `x1Range` / `x1Scale` place the sub-bands, and the stack is
  // partitioned per sub-band by the chart state itself (stackGroupBy), so
  // 2025 and 2026 each stack from zero.
  //
  // THE TWO-LINE AXIS, after the quarter axis (QuarterTickLabel): the
  // sub-band row on top (the years, muted, no ticks), the
  // category row under it in the ink, centred under its pair. The category
  // row is the chart's own x axis pushed down a line; the sub-band row is one
  // more LayerChart Axis per sub-band value, on the same x scale, shifted by
  // a Group onto that sub-band's centre (offsets read off LayerChart's x and
  // x1 scales, never typed in).
  //
  // CUMULATIVE LEVELS (`pair.cumulative`, e.g. percentiles): the series name
  // levels, not shares. Each visible level stacks as the step from the
  // visible level below it, so the segment edges sit on the levels. Which
  // levels are visible comes from `pair.selected` (the figure's shared
  // legend, DoubleChartPanel); none selected = all.
  import { Axis, BarChart, Bars, Group, Tooltip } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { group } from "d3-array";
  import { cubicInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { untrack } from "svelte";
  import { xAxisProps, yAxisProps, chartPadding, barLabelRoom, barXScale, groupedXPadding, groupedXPaddingBare, groupedXPaddingSingle, groupedAxisOffset, baselineStroke, quarterTickStroke } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";
  import { neutral } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  // "Same scale" ↔ "Own scale" EASES the y domain (Sandra, 2026-10-29): a
  // Svelte Tween of the domain DoubleChartPanel hands over, fed to
  // LayerChart's yDomain, so the bars, grid and labels follow the scale in
  // the same frame. A legend change (pair.selected) jumps instead — the
  // panels fade around it there — and so does everything under reduced
  // motion. The first render never animates.
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const yDomainTween = new Tween(untrack(() => pair.yDomain));
  let lastSelected = untrack(() => (pair.selected ?? []).join("|"));
  $effect(() => {
    const target = pair.yDomain;
    const sel = (pair.selected ?? []).join("|");
    if (!target) return;
    // `current` read untracked: tracked, every animation frame re-ran this
    // effect and restarted the tween from where it stood, and cubicInOut's
    // zero starting speed then kept the bars from ever moving.
    const instant =
      reducedMotion || sel !== lastSelected || untrack(() => yDomainTween.current) == null;
    lastSelected = sel;
    yDomainTween.set(target, instant ? { duration: 0 } : { duration: 600, easing: cubicInOut });
  });
  let context = $state();

  const formatValue = (d) => `${pair.valuePrefix ?? ""}${formatNumber(d)}${pair.valueSuffix ?? ""}`;
  // `pair.tooltipFormat`: a figure's own rounding for the tooltip table.
  const formatTooltip = $derived(pair.tooltipFormat ?? formatValue);
  // Change from the first sub-band to the second, whole percent, signed.
  const formatChange = (a, b) => {
    if (!a || b == null) return "–";
    const pct = Math.round((b / a - 1) * 100);
    return `${pct > 0 ? "+" : pct < 0 ? "−" : ""}${formatNumber(Math.abs(pct))}%`;
  };
  const categories = $derived([...new Set(pair.data.map((d) => d[pair.xKey]))]);

  const levels = $derived(
    pair.selected?.length ? pair.series.filter((s) => pair.selected.includes(s.key)) : pair.series
  );
  // EVERY level stays in the stack; a level the legend hides is a step of
  // zero, drawn clear, so the series list (and the marks) stay stable.
  const series = $derived(
    pair.cumulative
      ? pair.series.map((s) => ({
          ...s,
          value: (d) => {
            const k = levels.indexOf(s);
            if (k < 0) return 0;
            return d[s.value] - (k > 0 ? d[levels[k - 1].value] : 0);
          },
        }))
      : levels
  );
  // A segment whose level equals the levels above it is the whole rest of
  // its bar: it wears the highest of those levels' colour. So a stage with
  // one value for every percentile (foundational Series D, 2026) is one
  // bar in the darkest step, not the lightest.
  const fillFor = (d, level) => {
    const k = levels.indexOf(level);
    if (k < 0) return level.color;
    let j = k;
    while (j + 1 < levels.length && d[levels[j + 1].value] === d[levels[k].value]) j++;
    return levels[j].color;
  };
  const levelOf = (key) => pair.series.find((l) => l.key === key);

  // Same label strips as BarChartPanelStacked: the right-hand y labels live
  // in the band scale's outer padding, so gridlines run under them.
  const xScale = $derived(
    barXScale(context?.width, categories.length, pair.bandPadding ?? 0.25, barLabelRoom(innerWidth, false, false).map((room, i) => (i === 1 ? (pair.yLabelRoom ?? room) : room)))
  );
  const x1Scale = $derived(scaleBand().paddingInner(pair.x1Padding ?? 0.08));

  // Short labels once a band gets too narrow for the full one (phones):
  // decided from the scales' own step, not from the window width.
  const categoryLabel = $derived(
    (context?.xScale?.step?.() ?? Infinity) < 70 && pair.xTickFormatShort ? pair.xTickFormatShort : (d) => d
  );
  const subLabel = $derived(
    (context?.x1Scale?.step?.() ?? Infinity) < 34 ? (v) => `’${String(v).slice(-2)}` : (v) => String(v)
  );
  // From the centre of a band to the centre of one of its sub-bands.
  const subOffset = (v) =>
    context?.x1Scale ? context.x1Scale(v) + context.x1Scale.bandwidth() / 2 - context.xScale.bandwidth() / 2 : 0;

  const yTickFormat = $derived(pair.yTickFormat ?? formatValue);
  // PHONES (Sandra, 2026-10-29): stacked small multiples write the two-line
  // axis once, under the last panel; the panels above drop labels, ticks and
  // the ink axis line, keeping only a gridline-weight zero line.
  // `pair.lastPanel` is set by DoubleChartPanel; a lone panel has none and
  // keeps its labels.
  // Phones drop the year row everywhere (the subtitle names left and right
  // bar), so the last panel writes the category row alone, at the plain
  // axis spacing.
  const axisLabels = $derived(innerWidth >= 768 || pair.lastPanel !== false);
  const yearRow = $derived(innerWidth >= 768);
  const padding = $derived(
    chartPadding(!axisLabels ? groupedXPaddingBare : yearRow ? groupedXPadding : groupedXPaddingSingle)
  );
</script>

<svelte:window bind:innerWidth />

<div class="flex min-h-0 min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <BarChart
      data={pair.data}
      x={pair.xKey}
      x1={pair.x1Key}
      x1Domain={pair.x1Domain}
      {x1Scale}
      x1Range={({ xScale }) => [0, xScale.bandwidth()]}
      {series}
      seriesLayout="stack"
      bandPadding={pair.bandPadding ?? 0.25}
      yDomain={pair.yDomain ? yDomainTween.current : undefined}
      yNice={pair.yNice}
      {xScale}
      bind:context
      legend={false}
      rule={false}
      tooltipContext={true}
      {padding}
      props={{
        // The category row: the axis rule, no ticks of its own (the
        // sub-band axes below draw one per bar), labels a line lower.
        xAxis: axisLabels
          ? {
              ...xAxisProps,
              // No ticks anywhere and the axis line in the quarter ticks'
              // light 35% mix, not the ink (Sandra, 2026-10-29): the labels
              // under each bar already say where it stands.
              stroke: quarterTickStroke,
              tickMarks: false,
              format: categoryLabel,
              tickLabelProps: {
                ...xAxisProps.tickLabelProps,
                dy: xAxisProps.tickLabelProps.dy + (yearRow ? groupedAxisOffset : 0),
              },
            }
          : { ...xAxisProps, stroke: baselineStroke, tickMarks: false, format: () => "" },
        yAxis: { ...yAxisProps, ticks: pair.yTicks, format: yTickFormat },
        grid: { yTicks: pair.yTicks },
      }}
    >
      <!-- BarChart's own marks, split per fill: LayerChart's Bars takes one
           fill per call, so each series draws one Bars per colour its rows
           resolve to (fillFor). Rounding and hover fade as BarChart's
           default marks do them. -->
      {#snippet marks({ context })}
        {#each context.series.visibleSeries as s (s.key)}
          {@const level = levelOf(s.key)}
          {@const hidden = pair.cumulative && !levels.includes(level)}
          {#each [...group(pair.data, (d) => (pair.cumulative ? fillFor(d, level) : s.color))] as [fill, rows] (fill)}
            <!-- `class` makes LayerChart's Bars forward `opacity` to each
                 Bar (extractLayerProps passes props on only with a class). -->
            <Bars
              seriesKey={s.key}
              data={rows}
              {fill}
              radius={4}
              strokeWidth={0}
              class="lc-grouped-bar"
              rounded={(d) => (context.series.isStackTop(s.key, d) ? "edge" : "none")}
              opacity={(d) => (hidden ? 0 : context.series.isHighlighted(s.key, true) ? 1 : 0.1)}
            />
          {/each}
        {/each}
      {/snippet}

      {#snippet aboveMarks()}
        {#each axisLabels && yearRow ? pair.x1Domain : [] as v (v)}
          <Group x={subOffset(v)}>
            <Axis
              placement="bottom"
              {...xAxisProps}
              rule={false}
              tickMarks={false}
              ticks={categories}
              format={() => subLabel(v)}
              tickLabelProps={{ ...xAxisProps.tickLabelProps, fill: neutral.label }}
            />
          </Group>
        {/each}
      {/snippet}

      <!-- A small table: a row per visible level (top of the stack first,
           with its swatch), a column per sub-band and the change between
           them. Built from LayerChart's Tooltip.List / Item: an Item is two
           grid cells (label, value), so a four-column List takes two Items
           per row. The values are the levels themselves, never the steps. -->
      {#snippet tooltip({ context })}
        <!-- Placed BESIDE the hovered stage, never over it: anchored at the
             band's centre (x="data"), pushed half a band plus 12px to the
             side, and LayerChart flips it to the other side at the edge.
             The page's own type (font-sans, Plus Jakarta Sans — the tooltip
             is portaled out of the figure, so it does not inherit it) at
             13px, one ink for every cell (LayerChart's default greys the
             labels: `!` beats its attribute selector), the header row in the
             page's medium weight, a rule under it. -->
        <Tooltip.Root
          {context}
          x="data"
          anchor="left"
          xOffset={(context.xScale.bandwidth?.() ?? 0) / 2 + 12}
          classes={{ container: "font-sans text-[0.8125rem]! leading-5!" }}
        >
          {#snippet children({ data })}
            {@const pairRows = pair.x1Domain.map((v) =>
              pair.data.find((d) => d[pair.xKey] === data[pair.xKey] && d[pair.x1Key] === v)
            )}
            {@const a = pairRows[0]}
            {@const b = pairRows[1]}
            {@const ink = "text-base-content!"}
            <!-- The stage heads the label column on the column headers' own
                 row, so the table opens on one line instead of two. -->
            <Tooltip.List class="grid-cols-[auto_auto_auto_auto] gap-x-5 gap-y-1 py-1">
              <Tooltip.Item
                label={data[pair.xKey]}
                value={String(pair.x1Domain[0])}
                valueAlign="right"
                classes={{ label: `font-medium ${ink}`, value: `font-medium ${ink}` }}
              />
              <Tooltip.Item
                label={String(pair.x1Domain[1])}
                value="Change"
                valueAlign="right"
                classes={{ label: `justify-end font-medium ${ink}`, value: `font-medium ${ink}` }}
              />
              <Tooltip.Separator class="col-span-full" />
              {#each [...levels].reverse() as s (s.key)}
                <Tooltip.Item
                  label={s.short ?? s.key}
                  color={s.color}
                  value={formatTooltip(a?.[s.value])}
                  valueAlign="right"
                  classes={{ label: ink, value: ink }}
                />
                <Tooltip.Item
                  label={formatTooltip(b?.[s.value])}
                  value={formatChange(a?.[s.value], b?.[s.value])}
                  valueAlign="right"
                  classes={{ label: `justify-end ${ink}`, value: ink }}
                />
              {/each}
            </Tooltip.List>
          {/snippet}
        </Tooltip.Root>
      {/snippet}
    </BarChart>
  </div>
</div>
