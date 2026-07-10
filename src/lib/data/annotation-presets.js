// Shared visual language for explanatory annotations (Datawrapper-style:
// dark ink for labels, hatch for projection ranges). Figures compose these
// via the factories below so every callout inherits the same styling; any
// AnnotationPoint/Range prop can still be overridden per call.

const INK = "#2A2659";

const annotationLabel = { fill: INK, class: "text-xs font-light" };
const mutedLabel = { fill: "#736B82", class: "text-xs font-light" };
const projectionPattern = { size: 8, lines: { rotate: -45, opacity: 0.2 } };

// Circled point callout. `filled` tints the ring with the series color for
// strong emphasis; otherwise a thin ink outline. `labelProps` extends the
// standard dark-ink label (textAnchor, dx, width, …).
export function circleCallout({ color = INK, filled = false, labelProps = {}, ...annotation }) {
  return {
    r: filled ? 12 : 10,
    ...annotation,
    props: {
      circle: filled ? { stroke: color, fill: color, fillOpacity: 0.2 } : { stroke: INK, fill: "none" },
      label: { ...annotationLabel, ...labelProps },
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
