import { defaultChartPadding } from "layerchart";
import { scaleBand } from "d3-scale";
import { ink, brand } from "./colors.js";

export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// Series are direct-labeled, so axis numbers are secondary: muted, not ink.
export const mutedTickLabelProps = { fill: brand.grayText, class: "text-xs font-light" };

// No tick marks and no axis rule line, on any axis of any chart.
export const xAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };
export const yAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };

// Mobile keeps only half-century ticks (1800, 1850…) so the narrow x axis
// isn't crowded; ranges left with <3 ticks keep the full set.
export function halfCenturyTicksOnMobile(ticks, innerWidth) {
  if (!ticks || innerWidth >= 1024) return ticks;
  const halved = ticks.filter((d) => d.getFullYear() % 50 === 0);
  return halved.length >= 3 ? halved : ticks;
}

// Mobile abbreviates years to two digits ("20", "21"…); the first tick stays
// 4-digit for orientation.
export function yearTickFormat(innerWidth, firstYear) {
  return (d) => {
    const year = d.getFullYear();
    if (innerWidth >= 1024 || year === firstYear) return String(year);
    return String(year % 100).padStart(2, "0");
  };
}

// Tooltip header for a time x axis: the year alone. X values are Dates pinned
// to 1 January, which LayerChart would spell out as "1 January 2035" —
// precision the annual data never had. Non-Dates pass through, so any panel
// can hand this to every tooltip. Figures override via pair.tooltipHeaderFormat.
export function tooltipHeaderYear(d) {
  return d instanceof Date ? String(d.getFullYear()) : d;
}

// Default y ticks (when a figure passes no pair.yTicks): the scale's own
// candidates minus 0, redundant against the flush axis. `count` forwards to
// scale.ticks() for a specific step.
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

// Figures store worker counts pre-scaled to millions (1.5 = 1.5 million); this
// spells the magnitude out on the label. Shortens to "mil." only when a caller
// passes a real mobile innerWidth (e.g. a bar total sitting on the bar).
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

// Applies a point annotation's optional `mobile` override (placement/offsets/
// label props) where the desktop placement would clip on a narrow viewport.
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

// Background-colored stroke behind end/direct labels, so they stay legible
// over a projection band, gridline or another series.
export function endLabelHalo(innerWidth) {
  return { stroke: "var(--color-base-100)", strokeWidth: innerWidth < 1024 ? 3 : 8 };
}

// Stacked-bar y ticks sit inside the plot, not a left gutter, so mobile has
// room for them: textAnchor "start" + dx reads them into the chart, and the
// halo keeps them legible over gridlines.
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

// Only has to clear the SVG edge — the inline labels above need no gutter.
export const yLabelPaddingInline = { left: 8 };

// Right padding reserved for line charts' end-of-line labels.
export function endLabelPadding(innerWidth, hasLabels, extra = {}) {
  const right = innerWidth < 1024 ? 60 : 80;
  return defaultChartPadding(hasLabels ? { ...extra, right } : extra);
}

// Mobile end-label wrap width: fits most series names on one line without
// eating bar width. lineHeight is pinned because Text's 16px default reads
// oversized against our 12px text-xs.
export const endLabelMobileWrap = {
  props: { label: { width: 80, truncate: false, lineHeight: "13px" } },
};

// Extra gap between bars on mobile, so a growth arrow and both totals fit in a
// two-bar panel. Scaled off the figure's own padding, so many-bar figures
// aren't compressed as hard as two-bar ones.
export function responsiveBandPadding(innerWidth, base) {
  return innerWidth < 1024 ? Math.min(base * 1.6, 0.68) : base;
}

// scaleBand's `.padding()` applies one fraction to both the inner gap and the
// outer margin. Two-bar panels want a big inner gap (responsiveBandPadding)
// but nothing useful in the outer margin, so handing BarChart this prebuilt
// scale (its `xScale` prop) decouples them and lets bars get thicker.
const bandOuterPadding = 0.1;

export function bandXScale(paddingInner) {
  return scaleBand().paddingInner(paddingInner).paddingOuter(bandOuterPadding);
}
