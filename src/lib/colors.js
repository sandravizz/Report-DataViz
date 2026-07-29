// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens.
//
// `gray` and `grayText` are pixel-sampled from the landing photo (see
// docs/sandraviz-brand.md) and used directly for muted chart ink (gridlines,
// annotation connectors). Actual series colors for this report come from the
// `iea` palette below.
export const brand = {
  gray: "#a89a8c", //     de-emphasized background series
  grayText: "#6b5a4a", // muted secondary text / annotation ink
};

// Warm near-black, not pure black (Sandra's call) — matches base-content.
export const ink = "#221d18";

// Report-scoped palette from a client-picked Coolors set (charcoal/mauve/
// rose/tan/sage/mint/turquoise/coral). The raw swatches read too pale for
// data marks, so each role keeps the swatch's hue but is re-tuned in OKLCH
// until it passes `scripts/validate_palette.js` (see the dataviz skill).
// `regionTints` is a one-hue ordinal ramp off `featured`, checked with
// `--ordinal` instead of the categorical checks.
export const iea = {
  solar: "#e09f3e", //      Solar PV
  wind: "#50c5b7", //       Wind
  grids: "#6184d8", //      Grids
  efficiency: "#2b2d42", // Energy efficiency
  featured: "#a52f63", //   Featured/highlight (e.g. China)
  heatPumps: "#7d8597", //  Heat pumps segment — a lighter step of efficiency
  // Figure 4a's region stack: China fading through Europe, India, North
  // America, to the merged "Rest of world".
  regionTints: ["#184e77", "#34a0a4", "#76c8a8", "#99D98C", "#cfc0bd"],
};
