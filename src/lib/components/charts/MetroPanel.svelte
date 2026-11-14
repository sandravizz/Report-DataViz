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
  import { Chart, Circle, Group, Layer, RectClipPath, Text, Tooltip } from "layerchart";
  import { GeoClipPath, GeoPath, GeoPoint } from "layerchart/geo";
  import { geoMercator } from "d3-geo";
  import { brand, mapTint, neutral, textOn } from "$lib/colors";
  import { stationMarks } from "$lib/data/figures/metro-stations.js";
  import { formatNumber } from "$lib/format";

  // - `roomy` gives the map a bigger box (the métro story, 2026-11-14): it
  //   bleeds further past the text column and into the air above the source
  //   line, on phones out to the screen's edges. MetroStoryPanel keeps its
  //   charts inside the column by the same amounts — change both together.
  // - `streets` + `streetsOpacity`: the street map under the network (the
  //   métro story's last state, 2026-11-14) — the landing page's own
  //   OpenStreetMap streets (street-map.js' streetLayers), as GeoPaths in a
  //   RECTANGLE: the box's full height, and at the sides `streetsInset` in
  //   from the Chart's inner box — the métro story passes the text column,
  //   so the map starts at the title's left edge and ends where the rule
  //   under the figure number ends (Sandra, 2026-11-14). Drawn in the figure's greys, lightest for the
  //   side streets, so the métro lines stay the only colour.
  //   Under the streets, where the file has them (`waterArea`, `green`): the
  //   Seine, the canals and the lakes in a faint blue, the parks and woods
  //   in a faint green (colors.js' mapTint).
  // - `zoom` (true / false; leave it out for a map that never zooms): PLUS
  //   and MINUS buttons in the map's top right corner, LayerChart's own
  //   `transform` in `projection` mode — the projection itself is scaled, so
  //   lines, dots and type keep their size and only the map grows. `false`
  //   hides the buttons and takes any zoom back (the story's chart states).
  //   The scroll wheel never zooms (the page scrolls); dragging moves the
  //   map only once it is zoomed in, so an untouched map never traps a
  //   scroll or a swipe. Zoomed, everything is cut to the map's rectangle.
  // - `focus` ({ lines, amount, more, moreAmount }): the métro story's "only
  //   this line" state; `more` lines come back as `moreAmount` goes 0 → 1.
  //   As `amount` goes 0 → 1 every line and badge NOT in `lines` goes
  //   completely (Sandra, 2026-11-14: faint leftovers hid the one line), and
  //   so do ALL station marks: the overlay draws the kept line's own
  //   stations. Hovering is off meanwhile.
  let {
    pair,
    marksOpacity = 1,
    baseOpacity = 0,
    overlay,
    roomy = false,
    streets = null,
    streetsOpacity = 0,
    streetsInset = 0,
    focus = null,
    zoom = undefined,
  } = $props();

  let chart = $state();
  let zoomed = $state(false);
  function zoomBy(direction) {
    const transform = chart?.transform;
    if (!transform) return;
    if (direction > 0) transform.zoomIn();
    else transform.zoomOut();
    zoomed = transform.targetScale > transform.initialScale * 1.001;
  }
  function zoomReset() {
    chart?.transform?.reset();
    zoomed = false;
  }
  $effect(() => {
    if (zoom === false && zoomed) zoomReset();
  });

  // Under the lines, weakest first: the filled areas, then [layer, stroke,
  // width]. The Seine's bank lines are only drawn where the water's area is
  // missing.
  const AREAS = [
    ["green", mapTint.green],
    ["waterArea", mapTint.water],
  ];
  const STREETS = [
    ["minor", neutral.faint, 0.5],
    ["mid", neutral.faint, 0.9],
    ["major", neutral.soft, 1.1],
  ];

  const morphing = $derived(marksOpacity < 1 || (focus?.amount ?? 0) > 0);

  // The lines picked by clicking (`properties.line`); empty means all.
  let selectedLines = $state([]);
  const isShown = (line) => selectedLines.length === 0 || selectedLines.includes(line);
  const FADED = 0.15;
  // How strongly a line (and what sits on it) is drawn: 1, or down to FADED.
  const strength = (line) =>
    focus
      ? focus.lines.includes(line)
        ? 1
        : 1 - focus.amount * (focus.more?.includes(line) ? 1 - focus.moreAmount : 1)
      : isShown(line)
        ? 1
        : FADED;
  // The station marks': the same, but in a focus they all go.
  const markStrength = (lines) => (focus ? 1 - focus.amount : Math.max(...lines.map(strength)));

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

<div class="relative min-w-0 flex-1 {roomy ? '-mx-[6vw] -mb-6 lg:-mx-10 lg:-mt-10 lg:-mb-14' : 'lg:-mx-10 lg:-mt-8'}">
  <Chart
    bind:context={chart}
    data={pair.data}
    geo={{ projection: geoMercator, fitGeojson: pair.fit }}
    padding={{ top: 16, bottom: 16, left: 16, right: 16 }}
    transform={zoom === undefined
      ? undefined
      : { mode: "projection", scaleExtent: [1, 8], scrollMode: "none", disablePointer: !(zoom && zoomed) }}
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
        <!-- The map's rectangle (16 = the Chart's padding: the box's full
             height). Zoomed, nothing may leave it. -->
        {@const mapRect = {
          x: streetsInset,
          y: -16,
          width: Math.max(0, context.width - 2 * streetsInset),
          height: context.height + 32,
        }}
        <RectClipPath {...mapRect} disabled={!zoomed}>
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
        {#if streetsOpacity > 0 && streets}
          <Group opacity={streetsOpacity}>
            <RectClipPath {...mapRect}>
              {#each AREAS as [layer, fill] (layer)}
                {#if streets[layer]}
                  <GeoPath geojson={streets[layer]} {fill} stroke="none" pointer-events="none" />
                {/if}
              {/each}
              {#if !streets.waterArea}
                <GeoPath
                  geojson={streets.water}
                  fill="none"
                  stroke={neutral.mid}
                  strokeWidth={1.2 * (compact ? 0.75 : 1)}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  pointer-events="none"
                />
              {/if}
              {#each STREETS as [layer, stroke, width] (layer)}
                <GeoPath
                  geojson={streets[layer]}
                  fill="none"
                  {stroke}
                  strokeWidth={width * (compact ? 0.75 : 1)}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  pointer-events="none"
                />
              {/each}
            </RectClipPath>
          </Group>
        {/if}
        <GeoClipPath geojson={pair.clip} disabled={!pair.clip}>
          {#each orderedLines as feature (feature.id)}
            {#if !overlay}
              {@const width = hovered === feature.id ? lineWidth + 1.25 : lineWidth}
              {@const opacity = strength(feature.properties.line)}
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
            opacity={markStrength([stop.properties.line]) * marksOpacity}
            pointer-events="none"
          />
        {/each}

        <!-- Interchanges: an ink-outlined white capsule (an ink stroke under
             a narrower white one, both round-capped) across the lines. -->
        {#each stations.interchanges as station (station.id)}
          {@const opacity =
            markStrength(station.properties.lineList) * marksOpacity}
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
          <GeoPoint {lat} {long} opacity={strength(end.line) * marksOpacity}>
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
        </RectClipPath>
        </Group>
      </Layer>

      <!-- Zoom: plus, minus and (once zoomed) back to the whole map. -->
      {#if zoom}
        <div
          role="group"
          aria-label="Map zoom"
          class="absolute z-10 flex flex-col gap-1"
          style:top="24px"
          style:right="{streetsInset + 24}px"
          onpointerdown={(event) => event.stopPropagation()}
        >
          <button type="button" class="btn btn-sm btn-square" aria-label="Zoom in" onclick={() => zoomBy(1)}>+</button>
          <button
            type="button"
            class="btn btn-sm btn-square"
            aria-label="Zoom out"
            disabled={!zoomed}
            onclick={() => zoomBy(-1)}>−</button
          >
          {#if zoomed}
            <button type="button" class="btn btn-sm btn-square" aria-label="Show the whole map" onclick={zoomReset}
              >⟲</button
            >
          {/if}
        </div>
      {/if}

      <!-- The same card as every other figure's tooltip (chart-theme's
           tooltipCard), written out because this one is a custom snippet. -->
      <Tooltip.Root class="max-lg:px-1.5 max-lg:py-1 max-lg:text-xs max-lg:leading-4">
        {#snippet children({ data })}
          {#if data.station}
            <!-- A sized station circle of the métro story: the station's
                 lines as badges (no "Line" written), its name, its number. -->
            <Tooltip.Header class="max-lg:mb-0.5 max-lg:pb-0.5">
              <span class="flex items-center gap-1">
                {#each data.station.lines as line (line)}
                  {@const color = pair.lines.features.find((f) => f.properties.line === line)?.properties.color ?? brand.ink}
                  <span
                    class="inline-flex size-4 shrink-0 items-center justify-center rounded-full font-semibold leading-none"
                    style:background={color}
                    style:color={textOn(color)}
                    style:font-size={line.length > 2 ? "6.5px" : "9px"}>{line}</span
                  >
                {/each}
                <span class="ml-0.5">{data.station.name}</span>
              </span>
            </Tooltip.Header>
            <Tooltip.List class="max-lg:gap-x-2 max-lg:gap-y-0.5">
              <Tooltip.Item label={data.station.label} value={formatNumber(data.station.value)} valueAlign="right" />
            </Tooltip.List>
          {:else}
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
          {/if}
        {/snippet}
      </Tooltip.Root>
    {/snippet}
  </Chart>
</div>
