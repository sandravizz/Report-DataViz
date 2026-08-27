// Single source for every color used inside the charts; the daisyUI theme in
// src/styles/tailwind.css repeats some of them as semantic UI tokens.
//
// Two blocks, and the split is the point. `iw` is the RECORD of the
// institute's own colors — what iwkoeln.de's default.css and the report PDF
// actually use (see docs/iw-brand.md). `colors` is what the CHARTS wear, which
// is a separate decision: the report's own legend swatches don't survive being
// re-drawn at screen size, so the series are re-picked here and validated
// against the surface they're drawn on.

export const iw = {
  navy: "#2e4964", //    link/.btn--primary; also chart-text ink
  blue: "#0069b4", //    logo mark; .btn--secondary
  teal: "#106b71", //    .btn--tertiary
  amber: "#f59d0f", //   --accent-color
  bodyText: "#1b4160", // default body text
  steel: "#93a7bb", //   PDF Figure 2-1's own Miete swatch — no longer a line color
  gold: "#e0c599", //    PDF Figure 2-1's own EZFH swatch — no longer a line color
  gray: "#b1b1b1", //    de-emphasized background series, dashed reference rules
  grayLight: "#e6e6e6", // grid lines, borders, "other" slices
  grayText: "#6f6f6f", // muted secondary text (axis ticks)
};

// Axis ticks and annotation labels.
export const ink = iw.navy;

// Series colors, keyed by the series they belong to.
//
// These replace the three swatches sampled off the report's own Figure 2-1
// (iw.steel / iw.navy / iw.gold, kept above as the record). That set is a
// LIGHTNESS ladder rather than three colors: navy sits at OKLCH L 0.40 and
// gold at L 0.84, all three fall below the C 0.10 chroma floor — so they read
// as grays, not as identity — and gold reaches only 1.6:1 against the white
// chart surface, which is not enough ink for a 2.5px line. Navy consequently
// won every crossing while the other two read as its shadow.
//
// The replacements are three EQUALLY weighted colors, and the structure
// carries meaning: the two purchase-price series share one hue at two
// lightness steps, so a reader sees ETW and EZFH are the same kind of thing
// before reading a single label, while Miete — the series the chapter is
// actually about — takes a hue of its own. All three sit in OKLCH L 0.50–0.65
// at C >= 0.13 and 3.4:1 or better on white, and hold ΔE 20.8 apart under
// simulated red-green color blindness (worst pair: the two greens, which is
// where a one-hue pair is expected to be tightest; the end labels are colored
// too, so identity never rests on hue alone).
//
// IW's blue #0069b4 is deliberately absent. It is the accent — spent only on
// things that point (the underline in running text, the rail's active dot,
// the figure connectors) — and the moment a data series wears it, that signal
// stops meaning anything. See the note in src/styles/tailwind.css.
export const colors = {
  miete: "#8e47cd", // violet — the headline series, its own hue
  etw: "#027743", //   green, dark  ┐ the purchase-price pair:
  ezfh: "#3ba654", //  green, light ┘ one hue, two steps
  muted: iw.grayText, // de-emphasized annotation text and connector rules
};
