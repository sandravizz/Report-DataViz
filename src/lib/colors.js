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

// Series colors. `highlight` is the institute's brand orange and marks the
// series a figure is actually about; `blue` is their secondary and carries
// the main contrast series; teal/green/amber/red round out a categorical set
// (all four are the site's own contextual colors). `gray` de-emphasizes
// background bar/dot series — a warm grey, because a neutral one goes green
// against the cream base — and `regionGray` de-emphasizes background *line*
// series, matched to the projection-band hatch (black at 20% opacity over
// the base ≈ #d3cec4), so both "background" treatments read as one tone.
export const colors = {
  highlight: "#ff6a00",
  blue: "#194abb",
  teal: "#287f9a",
  green: "#3a833a",
  amber: "#a4660e",
  red: "#d4403a",
  gray: "#c9c3b6",
  regionGray: "#d3cec4",
};
