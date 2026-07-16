// Shared visual language for explanatory annotations (Datawrapper-style:
// dark ink for labels, hatch for projection ranges). Figures compose these
// via the factories below so every callout inherits the same styling; any
// AnnotationPoint/Range prop can still be overridden per call.

import { ink, colors } from "$lib/colors.js";

const annotationLabel = { fill: ink, class: "text-xs font-light" };
const mutedLabel = { fill: colors.lavender, class: "text-xs font-light" };
const projectionPattern = { size: 8, lines: { rotate: -45, opacity: 0.2 } };

// Circled point callout — one style everywhere: the ring wears the color of
// the series it highlights (stroke + translucent fill), the connector and
// label stay dark ink. Pass `color` as the highlighted series' color;
// `labelProps` extends the standard dark-ink label (textAnchor, dx, width, …).
export function circleCallout({ color = ink, labelProps = {}, ...annotation }) {
  return {
    r: 12,
    ...annotation,
    props: {
      circle: { stroke: color, fill: color, fillOpacity: 0.2 },
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
