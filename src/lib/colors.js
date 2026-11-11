// Single source for every color used inside the charts, independent of the
// daisyUI UI theme in src/styles/tailwind.css.
//
// paris-demo (2026-11-04): the chart structure is carta-demo's, the palette
// is main's (Global Justice Project). COLOR MEANS SOMETHING: a colour is spent
// only on a series the reader is meant to look at; everything else is one
// grey family, tinted toward the ink's own green hue so it reads as part of
// this palette rather than a generic grey.
//
// Spring green #0FFF95 is reserved for accent duty (cover, chapter dividers,
// underline rules) and is 1.3:1 on the ground, so it is never a chart ink on
// the ground. The one exception is the métro maps, where it runs on violet.
//
// Re-validate any new series pairing against the screen surface before
// shipping it (.claude/skills/dataviz/scripts/validate_palette.js).

// Main's palette as a record.
export const brand = {
  ink: "#1F281D", //     base-content: text, and the cover ground
  ground: "#EFF1EF", //  base-200: the report's ground
  accent: "#0FFF95", //  reserved accent — never a series
  negative: "#D9553F", // the outcome the copy argues against
  middle: "#705DC8", //  the aggregate / middle case
  positive: "#009580", // the outcome the copy argues for
};

// The neutral ramp: main's grey family (hue ~103, the ink's own).
export const neutral = {
  strong: "#1F281D", // ink — dark context bars
  label: "#5C6C56", //  annotation labels, connector rules (5.6:1 on white)
  mid: "#7E8E77", //    ordinary context series / quiet line
  soft: "#8F9F89", //   washes, a labeled thin line
  faint: "#C5CCC2", //  background fill only, never a line
  wash: "#E0E4DE", //   the lightest: a base map under the métro (just off the ground)
};

// The text colour a filled badge takes: white, or ink where the fill is
// light (métro line 1's yellow takes ink, as on the real map).
export function textOn(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35 ? brand.ink : "#FFFFFF";
}

// Axis ticks and annotation labels: main's mid-dark chart ink, not black.
export const ink = "#5C6C56";

// The series the figure is about, and its deeper partner for a second series
// of the same group.
export const accent = brand.positive;
export const accentDeep = "#006B5C";

// Series colors, keyed by the JOB the series does in its figure. A figure
// picks `accent` for the series its title is about and walks down the ramp
// for the rest, in the series array's fixed order — never by rank. The three
// role colours from main (`negative` / `middle` / `positive`) sit on one
// lightness band, so none outweighs another.
export const colors = {
  accent,
  accentDeep,
  accentSoft: "#7FC9BC", // fill only, always labeled
  negative: brand.negative,
  middle: brand.middle,
  positive: brand.positive,
  strong: neutral.strong,
  mid: neutral.mid,
  soft: neutral.soft,
  faint: neutral.faint,
};

// SEQUENTIAL ramp for magnitude (the choropleth): ONE hue, the cover's violet
// `middle`, light → dark in five steps, `middle` itself as step four (for now,
// 2026-11-08: the maps take the cover's violet and green). Never a rainbow. The
// lightest step is still clearly off the ground #EFF1EF; regions are separated
// by a 1px ground-coloured stroke, so neighbouring light steps never merge.
export const sequential = ["#E0DBF3", "#BCB1E6", "#9485D7", "#705DC8", "#4D3D9B"];
