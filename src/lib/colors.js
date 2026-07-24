// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens.
//
// IW (Institut der deutschen Wirtschaft) palette. The three chart line colors
// are the exact pixel colors of the source report's own Figure 2-1 legend
// swatches (Miete/ETW/EZFH, IW-Report 34/2026); navy/blue/teal/amber/bodyText
// are lifted straight from iwkoeln.de's own default.css (confirms the same
// navy and blue independently — see docs/iw-brand.md).

export const iw = {
  navy: "#2e4964", //    site's own link/.btn--primary color; also ETW line color and the report's own chart-text ink
  blue: "#0069b4", //    IW logo mark; site's .btn--secondary
  teal: "#106b71", //    site's .btn--tertiary
  amber: "#f59d0f", //   site's --accent-color
  bodyText: "#1b4160", // site's default body text color
  steel: "#93a7bb", //   Miete line color
  gold: "#e0c599", //    EZFH (Ein-/Zweifamilienhäuser) line color
  gray: "#b1b1b1", //    de-emphasized background series
  grayLight: "#e6e6e6", // grid lines, borders, "other" slices
  grayText: "#6f6f6f", // muted secondary text (axis ticks)
};

// White tints for muted background series / bands.
export function tint(hex, pct) {
  const mix = (c) => Math.round(c * pct + 255 * (1 - pct));
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${[r, g, b].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
}

// Black-mixed shade, the inverse of tint() above.
export function shade(hex, pct) {
  const mix = (c) => Math.round(c * pct);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${[r, g, b].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
}

// Axis ticks and annotation labels — the report's own chart-text ink (sampled
// from Figure 2-1's legend text pixels, and confirmed as the site's own
// primary/link color independently).
export const ink = iw.navy;

// Series colors, keyed by role (key names kept from the template so figures
// re-skin without edits).
export const colors = {
  sage: iw.gold,
  coral: iw.navy,
  lavender: iw.grayText,
  sky: iw.blue,
  gray: iw.gray,
};
