<script>
  // METRO figure (paris-demo, 2026-11-08): the network on its own, no base
  // map (2026-11-10, a base comes back later). Same LayerChart set-up as
  // ChoroplethPanel: the projection is fitted through `geo.fitGeojson` and
  // every line is a GeoPath.
  //
  // Figure fields: lines (MultiLineStrings with `properties.name / line /
  // color / stops`), stops (Points, one per station per line, with
  // `properties.name`, `line`, `lines`), ends (each line's ends, from
  // metro-termini.js), fit (what the map is framed on). Optional: clip (the
  // lines end at this shape's edge), lineWeight (thicker lines for a
  // zoomed-in map), stopsLabel (the line tooltip's row name). `base` stays in
  // the figure files but is not drawn.
  //
  // MÉTRO-MAP STYLE (Sandra, 2026-11-10, after the RATP night map): the
  // lines on the real map, but drawn the way a métro map draws them —
  // - lines thick and round-capped, each on a casing of the ground colour, so
  //   where lines cross or run side by side a thin gap separates them;
  // - a station on one line is a white dot ringed in the line's colour;
  // - an interchange is a white capsule with an ink outline, spanning the
  //   lines it joins (metro-stations.js);
  // - NO LEGEND: each line's number sits in a badge of its colour centred
  //   exactly on each end of the line (no station names, Sandra 2026-11-10).
  //   A line with branches gets a badge per branch end.
  // All of it is LayerChart: GeoPath, GeoPoint, Circle, Text.
  //
  // CLICKING A LINE (or its badge) filters the map, so lines can be compared.
  // With nothing picked every line shows. The first click keeps that line in
  // colour and fades the rest, each further click adds a line, and clicking
  // a picked line removes it. Removing the last one brings the whole network
  // back. Faded lines stay clickable, so they can be added.
  //
  // COLOURS (2026-11-10): each line in its official colour
  // (`properties.color`).
  //
  // For the map-to-chart morph (MetroMorphPanel), inside the same Chart so it
  // shares the map's projection and size exactly:
  // - `overlay`: a snippet that draws the lines INSTEAD of this component
  //   (and moves them), under every station and badge, so the badges stay on
  //   top of the line ends (Sandra, 2026-11-10). With an overlay the map is
  //   a stage: tooltips still work, but clicking does not filter, as the
  //   overlay's lines would not follow.
  // - `marksOpacity` fades the stations, interchanges and badges, which leave
  //   before the lines start to move (and turns hovering off below 1).
  // - `baseOpacity` draws the figure's `base` (the arrondissements) under
  //   everything, very light grey with white borders — off unless asked for
  //   (the morph study, Figure 7, 2026-11-10).
  import { Chart, Circle, Group, Layer, Text, Tooltip } from "layerchart";
  import { GeoClipPath, GeoPath, GeoPoint } from "layerchart/geo";
  import { geoMercator } from "d3-geo";
  import { brand, neutral, textOn } from "$lib/colors";
  import { stationMarks } from "$lib/data/figures/metro-stations.js";

  let { pair, marksOpacity = 1, baseOpacity = 0, overlay } = $props();

  const morphing = $derived(marksOpacity < 1);

  // The lines picked by clicking (`properties.line`); empty means all.
  let selectedLines = $state([]);
  const isShown = (line) => selectedLines.length === 0 || selectedLines.includes(line);
  const FADED = 0.15;
  const anyShown = (lines) => lines.some(isShown);

  // Picked lines draw last, on top of the faded ones.
  const orderedLines = $derived(
    [...pair.lines.features].sort((a, b) => isShown(a.properties.line) - isShown(b.properties.line)),
  );
  const stations = $derived(stationMarks(pair.stops));

  function toggleLine(line) {
    if (overlay) return;
    selectedLines = selectedLines.includes(line)
      ? selectedLines.filter((l) => l !== line)
      : [...selectedLines, line];
  }
</script>

<div class="relative min-w-0 flex-1 lg:-mx-16 lg:-mt-8">
  <Chart
    data={pair.data}
    geo={{ projection: geoMercator, fitGeojson: pair.fit }}
    padding={{ top: 16, bottom: 16, left: 16, right: 16 }}
  >
    {#snippet children({ context })}
      {@const compact = context.width < 640}
      {@const lineWidth = (compact ? 2 : 3) * (pair.lineWeight ?? 1)}
      {@const casing = compact ? 1 : 1.5}
      {@const dotRadius = lineWidth * 0.42}
      {@const capsuleWidth = lineWidth * 1.7}
      {@const badgeRadius = compact ? 6 : 8}
      {@const hovered = context.tooltip.data?.id}
      <Layer>
        <Group pointer-events={morphing ? "none" : undefined}>
        <!-- Explicit hex fills and strokes (not classes): the PNG export
             re-serializes the SVG outside the page's stylesheet. -->
        {#if baseOpacity > 0 && pair.base}
          <Group opacity={baseOpacity}>
            {#each pair.base.features as area, k (k)}
              <GeoPath
                geojson={area}
                fill={neutral.wash}
                stroke="#FFFFFF"
                strokeWidth={compact ? 0.75 : 1}
                pointer-events="none"
              />
            {/each}
          </Group>
        {/if}
        <GeoClipPath geojson={pair.clip} disabled={!pair.clip}>
          {#each orderedLines as feature (feature.id)}
            {#if !overlay}
              {@const width = hovered === feature.id ? lineWidth + 1.25 : lineWidth}
              {@const opacity = isShown(feature.properties.line) ? 1 : FADED}
              <!-- The casing, then the line: drawn as a pair, so each line
                   cuts a gap through the lines beneath it. -->
              <GeoPath
                geojson={feature}
                fill="none"
                stroke={brand.ground}
                strokeWidth={width + 2 * casing}
                stroke-linecap="round"
                stroke-linejoin="round"
                pointer-events="none"
              />
              <GeoPath
                geojson={feature}
                fill="none"
                stroke={feature.properties.color}
                strokeWidth={width}
                {opacity}
                stroke-linecap="round"
                stroke-linejoin="round"
                pointer-events="none"
              />
            {/if}
          {/each}

          <!-- Wider invisible copies of the lines, so a line can be hovered
               and clicked. -->
          {#each pair.lines.features as feature (feature.id)}
            <GeoPath
              geojson={feature}
              fill="none"
              stroke="transparent"
              strokeWidth={10}
              tooltip
              class={overlay ? undefined : "cursor-pointer"}
              onclick={() => toggleLine(feature.properties.line)}
            />
          {/each}
        </GeoClipPath>

        <!-- The morph's moving lines (and its panel frames), under the
             stations and badges. -->
        {@render overlay?.(context)}

        <!-- Stations on one line: a white dot ringed in the line's colour. -->
        {#each stations.singles as stop (stop.id)}
          {@const [long, lat] = stop.geometry.coordinates}
          {@const color = pair.lines.features.find((f) => f.properties.line === stop.properties.line)?.properties.color}
          <GeoPoint
            {lat}
            {long}
            r={hovered === stop.id ? dotRadius + 1 : dotRadius}
            fill="#FFFFFF"
            stroke={color}
            strokeWidth={lineWidth * 0.3}
            opacity={(isShown(stop.properties.line) ? 1 : FADED) * marksOpacity}
            pointer-events="none"
          />
        {/each}

        <!-- Interchanges: an ink-outlined white capsule (an ink stroke under
             a narrower white one, both round-capped) across the lines. -->
        {#each stations.interchanges as station (station.id)}
          {@const opacity =
            (anyShown(station.properties.lineList) ? 1 : FADED) * marksOpacity}
          {@const width = hovered === station.id ? capsuleWidth + 1 : capsuleWidth}
          <GeoPath
            geojson={station}
            fill="none"
            stroke={brand.ink}
            strokeWidth={width + 1.5}
            stroke-linecap="round"
            {opacity}
            pointer-events="none"
          />
          <GeoPath
            geojson={station}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={width}
            stroke-linecap="round"
            {opacity}
            pointer-events="none"
          />
        {/each}

        <!-- Station hit areas, above the lines' (a Point GeoPath draws a
             4.5px circle). -->
        {#each stations.singles as stop (stop.id)}
          <GeoPath geojson={stop} fill="transparent" stroke="none" tooltip />
        {/each}
        {#each stations.interchanges as station (station.id)}
          <GeoPath
            geojson={station}
            fill="none"
            stroke="transparent"
            strokeWidth={capsuleWidth + 6}
            stroke-linecap="round"
            tooltip
          />
        {/each}

        <!-- The line badges, centred on the end of the line. -->
        {#each pair.ends as end (end.id)}
          {@const [long, lat] = end.coordinates}
          <GeoPoint {lat} {long} opacity={(isShown(end.line) ? 1 : FADED) * marksOpacity}>
            <Circle
              cx={0}
              cy={0}
              r={badgeRadius}
              fill={end.color}
              stroke="none"
              class={overlay ? undefined : "cursor-pointer"}
              onclick={() => toggleLine(end.line)}
            />
            <Text
              x={0}
              y={0}
              value={end.line}
              textAnchor="middle"
              verticalAnchor="middle"
              fill={textOn(end.color)}
              fontSize={(compact ? 7 : 9) * (end.line.length > 2 ? 0.75 : 1)}
              font-weight={600}
              pointer-events="none"
            />
          </GeoPoint>
        {/each}
        </Group>
      </Layer>

      <!-- The same card as every other figure's tooltip (chart-theme's
           tooltipCard), written out because this one is a custom snippet. -->
      <Tooltip.Root class="max-lg:px-1.5 max-lg:py-1 max-lg:text-xs max-lg:leading-4">
        {#snippet children({ data })}
          <Tooltip.Header class="max-lg:mb-0.5 max-lg:pb-0.5">{data.properties.name}</Tooltip.Header>
          <Tooltip.List class="max-lg:gap-x-2 max-lg:gap-y-0.5">
            {#if data.properties.lines !== undefined}
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
