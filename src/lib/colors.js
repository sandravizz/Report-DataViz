// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens.
//
// SandraViz brand palette. Signature hue and neutrals are sampled straight
// from the landing photo's own sunset/tidal-flat colors (static/cover.jpg —
// see docs/sandraviz-brand.md); the rest of the categorical set carries over
// from the earlier sandraviz.com-derived palette, re-validated against the
// new signature hue. Key names are kept from the previous edition
// (blue/royal/teal/coral/purple/gray) so existing figures re-skin without
// edits; `blue` now carries the photo's burnt-orange since that key holds
// the featured/highlight role, not a literal blue. The validated line-mark
// set is orange / blue / green / purple / amber (all four checks pass,
// `scripts/validate_palette.js`, including all-pairs CVD, orange↔green at a
// WARN covered by the house rule that every series is direct-labeled).

export const brand = {
  blue: "#8f4d28", //     signature burnt orange, sampled from the cover photo's sunset — the highlight/featured series
  navy: "#5d321a", //     pressed/hover shade of the orange, deep accents
  royal: "#1a6aff", //    actual blue — mid-tone categorical hue
  cyan: "#8fc2ff", //     light blue — fills/bands only
  teal: "#1f7a3d", //     dark-shaded green — line-safe secondary series
  mint: "#4cfc0f", //     bright accent — fills/bands only (1.4:1 on white)
  yellow: "#fce94c", //   fills/bands only
  amber: "#c77a00", //    warm accent, extremes
  coral: "#c77a00", //    alias of amber, kept for figures keyed on "coral"
  lavender: "#c9a0d8", // soft purple, fills/bands only
  purple: "#7a3d99", //   muted secondary series
  red: "#e34946", //      reserved for error/serious status, not a series color
  gray: "#a89a8c", //     de-emphasized background series, warmed to match the photo neutrals
  grayLight: "#e7dfd4", // grid lines, borders, "other" slices — warm tan-gray
  grayText: "#6b5a4a", // muted secondary text — warm brownish-gray, sampled from the photo's tidal flat
};

// White tints for muted background series / bands.
export function tint(hex, pct) {
  const mix = (c) => Math.round(c * pct + 255 * (1 - pct));
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${[r, g, b].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
}

// Black-mixed shade, the inverse of tint() above: darkens a fills-only brand
// color enough to serve as legible direct-label text.
export function shade(hex, pct) {
  const mix = (c) => Math.round(c * pct);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${[r, g, b].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
}

// Axis ticks and annotation labels — warm near-black, matching base-content
// (not pure black — Sandra's call).
export const ink = "#221d18";

// Series colors, keyed by role (key names kept from report v1 so existing
// figures re-skin without edits). gray de-emphasizes background series,
// sky highlights the featured series, coral marks extremes.
export const colors = {
  sage: brand.teal,
  coral: brand.coral,
  lavender: brand.grayText, // only used as muted annotation/connector ink, not a series
  sky: brand.blue,
  gray: brand.gray,
};

// Darker variant of mint, for series that direct-label a mint segment — the
// segment fill and its label share this shade instead of the unreadably
// light brand green.
export const mintDark = shade(brand.mint, 0.5);
