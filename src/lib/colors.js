// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens.
//
// FDL corporate palette (brand guidelines pp. 8-9). The brand is deliberately
// muted — most hues sit below the usual chart chroma floor and sand/camel/pale
// sage fall under 3:1 contrast on white. That is only safe because every series
// in this report also carries a direct label (end-of-line labels, annotations,
// legends); keep that rule when adding figures, and use sand only for area
// fills/bands, never for thin lines.

export const fdl = {
  slate: "#395966", // primary dark — text, axes, emphasis
  teal: "#709899", //  primary brand hue — the highlight series
  camel: "#c99561", // primary warm neutral — needs direct labels (2.6:1)
  rust: "#c24c2c", //  strongest accent — extremes, calls to attention
  terracotta: "#d3714e", // softer warm accent
  green: "#618e78", // secondary green — avoid next to teal (CVD collapse)
  sand: "#e9be72", //  area fills / bands only (1.7:1 on white)
  paleSage: "#abc6b1", // de-emphasized background series
  greyGreen: "#5e6d68", // muted secondary, muted label text
};

// The guidelines also sanction 75% / 50% white tints of any palette color.
export function tint(hex, pct) {
  const mix = (c) => Math.round(c * pct + 255 * (1 - pct));
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${[r, g, b].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
}

// Axis ticks and annotation labels.
export const ink = fdl.slate;

// Series colors, keyed by role (key names kept from report v1 so existing
// figures re-skin without edits). gray de-emphasizes background series,
// sky highlights the featured series, coral marks extremes.
export const colors = {
  sage: fdl.camel,
  coral: fdl.rust,
  lavender: fdl.greyGreen,
  sky: fdl.teal,
  gray: fdl.paleSage,
};
