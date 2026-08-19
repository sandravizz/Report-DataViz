// Shared visual language for explanatory annotations (Datawrapper-style: dark
// ink labels, hatched projection ranges). Figures compose the factories below
// so every callout inherits the same styling; any AnnotationPoint/Range prop
// can still be overridden per call.

import { ink, mutedTextGray } from "$lib/colors.js";
import { endLabelHalo } from "$lib/chart-theme.js";

// Desktop-width halo: these presets are built once at figure-definition time,
// with no viewport to react to (unlike endLabelHalo's own per-panel usage).
const annotationLabel = { ...endLabelHalo(1024), fill: ink, class: "text-xs font-light" };
const mutedLabel = { ...endLabelHalo(1024), fill: mutedTextGray, class: "text-xs font-light" };
// Explicit color, never `currentColor` or a CSS variable: the PNG export
// re-serializes the chart's SVG outside the page's stylesheet, where a custom
// property has nothing left to resolve against.
// #7E8E77 at 0.45 over white renders exactly #C5CCC2 — colors.quiet — so the
// projection hatch, the unimportant bars and the background region lines are
// all literally the same tone. The mix is why this is not just colors.quiet
// with an opacity: the pattern's lines are drawn at partial alpha, so the
// stated color has to be pre-compensated to LAND on the quiet grey.
const projectionPattern = { size: 8, lines: { rotate: -45, opacity: 0.45, color: "#7E8E77" } };

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
