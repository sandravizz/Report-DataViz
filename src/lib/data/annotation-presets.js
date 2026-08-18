// Shared visual language for explanatory annotations (Datawrapper-style dark
// ink). Figures compose these so every callout inherits the same styling; any
// AnnotationPoint/Range prop can still be overridden per call.

import { ink, iw, colors } from "$lib/colors.js";

const annotationLabel = { fill: ink, class: "text-xs font-light" };
const mutedLabel = { fill: colors.lavender, class: "text-xs font-light" };

// Circled point callout. `filled` tints the ring with the series color for
// strong emphasis, otherwise a thin ink outline. `labelProps` extends the
// standard label (textAnchor, dx, width, …).
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

// Leader-line callout: no circle, just a thin muted line from the anchor to
// the label. `r` sets where the line starts (pass ~half the bar width);
// labelXOffset/labelYOffset set its length and angle.
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

// Dashed vertical reference line (e.g. an index's base period). Light gray so
// it reads as a reference mark, not a data callout; spans the full plot height
// unless y1/y2 shorten it. Note: layerchart's <Line> renders stroke-dasharray
// from its own `dashArray` prop after spreading the rest, so a plain
// `strokeDasharray` here is silently overwritten and the line comes out solid.
export function verticalRule({ labelProps = {}, ...annotation }) {
  return {
    labelPlacement: "top",
    labelYOffset: 4,
    ...annotation,
    props: {
      line: { stroke: iw.gray, strokeWidth: 1, dashArray: [4, 3] },
      label: { ...mutedLabel, textAnchor: "middle", ...labelProps },
    },
  };
}
