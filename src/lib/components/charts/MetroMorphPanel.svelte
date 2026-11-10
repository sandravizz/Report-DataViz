<script>
  // MAP-TO-CHART MORPH (paris-demo, 2026-11-10): the figure opens as Figure
  // 5's métro map and, as the reader scrolls, six of its lines leave the map
  // and unroll into a two-column grid of small-multiple line charts. Driven
  // by `progress` (0 → 1, the figure's own scroll progress from
  // ChartDisplay), not by time, so it plays forwards and backwards with the
  // scroll. The figure's long hold (`holdVh`) gives it the room.
  //
  // THE MAP is MetroPanel itself, given Figure 5's figure (`pair.map`), so it
  // starts exactly as Figure 5 ended. The morphing lines are its `overlay`,
  // drawn inside the same Chart, so they share the map's projection and box.
  //
  // THE MORPH: each line's track inside Paris, end to end and west end first
  // (`pair.chains`, metro-chain.js), is projected to pixels and resampled to
  // N points evenly along its length; its chart line is resampled to the same
  // N points evenly across the years. Point k moves from the one to the
  // other, so the line uncurls left to right into its chart. Lines start a
  // beat apart.
  //
  // THE STAGES, one after the other (Sandra, 2026-11-10; numbers below):
  //   1. the full map, a beat;
  //   2. scroll 1: the rest of the map (other lines, their stations and
  //      badges) disappears in one quick timed fade; the six lines keep
  //      their stations, interchanges and badges;
  //   3. scroll 2: the six lines' stations, interchanges and badges
  //      disappear the same way, leaving the bare lines;
  //   4. the six lines move into their panels (staggered), with the scroll;
  //   5. once they have landed, each panel's frame appears: badge +
  //      "Line n" on top, y gridlines and labels, the years under the
  //      bottom row.
  // The frame follows chart-theme's look: y labels at the START of their
  // gridline, sitting on it (yAxisLeftProps, as names own no right edge
  // here); an ink x axis line with short ticks; years full at the ends,
  // ’yy between (yearTickFormat). The top tick is the scale's headroom only:
  // no gridline or label for it (Sandra, 2026-11-10, "too much").
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
  import { brand, ink, neutral } from "$lib/colors";
  import { yearTickFormat } from "$lib/chart-theme";
  import { formatNumber } from "$lib/format";

  let { pair, progress = 1 } = $props();

  const N = 160;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  // THE STAGES (Sandra, 2026-11-10), two quick clean-ups, then the morph:
  //   full map → SCROLL 1: every other line and all its marks are gone →
  //   SCROLL 2: the six lines' stations and badges are gone, bare lines →
  //   the morph, slow, over several scrolls.
  // In fractions of the figure's progress, which spans the figure's hold
  // (6-paris-metro-ridership.js `holdVh: 132` = 1.65 steps of 80vh); the
  // comments give each stage in steps. Change one, re-fit the others.
  // Kept SHORT before the morph (Sandra, 2026-11-10: "I still need to scroll
  // a lot to get there"): a small scroll each, ~8vh, ~20vh, ~12vh.
  //
  // A figure can bring its own `stages` (same keys, same units: fractions of
  // ITS hold) — the study in Figure 7 does.
  const {
    mapOutAt: MAP_OUT_AT, //       0.1 step:  the full map, as Figure 5 left it
    marksOutAt: MARKS_OUT_AT, //   0.25 step: the six lines with their marks
    morphStart: MORPH_START, //    0.15 step: the six bare lines
    lineStagger: LINE_STAGGER, //  the lines leave one after another…
    lineDuration: LINE_DURATION, // …each moving over ~0.8 step; the last lands at 0.94
    frameStart: FRAME_START, //    the panel frames come in as the last lines land
  } = {
    mapOutAt: 0.06,
    marksOutAt: 0.21,
    morphStart: 0.3,
    lineStagger: 0.032,
    lineDuration: 0.48,
    frameStart: 0.92,
    ...pair.stages,
  };

  // LINES-ONLY (`pair.linesOnly`, the Figure 7 study, 2026-11-10): the other
  // lines are never there; the six lines start with their stations and badges
  // over the light base map (`base`), and ONE scroll takes the base map and
  // the marks away together (at `marksOutAt`). Then the morph.

  // The clean-ups are NOT scrubbed by the scroll: crossing the point (either
  // way) plays a short timed fade, so each reads as one move however slowly
  // the reader scrolls. Only the morph follows the scroll.
  const fadeOut = (at) =>
    Tween.of(() => (progress >= at ? 0 : 1), { duration: 350, easing: cubicOut });
  const mapFade = fadeOut(MAP_OUT_AT);
  const marksFade = fadeOut(MARKS_OUT_AT);
  const mapOpacity = $derived(pair.linesOnly ? 0 : mapFade.current);
  const keepOpacity = $derived(marksFade.current);
  const baseOpacity = $derived(pair.linesOnly ? marksFade.current : 0);
  const lineT = (i) => ease(clamp01((progress - MORPH_START - i * LINE_STAGGER) / LINE_DURATION));

  // From the Chart's inner box to the text column: MetroPanel's wrapper
  // bleeds 64px each side at lg (lg:-mx-16, 64rem = Tailwind's lg) and the
  // Chart pads 16px, so the column starts 48px in at lg and 16px OUT below.
  const wide = new MediaQuery("min-width: 64rem");
  const columnInset = $derived(wide.current ? 64 - 16 : -16);
  const frameOpacity = $derived(clamp01((progress - FRAME_START) / (1 - FRAME_START)));

  // Each panel's rows in year order.
  const rows = $derived(
    pair.groups.map((g) =>
      pair.data.filter((d) => d[pair.groupKey] === g).sort((a, b) => a[pair.xKey] - b[pair.xKey]),
    ),
  );
  // The shared y scale's ticks: three round steps, the top one the scale's top.
  const yTicks = $derived(
    scaleLinear()
      .domain([0, Math.max(...rows.flat().map((d) => d[pair.yKey]))])
      .nice(3)
      .ticks(3),
  );
  const yMax = $derived(yTicks[yTicks.length - 1]);
  const years = $derived(rows[0].map((d) => d[pair.xKey]));
  const formatValue = (v) => `${formatNumber(v)}${pair.valueSuffix ?? ""}`;

  // N points evenly spaced along a polyline.
  function resample(points, n) {
    const cumulative = [0];
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      cumulative.push(cumulative[i - 1] + Math.hypot(x1 - x0, y1 - y0));
    }
    const total = cumulative[cumulative.length - 1] || 1;
    const out = [];
    let j = 1;
    for (let k = 0; k < n; k++) {
      const target = (k / (n - 1)) * total;
      while (j < points.length - 1 && cumulative[j] < target) j++;
      const span = cumulative[j] - cumulative[j - 1] || 1;
      const t = clamp01((target - cumulative[j - 1]) / span);
      out.push([lerp(points[j - 1][0], points[j][0], t), lerp(points[j - 1][1], points[j][1], t)]);
    }
    return out;
  }

  // The panels: two columns, as many rows as it takes, kept close together
  // so the six read as one figure. Each panel: a title row (badge + name),
  // the plot, and room for the years (shown under the bottom row only, the
  // x scale being shared). The plot starts after a strip for the y labels,
  // in both columns, so the two columns stay the same width.
  function layout(width, height, compact) {
    const columns = 2;
    const rowCount = Math.ceil(pair.groups.length / columns);
    const gapX = compact ? 16 : 32;
    const gapY = compact ? 6 : 10;
    const titleH = compact ? 18 : 24;
    const yearsH = compact ? 16 : 20;
    const yLabelRoom = compact ? 24 : 30;
    const w = (width - 2 * columnInset - gapX * (columns - 1)) / columns;
    const h = (height - gapY * (rowCount - 1)) / rowCount;
    return pair.groups.map((_, i) => {
      const x0 = columnInset + (i % columns) * (w + gapX);
      const y0 = Math.floor(i / columns) * (h + gapY);
      return {
        x0,
        x1: x0 + w,
        y0,
        plotX0: x0 + yLabelRoom,
        plotTop: y0 + titleH + 6,
        plotBottom: y0 + h - yearsH,
        bottomRow: Math.floor(i / columns) === rowCount - 1,
      };
    });
  }

  const xOf = (panel, f) => lerp(panel.plotX0, panel.x1, f);
  const yOf = (panel, v) => panel.plotBottom - (v / yMax) * (panel.plotBottom - panel.plotTop);

  // A panel's chart line as N points evenly across the years.
  function chartPoints(values, panel) {
    return Array.from({ length: N }, (_, k) => {
      const f = (k / (N - 1)) * (values.length - 1);
      const i = Math.min(values.length - 2, Math.floor(f));
      return [xOf(panel, k / (N - 1)), yOf(panel, lerp(values[i], values[i + 1], f - i))];
    });
  }

  function shapes(context) {
    const projection = context.geo.projection;
    if (!projection || !context.width) return [];
    const compact = context.width < 640;
    const mapWidth = (compact ? 2 : 3) * (pair.map.lineWeight ?? 1);
    const casing = compact ? 1 : 1.5;
    const panels = layout(context.width, context.height, compact);
    return pair.groups.map((line, i) => {
      const from = resample(pair.chains[i].map((p) => projection(p)), N);
      const to = chartPoints(rows[i].map((d) => d[pair.yKey]), panels[i]);
      const t = lineT(i);
      const points = from.map(([x, y], k) => [lerp(x, to[k][0], t), lerp(y, to[k][1], t)]);
      return {
        line,
        color: pair.colors[i],
        width: lerp(mapWidth, 2, t),
        // The map's ground-coloured casing, gone once the line has landed.
        casing: lerp(casing, 0, t),
        d: "M" + points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L"),
        panel: panels[i],
        compact,
      };
    });
  }

  // The badge's number in white or ink, as on the map (MetroPanel).
  function badgeText(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35 ? brand.ink : "#FFFFFF";
  }
</script>

<!-- One panel's frame: title, gridlines with labels, and (bottom row) the
     x axis with the years. Drawn under the lines. -->
{#snippet frame(shape)}
  {@const { panel, compact } = shape}
  {@const badgeRadius = compact ? 6 : 8}
  {@const labelSize = compact ? 9 : 11}
  {@const yearFormat = yearTickFormat(years)}
  <Circle
    cx={panel.x0 + badgeRadius}
    cy={panel.y0 + badgeRadius}
    r={badgeRadius}
    fill={shape.color}
    stroke="none"
  />
  <Text
    x={panel.x0 + badgeRadius}
    y={panel.y0 + badgeRadius}
    value={shape.line}
    textAnchor="middle"
    verticalAnchor="middle"
    fill={badgeText(shape.color)}
    fontSize={(compact ? 7 : 9) * (shape.line.length > 2 ? 0.75 : 1)}
    font-weight={600}
  />
  <Text
    x={panel.x0 + badgeRadius * 2 + 6}
    y={panel.y0 + badgeRadius}
    value={pair.groupLabel(shape.line)}
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
       bottom row; a plain baseline in the panels above. -->
  <Line x1={panel.x0} x2={panel.x1} y1={panel.plotBottom} y2={panel.plotBottom} stroke={ink} strokeWidth={1} />
  {#if panel.bottomRow}
    {#each years as year, k (k)}
      {@const x = xOf(panel, k / (years.length - 1))}
      {#if compact ? (years.length - 1 - k) % 2 === 0 : true}
        <Line x1={x} x2={x} y1={panel.plotBottom} y2={panel.plotBottom + 4} stroke={ink} strokeWidth={1} />
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
  {@const all = shapes(context)}
  <!-- Inside MetroPanel's Layer, between its lines and its stations. -->
  <Group pointer-events="none">
    {#if frameOpacity > 0}
      <Group opacity={frameOpacity}>
        {#each all as shape (shape.line)}
          {@render frame(shape)}
        {/each}
      </Group>
    {/if}
    {#each all as shape (shape.line)}
      {#if shape.casing > 0.05}
        <Path
          pathData={shape.d}
          fill="none"
          stroke={brand.ground}
          strokeWidth={shape.width + 2 * shape.casing}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {/if}
      <Path
        pathData={shape.d}
        fill="none"
        stroke={shape.color}
        strokeWidth={shape.width}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    {/each}
  </Group>
{/snippet}

<MetroPanel pair={pair.map} {mapOpacity} keepLines={pair.groups} {keepOpacity} {baseOpacity} {overlay} />
