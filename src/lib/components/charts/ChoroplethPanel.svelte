<script>
  // CHOROPLETH figure (paris-demo, 2026-11-04): one region per feature,
  // filled by its value. Built the way LayerChart's own GeoPath choropleth
  // example builds it (layerchart.com/docs/components/GeoPath/choropleth):
  // the colour scale lives on the Chart (`c` / `cScale` / `cDomain` /
  // `cRange`), the projection is fitted through `geo.fitGeojson`, each
  // region is a GeoPath with `tooltip`, and the key is LayerChart's Legend,
  // which reads the chart's cScale by itself.
  //
  // Figure fields: geojson (a FeatureCollection whose features carry
  // `properties.value`, `properties.name` and optionally `properties.sub`,
  // the tooltip's second line), domain ([min, max]), legendTitle,
  // valueLabel (the tooltip's row name), valueSuffix, legendFormat (the
  // legend's tick format, when the full number is too wide), valuePrefix,
  // palette (five colours light → dark, default the violet `sequential`),
  // strokeWidth (the gap
  // between regions — thinner for dense maps like IRIS), outline (an
  // optional FeatureCollection drawn on top as unfilled ink lines, e.g.
  // the département borders around Paris).
  //
  // NO DATA: a feature whose value is null (a unit the source does not
  // publish a figure for) is filled in the grey wash, off the colour scale,
  // and its tooltip says "No data".
  import { BarChart, Chart, Layer, Legend, Tooltip } from "layerchart";
  import { GeoPath } from "layerchart/geo";
  import { geoMercator } from "d3-geo";
  import { scaleQuantize } from "d3-scale";
  import { sequential, brand, neutral } from "$lib/colors";
  import { formatNumber } from "$lib/format";
  import { tooltipCard } from "$lib/chart-theme";

  let { pair } = $props();

  const valueOf = (f) => f.properties.value;
  const formatValue = (v) => (v == null ? "No data" : `${pair.valuePrefix ?? ""}${formatNumber(v)}${pair.valueSuffix ?? ""}`);
  const fillOf = (f, cScale) => (valueOf(f) == null ? neutral.wash : cScale?.(valueOf(f)));

  // From lg (1400) the map takes more room: it bleeds 64px past the figure
  // column on both sides, up towards the subtitle, and the legend moves into
  // the map's empty lower-left corner instead of reserving a strip below it.
  let viewportWidth = $state(0);
  const desktop = $derived(viewportWidth >= 1400);

  // THE DISTRIBUTION, a small histogram WITH THE LEGEND, in the map's lower
  // left corner, standing on top of the colour key (Sandra, 2026-11-15; it
  // first sat in the lower right corner, on top of the Bois de Vincennes)
  // (Sandra, 2026-11-15: the measures may be skewed, so show how the units
  // are spread before choosing the colour scale). One bar per bin, as tall
  // as the number of units in it, in the colour the map gives that value —
  // so it also shows how many units each colour class holds.
  // - Bins are a quarter of a colour class wide and start on the scale's
  //   minimum, so no bin straddles two classes.
  // - Units beyond the scale's ends are counted too, in bins of the same
  //   width out to the data's own minimum and maximum; they take the end
  //   classes' colours, as on the map.
  // - Units without a value are left out.
  // A LayerChart BarChart of its own, laid over the map (a second chart
  // root: the PNG export collects every chart root in the figure).
  const palette = $derived(pair.palette ?? sequential);
  const histogram = $derived.by(() => {
    const [d0, d1] = pair.domain;
    const step = (d1 - d0) / palette.length / 4;
    const values = pair.data.map(valueOf).filter((v) => v != null);
    if (!values.length) return [];
    const index = (v) => Math.floor((v - d0) / step);
    const first = Math.min(0, ...values.map(index));
    const last = Math.max(palette.length * 4 - 1, ...values.map(index));
    const bins = Array.from({ length: last - first + 1 }, (_, k) => {
      const from = d0 + (first + k) * step;
      return { from, to: from + step, mid: from + step / 2, count: 0 };
    });
    for (const v of values) bins[index(v) - first].count += 1;
    return bins;
  });
  const formatTick = (v) => (pair.legendFormat ?? formatValue)(v);
  // Labelled on the axis: the colour classes' boundaries (the bins that
  // start on one) — all four on a wide screen, the outer two on a phone.
  const histogramTicks = $derived.by(() => {
    const [d0, d1] = pair.domain;
    const width = (d1 - d0) / palette.length;
    const all = [1, 2, 3, 4].map((k) => d0 + k * width);
    return desktop ? all : [all[0], all[3]];
  });
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="relative min-w-0 flex-1 lg:-mx-10 lg:-mt-8">
  <Chart
    data={pair.data}
    c={valueOf}
    cScale={scaleQuantize()}
    cDomain={pair.domain}
    cRange={palette}
    geo={{ projection: geoMercator, fitGeojson: pair.geojson }}
    padding={{ top: 8, bottom: desktop ? 8 : 60 }}
    tooltipContext={{ raiseTarget: true }}
  >
    {#snippet children({ context })}
      <Layer>
        {#each pair.geojson.features as feature (feature.id)}
          <!-- Explicit hex fills and strokes (not classes): the PNG export
               re-serializes the SVG outside the page's stylesheet. The
               ground-coloured stroke is the 1px gap between neighbours; the
               hovered region takes an ink outline. -->
          <GeoPath
            geojson={feature}
            fill={fillOf(feature, context.cScale)}
            stroke={context.tooltip.data?.id === feature.id ? brand.ink : brand.ground}
            strokeWidth={context.tooltip.data?.id === feature.id ? 1.5 : (pair.strokeWidth ?? 1)}
            tooltip
          />
        {/each}
        {#if pair.outline}
          {#each pair.outline.features as feature (feature.id)}
            <GeoPath
              geojson={feature}
              fill="none"
              stroke={brand.ink}
              strokeWidth={1.25}
              strokeOpacity={0.7}
              pointer-events="none"
            />
          {/each}
        {/if}
      </Layer>

      <!-- A key, not a feature: LayerChart's default 320×10 bar is sized
           down through its own width/height/tickFontSize props (160 / 120px
           wide, 6px tall), so it stays small and fits a phone's map. -->
      <Legend
        title={pair.legendTitle}
        placement="bottom-left"
        tickFormat={pair.legendFormat ?? formatValue}
        width={desktop ? 160 : 120}
        height={6}
        tickFontSize={9}
        tickLength={3}
        classes={{ root: "lg:left-16", title: "text-[10px] font-normal text-base-content", tick: "fill-base-content/70" }}
      />

      <!-- The same card as every other figure's tooltip (chart-theme's
           tooltipCard), written out because this one is a custom snippet. -->
      <Tooltip.Root class="max-lg:px-1.5 max-lg:py-1 max-lg:text-xs max-lg:leading-4">
        {#snippet children({ data })}
          <Tooltip.Header class="max-lg:mb-0.5 max-lg:pb-0.5">
            {data.properties.name}
            {#if data.properties.sub}
              <div class="font-normal text-base-content/70">{data.properties.sub}</div>
            {/if}
          </Tooltip.Header>
          <Tooltip.List class="max-lg:gap-x-2 max-lg:gap-y-0.5">
            <Tooltip.Item
              label={pair.valueLabel ?? "Value"}
              value={data.properties.value}
              format={formatValue}
              valueAlign="right"
            />
          </Tooltip.List>
        {/snippet}
      </Tooltip.Root>
    {/snippet}
  </Chart>

  <!-- The histogram: from lg above the legend, left edges aligned (on
       phones, in the strip under the map, beside the legend). Bars only, no
       y axis: the shape is the point; a bar's tooltip gives its range and
       its count. Its baseline is a faint hairline, not an ink axis. -->
  {#if histogram.length}
    <div class="absolute right-0 bottom-0 h-14 w-32 lg:right-auto lg:bottom-14 lg:left-16 lg:h-22 lg:w-48">
      <BarChart
        data={histogram}
        x="from"
        series={[{ key: "count", value: "count", label: "Units" }]}
        c={(d) => d.mid}
        cScale={scaleQuantize()}
        cDomain={pair.domain}
        cRange={palette}
        bandPadding={0.12}
        axis="x"
        grid={false}
        rule={false}
        legend={false}
        padding={{ top: 2, bottom: 14, left: 0, right: 0 }}
        props={{
          bars: { strokeWidth: 0, radius: 0 },
          xAxis: {
            rule: true,
            stroke: neutral.faint,
            tickMarks: false,
            ticks: histogramTicks,
            format: formatTick,
            tickLabelProps: { class: "fill-base-content/70 text-[9px]", dy: 3 },
          },
          tooltip: {
            ...tooltipCard((from) => `${formatValue(from)} – ${formatValue(histogram.find((b) => b.from === from)?.to)}`),
            item: { format: formatNumber },
          },
        }}
      />
    </div>
  {/if}
</div>
