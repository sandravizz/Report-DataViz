<script>
  // Small multiples of single-line charts: each of pair.panels gets its own
  // mini LineChart (one series, no legend needed — the label above the panel
  // is the identity). A grid (not flex-wrap) so the column count is explicit
  // per breakpoint rather than however many 224px panels happen to fit: 2x2
  // on phones and tablets, all four in a row on desktop where the figure
  // column is a fixed 800px (ChartDisplay's lg:w-200).
  import { Area, AnnotationPoint, LineChart, Spline, defaultChartPadding } from "layerchart";
  import { curveMonotoneX } from "d3-shape";
  import { xAxisProps, yAxisProps, endLabelHalo, desktopTooltips, yearTickFormat } from "$lib/chart-theme";

  // Same <1024 mobile threshold as the rest of the report (desktopTooltips,
  // the grid's column breakpoints below). Below it every panel is stacked
  // full-width, so there's no "first panel"/"last panel" left to carry axis
  // numbers — all four rely on the start/end point labels only.
  const isMobile = (width) => width < 1024;

  let { pair } = $props();
  let innerWidth = $state(1024);

  const lineStyle = {
    curve: curveMonotoneX,
    strokeWidth: 2.5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  };
  const casingStyle = {
    ...lineStyle,
    stroke: "var(--color-base-100)",
    strokeWidth: 6.5,
  };

  const formatValue = (d) => `${d}${pair.valueSuffix ?? ""}`;
  const formatPoint = (d) => d.toFixed(1);
  // Earliest year in the chart's own x domain, so the mobile year
  // abbreviation below knows which tick to keep spelled out in full.
  const firstTickYear = (pair.xTicks?.[0] ?? pair.data[0][pair.xKey]).getFullYear();

  // Desktop (all four panels in one row): only the first panel's axis
  // carries numbers on the left and only the last carries them on the right;
  // the two middle panels keep their gridlines (the chart's own default
  // Grid, untouched here) but no tick text, so the row doesn't repeat the
  // same four numbers four times. Below 1024 the panels stack full-width
  // instead, so none of them get axis numbers at all — the start/end value
  // labels are the only readout there.
  function yAxisConfig(index, count, width) {
    if (isMobile(width)) return { ...yAxisProps, ticks: pair.yTicks, format: () => "" };
    if (index === 0) return { ...yAxisProps, ticks: pair.yTicks, format: formatValue };
    if (index === count - 1)
      return { ...yAxisProps, ticks: pair.yTicks, format: formatValue, placement: "right" };
    return { ...yAxisProps, ticks: pair.yTicks, format: () => "" };
  }

  // Extra top padding clears room for the start/end value labels (anchored
  // above their points) without clipping against the plot's top edge; the
  // last panel gets extra right padding to fit its right-side axis numbers,
  // only relevant on desktop since mobile shows no axis numbers at all.
  function panelPadding(isLast, width) {
    if (isMobile(width)) return defaultChartPadding({ top: 20 });
    return defaultChartPadding({ top: 28, right: isLast ? 32 : 4 });
  }

  // Start and end value labels, in the line's own color — the readout the
  // dropped y-axis numbers used to carry for the two middle panels, and a
  // consistent "where it started, where it ended" for all four.
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
      <!-- Desktop only: the name sits above the chart, same as every other
           figure's panel label. Below 1024 there's no headroom to spare for
           a separate label row (two rows of two panels means every pixel of
           row height counts), so the name instead overlays the chart,
           centered — dead center clears both the start/end value labels
           (anchored at the plot's left/right edges) and every series' own
           line, which at this shared 2–10 domain never runs through the
           vertical middle for more than an instant. -->
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
            xAxis: { ...xAxisProps, ticks: pair.xTicks, format: pair.xTickFormat ?? formatYear },
            yAxis: yAxisConfig(i, pair.panels.length, innerWidth),
            tooltip: pair.valueSuffix ? { item: { format: formatValue } } : undefined,
          }}
        >
          {#snippet marks()}
            <!-- Fill down to the shared domain floor (pair.yDomain[0]), not
                 to 0 — y0 as a function is a constant accessor (a plain
                 number here would be read as a field-index lookup), so every
                 panel's area bottoms out at the same axis floor its line
                 sits on. -->
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
