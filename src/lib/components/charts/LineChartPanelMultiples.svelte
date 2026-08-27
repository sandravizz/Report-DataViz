<script>
  // Small multiples: each of pair.panels gets its own mini LineChart, its
  // label carrying the identity instead of a legend. A grid, not flex-wrap, so
  // the column count is explicit per breakpoint — 2x2 up to tablets, one row
  // on desktop's fixed 800px figure column.
  import { Area, AnnotationPoint, LineChart, Spline, defaultChartPadding } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { xAxisProps, yAxisProps, endLabelHalo, desktopTooltips, yearTickFormat } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";

  // Below 1024 the panels stack full-width, so there is no first/last panel
  // to carry axis numbers — the start/end point labels are the whole readout.
  const isMobile = (width) => width < 1024;

  let { pair } = $props();
  let innerWidth = $state(1024);

  // Same mobile thinning as LineChartPanel's casing.
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

  const formatValue = (d) => `${formatNumber(d)}${pair.valueSuffix ?? ""}`;
  const formatPoint = (d) => d.toFixed(1);
  // Earliest year in the x domain, so the mobile year abbreviation knows which
  // tick to spell out.
  const firstTickYear = $derived(
    (pair.xTicks?.[0] ?? pair.data[0][pair.xKey]).getFullYear()
  );

  // Desktop: only the first panel carries axis numbers on the left and the
  // last on the right; the middle panels keep gridlines but no tick text, so
  // the row doesn't repeat the same numbers four times.
  function yAxisConfig(index, count, width) {
    if (isMobile(width)) return { ...yAxisProps, ticks: pair.yTicks, format: () => "" };
    if (index === 0) return { ...yAxisProps, ticks: pair.yTicks, format: formatValue };
    if (index === count - 1)
      return { ...yAxisProps, ticks: pair.yTicks, format: formatValue, placement: "right" };
    return { ...yAxisProps, ticks: pair.yTicks, format: () => "" };
  }

  // Top padding clears the start/end value labels; the last panel gets extra
  // right padding for its axis numbers (desktop only).
  function panelPadding(isLast, width) {
    if (isMobile(width)) return defaultChartPadding({ top: 20 });
    return defaultChartPadding({ top: 28, right: isLast ? 32 : 4 });
  }

  // Start and end value labels in the line's own color: the readout the
  // dropped axis numbers used to carry, and a consistent "from → to".
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
      <!-- Desktop puts the name above the chart. Below 1024 there is no
           headroom for a label row, so it overlays the chart dead center,
           which clears both the edge-anchored value labels and the line. -->
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
            tooltip: pair.valueSuffix ? { item: { format: formatValue } } : undefined,
          }}
        >
          {#snippet marks()}
            <!-- Fill down to the shared domain floor, not 0. y0 must be a
                 function: a plain number is read as a field index. -->
            <Area
              y0={() => pair.yDomain[0]}
              y1={panel.value}
              curve={curveMonotoneX}
              fill={panel.color}
              fillOpacity={0.12}
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
