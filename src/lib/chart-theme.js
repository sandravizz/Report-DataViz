import { defaultChartPadding } from "layerchart";
import { ink, iea } from "./colors.js";

export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// Axis numbers are a reference, not the primary readout (series are
// direct-labeled), so both axes get the same muted gray as the "Projection"
// band label instead of the report's usual black ink. Data labels (bar
// totals, value-on-bar text, etc.) keep using `tickLabelProps` above.
export const mutedTickLabelProps = { fill: iea.grayText, class: "text-xs font-light" };

// No tick marks and no axis rule line, on any axis of any chart.
export const xAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };
export const yAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };

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
// `count` is forwarded to `scale.ticks()` as-is, so callers that want a
// specific step (paired with a matching `yNice` count on the scale, e.g. 5
// for "5, 10, 15…" / "0.5, 1, 1.5…" spacing) can pass it; omitted, it's
// d3's own default tick count.
export function excludeZeroTick(scale, count) {
  const candidates = typeof scale.ticks === "function" ? scale.ticks(count) : scale.domain();
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

// Word-formatted y tick labels ("1.5 million") run wider than the plain
// numeric gutter above, so charts using formatMillions() below get extra
// left padding to keep the longest tick ("10 million" etc.) from clipping.
export const yLabelPaddingWide = { left: 64 };

// Report figures store worker counts pre-scaled to millions (e.g. 1.5 =
// 1.5 million), so the y-axis domain is already the "actual" unit — this
// just spells out the magnitude on the tick label itself ("1.5 million",
// "500 thousand") instead of leaving readers to infer it from the subtitle.
export function formatMillions(d) {
  if (d === 0) return "0";
  if (Math.abs(d) >= 1) {
    const millions = Math.round(d * 10) / 10;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} million`;
  }
  const thousands = Math.round(d * 1000);
  return `${thousands.toLocaleString()}K`;
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

// Stacked bar charts put the y-axis tick labels inside the plot, over the
// gridlines, instead of in a reserved left-hand gutter — on mobile a "1
// million" label has nowhere to go if it has to live outside the chart.
// textAnchor flips from the axis default ("end", sitting left of the axis
// line) to "start" with a small positive dx, so the label starts right at
// the axis line and reads into the chart; the halo keeps it legible over a
// gridline or a bar it happens to land on.
export function yAxisPropsInline(innerWidth) {
  return {
    ...yAxisProps,
    tickLabelProps: {
      ...mutedTickLabelProps,
      textAnchor: "start",
      verticalAnchor: "end",
      dx: 4,
      dy: -3,
      ...endLabelHalo(innerWidth),
    },
  };
}

// Left padding only needs to clear the SVG edge now that labels live inside
// the plot rather than needing gutter width sized to the longest tick.
export const yLabelPaddingInline = { left: 8 };

// End-of-line labels (LineChartPanel's series end labels) reserve padding on
// the right. Mobile gets a tighter margin than desktop —
// screen width is already scarce there, and the labels wrap instead of
// running wide.
export function endLabelPadding(innerWidth, hasLabels, extra = {}) {
  const labelSpace = innerWidth < 1024 ? 60 : 80;
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
