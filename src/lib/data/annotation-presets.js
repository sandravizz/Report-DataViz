// Shared visual language for explanatory annotations (Datawrapper-style: dark
// ink labels, hatched projection ranges). Figures compose the factories below
// so every callout inherits the same styling; any AnnotationPoint/Range prop
// can still be overridden per call.

import { ink, mutedTextGray } from "$lib/colors.js";

// No halo here on purpose. These presets are evaluated once at module scope,
// where there is no viewport to size one against; chart-theme's
// resolveAnnotations adds the breakpoint-correct halo as each point callout
// passes through it on its way into a panel. `mutedLabel` never gets one and
// needs none — the range band's label sits on clear white above the plot,
// not over the data.
const annotationLabel = { fill: ink, class: "text-xs font-light" };
const mutedLabel = { fill: mutedTextGray, class: "text-xs font-light" };
// Explicit color, never `currentColor` or a CSS variable: the PNG export
// re-serializes the chart's SVG outside the page's stylesheet, where a custom
// property has nothing left to resolve against.
// Same hue family as everything else de-emphasized: this is colors.quietLine
// drawn at partial alpha, which over white lands around #D8DDD6 — a shade
// lighter than colors.quiet. That ranking is deliberate. The band is not
// data, it is a backdrop saying "everything right of here is modelled", so it
// has to sit UNDER the faintest series in the plot; at equal weight the hatch
// competes with the region lines drawn across it.
const projectionPattern = { size: 8, lines: { rotate: -45, opacity: 0.3, color: "#7E8E77" } };

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
