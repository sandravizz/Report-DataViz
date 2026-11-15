<script>
  // CHOROPLETH figure (paris-demo, 2026-11-04): one region per feature,
  // filled by its value. Built the way LayerChart's own GeoPath choropleth
  // example builds it (layerchart.com/docs/components/GeoPath/choropleth):
  // the colour scale lives on the Chart (`c` / `cScale` / `cDomain` /
  // `cRange`), the projection is fitted through `geo.fitGeojson`, each
  // region is a GeoPath with `tooltip`. The key is the histogram described
  // below (it was LayerChart's Legend until 2026-11-15).
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
  import { BarChart, Chart, Layer, Tooltip } from "layerchart";
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

  // THE KEY IS A HISTOGRAM (Sandra, 2026-11-15: "the legend can be the
  // x-axis of the histogram"). In the map's lower left corner, one element:
  // the measure's name, the distribution of the units as bars, and directly
  // under them the colour bar they stand on, with the class boundaries
  // written below. A bar is as tall as the number of units in its bin and
  // takes the colour the map gives that value, so the key shows what each
  // colour means AND how many units wear it. (It began as LayerChart's
  // Legend with a separate histogram in the lower right corner, which sat
  // on the Bois de Vincennes.)
  // - Bins are a quarter of a colour class wide and start on the scale's
  //   minimum, so no bin straddles two classes.
  // - Units beyond the scale's ends are counted too, in bins of the same
  //   width out to the data's own minimum and maximum; they take the end
  //   classes' colours, as on the map. So the colour bar's first and last
  //   segments are as long as the values they really cover.
  // - Units without a value are left out.
  // BUILT FROM TWO LayerChart BarCharts on the same bins and the same band
  // scale (no band padding, so they line up to the pixel): the histogram,
  // and under it a strip of equal bars, one per bin, which is the colour
  // bar. Its axis labels the class boundaries; a label is moved half a bin
  // left, from its bin's centre to the bin's start, where the colour
  // changes. (Both are chart roots: the PNG export collects them.)
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
      return { from, to: from + step, mid: from + step / 2, count: 0, one: 1 };
    });
    for (const v of values) bins[index(v) - first].count += 1;
    return bins;
  });
  const formatTick = (v) => (pair.legendFormat ?? formatValue)(v);
  // The four class boundaries (each is a bin's start).
  const keyTicks = $derived.by(() => {
    const [d0, d1] = pair.domain;
    const width = (d1 - d0) / palette.length;
    return [1, 2, 3, 4].map((k) => d0 + k * width);
  });
  // The key's width in px (the Tailwind widths on its box below): 208 from
  // lg, 160 on phones and tablets. Half a bin, for the labels' shift.
  const keyWidth = $derived(desktop ? 208 : 160);
  const halfBin = $derived(histogram.length ? keyWidth / histogram.length / 2 : 0);
  // What both charts share: the bins, the band scale, the colours.
  const keyChart = $derived({
    data: histogram,
    x: "from",
    c: (d) => d.mid,
    cScale: scaleQuantize(),
    cDomain: pair.domain,
    cRange: palette,
    bandPadding: 0,
    grid: false,
    rule: false,
    legend: false,
  });
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<!-- THE MAP'S BOX. Below lg it takes all the room there is (Sandra,
     2026-11-15: on an iPhone the map was very small): it bleeds 6vw each
     side, out to the screen's edges (the figure is 88vw), and 24px up and
     down into the air under the subtitle and above the source — MetroPanel's
     `roomy` box. The key keeps the figure's left edge (left-[6vw]). -->
<div class="relative min-w-0 flex-1 max-lg:-mx-[6vw] max-lg:-mt-6 max-lg:-mb-6 lg:-mx-10 lg:-mt-8">
  <Chart
    data={pair.data}
    c={valueOf}
    cScale={scaleQuantize()}
    cDomain={pair.domain}
    cRange={palette}
    geo={{ projection: geoMercator, fitGeojson: pair.geojson }}
    padding={{ top: 8, bottom: desktop ? 8 : 84 }}
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

  <!-- THE KEY: name, histogram, colour bar, boundaries — see the script.
       Lower left corner of the map from lg; on phones in the strip the
       Chart's bottom padding leaves under the map. -->
  {#if histogram.length}
    <div class="absolute bottom-0 left-[6vw] w-40 lg:-bottom-8 lg:left-16 lg:w-52">
      <!-- The measure's name, as the Legend's title was. `data-export-label`
           puts it in the PNG. -->
      <div data-export-label class="mb-1 text-[10px] leading-none text-base-content">{pair.legendTitle}</div>
      <!-- The histogram: bars only, a hairline of ground between them
           (insets, so the band scale stays the strip's). A bar's tooltip
           gives its range and its count. -->
      <div class="h-11 lg:h-18">
        <BarChart
          {...keyChart}
          series={[{ key: "count", value: "count", label: "Units" }]}
          axis={false}
          padding={{ top: 2, bottom: 0, left: 0, right: 0 }}
          props={{
            bars: { strokeWidth: 0, radius: 0, insets: { left: 0.5, right: 0.5 } },
            tooltip: {
              ...tooltipCard((from) => `${formatValue(from)} – ${formatValue(histogram.find((b) => b.from === from)?.to)}`),
              item: { format: formatNumber },
            },
          }}
        />
      </div>
      <!-- The colour bar the histogram stands on: 6px of equal bars, one
           per bin, touching; the class boundaries under it. No tooltip of
           its own (pointer-events-none). -->
      <div class="pointer-events-none mt-0.5 h-5">
        <BarChart
          {...keyChart}
          series={[{ key: "one", value: "one" }]}
          yDomain={[0, 1]}
          axis="x"
          padding={{ top: 0, bottom: 14, left: 0, right: 0 }}
          props={{
            bars: { strokeWidth: 0, radius: 0 },
            xAxis: {
              rule: false,
              tickMarks: false,
              ticks: keyTicks,
              format: formatTick,
              tickLabelProps: { class: "fill-base-content/70 text-[9px]", dx: -halfBin, dy: 2 },
            },
          }}
        />
      </div>
    </div>
  {/if}
</div>
