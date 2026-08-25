// Single source for every color used inside the charts; src/styles/tailwind.css
// repeats some as daisyUI UI tokens.

// Muted chart ink. These were pixel-sampled from the landing photo and came out
// warm browns (#a89a8c / #6b5a4a), which read as a colour of their own next to
// the orange rather than as neutral — wrong for the two things they mark, which
// are precisely the things NOT being asserted (a projection band, an axis
// number). They are now slate, the same hue as the accent (#7d8597): each keeps
// its predecessor's exact OKLCH lightness and chroma, rotated to hue 266, so
// contrast is unchanged and only the temperature moves.
export const brand = {
  gray: "#959dad", //     de-emphasized background series, hatch fill, soft rules
  grayText: "#555d71", // muted secondary text / annotation ink
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
  // The "rest of world" bucket is the ramp's one near-neutral, so it was the
  // one place a warm greige (#cfc0bd) could hide; it now sits at the same
  // lightness in slate, with the other de-emphasized greys.
  regionTints: ["#184e77", "#34a0a4", "#76c8a8", "#99D98C", "#bec4d0"],
};
