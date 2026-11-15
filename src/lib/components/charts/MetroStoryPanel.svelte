<script>
  // THE MÉTRO STORY (paris-demo, Sandra 2026-11-14): MetroMorphPanel's
  // map-to-chart morph played BACKWARDS, with two chart stages in front.
  // Driven by `progress` (0 → 1, the figure's own scroll progress from
  // ChartDisplay), so it plays forwards and backwards with the scroll.
  //
  // FIVE STATES, four moves (`pair.stages`, fractions of progress):
  //   A  the whole métro as one black line, 2000–2025, its events named;
  //   →  stretchStart … stretchEnd (Sandra, 2026-11-14): the x axis
  //      stretches until it starts in 2015, where the lines' series start.
  //      The total line stays one black line and the scale stays its own;
  //      the years before 2015 leave at the plot's left edge;
  //   A′ the total, 2015–2025;
  //   →  linesStart … linesEnd: a copy of that line per métro line moves to
  //      the line's own values, still black (the colours come in one quick
  //      fade once all have landed), while the scale goes from the total's
  //      to the lines'. (Without the two stretch stages the years stretch
  //      during this move, as they did before.)
  //   B  every line in one chart, a badge at each line's end;
  //      WITH `pair.stacked` (Sandra, 2026-11-15: the lines add up to the
  //      total, so show that): B is a STACKED AREA CHART instead. The copies
  //      fan out DOWNWARDS from the total line to the stack's boundaries
  //      (the top copy stays where the total is), the scale stays the
  //      total's, and once they have landed the bands fill with the lines'
  //      colours in the same timed fade. The line with the most trips in
  //      the last year is on top, the one with the fewest on the x axis.
  //      On the way to C the fills go and each band's top edge travels to
  //      its own panel, down to its own values;
  //   →  panelsStart … panelsEnd: each line moves into its own panel;
  //   C  the small multiples (MetroMorphPanel's grid);
  //   →  mapStart … mapEnd: the lines roll back onto the map, one after
  //      another (MetroMorphPanel's morph, reversed);
  //   D  the bare lines on the map;
  //   →  at marksInAt: the base map, stations and badges arrive in one
  //      quick TIMED fade (not scrubbed);
  //   E  Figure 5's map;
  //   →  at streetsInAt (optional): the grey city shapes give way to the
  //      street map, in a second timed fade;
  //   F  the network over the streets of Paris (the landing page's
  //      OpenStreetMap data, drawn by MetroPanel), a rectangle as wide as
  //      the text column;
  //   →  at focusAt (optional, with `pair.focus`): a third timed fade;
  //   G  only that line stays (line 1), the others gone, its stations as
  //      equal dots in the line's colour, each with its name;
  //   →  at sizeAt: the dots grow, timed;
  //   H  each dot's AREA is the station's value (entries in 2025), with a
  //      size legend in the map's lower left corner;
  //   →  at each `pair.focus.more` line's `at`: one more timed fade;
  //   I  those lines (4 and 14) come back, their stations sized at once, on
  //      the same size scale;
  //   →  at each stop of `pair.focus.zoom`: the map eases in on a station,
  //      timed, and stays (MetroPanel's `zoom`); at the next stop it travels
  //      on to the next station; the last stop shows the whole map again.
  //      The text beside the figure changes with every state (`pair.notes`,
  //      lib/figure-progress.js).
  //   →  at `pair.explore.at`: the last state, the reader's own map — see
  //      `exploring` below.
  //   The dots, names and legend are custom too: LayerChart's Legend shows
  //   colour scales, it has no size legend.
  //
  // HOW A POINT MOVES: every point of a track carries `u`, how far along its
  // line it is (0 → 1, metro-unroll.js). That gives it a position in every
  // state — A: on the total line, at the year u of the way through the
  // lines' years; B: on its own line in the one chart; C: on its line in its
  // panel; D: on the map — and it is drawn on the straight path between the
  // two states the scroll is between.
  //
  // AXES follow the house rule: y labels at the END of their gridline, on
  // the right, inside the plot, sitting on the line; an ink x axis with
  // short ticks; years full at the ends, ’yy between.
  //
  // CUSTOM GEOMETRY, flagged per the LayerChart-first rule: as in
  // MetroMorphPanel, LayerChart has no scroll-scrubbed morph between charts
  // or between a chart and a map, so the in-between shapes and the frames
  // are computed here and drawn with LayerChart's own Path, Line, Circle and
  // Text, inside MetroPanel's Chart. Why: docs/map-to-chart-morph.md.
  import { Circle, Group, Line, Path, Text } from "layerchart";
  import { scaleLinear, scaleSqrt } from "d3-scale";
  import { onMount } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import MetroPanel from "./MetroPanel.svelte";
  import { brand, ink, neutral, textOn } from "$lib/colors";
  import { formatNumber } from "$lib/format";
  import { loadLand, loadStreets, streetLayers } from "$lib/street-map.js";

  let { pair, progress = 1 } = $props();

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  // A colour part-way between two hex colours.
  const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const mix = (from, to, t) => {
    const a = channels(from);
    const b = channels(to);
    return `#${a.map((c, i) => Math.round(lerp(c, b[i], t)).toString(16).padStart(2, "0")).join("")}`;
  };

  const stages = $derived(pair.stages);
  const between = (from, to) => ease(clamp01((progress - from) / (to - from)));
  // A → B and B → C: 0 before the move, 1 after it.
  const tLines = $derived(between(stages.linesStart, stages.linesEnd));
  // A → A′: the x axis stretches to the lines' first year.
  const tStretch = $derived(
    stages.stretchStart === undefined ? tLines : between(stages.stretchStart, stages.stretchEnd),
  );
  const tPanels = $derived(between(stages.panelsStart, stages.panelsEnd));
  // C → D, per line: 0 in its panel → 1 on the map. The lines leave one
  // after another over the first quarter of the move and each takes the
  // other three quarters, so the last lands at mapEnd.
  const STAGGER = 0.25;
  const tMap = (i) => {
    const span = stages.mapEnd - stages.mapStart;
    const start = stages.mapStart + (i / (pair.tracks.length - 1)) * span * STAGGER;
    return ease(clamp01((progress - start) / (span * (1 - STAGGER))));
  };
  // The colours (Sandra, 2026-11-14): the copies stay BLACK while they move
  // and take their colours only once every line has landed, in one quick
  // timed fade — a line half-way between black and its colour reads as a
  // third, wrong colour. Crossing `linesEnd` (either way) plays it.
  const colourFade = Tween.of(() => (progress >= stages.linesEnd ? 1 : 0), { duration: 350, easing: cubicOut });
  // D → E, the timed fade: crossing `marksInAt` (either way) plays it.
  const marksFade = Tween.of(() => (progress >= stages.marksInAt ? 1 : 0), { duration: 350, easing: cubicOut });

  // E → F, the street map: fetched once the figure mounts (the cover has
  // usually loaded the file already).
  let streets = $state.raw(null);
  onMount(() => {
    if (pair.stages.streetsInAt === undefined) return;
    // The water and the parks are a second, smaller file; without it the
    // streets still come.
    Promise.all([loadStreets(), loadLand().catch(() => ({}))]).then(
      ([data, areas]) => (streets = streetLayers(data, areas)),
    );
  });
  // Crossing `streetsInAt` (either way) plays the fade; until the streets
  // have arrived the city shapes simply stay.
  const streetsFade = Tween.of(() => (stages.streetsInAt !== undefined && progress >= stages.streetsInAt ? 1 : 0), {
    duration: 350,
    easing: cubicOut,
  });
  const streetsOpacity = $derived(streets ? streetsFade.current : 0);
  // F → G: every line but `pair.focus.lines` goes (MetroPanel takes its
  // station marks and the other lines' badges away in step).
  const focusFade = Tween.of(() => (stages.focusAt !== undefined && progress >= stages.focusAt ? 1 : 0), {
    duration: 350,
    easing: cubicOut,
  });
  // H → I…: the `more` lines come back ONE AT A TIME (Sandra, 2026-11-14:
  // first line 4, then line 14), each with a timed fade of its own once the
  // scroll passes its `at`. (`pair.focus.more` is fixed for the figure's
  // life, so one Tween per line is made here, once.)
  const moreFades = (pair.focus?.more ?? []).map((more) => ({
    line: more.line,
    fade: Tween.of(() => (progress >= more.at ? 1 : 0), { duration: 500, easing: cubicOut }),
  }));
  // THE LAST STATE, AFTER THE STORY: THE READER'S OWN MAP (Sandra,
  // 2026-11-14; `pair.explore`). Past `explore.at` every line comes back and
  // EVERY station inside Paris is a circle, with no name written (the name
  // is in the tooltip):
  // - its area is the station's entries (the story's own size scale);
  // - its colour is the station's `line` in the CSV: where several lines
  //   stop, the one that carries the most trips in a year;
  // - a switch beside the legend sets the circles: off, equal dots, or
  //   sized by entries (`stationMode`);
  // - clicking a station zooms in on it, as the story's stops do; clicking
  //   anywhere else zooms out again (`picked`).
  const exploring = $derived(!!pair.explore && progress >= pair.explore.at);
  const exploreFade = Tween.of(() => (exploring ? 1 : 0), { duration: 500, easing: cubicOut });
  const STATION_MODES = [
    ["off", "Off"],
    ["dots", "Dots"],
    ["entries", "By entries"],
  ];
  let stationMode = $state("entries");
  const shownFade = Tween.of(() => (stationMode === "off" ? 0 : 1), { duration: 350, easing: cubicOut });
  const sizedFade = Tween.of(() => (stationMode === "entries" ? 1 : 0), { duration: 500, easing: cubicOut });
  let picked = $state(null);
  // A click on a station or on the switch also reaches the window, whose
  // handler zooms out: this marks it as handled first.
  let handled = false;
  function clickedElsewhere() {
    if (handled) handled = false;
    else picked = null;
  }
  // Leaving the state (scrolling back) lets go of the picked station.
  $effect(() => {
    if (!exploring) picked = null;
  });
  // Every station of `pair.explore.stations`, at its dominant line's stop.
  const exploreStations = $derived.by(() => {
    const e = pair.explore;
    if (!e?.stations) return [];
    return e.stations.flatMap((row) => {
      const line = String(row[e.lineKey]);
      const name = row[e.nameKey];
      const stop = pair.map.stops.features.find((s) => s.properties.line === line && s.properties.name === name);
      if (!stop) return [];
      return [
        {
          name,
          value: row[e.valueKey],
          coordinates: stop.geometry.coordinates,
          lines: stop.properties.lines.split(",").map((l) => l.trim()),
          color: pair.tracks.find((t) => t.line === line)?.color ?? brand.ink,
        },
      ];
    });
  });

  // `back`: how far each of those lines is back, 0 → 1, by line; `all`:
  // every line back at once, for the last state.
  const focus = $derived(
    pair.focus
      ? {
          lines: pair.focus.lines,
          amount: focusFade.current,
          back: Object.fromEntries(moreFades.map((more) => [more.line, more.fade.current])),
          all: exploreFade.current,
        }
      : null,
  );
  // As MetroPanel's `strength`.
  const lineStrength = (line) =>
    !focus || focus.lines.includes(line)
      ? 1
      : 1 - focus.amount * (1 - Math.max(focus.back[line] ?? 0, focus.all));
  // G → H: the dots take their size.
  const sizeFade = Tween.of(() => (stages.sizeAt !== undefined && progress >= stages.sizeAt ? 1 : 0), {
    duration: 500,
    easing: cubicOut,
  });
  // I → J…: THE MAP TRAVELS (after subwaystories.nyc). `pair.focus.zoom` is
  // a list of stops in scroll order, [{ at, station, scale }]: past a stop's
  // `at` the map eases in on that station and stays there; past the next it
  // travels on to the next station; a stop without a station shows the
  // whole map again. Before the first stop: null, the whole map.
  // (The stop's index first, so the target is one object for as long as the
  // map stays there, not a new one on every scroll frame.)
  const zoomIndex = $derived.by(() => {
    let current = -1;
    (pair.focus?.zoom ?? []).forEach((stop, k) => {
      if (progress >= stop.at) current = k;
    });
    return current;
  });
  const zoomTarget = $derived.by(() => {
    // The last state: the station the reader clicked, if any.
    if (exploring) {
      const station = picked && exploreStations.find((s) => s.name === picked);
      return station ? { coordinates: station.coordinates, scale: pair.explore.scale ?? 4 } : null;
    }
    const z = pair.focus?.zoom?.[zoomIndex];
    if (!z?.station) return null;
    const stop = pair.map.stops.features.find((s) => s.properties.name === z.station);
    return stop ? { coordinates: stop.geometry.coordinates, scale: z.scale ?? 4 } : null;
  });
  // STATION NAMES (Sandra, 2026-11-14: not every station needs its name).
  // On the whole map only the big stations are named (`focus.labelMin`, a
  // value; without it all are); zoomed in there is room, so the others'
  // names fade in with the zoom and out again with it.
  const namesFade = Tween.of(() => (zoomTarget ? 1 : 0), { duration: 500, easing: cubicOut });
  // The stations of the kept and the added lines (`pair.focus.stations`),
  // each with its place on the map, from the map's own stops, and its
  // line's colour. A station on several of the lines is drawn ONCE, for the
  // first line it is listed under (its number is the whole station's).
  const focusStations = $derived.by(() => {
    const f = pair.focus;
    if (!f?.stations) return [];
    const seen = new Set();
    return f.stations.flatMap((row) => {
      const line = row[f.lineKey];
      const name = row[f.nameKey];
      const stop = pair.map.stops.features.find((s) => s.properties.line === line && s.properties.name === name);
      if (!stop || seen.has(name)) return [];
      seen.add(name);
      return [
        {
          name,
          value: row[f.valueKey],
          coordinates: stop.geometry.coordinates,
          // Every métro line at the station, for the tooltip's badges.
          lines: stop.properties.lines.split(",").map((l) => l.trim()),
          color: pair.tracks.find((t) => t.line === line)?.color ?? brand.ink,
          line,
          added: !f.lines.includes(line),
          minor: row[f.valueKey] < (f.labelMin ?? 0),
        },
      ];
    });
  });
  // One size scale for the story's stations and the last state's.
  const focusMax = $derived(Math.max(1, ...focusStations.map((s) => s.value), ...exploreStations.map((s) => s.value ?? 0)));

  // What shows when.
  // The one chart's axes: there for A and B, gone early in the move to C.
  const oneChartOpacity = $derived(1 - clamp01(tPanels / 0.25));
  // Its two label sets cross-fade half-way through A → B.
  // (Stacked, the scale stays the total's: its labels stay.)
  const totalLabels = $derived(pair.stacked ? 1 : clamp01(1 - 2 * tLines));
  const lineLabels = $derived(pair.stacked ? 0 : clamp01(2 * tLines - 1));
  // The black total and its events go as the copies leave it.
  const totalOpacity = $derived(clamp01(1 - 2.5 * tLines));
  const eventsOpacity = $derived(clamp01(1 - 4 * tLines));
  // The panels' frames: in as the lines land, out just before they leave.
  const leaving = $derived(clamp01((progress - (stages.mapStart - 0.04)) / 0.04));
  const frameOpacity = $derived(clamp01((tPanels - 0.8) / 0.2) * (1 - leaving));
  // The badges: in with the colours, they ride from the line ends to the
  // panel titles, and go with the frames (the map has its own).
  const badgeOpacity = $derived(colourFade.current * (1 - leaving));

  // From the Chart's inner box to the text column. The map gets a ROOMY box
  // (MetroPanel's `roomy`): at lg it bleeds 40px each side (the gap to the
  // side columns since 2026-11-14), 40px up and 56px down (lg:-mx-10
  // lg:-mt-10 lg:-mb-14; lg is 87.5rem on this project, not 64rem); below lg
  // 6vw each side (the figure is 88vw, so out to the screen's edges), 24px
  // down and 24px up (-mt-6, 2026-11-14: on a phone the charts take that
  // height too, so `topInset` stays 0 there). The Chart pads 16px inside that. The charts stay in the
  // column, where they were before the map grew: inset by the bleed minus
  // the padding at the sides, by the extra bleed at top and bottom.
  const wide = new MediaQuery("min-width: 87.5rem");
  let innerWidth = $state(1024);
  const columnInset = $derived((wide.current ? 40 : 0.06 * innerWidth) - 16);
  const topInset = $derived(wide.current ? 8 : 0);
  const bottomInset = $derived(wide.current ? 56 : 24);

  const yearOf = (d) => d[pair.xKey].getFullYear();
  const byYear = (a, b) => a[pair.xKey] - b[pair.xKey];

  // The whole network.
  const totalRows = $derived([...pair.total].sort(byYear));
  const totalValues = $derived(totalRows.map((d) => d[pair.yKey]));
  const totalFirst = $derived(yearOf(totalRows[0]));
  const totalLast = $derived(yearOf(totalRows[totalRows.length - 1]));
  // Each line's values in year order (every line has the same years).
  const rows = $derived(pair.groups.map((g) => pair.data.filter((d) => d[pair.groupKey] === g).sort(byYear)));
  const values = $derived(rows.map((r) => r.map((d) => d[pair.yKey])));
  const lineFirst = $derived(yearOf(rows[0][0]));
  const lineLast = $derived(yearOf(rows[0][rows[0].length - 1]));
  // The year the total's x axis starts at: 2000, then (A → A′) 2015.
  const firstShown = $derived(lerp(totalFirst, lineFirst, tStretch));
  // The year labels cross-fade from the total's to the lines' half-way
  // through the stretch.
  const totalYears = $derived(clamp01(1 - 2 * tStretch));
  const lineYears = $derived(clamp01(2 * tStretch - 1));

  // THE STACK (`pair.stacked`): the panels' indices from the bottom band to
  // the top one, by the last year's value (fewest trips on the x axis, most
  // on top; the order holds for every year, as in any stacked chart). Then
  // each panel's two boundaries as series of their own: `stackTop[p]` is its
  // line's values plus everything under it, `stackBase[p]` the band below's
  // top (zeros for the lowest). The highest `stackTop` is the lines' sum,
  // which is the total line (within 0.3%: the source's total counts a little
  // more than its lines from 2022 on).
  const stacked = $derived(!!pair.stacked);
  const stackOrder = $derived(
    values.map((_, p) => p).sort((a, b) => values[a][values[a].length - 1] - values[b][values[b].length - 1]),
  );
  const stack = $derived.by(() => {
    const top = [];
    const base = [];
    let running = values[0].map(() => 0);
    for (const p of stackOrder) {
      base[p] = running;
      running = running.map((v, k) => v + values[p][k]);
      top[p] = running;
    }
    return { top, base };
  });
  // The fills: in with the colours, out early on the way to the panels.
  // The lines themselves step back while the fills are there.
  const fillOpacity = $derived(stacked ? colourFade.current * (1 - clamp01(tPanels / 0.15)) : 0);

  // Round scale tops, and the gridlines under them (the top tick is the
  // scale's headroom only: no gridline or label for it).
  const roundTop = (max) => scaleLinear().domain([0, max]).nice().domain()[1];
  const innerTicks = (top, count) =>
    scaleLinear()
      .domain([0, top])
      .ticks(count)
      .filter((v) => v > 0 && v < top);
  const totalTop = $derived(roundTop(Math.max(...totalValues)));
  const lineTop = $derived(roundTop(Math.max(...values.flat())));
  // The one chart draws the same number of gridlines for both scales, so
  // each can slide from the total's value to the lines'.
  const totalTicks = $derived(innerTicks(totalTop, 4));
  const lineTicks = $derived(innerTicks(lineTop, 4));
  const gridlines = $derived(
    totalTicks.length === lineTicks.length
      ? totalTicks.map((v, i) => ({ total: v, line: lineTicks[i] }))
      : lineTicks.map((v) => ({ total: (v / lineTop) * totalTop, line: v })),
  );
  // A panel is short: one or two gridlines.
  const panelTicks = $derived(innerTicks(lineTop, 2));

  // The labelled years. The total's: every fifth. The lines': even steps
  // from the last year back to the first.
  const totalYearTicks = $derived(
    totalRows.map(yearOf).filter((year) => (totalLast - year) % 5 === 0),
  );
  const lineSpan = $derived(lineLast - lineFirst);
  // The one chart, 2015–2025: EVERY SECOND YEAR, counted back from the last
  // (Sandra, 2026-11-14: with four labels the stretched axis looked empty).
  const lineYearTicks = $derived(rows[0].map(yearOf).filter((year) => (lineLast - year) % 2 === 0));
  // A small panel has room for four at most: even steps of six (or five).
  const panelYearStep = $derived(lineSpan % 6 === 0 ? 6 : lineSpan % 5 === 0 ? 5 : lineSpan);
  const panelYearTicks = $derived(
    rows[0].map(yearOf).filter((year) => (lineLast - year) % panelYearStep === 0),
  );
  // Full at the ends, ’yy between.
  const yearLabel = (year, ticks) =>
    year === ticks[0] || year === ticks[ticks.length - 1] ? String(year) : `’${String(year % 100).padStart(2, "0")}`;

  // A series' value u of the way through its years (u: 0 → 1), ON THE
  // HOUSE LINE: the curve the other reports' line charts draw (d3's
  // curveMonotoneX — it rounds the corners and never overshoots a value),
  // worked out here because these lines are morphing paths, not a Spline.
  // The slope at each year is d3's own rule (Steffen's monotone slopes).
  const slopeCache = new WeakMap();
  function slopes(series) {
    if (slopeCache.has(series)) return slopeCache.get(series);
    const n = series.length;
    const secant = (i) => series[i + 1] - series[i];
    const m = series.map((_, i) => {
      if (i === 0 || i === n - 1) return 0;
      const a = secant(i - 1);
      const b = secant(i);
      return (Math.sign(a) + Math.sign(b)) * Math.min(Math.abs(a), Math.abs(b), 0.25 * Math.abs(a + b));
    });
    if (n > 2) {
      m[0] = (3 * secant(0) - m[1]) / 2;
      m[n - 1] = (3 * secant(n - 2) - m[n - 2]) / 2;
    } else if (n === 2) {
      m[0] = m[1] = secant(0);
    }
    slopeCache.set(series, m);
    return m;
  }
  function valueAt(series, u) {
    const f = clamp01(u) * (series.length - 1);
    const i = Math.min(series.length - 2, Math.floor(f));
    const t = f - i;
    const m = slopes(series);
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * series[i] +
      (t3 - 2 * t2 + t) * m[i] +
      (-2 * t3 + 3 * t2) * series[i + 1] +
      (t3 - t2) * m[i + 1]
    );
  }

  // THE ONE CHART (states A and B): in the text column, the plot ending
  // before the y labels' strip — and, in B, before the badges' strip too.
  function oneChart(width, height, compact) {
    const labelRoom = compact ? 30 : 36;
    const badgeRadius = compact ? 6 : 8;
    const x0 = columnInset;
    const x1 = width - columnInset;
    const top = topInset + (compact ? 14 : 16);
    const bottom = height - bottomInset - (compact ? 20 : 24);
    const left = x0 + 6;
    const yOf = (share) => bottom - share * (bottom - top);
    return {
      x0,
      x1,
      top,
      bottom,
      yOf,
      badgeRadius,
      left,
      // A: the total's years across the plot, from `firstShown` on (earlier
      // years fall left of the plot and are not drawn).
      totalX: (year) => lerp(left, x1 - labelRoom, (year - firstShown) / (totalLast - firstShown)),
      // B: the lines' years across a slightly narrower plot.
      lineX: (u) => lerp(left, x1 - labelRoom - 2 * badgeRadius - 12, u),
      badgeX: x1 - labelRoom - badgeRadius - 4,
    };
  }

  // THE PANELS (state C): MetroMorphPanel's grid — four columns, three on
  // phones — each with a title row, the plot, and room for the years under
  // the lowest panel of each column. The plot ends before the y label,
  // which sits at the right end of its gridline.
  function panelGrid(width, height, compact) {
    const count = pair.groups.length;
    const columns = compact ? 3 : 4;
    const rowCount = Math.ceil(count / columns);
    const gapX = compact ? 12 : 24;
    const gapY = compact ? 6 : 10;
    const titleH = compact ? 18 : 24;
    const yearsH = compact ? 16 : 20;
    const labelRoom = compact ? 20 : 24;
    const w = (width - 2 * columnInset - gapX * (columns - 1)) / columns;
    const h = (height - topInset - bottomInset - gapY * (rowCount - 1)) / rowCount;
    return pair.groups.map((group, i) => {
      const x0 = columnInset + (i % columns) * (w + gapX);
      const y0 = topInset + Math.floor(i / columns) * (h + gapY);
      const plotTop = y0 + titleH + 6;
      const plotBottom = y0 + h - yearsH;
      return {
        group,
        color: pair.colors[i],
        x0,
        x1: x0 + w,
        y0,
        plotX1: x0 + w - labelRoom,
        plotTop,
        plotBottom,
        yOf: (v) => plotBottom - (v / lineTop) * (plotBottom - plotTop),
        lowest: i + columns >= count,
      };
    });
  }

  // Badges at the line ends in B would sit on top of each other where lines
  // end close together: keep each at least `gap` from the one above, inside
  // [top, bottom], as near its line's end as that allows.
  function spread(targets, gap, top, bottom) {
    const order = targets.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
    for (let k = 0; k < order.length; k++) {
      order[k].y = Math.max(order[k].y, k === 0 ? top : order[k - 1].y + gap);
    }
    for (let k = order.length - 1; k >= 0; k--) {
      order[k].y = Math.min(order[k].y, k === order.length - 1 ? bottom : order[k + 1].y - gap);
    }
    const out = [];
    for (const { y, i } of order) out[i] = y;
    return out;
  }

  // Everything drawn for the current scroll position.
  function scene(context) {
    const projection = context.geo.projection;
    if (!projection || !context.width) return null;
    const compact = context.width < 640;
    const one = oneChart(context.width, context.height, compact);
    const panels = panelGrid(context.width, context.height, compact);
    const mapWidth = (compact ? 2 : 3) * (pair.map.lineWeight ?? 1);
    // THE HOUSE LINE in the chart states, as in every report's line chart
    // (.claude/skills/dataviz, "Line charts"): 2.5px (2px on phones), round
    // joins and caps, on a ground-coloured casing 1px wider each side, so
    // where two lines cross one passes in front of the other.
    const chartWidth = compact ? 2 : 2.5;

    // The black total, and its events.
    // The line starts at `firstShown` (a point between two years while the
    // axis stretches), so nothing is drawn left of the plot.
    const totalPoint = (i) => [one.totalX(totalFirst + i), one.yOf(totalValues[i] / totalTop)];
    const startValue = valueAt(totalValues, (firstShown - totalFirst) / (totalLast - totalFirst));
    // Four points a year, so the path follows the house curve (valueAt).
    const totalPoints = [[one.left, one.yOf(startValue / totalTop)]];
    for (let year = Math.floor(firstShown * 4 + 1) / 4; year <= totalLast; year += 0.25) {
      const value = valueAt(totalValues, (year - totalFirst) / (totalLast - totalFirst));
      totalPoints.push([one.totalX(year), one.yOf(value / totalTop)]);
    }
    const totalPath = "M" + totalPoints.map((point) => point.map((v) => v.toFixed(1)).join(",")).join("L");
    // An event's name stays inside the plot: at the left edge it sits as far
    // right of its point as it needs to (its width estimated from its length).
    const events = (pair.events ?? [])
      .filter((event) => event.year >= firstShown - 0.001)
      .map((event) => {
        const [x, y] = totalPoint(event.year - totalFirst);
        const halfWidth = (event.label.length * (compact ? 10 : 12) * 0.55) / 2;
        return { ...event, x, y, labelX: Math.max(x, one.x0 + halfWidth), drop: event.drop ?? 14 };
      });

    // The lines: nothing to draw until the copies leave the total.
    const paths =
      tLines <= 0
        ? []
        : pair.tracks.map((track, i) => {
            const series = values[track.panel];
            const panel = panels[track.panel];
            const toMap = tMap(i);
            // State B: on its own line — or, stacked, on its band's top edge.
            const inOne = (u) =>
              stacked
                ? one.yOf(valueAt(stack.top[track.panel], u) / totalTop)
                : one.yOf(valueAt(series, u) / lineTop);
            const point = ([long, lat, u]) => {
              let x;
              let y;
              if (toMap > 0) {
                const [mapX, mapY] = projection([long, lat]);
                x = lerp(lerp(panel.x0, panel.plotX1, u), mapX, toMap);
                y = lerp(panel.yOf(valueAt(series, u)), mapY, toMap);
              } else if (tPanels > 0) {
                x = lerp(one.lineX(u), lerp(panel.x0, panel.plotX1, u), tPanels);
                y = lerp(inOne(u), panel.yOf(valueAt(series, u)), tPanels);
              } else {
                const year = lerp(lineFirst, lineLast, u);
                const total = valueAt(totalValues, (year - totalFirst) / (totalLast - totalFirst));
                x = lerp(one.totalX(year), one.lineX(u), tLines);
                y = lerp(one.yOf(total / totalTop), inOne(u), tLines);
              }
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            };
            return {
              line: track.line,
              opacity: lineStrength(track.line) * (1 - fillOpacity),
              color: mix(brand.ink, track.color, colourFade.current),
              d: track.strands.map((strand) => "M" + strand.map(point).join("L")).join(""),
              width: lerp(chartWidth, mapWidth, toMap),
              // The ground-coloured casing each side: the chart's 1px, the map's 1.5px.
              casing: lerp(1, compact ? 1 : 1.5, toMap),
            };
          });

    // The badges: from each line's end in the one chart to its panel's title.
    const r = one.badgeRadius;
    // THE BANDS (stacked, state B): each line's area between its two
    // boundaries, four points a year on the house curve, the top edge left
    // to right and the base back.
    let bands = [];
    if (fillOpacity > 0) {
      const count = (lineLast - lineFirst) * 4;
      const edge = (series, k) =>
        `${one.lineX(k / count).toFixed(1)},${one.yOf(valueAt(series, k / count) / totalTop).toFixed(1)}`;
      const steps = Array.from({ length: count + 1 }, (_, k) => k);
      const back = [...steps].reverse();
      bands = stackOrder.map((p) => ({
        group: pair.groups[p],
        color: pair.colors[p],
        d: `M${steps.map((k) => edge(stack.top[p], k)).join("L")}L${back.map((k) => edge(stack.base[p], k)).join("L")}Z`,
      }));
    }

    const ends = spread(
      values.map((series, p) =>
        stacked
          ? // The middle of the band's right end.
            one.yOf((stack.top[p].at(-1) + stack.base[p].at(-1)) / 2 / totalTop)
          : one.yOf(series[series.length - 1] / lineTop),
      ),
      2 * r + 2,
      one.top,
      one.bottom - r,
    );
    const badges = panels.map((panel, i) => ({
      group: panel.group,
      color: panel.color,
      r,
      x: lerp(one.badgeX, panel.x0 + r, tPanels),
      y: lerp(ends[i], panel.y0 + r, tPanels),
    }));

    // The kept line's stations: equal dots, then (sizeFade) circles whose
    // AREA is the value. The biggest are drawn first, so a small neighbour
    // stays on top.
    let dots = [];
    let legend = null;
    const dot = mapWidth * 0.95;
    const radius = scaleSqrt().domain([0, focusMax]).range([0, compact ? 16 : 28]);
    // The last state's circles: every station, equal dots or sized
    // (`sizedFade`); a station without a count of its own stays a dot.
    let explore = [];
    if (exploreFade.current > 0 && shownFade.current > 0) {
      explore = exploreStations
        .map((station) => {
          const [x, y] = projection(station.coordinates);
          const r = station.value == null ? dot : lerp(dot, Math.max(dot, radius(station.value)), sizedFade.current);
          return { ...station, x, y, r };
        })
        .sort((a, b) => b.r - a.r);
    }
    if (focus && focus.amount > 0 && focusStations.length) {
      // The kept line's dots grow with sizeFade; an added line's arrive
      // sized, and only fade in.
      const sized = (value, added) => lerp(dot, Math.max(dot, radius(value)), added ? 1 : sizeFade.current);
      dots = focusStations
        // (The story's own stations go as the last state's arrive.)
        .map((station) => ({
          station,
          back: (station.added ? (focus.back[station.line] ?? 0) : 1) * (1 - exploreFade.current),
        }))
        .filter(({ back }) => back > 0)
        .map(({ station, back }) => {
          const [x, y] = projection(station.coordinates);
          return { ...station, x, y, r: sized(station.value, station.added), opacity: back };
        })
        .sort((a, b) => b.r - a.r);
      // The legend: nested circles standing on one baseline, in the lower
      // left corner of the street map's rectangle. DISCREET (Sandra,
      // 2026-11-14): straight on the map, no card behind it, the circles as
      // thin outlines only.
      const steps = (pair.focus.legendValues ?? []).map((value) => ({ value, r: radius(value) }));
      if (steps.length) {
        const big = Math.max(...steps.map((s) => s.r));
        legend = {
          steps,
          big,
          x: columnInset + 14 + big,
          // In the last state it moves up, clear of the station switch under it.
          bottom: context.height + 16 - (compact ? 12 : 16) - 30 * exploreFade.current,
        };
      }
    }

    return { compact, one, panels, paths, bands, totalPath, chartWidth, events, badges, dots, explore, legend };
  }
</script>

<!-- The one chart's axes (states A and B). The gridlines slide from the
     total's values to the lines'; the two sets of labels cross-fade. -->
{#snippet oneChartFrame(one, compact, events)}
  {@const labelSize = compact ? 10 : 12}
  {#each gridlines as gridline (gridline.line)}
    {@const y = one.yOf(lerp(gridline.total / totalTop, gridline.line / lineTop, stacked ? 0 : tLines))}
    <Line x1={one.x0} x2={one.x1} y1={y} y2={y} stroke={neutral.faint} strokeWidth={1} />
    {#each [[gridline.total, totalLabels], [gridline.line, lineLabels]] as [value, opacity], k (k)}
      {#if opacity > 0}
        <Text
          x={one.x1}
          y={y - 3}
          value={formatNumber(value)}
          textAnchor="end"
          verticalAnchor="end"
          fill={ink}
          fontSize={labelSize}
          font-weight={300}
          {opacity}
        />
      {/if}
    {/each}
  {/each}

  <!-- The x axis: an ink line, a short tick and a label per labelled year. -->
  <Line x1={one.x0} x2={one.x1} y1={one.bottom} y2={one.bottom} stroke={ink} strokeWidth={1} />
  <!-- The total's years (those still in the plot), then the lines' years,
       which stand where the stretched axis has them and move with the
       plot as it narrows for the badges (tLines). -->
  {#each [[totalYearTicks.filter((year) => year >= firstShown), totalYears, one.totalX], [lineYearTicks, lineYears, (year) => lerp(one.totalX(year), one.lineX((year - lineFirst) / (lineLast - lineFirst)), tLines)]] as [ticks, opacity, xOf], k (k)}
    {#if opacity > 0}
      <Group {opacity}>
        {#each ticks as year (year)}
          {@const x = xOf(year)}
          <Line x1={x} x2={x} y1={one.bottom} y2={one.bottom + 5} stroke={ink} strokeWidth={1} />
          <Text
            {x}
            y={one.bottom + 8}
            value={yearLabel(year, ticks)}
            textAnchor="middle"
            verticalAnchor="start"
            fill={ink}
            fontSize={labelSize}
            font-weight={300}
          />
        {/each}
      </Group>
    {/if}
  {/each}

  <!-- The events on the total line: a thin rule down from the point, the
       name under it (annotation-presets' lineCallout, by hand). -->
  {#if eventsOpacity > 0}
    <Group opacity={eventsOpacity}>
      {#each events as event (event.year)}
        <Line x1={event.x} x2={event.x} y1={event.y + 5} y2={event.y + event.drop} stroke={neutral.label} strokeWidth={1} />
        <Text
          x={event.labelX}
          y={event.y + event.drop + 3}
          value={event.label}
          textAnchor="middle"
          verticalAnchor="start"
          fill={ink}
          fontSize={labelSize}
          font-weight={300}
        />
      {/each}
    </Group>
  {/if}
{/snippet}

<!-- One panel's frame (state C): its name beside the badge, the gridline
     with its label at the right end, and (lowest panel of a column) the x
     axis with the years. Drawn under the lines. -->
{#snippet panelFrame(panel, compact)}
  {@const badgeRadius = compact ? 6 : 8}
  {@const labelSize = compact ? 9 : 11}
  <Text
    x={panel.x0 + badgeRadius * 2 + 6}
    y={panel.y0 + badgeRadius}
    value={pair.groupLabel(panel.group)}
    verticalAnchor="middle"
    fill={brand.ink}
    fontSize={compact ? 11 : 14}
    font-weight={500}
  />

  {#each panelTicks as v (v)}
    <Line x1={panel.x0} x2={panel.x1} y1={panel.yOf(v)} y2={panel.yOf(v)} stroke={neutral.faint} strokeWidth={1} />
    <Text
      x={panel.x1}
      y={panel.yOf(v) - 3}
      value={formatNumber(v)}
      textAnchor="end"
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
    {#each panelYearTicks as year (year)}
      {@const x = lerp(panel.x0, panel.plotX1, (year - lineFirst) / (lineLast - lineFirst))}
      <Line x1={x} x2={x} y1={panel.plotBottom} y2={panel.plotBottom + 4} stroke={ink} strokeWidth={1} />
      <!-- The first year's label starts at the axis' start, so it does not
           hang out of the panel into its neighbour. -->
      <Text
        {x}
        y={panel.plotBottom + 6}
        value={yearLabel(year, panelYearTicks)}
        textAnchor={year === lineFirst ? "start" : "middle"}
        verticalAnchor="start"
        fill={ink}
        fontSize={labelSize}
        font-weight={300}
      />
    {/each}
  {/if}
{/snippet}

{#snippet overlay(context)}
  {@const drawn = scene(context)}
  {#if drawn}
    {@const { compact, one, panels, paths, bands, totalPath, chartWidth, events, badges, dots, explore, legend } = drawn}
    <!-- Inside MetroPanel's Layer, under its stations and badges. -->
    <Group pointer-events="none">
      {#if oneChartOpacity > 0}
        <Group opacity={oneChartOpacity}>
          {@render oneChartFrame(one, compact, events)}
        </Group>
      {/if}
      {#if frameOpacity > 0}
        <Group opacity={frameOpacity}>
          {#each panels as panel (panel.group)}
            {@render panelFrame(panel, compact)}
          {/each}
        </Group>
      {/if}

      {#if totalOpacity > 0}
        <Path
          pathData={totalPath}
          fill="none"
          stroke={brand.ground}
          strokeWidth={chartWidth + 2}
          opacity={totalOpacity}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          pathData={totalPath}
          fill="none"
          stroke={brand.ink}
          strokeWidth={chartWidth}
          opacity={totalOpacity}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {/if}

      <!-- The stacked bands (state B with `pair.stacked`): each line's area
           in its colour, a ground-coloured hairline between neighbours. -->
      {#if bands.length}
        <Group opacity={fillOpacity}>
          {#each bands as band (band.group)}
            <Path pathData={band.d} fill={band.color} stroke={brand.ground} strokeWidth={1} stroke-linejoin="round" />
          {/each}
        </Group>
      {/if}

      <!-- The casing, then the line: drawn as a pair, so on the map each
           line cuts a gap through the lines beneath it. -->
      {#each paths as path (path.line)}
        {#if path.casing > 0.05}
          <Path
            pathData={path.d}
            fill="none"
            stroke={brand.ground}
            strokeWidth={path.width + 2 * path.casing}
            opacity={path.opacity}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        {/if}
        <Path
          pathData={path.d}
          fill="none"
          stroke={path.color}
          strokeWidth={path.width}
          opacity={path.opacity}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {/each}

      <!-- States G and H: the kept line's stations and their names. A name
           is written twice, a ground-coloured outline under the ink, so it
           reads over the streets (and in the PNG, which has no stylesheet). -->
      {#if dots.length}
        {@const nameSize = compact ? 9 : 12}
        <Group opacity={focus.amount}>
          {#each dots as dot (dot.name)}
            <Circle
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={dot.color}
              fill-opacity={lerp(1, 0.85, sizeFade.current)}
              opacity={dot.opacity}
              stroke={brand.ground}
              strokeWidth={compact ? 1 : 1.5}
            />
          {/each}
          {#each dots.filter((dot) => !dot.minor || namesFade.current > 0) as dot (dot.name)}
            {@const reach = (dot.r + (compact ? 3 : 5)) * Math.SQRT1_2}
            {#each [true, false] as outline (outline)}
              <Text
                x={dot.x + reach}
                y={dot.y - reach}
                value={dot.name}
                rotate={-45}
                textAnchor="start"
                verticalAnchor="middle"
                fill={outline ? brand.ground : brand.ink}
                stroke={outline ? brand.ground : "none"}
                strokeWidth={outline ? 3 : 0}
                opacity={dot.opacity * (dot.minor ? namesFade.current : 1)}
                stroke-linejoin="round"
                fontSize={nameSize}
                font-weight={500}
              />
            {/each}
          {/each}
        </Group>

        <!-- The sized circles' tooltip (states H and I only, once a circle
             has its size): the station's line badges, its name and its
             number (MetroPanel's Tooltip draws it). Small circles are last,
             so they are on top of a big neighbour. `pointer-events="all"`
             because everything around is switched off for the morph. -->
        {#if sizeFade.current === 1}
          {#each dots as dot (dot.name)}
            {#if dot.opacity === 1}
              {@const show = (event) =>
                context.tooltip.show(event, {
                  id: `sized-${dot.name}`,
                  station: {
                    name: dot.name,
                    lines: dot.lines,
                    value: dot.value,
                    label: pair.focus.tooltipLabel ?? "Entries",
                  },
                })}
              <Circle
                cx={dot.x}
                cy={dot.y}
                r={Math.max(dot.r, 8)}
                fill="transparent"
                stroke="none"
                pointer-events="all"
                onpointerenter={show}
                onpointermove={show}
                onpointerleave={() => context.tooltip.hide()}
              />
            {/if}
          {/each}
        {/if}
      {/if}

      <!-- THE LAST STATE: every station, its dominant line's colour, no
           names. Then one hit circle each (small ones last, so on top): the
           tooltip on hover, the zoom on click. -->
      {#if explore.length}
        <Group opacity={exploreFade.current * shownFade.current}>
          {#each explore as dot (dot.name)}
            <Circle
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={dot.color}
              fill-opacity={lerp(1, 0.85, sizedFade.current)}
              stroke={brand.ground}
              strokeWidth={compact ? 0.75 : 1}
            />
          {/each}
        </Group>
        {#if exploreFade.current === 1 && stationMode !== "off"}
          {#each explore as dot (dot.name)}
            {@const show = (event) =>
              context.tooltip.show(event, {
                id: `station-${dot.name}`,
                station: {
                  name: dot.name,
                  lines: dot.lines,
                  value: dot.value,
                  label: pair.focus.tooltipLabel ?? "Entries",
                },
              })}
            <Circle
              cx={dot.x}
              cy={dot.y}
              r={Math.max(dot.r, compact ? 7 : 6)}
              fill="transparent"
              stroke="none"
              pointer-events="all"
              class="cursor-pointer"
              onpointerenter={show}
              onpointermove={show}
              onpointerleave={() => context.tooltip.hide()}
              onclick={() => {
                handled = true;
                picked = picked === dot.name ? null : dot.name;
              }}
            />
          {/each}
        {/if}
      {/if}

      {#if legend && sizeFade.current > 0}
        {@const labelSize = compact ? 9 : 10}
        {@const labelX = legend.x + legend.big + (compact ? 10 : 12)}
        <Group opacity={sizeFade.current * focus.amount * lerp(1, sizedFade.current * shownFade.current, exploreFade.current)}>
          <Text
            x={legend.x - legend.big}
            y={legend.bottom - 2 * legend.big - 10}
            value={pair.focus.legendTitle}
            verticalAnchor="end"
            fill={ink}
            fontSize={labelSize}
            font-weight={400}
          />
          {#each legend.steps as step (step.value)}
            {@const top = legend.bottom - 2 * step.r}
            <Circle
              cx={legend.x}
              cy={legend.bottom - step.r}
              r={step.r}
              fill="none"
              stroke={neutral.label}
              strokeWidth={0.75}
            />
            <Line x1={legend.x} x2={labelX - 4} y1={top} y2={top} stroke={neutral.label} strokeWidth={0.75} />
            <Text
              x={labelX}
              y={top}
              value={formatNumber(step.value / 1e6)}
              verticalAnchor="middle"
              fill={ink}
              fontSize={labelSize}
              font-weight={300}
            />
          {/each}
        </Group>
      {/if}

      {#if badgeOpacity > 0}
        <Group opacity={badgeOpacity}>
          {#each badges as badge (badge.group)}
            <Circle cx={badge.x} cy={badge.y} r={badge.r} fill={badge.color} stroke="none" />
            <Text
              x={badge.x}
              y={badge.y}
              value={badge.group}
              textAnchor="middle"
              verticalAnchor="middle"
              fill={textOn(badge.color)}
              fontSize={(compact ? 7 : 9) * (badge.group.length > 2 ? 0.75 : 1)}
              font-weight={600}
            />
          {/each}
        </Group>
      {/if}
    </Group>
  {/if}
{/snippet}

<!-- THE STATION SWITCH (the last state only): off / equal dots / sized by
     entries. HTML over the map's lower left corner, under the size legend;
     the same hairline outline as the figure's PNG | CSV control. A click on
     it must not count as "somewhere else" (which zooms out). -->
{#snippet controls(context)}
  {#if exploreFade.current > 0}
    <div
      role="group"
      aria-label="Station circles"
      class="absolute z-10 inline-flex h-6 items-stretch overflow-hidden rounded-md border border-base-content/28 bg-base-200/80 font-sans text-[11px] tracking-wide text-base-content/75"
      style:left="{columnInset + 16 + 14}px"
      style:bottom="12px"
      style:opacity={exploreFade.current}
      style:pointer-events={exploring ? "auto" : "none"}
      onclick={() => (handled = true)}
    >
      {#each STATION_MODES as [mode, label], k (mode)}
        {#if k > 0}
          <span class="my-1.5 w-px bg-base-content/20" aria-hidden="true"></span>
        {/if}
        <button
          type="button"
          aria-pressed={stationMode === mode}
          class="cursor-pointer px-2 transition-colors duration-200 hover:text-base-content {stationMode === mode
            ? 'bg-base-content/10 text-base-content'
            : ''}"
          onclick={() => (stationMode = mode)}
        >
          {label}
        </button>
      {/each}
    </div>
  {/if}
{/snippet}

<!-- A click anywhere but on a station (or the switch) lets the map out
     again. -->
<svelte:window bind:innerWidth onclick={clickedElsewhere} />

<MetroPanel
  roomy
  pair={pair.map}
  marksOpacity={marksFade.current}
  baseOpacity={pair.baseMap === false ? 0 : marksFade.current * (1 - streetsOpacity)}
  {streets}
  {streetsOpacity}
  streetsInset={columnInset}
  zoom={zoomTarget}
  {focus}
  {overlay}
  {controls}
/>
