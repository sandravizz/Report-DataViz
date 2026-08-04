import { defaultChartPadding } from "layerchart";
import { scaleBand } from "d3-scale";
import { ink, brand } from "./colors.js";

export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// Axis numbers are a reference, not the primary readout (series are
// direct-labeled), so both axes get a muted gray instead of ink.
export const mutedTickLabelProps = { fill: brand.grayText, class: "text-xs font-light" };

// No tick marks and no axis rule line, on any axis of any chart.
export const xAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };
export const yAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };

// Mobile keeps only half-century ticks (1800, 1850…) to avoid crowding the
// narrow x axis; short ranges left with <3 ticks keep the full set instead.
export function halfCenturyTicksOnMobile(ticks, innerWidth) {
  if (!ticks || innerWidth >= 1024) return ticks;
  const halved = ticks.filter((d) => d.getFullYear() % 50 === 0);
  return halved.length >= 3 ? halved : ticks;
}

// Mobile abbreviates years to their last two digits ("20", "21"…) except the
// first tick, which stays a full 4-digit year for orientation.
export function yearTickFormat(innerWidth, firstYear) {
  return (d) => {
    const year = d.getFullYear();
    if (innerWidth >= 1024 || year === firstYear) return String(year);
    return String(year % 100).padStart(2, "0");
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

// Default y ticks when a figure doesn't pass its own pair.yTicks: the
// scale's own candidates with 0 dropped (redundant against the flush axis).
// `count` forwards to scale.ticks() for a specific step.
export function excludeZeroTick(scale, count) {
  const candidates = typeof scale.ticks === "function" ? scale.ticks(count) : scale.domain();
  return candidates.filter((tick) => tick !== 0);
}

// Tooltips are desktop-only — tap-triggered tooltips misbehave on touch.
export function desktopTooltips(innerWidth) {
  return innerWidth >= 1024;
}

// Numeric y tick labels need more than the default 20px left gutter.
export const yLabelPadding = { left: 36 };

// Report figures store worker counts pre-scaled to millions (1.5 = 1.5
// million); this spells the magnitude out on the tick label itself. Only
// shortens to "mil." once a caller passes an actual mobile innerWidth (e.g.
// the stacked bar's last-bar total, which sits directly on the bar).
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

// A point annotation may carry a `mobile` override (placement/offsets/label
// props) for narrow viewports where the desktop placement would clip.
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

// Same-color-as-background text stroke behind every end/direct label, so it
// stays legible over a projection band, gridline, or another series.
export function endLabelHalo(innerWidth) {
  return { stroke: "var(--color-base-100)", strokeWidth: innerWidth < 1024 ? 3 : 8 };
}

// Stacked-bar y tick labels sit inside the plot rather than in a left
// gutter, so mobile has somewhere for them to go. textAnchor flips to
// "start" with a small dx so the label reads into the chart instead of
// hanging left of the axis line; the halo keeps it legible over gridlines.
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

// Left padding just needs to clear the SVG edge, since labels above live
// inside the plot rather than needing gutter width for the longest tick.
export const yLabelPaddingInline = { left: 8 };

// Right padding reserved for line charts' end-of-line labels.
export function endLabelPadding(innerWidth, hasLabels, extra = {}) {
  const right = innerWidth < 1024 ? 60 : 80;
  return defaultChartPadding(hasLabels ? { ...extra, right } : extra);
}

// Mobile end-label wrap width: fits most series names on one line without
// eating much bar width; also pins lineHeight (Text's 16px default reads
// oversized against our text-xs/12px).
export const endLabelMobileWrap = {
  props: { label: { width: 80, truncate: false, lineHeight: "13px" } },
};

// Extra gap between bars on mobile so a growth arrow and both bars' totals
// fit in a two-bar panel; scaled relative to the figure's own padding so
// many-bar figures aren't compressed as aggressively as two-bar ones.
export function responsiveBandPadding(innerWidth, base) {
  return innerWidth < 1024 ? Math.min(base * 1.6, 0.68) : base;
}

// scaleBand's `.padding()` setter applies one fraction to both the inner gap
// (between bars) and outer margin (before/after the first/last bar). A
// two-bar panel needs a big inner gap (see responsiveBandPadding) but
// nothing useful fills the outer margin, so passing BarChart this prebuilt
// scale (via its `xScale` prop) decouples the two: outer stays a small
// constant and bars get thicker.
const bandOuterPadding = 0.1;

export function bandXScale(paddingInner) {
  return scaleBand().paddingInner(paddingInner).paddingOuter(bandOuterPadding);
}
