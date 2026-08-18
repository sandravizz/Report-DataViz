// Single source for every color used inside the charts; the daisyUI theme in
// src/styles/tailwind.css repeats some of them as semantic UI tokens.
// The three line colors are pixel-sampled from the source report's own
// Figure 2-1 legend swatches; the rest come from iwkoeln.de's default.css.
// See docs/iw-brand.md.

export const iw = {
  navy: "#2e4964", //    link/.btn--primary; also the ETW line and chart-text ink
  blue: "#0069b4", //    logo mark; .btn--secondary
  teal: "#106b71", //    .btn--tertiary
  amber: "#f59d0f", //   --accent-color
  bodyText: "#1b4160", // default body text
  steel: "#93a7bb", //   Miete line
  gold: "#e0c599", //    EZFH line
  gray: "#b1b1b1", //    de-emphasized background series
  grayLight: "#e6e6e6", // grid lines, borders, "other" slices
  grayText: "#6f6f6f", // muted secondary text (axis ticks)
};

// Axis ticks and annotation labels.
export const ink = iw.navy;

// Series colors keyed by role — key names kept from the template so figures
// re-skin without edits.
export const colors = {
  sage: iw.gold,
  coral: iw.navy,
  lavender: iw.grayText,
  sky: iw.blue,
  gray: iw.gray,
};
