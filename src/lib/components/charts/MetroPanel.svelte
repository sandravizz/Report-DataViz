<script>
  // METRO figure (paris-demo, 2026-11-08): the network drawn over a quiet
  // base map. Same LayerChart set-up as ChoroplethPanel: the projection is
  // fitted through `geo.fitGeojson`, every shape is a GeoPath, the key is
  // LayerChart's Legend, given an ordinal scale of the lines.
  //
  // Figure fields: base (FeatureCollection, the map underneath), lines
  // (MultiLineStrings with `properties.name / line / color / stops`), stops
  // (Points, one per station per line, with `properties.name`, `line` and
  // `lines`, every line at that station), fit (what the map is framed on),
  // legendTitle. Optional: clip (the lines end at this shape's edge),
  // lineWeight (thicker lines for a zoomed-in map), stopsLabel (the line
  // tooltip's row name).
  //
  // The legend filters the map, so lines can be compared. With nothing
  // picked every line shows. The first click shows only that line and its
  // stations, each further click adds a line, and clicking a picked line
  // removes it. Removing the last one brings the whole network back.
  //
  // COLOURS (for now, 2026-11-08): the cover's. The city is violet and every
  // line is the same spring green, so the legend's line numbers and the
  // tooltips carry the identity. A violet edge under each green line keeps it
  // visible where it leaves the city onto the light ground (Figure 4). The
  // network's official colours are still in the data (`properties.color`).
  import { Chart, Layer, Legend, Tooltip } from "layerchart";
  import { GeoClipPath, GeoPath, GeoPoint } from "layerchart/geo";
  import { geoMercator } from "d3-geo";
  import { scaleOrdinal } from "d3-scale";
  import { brand } from "$lib/colors";

  let { pair } = $props();

  const lineScale = $derived(
    scaleOrdinal()
      .domain(pair.lines.features.map((f) => f.properties.line))
      .range([brand.accent]),
  );

  // From lg (1400) the map takes more room: it bleeds 64px past the figure
  // column on both sides, up towards the subtitle, and the legend moves into
  // the map's empty lower-left corner instead of reserving a strip below it.
  let viewportWidth = $state(0);
  const desktop = $derived(viewportWidth >= 1400);

  // The lines picked in the legend (`properties.line`); empty means all.
  let selectedLines = $state([]);

  const shownLines = $derived(
    selectedLines.length
      ? pair.lines.features.filter((f) => selectedLines.includes(f.properties.line))
      : pair.lines.features,
  );
  const shownStops = $derived(
    selectedLines.length
      ? pair.stops.features.filter((f) => selectedLines.includes(f.properties.line))
      : pair.stops.features,
  );

  // Returns true so that Legend skips its own series toggle (`onclick ?? …`).
  function toggleLine(_event, item) {
    selectedLines = selectedLines.includes(item.value)
      ? selectedLines.filter((l) => l !== item.value)
      : [...selectedLines, item.value];
    return true;
  }
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="relative min-w-0 flex-1 lg:-mx-16 lg:-mt-8">
  <Chart
    data={pair.data}
    geo={{ projection: geoMercator, fitGeojson: pair.fit }}
    padding={{ top: 8, bottom: desktop ? 8 : 56 }}
  >
    {#snippet children({ context })}
      {@const compact = context.width < 640}
      {@const lineWidth = (compact ? 1.5 : 2.25) * (pair.lineWeight ?? 1)}
      {@const stopRadius = compact ? 1.9 : 3}
      {@const hovered = context.tooltip.data?.id}
      <Layer>
        <!-- Explicit hex fills and strokes (not classes): the PNG export
             re-serializes the SVG outside the page's stylesheet. -->
        {#each pair.base.features as feature (feature.id)}
          <GeoPath geojson={feature} fill={brand.middle} stroke="#8F81D4" strokeWidth={1} pointer-events="none" />
        {/each}

        <GeoClipPath geojson={pair.clip} disabled={!pair.clip}>
          {#each shownLines as feature (feature.id)}
            <GeoPath
              geojson={feature}
              fill="none"
              stroke={brand.middle}
              strokeWidth={(hovered === feature.id ? lineWidth + 1.25 : lineWidth) + 1.4}
              stroke-linecap="round"
              stroke-linejoin="round"
              pointer-events="none"
            />
          {/each}
          {#each shownLines as feature (feature.id)}
            <GeoPath
              geojson={feature}
              fill="none"
              stroke={brand.accent}
              strokeWidth={hovered === feature.id ? lineWidth + 1.25 : lineWidth}
              stroke-linecap="round"
              stroke-linejoin="round"
              pointer-events="none"
            />
          {/each}

          <!-- Wider invisible copies of the lines, so a 2px line can be hovered. -->
          {#each shownLines as feature (feature.id)}
            <GeoPath geojson={feature} fill="none" stroke="transparent" strokeWidth={10} tooltip />
          {/each}
        </GeoClipPath>

        {#each shownStops as feature (feature.id)}
          {@const [long, lat] = feature.geometry.coordinates}
          <GeoPoint
            {lat}
            {long}
            r={hovered === feature.id ? stopRadius + 1.5 : stopRadius}
            fill="#FFFFFF"
            stroke="none"
            pointer-events="none"
          />
        {/each}

        <!-- A Point GeoPath draws a 4.5px-radius circle: the stop's hit area,
             larger than the dot and on top of the lines' hit areas. -->
        {#each shownStops as feature (feature.id)}
          <GeoPath geojson={feature} fill="transparent" stroke="none" tooltip />
        {/each}
      </Layer>

      <Legend
        scale={lineScale}
        title={pair.legendTitle}
        placement="bottom-left"
        variant="swatches"
        selected={selectedLines}
        onclick={toggleLine}
        classes={{
          root: "max-w-full lg:left-16 lg:max-w-[20rem]",
          title: "text-xs font-normal text-base-content",
          items: "flex-wrap gap-x-2.5 gap-y-1",
          item: "cursor-pointer",
          swatch: "size-2.5 ring-1 ring-base-content/40",
          label: "text-[11px] text-base-content/80",
        }}
      />

      <!-- The same card as every other figure's tooltip (chart-theme's
           tooltipCard), written out because this one is a custom snippet. -->
      <Tooltip.Root class="max-lg:px-1.5 max-lg:py-1 max-lg:text-xs max-lg:leading-4">
        {#snippet children({ data })}
          <Tooltip.Header class="max-lg:mb-0.5 max-lg:pb-0.5">{data.properties.name}</Tooltip.Header>
          <Tooltip.List class="max-lg:gap-x-2 max-lg:gap-y-0.5">
            {#if data.geometry.type === "Point"}
              <Tooltip.Item
                label={data.properties.lines.includes(",") ? "Lines" : "Line"}
                value={data.properties.lines}
                valueAlign="right"
              />
            {:else}
              <Tooltip.Item label={pair.stopsLabel ?? "Stations"} value={data.properties.stops} valueAlign="right" />
            {/if}
          </Tooltip.List>
        {/snippet}
      </Tooltip.Root>
    {/snippet}
  </Chart>
</div>
