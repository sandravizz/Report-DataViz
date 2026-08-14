// Single source for every color used inside the charts; src/styles/tailwind.css
// repeats some as daisyUI UI tokens.

// Muted chart ink, pixel-sampled from the landing photo (docs/sandraviz-brand.md).
export const brand = {
  gray: "#a89a8c", //     de-emphasized background series
  grayText: "#6b5a4a", // muted secondary text / annotation ink
};

// Warm near-black, not pure black (Sandra's call) — matches base-content.
export const ink = "#221d18";

// Report palette: each role keeps its Coolors swatch hue but is re-tuned in
// OKLCH to pass scripts/validate_palette.js (dataviz skill). regionTints is a
// one-hue ordinal ramp, checked with --ordinal instead.
export const iea = {
  solar: "#e09f3e", //      Solar PV
  wind: "#50c5b7", //       Wind
  grids: "#6184d8", //      Grids
  efficiency: "#2b2d42", // Energy efficiency
  heatPumps: "#7d8597", //  Heat pumps — a lighter step of efficiency
  // Figure 4a's region stack: China → Europe → India → North America → rest.
  regionTints: ["#184e77", "#34a0a4", "#76c8a8", "#99D98C", "#cfc0bd"],
};
