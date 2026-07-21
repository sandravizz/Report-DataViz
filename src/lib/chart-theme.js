import { defaultChartPadding } from "layerchart";
import { ink } from "./colors.js";

export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// Every line-over-area chart draws its wash at the same strength: the line
// does the reading, the fill only signals amount. All area components read
// this — never hardcode a fill opacity in a component or figure.
export const areaFillOpacity = 0.5;

// No tick marks and no axis rule line, on any axis of any chart.
export const xAxisProps = {  tickLength: 4, tickMarks: false, rule: false, tickLabelProps };
export const yAxisProps = { tickLength: 4, tickMarks: false, rule: false, tickLabelProps };

// X ticks for year axes: every 25 years on the quarter-century grid
// (1800, 1825, … 2100), so a tick and its gridline always land on 2025,
// where the projection bands start. Start years off the grid (e.g. 1980)
// snap up to the next grid year.
export function quarterCenturyTicks(startYear, endYear) {
  const ticks = [];
  for (let y = Math.ceil(startYear / 25) * 25; y <= endYear; y += 25) {
    ticks.push(new Date(y, 0, 1));
  }
  return ticks;
}

// On mobile the quarter-century ticks crowd the narrow x axis, so keep only
// the half-century years (1800, 1850, … 2100). Short-range charts would be
// left with fewer than three ticks that way, so they keep the full
// quarter-century set instead. Same <1024 mobile threshold as the layout's
// lg: breakpoint.
export function halfCenturyTicksOnMobile(ticks, innerWidth) {
  if (!ticks || innerWidth >= 1024) return ticks;
  const halved = ticks.filter((d) => d.getFullYear() % 50 === 0);
  return halved.length >= 3 ? halved : ticks;
}

// On mobile the x axis is too narrow to spell out every year in full — the
// first tick keeps its 4-digit year for orientation, later ticks abbreviate
// to the last two digits ("20", "21"…) since the century never changes
// within one chart's range. Desktop always shows full years. Figures with
// their own custom xTickFormat (e.g. scenario labels) pass that prop
// directly instead, so this only ever applies to plain year axes.
export function yearTickFormat(innerWidth, firstYear) {
  return (d) => {
    const year = d.getFullYear();
    if (innerWidth >= 1024 || year === firstYear) return String(year);
    return String(year % 100).padStart(2, "0");
  };
}

// Default y-axis ticks when a figure doesn't supply its own array via
// pair.yTicks: use the scale's own candidate ticks with 0 dropped, since the
// plot area already sits flush against the axis there and a "0" label is
// redundant clutter. Figures that need exact values (e.g. log scales, or a
// deliberately included 0) pass pair.yTicks, which is used as-is instead.
export function excludeZeroTick(scale) {
  const candidates = typeof scale.ticks === "function" ? scale.ticks() : scale.domain();
  return candidates.filter((tick) => tick !== 0);
}

// Tooltips are desktop-only: on mobile viewports the tooltip interaction is
// buggy (tap-triggered tooltips misbehave on touch), so every chart passes
// this as its `tooltipContext` instead of a hardcoded boolean. Same <1024
// mobile threshold as the layout's lg: breakpoint and the helpers below.
export function desktopTooltips(innerWidth) {
  return innerWidth >= 1024;
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
    innerWidth < 1024 && mobile
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
  const labelSpace = innerWidth < 1024 ? 52 : 80;
  return defaultChartPadding(hasLabels ? { ...extra, right: labelSpace } : extra);
}

// Mobile override for end-of-line label annotations: the reserved
// margin is too tight for longer names on one line, so wrap instead. Also
// pins lineHeight — Text's default line height is a flat 16px (1em resolved
// against an assumed 16px base font, not our actual text-xs/12px), which
// reads as oversized gaps between wrapped lines.
export const endLabelMobileWrap = {
  props: { label: { width: 44, truncate: false, lineHeight: "13px" } },
};

// Halo behind every end/direct label: a same-color-as-background text stroke
// so a label stays legible wherever it lands — most notably over a hatched
// projection band, but just as true over a gridline or another series. Text
// already paints its stroke under its fill (paint-order: stroke, set
// globally on .lc-text-svg), so this reads as a tight halo, not an outline.
// Mobile's smaller text and tighter layouts read the desktop width as a
// bloated blob rather than a halo, so it's scaled down there.
export function endLabelHalo(innerWidth) {
  return { stroke: "var(--color-base-100)", strokeWidth: innerWidth < 1024 ? 3 : 8 };
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
