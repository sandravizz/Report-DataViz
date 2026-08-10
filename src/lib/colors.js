// Single source for every color used inside the charts, independent of the
// daisyUI UI theme in src/styles/tailwind.css (which follows the Kiel
// Institute's own site palette). Every hue below is one the institute
// already uses on kielinstitut.de — see docs/kiel-brand.md.

// Annotation labels, callout ink, and axis numbers — the report's one "dark
// ink" for anything read as reference text on a chart. The institute's body
// text is flat #000000; this is the same near-black warmed a little toward
// the cream base so it doesn't punch a hole in the page.
export const ink = "#1d1815";

// De-emphasized reference text (e.g. the "Projection →" band label) — the
// institute's own `--color-minorinfo`, which is exactly what they use it for.
export const mutedTextGray = "#6f6d68";

// Series colors. The first three are the institute's *own* chart palette,
// pixel-sampled from the Economic Outlook's figures: every line and bar in
// that report is drawn in the brand orange, the brand blue, or a pale tint of
// that blue — nothing else. `highlight` (orange) carries the series a figure
// is about, `blue` the main contrast series, `lightBlue` the third, quieter
// one. teal/green/amber/red extend the set for figures that need more
// categories (all four are the institute's own contextual colors from
// kielinstitut.de). `gray` de-emphasizes background bar/dot series — a warm
// grey, because a neutral one goes green against the cream base — and
// `regionGray` de-emphasizes background *line* series, matched to the
// projection-band hatch (black at 20% opacity over the base ≈ #d3cec4), so
// both "background" treatments read as one tone.
export const colors = {
  highlight: "#ff6a00",
  blue: "#194abb",
  lightBlue: "#9badd5",
  teal: "#287f9a",
  green: "#3a833a",
  amber: "#a4660e",
  red: "#d4403a",
  gray: "#c9c3b6",
  regionGray: "#d3cec4",
};

// The tint the Economic Outlook washes over the forecast portion of a chart
// (sampled from its Figures 5 and 7): the brand orange at low opacity over
// the cream page, #f7cfad. Used as a solid fill by `forecastRange` rather
// than the hatch this template uses elsewhere, so the reproduction matches.
export const forecastBand = "#f7cfad";
