<script>
  // Small multiples: each of pair.panels gets its own mini LineChart (one
  // series, no legend — the label above the panel is the identity). A grid
  // (not flex-wrap) fixes the column count per breakpoint: 2x2 on phones and
  // tablets, all four in a row on desktop.
  import { Area, AnnotationPoint, LineChart, Spline, defaultChartPadding } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { xAxisProps, yAxisProps, endLabelHalo, desktopTooltips, yearTickFormat, tooltipHeaderYear } from "$lib/chart-theme";

  const isMobile = (width) => width < 1024;

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Same mobile-thinning rule as LineChartPanel's casing (see its comment).
  const lineStyle = $derived({
    curve: curveMonotoneX,
    strokeWidth: innerWidth < 1024 ? 2 : 2.5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
  const casingStyle = $derived({
    ...lineStyle,
    stroke: "var(--color-base-100)",
    strokeWidth: innerWidth < 1024 ? 4.5 : 6.5,
  });

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
  const formatPoint = (d) => d.toFixed(1);
  const firstTickYear = $derived(
    (pair.xTicks?.[0] ?? pair.data[0][pair.xKey]).getFullYear()
  );

  // Desktop: only the first panel's axis carries numbers on the left and
  // only the last on the right, so the row doesn't repeat the same four
  // numbers four times. Mobile stacks full-width with no axis numbers at
  // all — the start/end value labels are the only readout there.
  function yAxisConfig(index, count, width) {
    if (isMobile(width)) return { ...yAxisProps, ticks: pair.yTicks, format: () => "" };
    if (index === 0) return { ...yAxisProps, ticks: pair.yTicks, format: formatValue };
    if (index === count - 1)
      return { ...yAxisProps, ticks: pair.yTicks, format: formatValue, placement: "right" };
    return { ...yAxisProps, ticks: pair.yTicks, format: () => "" };
  }

  // Extra top padding clears the start/end value labels; the last panel gets
  // extra right padding for its right-side axis numbers (desktop only).
  function panelPadding(isLast, width) {
    if (isMobile(width)) return defaultChartPadding({ top: 20 });
    return defaultChartPadding({ top: 28, right: isLast ? 32 : 4 });
  }

  // Start/end value labels, in the line's own color, for all four panels.
  function pointAnnotations(panel) {
    const first = pair.data[0];
    const last = pair.data[pair.data.length - 1];
    return [first, last].map((d) => ({
      x: d[pair.xKey],
      y: d[panel.value],
      r: 3,
      label: formatPoint(d[panel.value]),
      labelPlacement: "top",
      labelYOffset: 2,
      props: {
        circle: { fill: panel.color, stroke: "none" },
        label: { ...endLabelHalo(innerWidth), fill: panel.color, class: "text-xs font-light" },
      },
    }));
  }
</script>

<svelte:window bind:innerWidth />

<div class="grid h-full min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1 md:gap-6 lg:grid-cols-4">
  {#each pair.panels as panel, i (panel.label)}
    <div class="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <!-- Desktop: label above the chart. Mobile has no headroom to spare for
           a separate row, so the name overlays the chart instead (below). -->
      <div class="mb-3 hidden font-sans text-xs font-medium lg:block" style:color={panel.color}>
        {panel.label}
      </div>
      <div class="relative min-h-0 flex-1">
        <div
          class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center lg:hidden"
        >
          <span
            class="rounded bg-base-100/85 px-1.5 py-0.5 font-sans text-xs font-medium"
            style:color={panel.color}
          >
            {panel.label}
          </span>
        </div>
        <LineChart
          data={pair.data}
          x={pair.xKey}
          yDomain={pair.yDomain}
          series={[{ key: panel.label, value: panel.value, color: panel.color }]}
          legend={false}
          rule={false}
          tooltipContext={desktopTooltips(innerWidth)}
          padding={panelPadding(i === pair.panels.length - 1, innerWidth)}
          props={{
            xAxis: { ...xAxisProps, ticks: pair.xTicks, format: pair.xTickFormat ?? yearTickFormat(innerWidth, firstTickYear) },
            yAxis: yAxisConfig(i, pair.panels.length, innerWidth),
            // Header is the year alone — the data is annual, so LayerChart's
            // default "1 January 2035" is precision the figures never had.
            tooltip: {
              header: { format: pair.tooltipHeaderFormat ?? tooltipHeaderYear },
              ...(pair.valueSuffix && { item: { format: formatValue } }),
            },
          }}
        >
          {#snippet marks()}
            <!-- y0 as a function (not a plain number, which reads as a field
                 lookup) so every panel bottoms out at the shared domain floor. -->
            <Area
              y0={() => pair.yDomain[0]}
              y1={panel.value}
              curve={curveMonotoneX}
              fill={panel.color}
              fillOpacity={0.5}
              stroke="none"
            />
            <Spline seriesKey={panel.label} {...casingStyle} />
            <Spline seriesKey={panel.label} {...lineStyle} />
          {/snippet}
          {#snippet aboveMarks()}
            {#each pointAnnotations(panel) as annotation, j (j)}
              <AnnotationPoint {...annotation} />
            {/each}
          {/snippet}
        </LineChart>
      </div>
    </div>
  {/each}
</div>
