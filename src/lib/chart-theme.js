import { defaultChartPadding } from "layerchart";
import { ink } from "./colors.js";

// The one width that separates the tablet layout from the desktop one, and the
// single knob for every viewport-conditional value in this file.
//
// It MUST track `--breakpoint-lg` in src/styles/tailwind.css. These were both
// 1024 when this file was written (2026-07-21); the layout moved to 1400 on
// 2026-08-04 and the numbers here did not follow, so the whole 1024-1400 band
// was getting the tablet LAYOUT with desktop TOOLTIPS, desktop annotation
// placements, desktop label halos and "million" spelled out — the opposite of
// what moving the breakpoint was for. Changing the two together is the fix; if
// you retune `--breakpoint-lg`, retune this with it.
//
// Every panel feeds this the WINDOW width (`<svelte:window bind:innerWidth />`),
// not the plot width, so it compares like with like against the CSS breakpoint.
const DESKTOP_MIN = 1400;

const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// Every line-over-area chart draws its wash at the same strength: the line
// does the reading, the fill only signals amount. All area components read
// this — never hardcode a fill opacity in a component or figure.
export const areaFillOpacity = 0.5;

// The x axis follows Bloomberg's sediment chart (Sandra, 2026-09-30): an ink
// axis line with a short tick under every label. `stroke` colours the rule
// and the tick marks; the labels keep their own fill and halo (the halo is a
// CSS rule in LayerChart, which beats the stroke attribute). The label's dy
// overrides LayerChart's default of `tickLength`, which would sit the text
// flush against the tick's end. The y axis stays bare: gridlines only.
const X_TICK_LENGTH = 5;
export const xAxisProps = {
  rule: true,
  stroke: ink,
  tickMarks: true,
  tickLength: X_TICK_LENGTH,
  tickLabelProps: { ...tickLabelProps, dy: X_TICK_LENGTH + 3 },
};
export const yAxisProps = { tickLength: 4, tickMarks: false, rule: false, tickLabelProps };

// How far the x axis line runs past the first and last tick, in px [left,
// right]. Every time-axis chart passes this as its chart-level `xPadding`:
// LayerChart pads the scale's DOMAIN by these pixels while the range — and so
// the axis rule, which spans the range — stays full width. The data and the
// ticks move in; the line does not. Band (bar) scales ignore xPadding, and
// don't need it: the band padding already leaves the rule overhanging the
// outer bars.
export const xAxisOverhang = [6, 12];

// Y labels at the RIGHT END of their gridlines, sitting on top of the line —
// Bloomberg's sediment chart again (Sandra, 2026-09-30, figure 1 first). A
// figure opts in with `yAxisRight: true`. The labels are right-aligned to the
// end of the range, so they need the data to stop short of it: those charts
// pass yAxisRightOverhang as xPadding instead of xAxisOverhang, and the
// right value is the room for a three-digit label ("300" at text-xs ≈ 20px)
// plus a gap. The gridlines and the x axis line run on under the labels.
export const yAxisRightProps = {
  placement: "right",
  tickLabelProps: { ...tickLabelProps, textAnchor: "end", verticalAnchor: "end", dx: 0, dy: -3 },
};
export const yAxisRightOverhang = [6, 32];

// The area wash as an OPAQUE colour: the series colour laid over the white
// figure surface at areaFillOpacity, pre-mixed. It looks the same as the
// translucent wash, but the gridlines no longer show through the area — the
// area paints over them, as in the Bloomberg reference. A single-series
// figure opts in with `solidWash: true`; AreaChartPanel then passes the fill
// through `props.area`. NOT through the series' own `props`: LayerChart's
// Spline spreads those onto the top line too, and a filled open line closes
// with a straight chord from the last point back to the first. Not for
// overlapping series: an opaque later area would hide the earlier one.
export function solidWash(color, opacity = areaFillOpacity) {
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [r, g, b] = rgb(color).map((c) => Math.round(255 + (c - 255) * opacity));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

// Default ticks for a year axis whose figure doesn't list its own `xTicks`:
// every year on desktop, every other year on mobile — counted back from the
// last year so the axis always ends on a labelled tick (same rule as
// BarChartPanelStacked's mobile bands). Explicit ticks are what let
// yearTickFormat know which labels are the ends; LayerChart's automatic ticks
// could start or stop on any year.
export function defaultYearTicks(data, xKey, innerWidth) {
  const years = data.map((d) => d[xKey]);
  if (innerWidth >= DESKTOP_MIN) return years;
  return years.filter((_, i) => (years.length - 1 - i) % 2 === 0);
}

// On mobile the quarter-century ticks crowd the narrow x axis, so keep only
// the half-century years (1800, 1850, … 2100). Short-range charts would be
// left with fewer than three ticks that way, so they keep the full
// quarter-century set instead. Below DESKTOP_MIN, i.e. the same threshold as
// the layout's lg: breakpoint.
export function halfCenturyTicksOnMobile(ticks, innerWidth) {
  if (!ticks || innerWidth >= DESKTOP_MIN) return ticks;
  const halved = ticks.filter((d) => d.getFullYear() % 50 === 0);
  return halved.length >= 3 ? halved : ticks;
}

// Year labels, at every width: the first and last tick spell the year in
// full, the ones between abbreviate to ’yy (2008 ’12 ’16 ’20 2024), as in
// Bloomberg's sediment chart. The apostrophe is a real ’ (U+2019): a bare
// "12" reads as a number, not a year. Pass the ticks the axis actually draws
// — the ends are found from them, so a mobile tick set that stops early still
// ends on a full year. Figures with their own xTickFormat (e.g. figure 3's
// IDA periods) pass that instead, so this only applies to plain year axes.
export function yearTickFormat(ticks) {
  const years = ticks.map((d) => d.getFullYear());
  const first = Math.min(...years);
  const last = Math.max(...years);
  return (d) => {
    const year = d.getFullYear();
    if (year === first || year === last) return String(year);
    return `’${String(year % 100).padStart(2, "0")}`;
  };
}

// Tooltip header for a time x axis: the year alone. The x values are Dates
// pinned to 1 January, so LayerChart's default header spells that out
// ("1 January 2035") — a day and a month the annual data never had. Values
// that aren't Dates (categorical bars) pass through untouched, so a panel can
// hand this to every tooltip it renders. Figures override via
// pair.tooltipHeaderFormat.
export function tooltipHeaderYear(d) {
  return d instanceof Date ? String(d.getFullYear()) : d;
}

// Default y-axis ticks when a figure doesn't supply its own array via
// pair.yTicks: use the scale's own candidate ticks with 0 dropped, since the
// plot area already sits flush against the axis there and a "0" label is
// redundant clutter. Figures that need exact values (e.g. log scales, or a
// deliberately included 0) pass pair.yTicks, which is used as-is instead.
// `count` forwards to scale.ticks() for a specific step; omitted, behaves as
// before.
export function excludeZeroTick(scale, count) {
  const candidates = typeof scale.ticks === "function" ? scale.ticks(count) : scale.domain();
  return candidates.filter((tick) => tick !== 0);
}

// Tooltips are desktop-only: on touch the tooltip interaction is buggy
// (tap-triggered tooltips misbehave — see docs/tooltip-mobile-freeze-bug.md),
// so every chart passes this as its `tooltipContext` instead of a hardcoded
// boolean. Gated on DESKTOP_MIN so it tracks the layout's lg: breakpoint, like
// the helpers below.
//
// CAVEAT, and the reason this is worth revisiting: the stated reason is TOUCH,
// but the test is WIDTH. Those used to agree closely enough at 1024; at 1400
// they don't. A 1280px-wide desktop window with a real mouse now gets no
// tooltips, and an iPad in landscape at 1366 correctly gets none but only by
// luck. The precise test is the pointer itself —
// `matchMedia("(any-hover: hover) and (pointer: fine)")`, the same gate
// CursorDot.svelte already uses — which would restore tooltips to narrow
// desktop windows and keep them off every touch device regardless of width.
// Not changed here because it alters behaviour on real desktops and wants an
// eye-check first.
export function desktopTooltips(innerWidth) {
  return innerWidth >= DESKTOP_MIN;
}

// Numeric y tick labels are wider than the default 20px left gutter; give
// those charts enough room that the labels stay inside the chart container,
// so the legend and plot stay flush with the title/subtitle/source.
export const yLabelPadding = { left: 36 };

// Point annotations may carry a `mobile` override (placement, offsets, label
// props) for narrow viewports where the desktop placement would run past the
// plot edge; SVG text does not clip-or-wrap on its own, so reposition instead.
export function resolveAnnotations(annotations, innerWidth) {
  return annotations.map(({ mobile, ...annotation }) =>
    innerWidth < DESKTOP_MIN && mobile
      ? {
          ...annotation,
          ...mobile,
          props: {
            ...annotation.props,
            ...mobile.props,
            label: { ...annotation.props?.label, ...mobile.props?.label },
          },
        }
      : annotation
  );
}

// End-of-line labels (LineChartPanel's series end labels) reserve padding on
// the right. Mobile gets a tighter margin than desktop —
// screen width is already scarce there, and the labels wrap instead of
// running wide.
export function endLabelPadding(innerWidth, hasLabels, extra = {}) {
  const labelSpace = innerWidth < DESKTOP_MIN ? 52 : 80;
  return defaultChartPadding(hasLabels ? { ...extra, right: labelSpace } : extra);
}

// Mobile override for end-of-line label annotations: the reserved
// margin is too tight for longer names on one line, so wrap instead. Also
// pins lineHeight — Text's default line height is a flat 16px (1em resolved
// against an assumed 16px base font, not our actual text-xs/12px), which
// reads as oversized gaps between wrapped lines.
const endLabelMobileWrap = {
  props: { label: { width: 44, truncate: false, lineHeight: "13px" } },
};

// Halo behind every end/direct label: a same-color-as-background text stroke
// so a label stays legible wherever it lands — most notably over a hatched
// projection band, but just as true over a gridline or another series. Text
// already paints its stroke under its fill (paint-order: stroke, set
// globally on .lc-text-svg), so this reads as a tight halo, not an outline.
// Mobile's smaller text and tighter layouts read the desktop width as a
// bloated blob rather than a halo, so it's scaled down there.
function endLabelHalo(innerWidth) {
  return { stroke: "var(--color-base-200)", strokeWidth: innerWidth < DESKTOP_MIN ? 3 : 8 };
}

// The end-of-line label annotation itself, shared by every panel that names
// series at their last observation instead of a legend. Dot and text wear the
// series color; a series whose color is too light to read as type (e.g. a
// muted tint) passes `endLabelColor` with a full-strength step of the same
// hue. A series can end before the x-domain does (null cells in the CSV), so
// the label anchors to its own last observation, not the last row.
export function endLabelAnnotation(s, pair, innerWidth) {
  const last = pair.data.findLast((d) => d[s.value] != null);
  return {
    x: last[pair.xKey],
    y: last[s.value],
    r: 4,
    label: s.endLabel,
    labelPlacement: "right",
    labelXOffset: 8,
    props: {
      circle: { fill: s.color, stroke: "none" },
      label: {
        ...endLabelHalo(innerWidth),
        fill: s.endLabelColor ?? s.color,
        class: "text-xs font-light",
      },
    },
    mobile: endLabelMobileWrap,
  };
}
