// Shared visual language for explanatory annotations (Datawrapper-style:
// dark ink for labels, hatch for projection ranges). Figures compose these
// via the factories below so every callout inherits the same styling; any
// AnnotationPoint/Range prop can still be overridden per call.

import { ink, iw, colors } from "$lib/colors.js";

const annotationLabel = { fill: ink, class: "text-xs font-light" };
const mutedLabel = { fill: colors.lavender, class: "text-xs font-light" };
const projectionPattern = {
  size: 8,
  lines: { rotate: -45, color: iw.gray, opacity: 0.5 },
};

// Circled point callout. `filled` tints the ring with the series color for
// strong emphasis; otherwise a thin ink outline. `labelProps` extends the
// standard dark-ink label (textAnchor, dx, width, …).
export function circleCallout({ color = ink, filled = false, labelProps = {}, ...annotation }) {
  return {
    r: filled ? 12 : 10,
    ...annotation,
    props: {
      circle: filled ? { stroke: color, fill: color, fillOpacity: 0.2 } : { stroke: ink, fill: "none" },
      label: { ...annotationLabel, ...labelProps },
    },
  };
}

// Leader-line callout (Datawrapper-style): no circle, just a thin muted line
// from the anchor to the label — the same connector language as the stacked
// charts' direct series labels. `r` sets how far from the anchor the line
// starts (pass ~half the bar width so it leaves from the bar's edge);
// labelXOffset/labelYOffset set the line's length and angle. The text is
// nudged 4px off the line's end on the side the placement points to.
export function lineCallout({ labelProps = {}, lineProps = {}, ...annotation }) {
  const dx = annotation.labelPlacement?.includes("left") ? -4 : 4;
  return {
    link: { stroke: colors.lavender, ...lineProps },
    ...annotation,
    props: {
      circle: { r: 0, stroke: "none", fill: "none" },
      label: { dx, ...annotationLabel, ...labelProps },
    },
  };
}

// Dashed vertical reference line (e.g. marking an index's base period). Muted
// like axis ticks since it's a reference mark, not a data callout; spans the
// full plot height by default (pass y1/y2 to shorten it).
export function verticalRule({ labelProps = {}, ...annotation }) {
  return {
    labelPlacement: "top",
    labelYOffset: 4,
    ...annotation,
    props: {
      line: { stroke: iw.grayText, strokeWidth: 1, strokeDasharray: "4 3" },
      label: { ...mutedLabel, textAnchor: "middle", ...labelProps },
    },
  };
}

// Hatched range band over the projected years. The label sits just above the
// plot at the band's left edge ("Projection →"); pass placement/props
// overrides for bands used as value highlights instead.
export function projectionRange({ x, label = "Projection →", ...annotation }) {
  return {
    x,
    pattern: projectionPattern,
    label,
    labelPlacement: "top-left",
    labelYOffset: 0,
    props: { label: { ...mutedLabel, textAnchor: "start", verticalAnchor: "end", dx: 0 } },
    ...annotation,
  };
}
