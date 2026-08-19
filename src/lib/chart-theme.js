import { defaultChartPadding } from "layerchart";
import { ink } from "$lib/colors.js";

// Chart panels sit on plain white (ScrollySection), not the theme's base-100
// — that grey is only behind header/footer/landing. Line casings and any
// halo must match against this.
export const chartSurface = "#ffffff";

// Deliberately no `stroke`: it would be an SVG presentation attribute, which
// can never outrank LayerChart's own stylesheet rule for the axis-label halo.
// That halo is killed globally in tailwind.css's `@layer utilities` instead.
export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// No tick marks and no axis rule, on every axis of every chart. tickLength
// still matters with tickMarks off — it is the label's gap from the axis.
export const xAxisProps = { tickLength: 4, tickMarks: false, rule: false, tickLabelProps };
export const yAxisProps = { tickLength: 4, tickMarks: false, rule: false, tickLabelProps };

// X ticks for year axes, on the quarter-century grid (1800, 1825, … 2100) so
// a tick and its gridline always land on 2025, where the projection bands
// start. Start years off the grid snap up to the next grid year.
export function quarterCenturyTicks(startYear, endYear) {
  const ticks = [];
  for (let y = Math.ceil(startYear / 25) * 25; y <= endYear; y += 25) {
    ticks.push(new Date(y, 0, 1));
  }
  return ticks;
}

// Quarter-century ticks crowd a narrow x axis, so mobile keeps only the
// half-century years — unless that leaves fewer than three ticks, as on a
// short-range chart. (1024 is the mobile threshold throughout this file.)
export function halfCenturyTicksOnMobile(ticks, innerWidth) {
  if (!ticks || innerWidth >= 1024) return ticks;
  const halved = ticks.filter((d) => d.getFullYear() % 50 === 0);
  return halved.length >= 3 ? halved : ticks;
}

// Default y ticks: the scale's own candidates with 0 dropped — the plot
// already sits flush against the axis there, so a "0" label is clutter.
// Figures needing exact values pass pair.yTicks, which is used as-is instead.
export function excludeZeroTick(scale) {
  const candidates = typeof scale.ticks === "function" ? scale.ticks() : scale.domain();
  return candidates.filter((tick) => tick !== 0);
}

// Tooltips are desktop-only — on touch they can freeze mid-scroll
// (docs/tooltip-mobile-freeze-bug.md). Every chart passes this as its
// `tooltipContext` rather than a hardcoded boolean.
export function desktopTooltips(innerWidth) {
  return innerWidth >= 1024;
}

// Numeric y tick labels overflow the default 20px left gutter; this keeps
// them inside the container so plot and legend stay flush with the title.
export const yLabelPadding = { left: 36 };

// Halo behind end/direct labels — currently off, and moot anyway: tailwind's
// `@layer utilities` strips `stroke` from every LayerChart text element.
// Kept as a seam (all 3 call sites already pass `innerWidth`, which the halo
// width used to depend on) so bringing it back is a one-line change here.
export function endLabelHalo(innerWidth) {
  return { strokeWidth: 0 };
}

// Applies a point annotation's optional `mobile` override on narrow
// viewports, where the desktop placement would run past the plot edge — SVG
// text neither clips nor wraps on its own, so it has to be repositioned.
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

// Right-hand padding reserved for LineChartPanel's end-of-line labels.
// Mobile gets a tighter margin — width is scarce there and the labels wrap
// (see endLabelMobileWrap) instead of running wide.
export function endLabelPadding(innerWidth, hasLabels, extra = {}) {
  const labelSpace = innerWidth < 1024 ? 52 : 80;
  return defaultChartPadding(hasLabels ? { ...extra, right: labelSpace } : extra);
}

// Mobile override for end-of-line labels: the reserved margin is too tight
// for longer names on one line, so wrap. lineHeight must be pinned — Text
// defaults to a flat 16px (1em against an assumed 16px base, not our
// text-xs/12px), which leaves oversized gaps between wrapped lines.
export const endLabelMobileWrap = {
  props: { label: { width: 44, truncate: false, lineHeight: "13px" } },
};
