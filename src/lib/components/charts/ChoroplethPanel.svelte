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
  // valueLabel (the tooltip's row name), valueSuffix, strokeWidth (the gap
  // between regions — thinner for dense maps like IRIS), outline (an
  // optional FeatureCollection drawn on top as unfilled ink lines, e.g.
  // the département borders around Paris).
  import { Chart, Layer, Legend, Tooltip } from "layerchart";
  import { GeoPath } from "layerchart/geo";
  import { geoMercator } from "d3-geo";
  import { scaleQuantize } from "d3-scale";
  import { sequential, brand } from "$lib/colors";
  import { formatNumber } from "$lib/format";

  let { pair } = $props();

  const valueOf = (f) => f.properties.value ?? 0;
  const formatValue = (v) => `${formatNumber(v)}${pair.valueSuffix ?? ""}`;

  // From lg (1400) the map takes more room: it bleeds 64px past the figure
  // column on both sides, up towards the subtitle, and the legend moves into
  // the map's empty lower-left corner instead of reserving a strip below it.
  let viewportWidth = $state(0);
  const desktop = $derived(viewportWidth >= 1400);
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="relative min-w-0 flex-1 lg:-mx-16 lg:-mt-8">
  <Chart
    data={pair.data}
    c={valueOf}
    cScale={scaleQuantize()}
    cDomain={pair.domain}
    cRange={sequential}
    geo={{ projection: geoMercator, fitGeojson: pair.geojson }}
    padding={{ top: 8, bottom: desktop ? 8 : 56 }}
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
            fill={context.cScale?.(valueOf(feature))}
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

      <Legend
        title={pair.legendTitle}
        placement="bottom-left"
        tickFormat={formatValue}
        classes={{ root: "lg:left-16", title: "text-xs font-normal text-base-content", tick: "text-[11px] fill-base-content/70" }}
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
</div>
