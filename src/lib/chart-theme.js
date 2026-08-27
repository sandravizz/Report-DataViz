import { defaultChartPadding } from "layerchart";
import { ink, iw } from "./colors.js";

export const tickLabelProps = { fill: ink, class: "text-xs font-light" };

// Axis numbers are a reference, not the primary readout (series are direct-
// labeled), so both axes go muted gray. Data labels keep tickLabelProps.
export const mutedTickLabelProps = { fill: iw.grayText, class: "text-xs font-light" };

// No tick marks and no axis rule line, on any axis of any chart. The one
// exception is the two-line quarterly axis below, which earns its pitch marks.
export const xAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };
export const yAxisProps = { tickLength: 10, tickMarks: false, rule: false, tickLabelProps: mutedTickLabelProps };

// Mobile crowds a dense year axis, so keep only the half-century years —
// unless that leaves fewer than three ticks. 1024 = the layout's lg:.
export function halfCenturyTicksOnMobile(ticks, innerWidth) {
  if (!ticks || innerWidth >= 1024) return ticks;
  const halved = ticks.filter((d) => d.getFullYear() % 50 === 0);
  return halved.length >= 3 ? halved : ticks;
}

// Mobile abbreviates years to two digits after the first tick (the century
// never changes within one chart); desktop always spells them out. Figures
// with their own xTickFormat bypass this.
export function yearTickFormat(innerWidth, firstYear) {
  return (d) => {
    const year = d.getFullYear();
    if (innerWidth >= 1024 || year === firstYear) return String(year);
    return String(year % 100).padStart(2, "0");
  };
}

// Quarterly series get a two-line x axis: a pitch mark under every quarter and
// the year on a second line under the mark that opens it — so the year row
// lands exactly where a plain year axis would have put it, and the quarters
// read as a finer comb hung off it.
//
// The quarters are MARKS ONLY, never words. Q2/Q3/Q4 were written under their
// marks once, and 25 labels under a line whose subject is a trend read as a row
// of noise — the reader was being asked to spell out a texture. The marks alone
// still say the series is quarterly and still show where each year starts, and
// the tooltip names the exact quarter (quarterLabel) for anyone who wants one.
// So the format returns an EMPTY STRING off Q1: the Axis still places the tick,
// and the label snippet is handed nothing to draw.
//
// Q1 writes no top line either, and instead runs a connector down to its year.
// Both lines travel as one string ("\n2018"): Text splits on the newline, and
// LineChartPanel's tickLabel snippet draws the connector and puts the year in
// the darker ink so the year leads.
const quarterOf = (d) => Math.floor(d.getMonth() / 3) + 1;

// Desktop keeps a mark per quarter. Below lg the comb closes up — 34 marks on
// a phone's plot is ~7px each — so mobile thins to the Q1 ticks only and takes
// the plain year axis with them.
export function quarterTicks(ticks, innerWidth) {
  if (!ticks || innerWidth >= 1024) return ticks;
  return ticks.filter((d) => d.getMonth() === 0);
}

// Marks under every quarter, words under none: off Q1 this returns an empty
// string, which draws no label but leaves the tick. Q1 carries the year on its
// second line. Below lg there is no second row, so the year is written plainly.
export function quarterTickFormat(innerWidth, firstYear) {
  if (innerWidth < 1024) return yearTickFormat(innerWidth, firstYear);
  return (d) => (d.getMonth() === 0 ? `\n${d.getFullYear()}` : "");
}

// The tooltip runs the axis's two lines back together — "Q2 2026" — rather
// than taking layerchart's default date format, which spells out a day
// ("1.4.2026") the quarterly data does not have.
export function quarterLabel(d) {
  return `Q${quarterOf(d)} ${d.getFullYear()}`;
}

// Axis geometry, and the one place the no-tick-marks rule bends: with no word
// under any quarter, the marks are the only thing left saying the axis is
// quarterly at all, so they stay. 4px pitch marks in the GRIDLINE gray rather
// than the axis gray — at #b1b1b1 the comb read as a picket fence under the
// plot, and #e6e6e6 lets it settle back into texture, which is all it is.
//
// The Q1 mark is the exception: it runs on down through the quarter row to stop
// `yearGap` short of its year, so the connector is what ties the year to its
// place on the axis. yearGap is also the knob for that line's LENGTH — raise it
// to shorten the connector without moving the year row, which stays pinned to
// yearLineOffset below.
export const quarterAxisTick = { length: 4, yearGap: 10, stroke: iw.grayLight };

// tickLength drives the label gap as well as the tick line, so with a 4px tick
// the year keeps its old 12px offset through an explicit dy. No fill override
// on the labels any more: the only label this axis renders is the year, and the
// snippet paints that in the body ink itself.
export const quarterXAxisProps = {
  tickLength: quarterAxisTick.length,
  tickMarks: true,
  rule: false,
  stroke: quarterAxisTick.stroke,
  tickLabelProps: { ...mutedTickLabelProps, dy: 12 },
};

// Distance from the quarter row down to the year row, and the bottom padding
// that has to clear both: defaultChartPadding reserves 20px, which fits one
// 12px line under a 10px tick gap and no more. The connector's length falls out
// of this minus quarterAxisTick.yearGap, so shortening the line is done there —
// move this and the year row moves with it.
export const yearLineOffset = 20;
export const twoLineXPadding = { bottom: 44 };

// Default y ticks: the scale's own candidates minus 0, which is redundant
// where the plot already sits flush against the axis. Figures needing exact
// values pass pair.yTicks instead. `count` is forwarded to scale.ticks().
export function excludeZeroTick(scale, count) {
  const candidates = typeof scale.ticks === "function" ? scale.ticks(count) : scale.domain();
  return candidates.filter((tick) => tick !== 0);
}

// Tooltips are desktop-only — tap-triggered tooltips misbehave on touch, so
// every chart passes this as its `tooltipContext`. See
// docs/tooltip-mobile-freeze-bug.md.
export function desktopTooltips(innerWidth) {
  return innerWidth >= 1024;
}

// Numeric y tick labels are wider than the default 20px left gutter.
export const yLabelPadding = { left: 36 };

// Values are stored pre-scaled to millions, so this only spells out the
// magnitude on the label itself. Shortens to "mil." only when a caller passes
// a real mobile innerWidth.
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

// Point annotations may carry a `mobile` override (placement, offsets, label
// props) for narrow viewports — SVG text neither clips nor wraps on its own,
// so it has to be repositioned instead.
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

// Background-colored text stroke behind every end/direct label, so it stays
// legible over a gridline or another series. .lc-text-svg sets paint-order:
// stroke globally, so this reads as a halo, not an outline. Thinner on
// mobile, where the desktop width looks like a blob.
export function endLabelHalo(innerWidth) {
  return { stroke: "var(--color-base-100)", strokeWidth: innerWidth < 1024 ? 3 : 8 };
}

// Stacked bars put y tick labels inside the plot rather than in a left
// gutter — on mobile a wide label has nowhere else to go. textAnchor flips to
// "start" so the label reads into the chart; the halo keeps it legible.
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

// Inline labels only need to clear the SVG edge, not fit the longest tick.
export const yLabelPaddingInline = { left: 8 };

// Right-hand padding reserved for end-of-line labels; tighter on mobile,
// where the labels wrap instead of running wide.
export function endLabelPadding(innerWidth, hasLabels, extra = {}) {
  const labelSpace = innerWidth < 1024 ? 60 : 80;
  return defaultChartPadding(hasLabels ? { ...extra, right: labelSpace } : extra);
}

// Mobile override for end labels: wrap rather than overflow the tighter
// margin. lineHeight is pinned because Text defaults to a flat 16px, which
// leaves oversized gaps under our 12px text-xs.
export const endLabelMobileWrap = {
  props: { label: { width: 80, truncate: false, lineHeight: "13px" } },
};

// Extra room between stacked bars on mobile, scaled relative to the figure's
// own padding so many-bar figures aren't compressed as hard as two-bar ones.
export function responsiveBandPadding(innerWidth, base) {
  return innerWidth < 1024 ? Math.min(base * 1.6, 0.68) : base;
}
