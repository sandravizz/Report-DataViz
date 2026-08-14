import { ink, brand } from "$lib/colors.js";

const annotationLabel = { fill: ink, class: "text-xs font-light" };
const mutedLabel = { fill: brand.grayText, class: "text-xs font-light" };
const projectionPattern = {
  size: 8,
  lines: { rotate: -45, color: brand.gray, opacity: 0.5 },
};

// Circled point callout. `filled` tints the ring with the series color for
// emphasis, otherwise a thin ink outline; `labelProps` extends the ink label.
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

// Hatched range band over the projected years, labeled above the plot at the
// band's left edge. Bands used as value highlights override placement/props.
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
