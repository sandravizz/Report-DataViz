import { defaultChartPadding } from "layerchart";
import { scaleBand } from "d3-scale";
import { ink } from "./colors.js";

export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// Axis numbers are a reference, not the primary readout in some figures; a
// caller that wants a de-emphasized numeric tick can opt into this instead
// of tickLabelProps — same ink color, reduced opacity.
export const mutedTickLabelProps = { fill: ink, class: "text-xs font-light opacity-50" };

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

// Mobile abbreviates a year tick to its last two digits ("20", "21"…),
// except the first tick, which stays a full 4-digit year for orientation.
// Additive helper — no current figure's xTicks needs it yet, but a future
// dense year axis can opt in via its LineChart's xAxis.format.
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

// Report figures may store a value pre-scaled to millions (1.5 = 1.5
// million); this spells the magnitude out on the tick label itself. Only
// shortens to "mil." once a caller passes an actual mobile innerWidth.
export function formatMillions(d, innerWidth = Infinity) {
  if (d === 0) return "0";
  if (Math.abs(d) >= 1) {
    const millions = Math.round(d * 10) / 10;
    const value = Number.isInteger(millions) ? millions : millions.toFixed(1);
    return `${value} ${innerWidth < 1024 ? "mil." : "million"}`;
  }
  const thousands = Math.round(d * 1000);
  return `${thousands.toLocaleString()}K`;
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

// Same-color-as-background text stroke behind an end/direct label, so it
// stays legible over a gridline, projection band, or another series.
export function endLabelHalo(innerWidth) {
  return { stroke: "var(--color-base-100)", strokeWidth: innerWidth < 1024 ? 3 : 8 };
}

// A y-axis tick style for labels placed inside the plot instead of a left
// gutter (e.g. a stacked/inline total). textAnchor flips to "start" with a
// small dx so the label reads into the chart; the halo keeps it legible over
// gridlines. Additive helper — no current figure needs it yet.
export function yAxisPropsInline(innerWidth) {
  return {
    ...yAxisProps,
    tickLabelProps: {
      ...mutedTickLabelProps,
      textAnchor: "start",
      verticalAnchor: "end",
      dx: 8,
      dy: -3,
      ...endLabelHalo(innerWidth),
    },
  };
}

// Left padding just needs to clear the SVG edge for yAxisPropsInline, since
// its labels live inside the plot rather than needing gutter width.
export const yLabelPaddingInline = { left: 8 };

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

// Extra gap between bars on mobile so two adjacent bars' labels (and, e.g., a
// growth arrow) fit in a narrow panel; scaled relative to the figure's own
// padding so many-bar figures aren't compressed as aggressively as two-bar
// ones. Additive helper — no current figure needs it yet.
export function responsiveBandPadding(innerWidth, base) {
  return innerWidth < 1024 ? Math.min(base * 1.6, 0.68) : base;
}

// scaleBand's `.padding()` setter applies one fraction to both the inner gap
// (between bars) and outer margin (before/after the first/last bar). A
// narrow panel may need a big inner gap (see responsiveBandPadding) but
// nothing useful fills the outer margin, so passing BarChart this prebuilt
// scale (via its `xScale`/`yScale` prop) decouples the two: outer stays a
// small constant and bars get thicker.
const bandOuterPadding = 0.1;

export function bandXScale(paddingInner) {
  return scaleBand().paddingInner(paddingInner).paddingOuter(bandOuterPadding);
}
