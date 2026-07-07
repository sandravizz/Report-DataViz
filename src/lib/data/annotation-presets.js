// Shared visual language for explanatory annotations (Datawrapper-style:
// dark ink for labels, muted dashed rules for projection dividers, hatch
// for projection ranges). Figures compose these via the factories below so
// every callout inherits the same styling; any AnnotationPoint/Line/Range
// prop can still be overridden per call.

const INK = "#2A2659";

export const annotationLabel = { fill: INK, class: "text-xs font-light" };
export const invertedLabel = { fill: "#FEFCFD", class: "text-xs font-light" };
export const mutedLabel = { fill: "#736B82", class: "text-xs font-light" };
export const dashedRule = { stroke: "#736B82", strokeDasharray: "4 3", strokeWidth: 1 };
export const projectionPattern = { size: 8, lines: { rotate: -45, opacity: 0.2 } };

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

// Bare text label placed in the plot (no marker). `inverted` switches to
// light ink for labels sitting on dark area fills.
export function textCallout({ inverted = false, labelProps = {}, ...annotation }) {
  return {
    r: 0,
    ...annotation,
    props: { label: { ...(inverted ? invertedLabel : annotationLabel), ...labelProps } },
  };
}

// Dashed vertical rule marking where observed data ends, with a small
// right-pointing label ("Projection →", "Fund launches →", …).
export function projectionRule({ x, label = "Projection →", showLine = true }) {
  return {
    x,
    label,
    labelPlacement: "top",
    labelYOffset: 4,
    props: {
      line: showLine ? dashedRule : { stroke: "none" },
      label: { ...mutedLabel, textAnchor: "start", dx: 6 },
    },
  };
}

// Hatched range band over the projected years. The label sits just above the
// plot at the band's left edge ("Projection →"), matching projectionRule so
// both markers read identically; pass placement/props overrides for bands
// used as value highlights instead.
export function projectionRange({ x, label = "Projection →", ...annotation }) {
  return {
    x,
    pattern: projectionPattern,
    label,
    labelPlacement: "top-left",
    labelYOffset: -4,
    props: { label: { ...mutedLabel, textAnchor: "start", verticalAnchor: "end", dx: 6 } },
    ...annotation,
  };
}
