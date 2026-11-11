<script>
  // MAP-TO-CHART MORPH (paris-demo, 2026-11-10; all lines 2026-11-11): the
  // figure opens as Figure 5's métro map and, as the reader scrolls, every
  // line leaves the map and unrolls into its own small line chart. Driven by
  // `progress` (0 → 1, the figure's own scroll progress from ChartDisplay),
  // not by time, so it plays forwards and backwards with the scroll. The
  // figure's long hold (`holdVh`) gives it the room.
  //
  // THE MAP is MetroPanel itself, given Figure 5's figure (`pair.map`), so it
  // starts exactly as Figure 5 ended. MetroPanel draws the stations and
  // badges; the lines are drawn HERE, as its `overlay`, inside the same
  // Chart, so they share the map's projection and box.
  //
  // THE MORPH, in one sentence: every point of a track has two positions,
  // one on the map and one on its line chart, and is drawn somewhere on the
  // straight path between the two, depending on the scroll.
  // - On the map: its longitude/latitude through the map's projection.
  // - On the chart: each point carries `u`, how far along the line it is
  //   (0 → 1, metro-unroll.js); its chart position is u of the way across
  //   the years, at the chart line's height there.
  // So a line's west end goes to the first year and its far end to the last,
  // and the line uncurls left to right. Forks and loops need nothing extra:
  // their points share a `u`, so they close onto the same stretch of chart.
  //
  // THE STAGES, one after the other (`pair.stages`, fractions of progress):
  //   1. the full map, a beat;
  //   2. at `marksOutAt`: stations, interchanges and badges (and the base
  //      map, if `pair.baseMap`) disappear in one quick TIMED fade — not
  //      scrubbed, so it reads as one move however slowly the reader scrolls;
  //   3. `morphStart` → `morphEnd`: the lines move, with the scroll, leaving
  //      one after another;
  //   4. as the last lands, each panel's frame fades in: badge + name on top,
  //      a y gridline with its label, the years under the lowest panels.
  // The frame follows chart-theme's look: y labels at the START of their
  // gridline, sitting on it; an ink x axis line with short ticks; years full
  // at the ends, ’yy between (yearTickFormat). The top tick is the scale's
  // headroom only: no gridline or label for it (Sandra, 2026-11-10).
  //
  // ALIGNMENT: the map bleeds past the text column (MetroPanel's wrapper,
  // lg:-mx-16) and the Chart pads it by 16px, but the panels sit in the
  // column, their left edge on the title's (Sandra, 2026-11-10).
  //
  // CUSTOM GEOMETRY, flagged per the LayerChart-first rule: LayerChart has
  // no map-to-cartesian morph, so the in-between shapes and the panel frames
  // are computed here and drawn with LayerChart's own Path (`pathData`),
  // Line, Circle and Text. Why, in full: docs/map-to-chart-morph.md.
  import { Circle, Group, Line, Path, Text } from "layerchart";
  import { scaleLinear } from "d3-scale";
  import { MediaQuery } from "svelte/reactivity";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import MetroPanel from "./MetroPanel.svelte";
  import { brand, ink, neutral, textOn } from "$lib/colors";
  import { yearTickFormat } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";

  let { pair, progress = 1 } = $props();

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  const { marksOutAt, morphStart, morphEnd } = $derived(pair.stages);

  // Stage 2, the timed fade: crossing `marksOutAt` (either way) plays it.
  const marksFade = Tween.of(() => (progress >= marksOutAt ? 0 : 1), { duration: 350, easing: cubicOut });

  // Stage 3: how far line i has moved, 0 (on the map) → 1 (in its chart).
  // The lines leave one after another over the first quarter of the morph
  // and each takes the other three quarters, so the last lands at morphEnd.
  const STAGGER = 0.25;
  const lineT = (i) => {
    const span = morphEnd - morphStart;
    const start = morphStart + (i / (pair.tracks.length - 1)) * span * STAGGER;
    return ease(clamp01((progress - start) / (span * (1 - STAGGER))));
  };

  // Stage 4: the frames start just before the last line lands.
  const frameOpacity = $derived(clamp01((progress - (morphEnd - 0.02)) / (1 - (morphEnd - 0.02))));

  // From the Chart's inner box to the text column: MetroPanel's wrapper
  // bleeds 64px each side at lg (lg:-mx-16, 64rem = Tailwind's lg) and the
  // Chart pads 16px, so the column starts 48px in at lg and 16px OUT below.
  const wide = new MediaQuery("min-width: 64rem");
  const columnInset = $derived(wide.current ? 64 - 16 : -16);

  // Each panel's values in year order.
  const rows = $derived(
    pair.groups.map((g) =>
      pair.data.filter((d) => d[pair.groupKey] === g).sort((a, b) => a[pair.xKey] - b[pair.xKey]),
    ),
  );
  const values = $derived(rows.map((r) => r.map((d) => d[pair.yKey])));
  const years = $derived(rows[0].map((d) => d[pair.xKey]));
  // The shared y scale's ticks: three round steps, the top one the scale's top.
  const yTicks = $derived(
    scaleLinear()
      .domain([0, Math.max(...values.flat())])
      .nice(3)
      .ticks(3),
  );
  const yMax = $derived(yTicks[yTicks.length - 1]);
  const formatValue = (v) => `${formatNumber(v)}${pair.valueSuffix ?? ""}`;

  // The panels: a grid (four columns, three on phones), kept close together
  // so they read as one figure. Each panel: a title row (badge + name), the
  // plot, and room for the years (shown under the lowest panel of each
  // column only, the x scale being shared). The plot starts after a strip
  // for the y labels, in every column, so the columns stay the same width.
  function layout(width, height, compact) {
    const count = pair.groups.length;
    const columns = compact ? 3 : 4;
    const rowCount = Math.ceil(count / columns);
    const gapX = compact ? 12 : 24;
    const gapY = compact ? 6 : 10;
    const titleH = compact ? 18 : 24;
    const yearsH = compact ? 16 : 20;
    const yLabelRoom = compact ? 24 : 30;
    const w = (width - 2 * columnInset - gapX * (columns - 1)) / columns;
    const h = (height - gapY * (rowCount - 1)) / rowCount;
    return pair.groups.map((group, i) => {
      const x0 = columnInset + (i % columns) * (w + gapX);
      const y0 = Math.floor(i / columns) * (h + gapY);
      return {
        group,
        color: pair.colors[i],
        x0,
        x1: x0 + w,
        y0,
        plotX0: x0 + yLabelRoom,
        plotTop: y0 + titleH + 6,
        plotBottom: y0 + h - yearsH,
        lowest: i + columns >= count,
      };
    });
  }

  const xOf = (panel, u) => lerp(panel.plotX0, panel.x1, u);
  const yOf = (panel, v) => panel.plotBottom - (v / yMax) * (panel.plotBottom - panel.plotTop);

  // The point u of the way along a panel's chart line (u: 0 → 1).
  function chartAt(panel, series, u) {
    const f = u * (series.length - 1);
    const i = Math.min(series.length - 2, Math.floor(f));
    return [xOf(panel, u), yOf(panel, lerp(series[i], series[i + 1], f - i))];
  }

  // Everything drawn for the current scroll position: the panels, and each
  // line's path, every point part-way between its map and chart positions.
  function scene(context) {
    const projection = context.geo.projection;
    if (!projection || !context.width) return { panels: [], paths: [] };
    const compact = context.width < 640;
    const mapWidth = (compact ? 2 : 3) * (pair.map.lineWeight ?? 1);
    const panels = layout(context.width, context.height, compact);
    const paths = pair.tracks.map((track, i) => {
      const t = lineT(i);
      const panel = panels[track.panel];
      const point = ([long, lat, u]) => {
        const [mapX, mapY] = projection([long, lat]);
        const [chartX, chartY] = chartAt(panel, values[track.panel], u);
        return `${lerp(mapX, chartX, t).toFixed(1)},${lerp(mapY, chartY, t).toFixed(1)}`;
      };
      return {
        line: track.line,
        color: track.color,
        d: track.strands.map((strand) => "M" + strand.map(point).join("L")).join(""),
        width: lerp(mapWidth, 2, t),
        // The map's ground-coloured casing, gone once the line has landed.
        casing: lerp(compact ? 1 : 1.5, 0, t),
      };
    });
    return { compact, panels, paths };
  }
</script>

<!-- One panel's frame: title, the gridline with its label, and (lowest
     panel of a column) the x axis with the years. Drawn under the lines. -->
{#snippet frame(panel, compact)}
  {@const badgeRadius = compact ? 6 : 8}
  {@const labelSize = compact ? 9 : 11}
  {@const yearFormat = yearTickFormat(years)}
  <!-- A year label needs ~30px: all of them, every second, or first, middle
       and last, whichever the plot's width holds. Counted from the last year. -->
  {@const plotWidth = panel.x1 - panel.plotX0}
  {@const labelEvery = plotWidth >= 330 ? 1 : plotWidth >= 180 ? 2 : 5}
  <Circle
    cx={panel.x0 + badgeRadius}
    cy={panel.y0 + badgeRadius}
    r={badgeRadius}
    fill={panel.color}
    stroke="none"
  />
  <Text
    x={panel.x0 + badgeRadius}
    y={panel.y0 + badgeRadius}
    value={panel.group}
    textAnchor="middle"
    verticalAnchor="middle"
    fill={textOn(panel.color)}
    fontSize={(compact ? 7 : 9) * (panel.group.length > 2 ? 0.75 : 1)}
    font-weight={600}
  />
  <Text
    x={panel.x0 + badgeRadius * 2 + 6}
    y={panel.y0 + badgeRadius}
    value={pair.groupLabel(panel.group)}
    verticalAnchor="middle"
    fill={brand.ink}
    fontSize={compact ? 11 : 14}
    font-weight={500}
  />

  {#each yTicks.filter((v) => v > 0 && v < yMax) as v (v)}
    <Line x1={panel.x0} x2={panel.x1} y1={yOf(panel, v)} y2={yOf(panel, v)} stroke={neutral.faint} strokeWidth={1} />
    <Text
      x={panel.x0}
      y={yOf(panel, v) - 3}
      value={formatValue(v)}
      verticalAnchor="end"
      fill={ink}
      fontSize={labelSize}
      font-weight={300}
    />
  {/each}

  <!-- The zero line: the x axis, in ink, with ticks and years under the
       lowest panel of each column; a plain baseline in the panels above. -->
  <Line x1={panel.x0} x2={panel.x1} y1={panel.plotBottom} y2={panel.plotBottom} stroke={ink} strokeWidth={1} />
  {#if panel.lowest}
    {#each years as year, k (k)}
      {@const x = xOf(panel, k / (years.length - 1))}
      <Line x1={x} x2={x} y1={panel.plotBottom} y2={panel.plotBottom + 4} stroke={ink} strokeWidth={1} />
      {#if (years.length - 1 - k) % labelEvery === 0}
        <Text
          {x}
          y={panel.plotBottom + 6}
          value={yearFormat(year)}
          textAnchor="middle"
          verticalAnchor="start"
          fill={ink}
          fontSize={labelSize}
          font-weight={300}
        />
      {/if}
    {/each}
  {/if}
{/snippet}

{#snippet overlay(context)}
  {@const { compact, panels, paths } = scene(context)}
  <!-- Inside MetroPanel's Layer, under its stations and badges. -->
  <Group pointer-events="none">
    {#if frameOpacity > 0}
      <Group opacity={frameOpacity}>
        {#each panels as panel (panel.group)}
          {@render frame(panel, compact)}
        {/each}
      </Group>
    {/if}
    <!-- The casing, then the line: drawn as a pair, so each line cuts a gap
         through the lines beneath it, as on the map. -->
    {#each paths as path (path.line)}
      {#if path.casing > 0.05}
        <Path
          pathData={path.d}
          fill="none"
          stroke={brand.ground}
          strokeWidth={path.width + 2 * path.casing}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {/if}
      <Path
        pathData={path.d}
        fill="none"
        stroke={path.color}
        strokeWidth={path.width}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    {/each}
  </Group>
{/snippet}

<MetroPanel
  pair={pair.map}
  marksOpacity={marksFade.current}
  baseOpacity={pair.baseMap ? marksFade.current : 0}
  {overlay}
/>
