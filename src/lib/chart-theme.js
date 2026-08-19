import { defaultChartPadding } from "layerchart";
import { ink } from "$lib/colors.js";

// The Economic Outlook prints its figures straight onto the report's cream
// page rather than onto white cards, so here the chart stage *is* base-100
// (see ScrollySection) and this constant tracks it. Line casings and label
// halos are drawn in this color to knock out what sits behind them, so it
// has to stay in step with the chart background or the casings show up as
// pale ghosts on every crossing.
export const chartSurface = "#ffffff";

// No stroke here: an SVG presentation attribute can't outrank a stylesheet
// rule, so a `stroke` prop set here would lose to LayerChart's own default
// axis-label halo (Axis.base.svelte, `components` layer) regardless of its
// value. That halo — and every other LayerChart text stroke — is disabled
// globally in tailwind.css's `@layer utilities` block instead, the one place
// with a cascade layer late enough to actually win.
export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

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

// Was a same-color-as-background text stroke behind an end/direct label, so
// it stayed legible over a gridline, projection band, or another series.
// Disabled: tailwind.css's `@layer utilities` block now strips `stroke` from
// every LayerChart text element globally, so any value returned here is
// moot — kept (rather than removed at all 3 call sites) so it's a one-line
// revert if the halo comes back. `innerWidth` is unused while the halo is
// disabled but stays in the signature: the stroke width was viewport-
// dependent, and all three call sites already pass a width, so restoring it
// really is a one-line change to the body.
export function endLabelHalo(innerWidth) {
  return { strokeWidth: 0 };
}

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
