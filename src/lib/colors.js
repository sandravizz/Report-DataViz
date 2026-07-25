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

// IEA report chart palette — sourced from a client-picked Coolors palette
// (charcoal/mauve/rose/tan/sage/mint/turquoise/coral), scoped to the report's
// figures only so it doesn't reskin the rest of the sandraviz.com site, which
// stays on `brand` above. The raw swatches read too pale/gray for data marks
// (several fall below the OKLCH chroma floor or outside the lightness band —
// `validate_palette.js` FAILed them as-is), so each role below holds the
// swatch's hue but is re-tuned in OKLCH (lightness/chroma) until every chart
// that uses it passes the validator — see `scripts/validate_palette.js` in
// the dataviz skill for the checks. `regionTints` is a one-hue ordinal ramp
// off `featured` for Figure 4a's stack, not a categorical set, so it's
// checked with `--ordinal` instead.
export const iea = {
  solar: "#eb5e55", //      Solar PV — the palette's coral, used as sampled
  wind: "#009399", //       Wind — from the palette's turquoise (57E2E5), re-tuned
  grids: "#6c4cae", //      Grids — from the palette's charcoal-purple (565264), re-tuned
  efficiency: "#009e94", // Energy efficiency — from the palette's sage (789C98), re-tuned
  featured: "#a52f63", //   Featured/highlight (China, Figure 1's "clean" series) — from the palette's mauve (A6808C), re-tuned
  gray: "#c67855", //       De-emphasized (economy-wide) — from the palette's tan (CCB7AE), re-tuned
  heatPumps: "#00c6b9", //  Heat pumps segment — a lighter step of the efficiency hue, not a separate hue
  // Figure 4a's region stack: China (full) fading through Europe, India,
  // North America, to the merged "Rest of world" — a single-hue ramp off
  // `featured`, not five arbitrary tints, so it passes as an ordinal ramp.
  regionTints: ["#a52f63", "#b05075", "#b86d87", "#bd8a9a", "#c2a5ae"],
};
