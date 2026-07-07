import { defaultChartPadding } from "layerchart";

export const tickLabelProps = { fill: "#2A2659", class: "text-xs font-light" };

// No tick marks and no axis rule line, on any axis of any chart.
export const xAxisProps = {  tickLength: 4, tickMarks: false, rule: false, tickLabelProps };
export const yAxisProps = { tickLength: 4, tickMarks: false, rule: false, tickLabelProps };

// Default y-axis ticks when a figure doesn't supply its own array via
// pair.yTicks: use the scale's own candidate ticks with 0 dropped, since the
// plot area already sits flush against the axis there and a "0" label is
// redundant clutter. Figures that need exact values (e.g. log scales, or a
// deliberately included 0) pass pair.yTicks, which is used as-is instead.
export function excludeZeroTick(scale) {
  const candidates = typeof scale.ticks === "function" ? scale.ticks() : scale.domain();
  return candidates.filter((tick) => tick !== 0);
}

export const legendProps = {
  class: "text-xs font-light",
  classes: {
    items: "flex-wrap gap-x-3 gap-y-1",
    // Default swatches (16px) read as oversized next to text-xs labels,
    // especially once several wrap across two rows on mobile.
    swatch: "w-2.5 h-2.5",
  },
};

// Stacked charts: hovering a legend item must not highlight its area/column
// (the legend click-to-toggle stays active). Returning a non-nullish value
// stops Legend from falling back to its built-in highlight handlers.
export const stackedLegendProps = {
  ...legendProps,
  onpointerenter: () => false,
  onpointerleave: () => false,
};

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

// End-of-line/band labels (LineChartPanel's lineEndLabels, StackedAreaChartPanel's
// areaEndLabels) reserve right padding for the label text in place of legend
// rows. Mobile gets a tighter margin than desktop — screen width is already
// scarce there, and the labels wrap instead of running wide.
export function endLabelPadding(innerWidth, hasLabels, extra = {}) {
  return defaultChartPadding(
    hasLabels ? { ...extra, right: innerWidth < 1024 ? 52 : 80 } : extra
  );
}

// Mobile override for end-of-line/band label annotations: the reserved
// margin is too tight for longer names on one line, so wrap instead. Also
// pins lineHeight — Text's default line height is a flat 16px (1em resolved
// against an assumed 16px base font, not our actual text-xs/12px), which
// reads as oversized gaps between wrapped lines.
export const endLabelMobileWrap = {
  props: { label: { width: 44, truncate: false, lineHeight: "13px" } },
};

// Bottom padding must fit the wrapped legend: on mobile items stack ~2 per
// row, on desktop a single row is enough unless there are many series.
// Passed as an explicit `bottom` (not the `legend: true` flag) because that
// flag always adds a fixed 32px on top, which left more empty space between
// plot and legend than the smaller swatches actually need.
const legendGap = 12; // space between the axis and the first legend row
const legendRowHeight = 18; // per wrapped row, sized for the 10px swatches
export function legendPadding(seriesCount, innerWidth, extra = {}) {
  const rows = innerWidth < 1024 ? Math.ceil(seriesCount / 2) : seriesCount > 4 ? 2 : 1;
  return defaultChartPadding({ ...extra, bottom: 20 + legendGap + rows * legendRowHeight });
}
