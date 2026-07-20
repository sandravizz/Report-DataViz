// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens.
//
// IEA corporate palette, taken from the Highcharts colorsets the IEA ships in
// its own site CSS (see docs/iea-brand.md). The brand is deliberately bright —
// yellow/mint/cyan/amber sit above the lightness band and under 3:1 contrast
// on white, so they are reserved for area fills/bands, never thin lines. The
// validated line-mark set is blue / teal / coral / purple (all six checks
// pass; teal and coral carry a contrast WARN that is covered by this report's
// house rule that every series is direct-labeled).

export const iea = {
  blue: "#0044ff", //   signature electric blue — the highlight/featured series
  navy: "#002999", //   pressed/hover shade of the blue, deep accents
  royal: "#3e7ad3", //  mid blue (site colorset slot 1)
  cyan: "#49d3ff", //   light blue — fills/bands only (1.6:1 on white)
  teal: "#00ada1", //   secondary series (2.7:1 — direct labels required)
  mint: "#68f394", //   fills/bands only (1.5:1 on white)
  yellow: "#fff45a", // fills/bands only (1.1:1 on white)
  amber: "#ffb743", //  fills/bands only (1.7:1 on white)
  coral: "#ff754b", //  warm accent, extremes (2.6:1 — direct labels required)
  lavender: "#b187ef", // soft purple (site colorset slot 7)
  purple: "#af6ab1", // muted secondary series
  red: "#e34946", //    reserved for error/serious status, not a series color
  gray: "#b1b1b1", //   de-emphasized background series
  grayLight: "#e6e6e6", // grid lines, borders, "other" slices
  grayText: "#6f6f6f", // muted secondary text
};

// White tints for muted background series / bands (mirrors the site's
// "light"/"tints" colorsets, which are white-mixed steps of the same hues).
export function tint(hex, pct) {
  const mix = (c) => Math.round(c * pct + 255 * (1 - pct));
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${[r, g, b].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
}

// Black-mixed shade, the inverse of tint() above: darkens a fills-only brand
// color enough to serve as legible direct-label text (the bright IEA hues
// are 1.5-1.7:1 on white — fine for a fill, unreadable as small text).
export function shade(hex, pct) {
  const mix = (c) => Math.round(c * pct);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${[r, g, b].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
}

// Axis ticks and annotation labels — IEA text is plain black.
export const ink = "#000000";

// Series colors, keyed by role (key names kept from report v1 so existing
// figures re-skin without edits). gray de-emphasizes background series,
// sky highlights the featured series, coral marks extremes.
export const colors = {
  sage: iea.teal,
  coral: iea.coral,
  lavender: iea.grayText, // only used as muted annotation/connector ink, not a series
  sky: iea.blue,
  gray: iea.gray,
};

// Darker variant of mint, for series that direct-label a mint segment (e.g.
// heat pumps in Figure 5) — the segment fill and its label share this shade
// instead of the unreadably-light brand mint.
export const mintDark = shade(iea.mint, 0.6);
