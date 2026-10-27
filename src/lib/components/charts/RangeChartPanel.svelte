<script>
  // RANGE figure (carta-demo, 2026-10-15): one horizontal bar per category
  // spanning two values — here the 25th to 75th percentile — with a ringed
  // dot on a third, the median, and a direct label beside it. Carta's own
  // "post-money valuation by stage" slide in this form.
  //
  // Built on LayerChart's BarChart, not custom SVG: `orientation:
  // "horizontal"` turns the bands to rows, and an ARRAY x accessor
  // ([low, high]) is BarChart's own range-bar mode (bars run from one value
  // to the other and round all four corners). The medians are
  // AnnotationPoints, which centre themselves on a band (see
  // AnnotationPoint.shared.svelte.js). `axis="x"` draws only the value axis:
  // the direct labels name the rows, so a band axis would say it twice.
  //
  // Figure fields: yKey (the category), range: [lowKey, highKey], median,
  // color (the bars' fill), xTicks, xDomain, valuePrefix / valueSuffix,
  // rangeLabel (the tooltip's row name).
  import { AnnotationPoint, BarChart } from "layerchart";
  import { xAxisProps, chartPadding, desktopTooltips } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";
  import { ink } from "$lib/colors";

  let { pair } = $props();
  let innerWidth = $state(1024);

  const formatValue = (d) => `${pair.valuePrefix ?? ""}${formatNumber(d)}${pair.valueSuffix ?? ""}`;
  // The tooltip's value is the range itself (the x accessor returns both
  // ends), so it prints as "$68.9M to $303M".
  const formatRange = (v) =>
    Array.isArray(v) ? `${formatValue(v[0])} to ${formatValue(v[1])}` : formatValue(v);

  // The median: a white dot ringed in ink (Carta's own marker), ≥8px, and
  // the row's name and value to its right in ink — over the bar where the
  // bar runs on, over the ground where it is short (Seed). The fill is a
  // pale coral, so ink on it stays well above 4.5:1 and no halo is needed.
  const annotations = $derived(
    pair.data.map((d) => ({
      x: d[pair.median],
      y: d[pair.yKey],
      r: innerWidth < 1024 ? 5 : 7,
      label: `${d[pair.yKey]}: ${formatValue(d[pair.median])}`,
      labelPlacement: "right",
      labelXOffset: 4,
      props: {
        circle: { fill: "#ffffff", stroke: ink, strokeWidth: 1.5 },
        label: { fill: ink, class: "text-xs font-semibold", verticalAnchor: "middle" },
      },
    }))
  );
</script>

<svelte:window bind:innerWidth />

<!-- The bar and the dot are two different statistics, so they get a key
     below the plot even though there is one series — the same manual legend
     as LineChartPanel's legendItems, pl-3 matching chartPadding's left edge. -->
<div class="flex min-w-0 flex-1 flex-col">
  <div class="min-h-0 flex-1">
    <BarChart
      data={pair.data}
      x={pair.range}
      y={pair.yKey}
      xDomain={pair.xDomain}
      orientation="horizontal"
      axis="x"
      bandPadding={pair.bandPadding ?? 0.45}
      legend={false}
      rule={false}
      tooltipContext={desktopTooltips(innerWidth)}
      padding={chartPadding({ right: 12 })}
      props={{
        // Explicit hex, not the chart's default `var(--color-primary)`: the
        // PNG export re-serializes the SVG outside the page's stylesheet.
        bars: { fill: pair.color, strokeWidth: 0 },
        xAxis: { ...xAxisProps, ticks: pair.xTicks, format: formatValue },
        // Vertical gridlines on exactly the labelled values, same ink as the
        // line charts' grid.
        grid: { stroke: "rgba(26, 26, 26, 0.1)", xTicks: pair.xTicks },
        tooltip: {
          item: { label: pair.rangeLabel ?? "Range", format: formatRange },
        },
      }}
    >
      {#snippet aboveMarks()}
        {#each annotations as annotation, i (i)}
          <AnnotationPoint {...annotation} />
        {/each}
      {/snippet}
    </BarChart>
  </div>
  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pl-3 text-xs font-light">
    <div class="flex items-center gap-1.5">
      <span class="h-2.5 w-4 shrink-0 rounded-sm" style:background-color={pair.color}></span>
      <span>{pair.rangeLabel ?? "Range"}</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="size-2.5 shrink-0 rounded-full border-[1.5px] border-base-content bg-white"></span>
      <span>{pair.medianLabel ?? "Median"}</span>
    </div>
  </div>
</div>
