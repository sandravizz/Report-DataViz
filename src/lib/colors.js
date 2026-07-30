// Single source for every color used inside the charts, independent of the
// daisyUI UI theme in src/styles/tailwind.css (which follows the Global
// Justice Project site's palette).

// Annotation labels and callout ink.
export const ink = "#2A2659";

// Axis numbers and other reference-only text — a plain neutral gray,
// distinct from `colors.gray` below (which has a warm cast tuned for
// de-emphasized data series, not text) and from `ink` (used for the
// higher-emphasis annotation/callout labels).
export const mutedTextGray = "#9CA3AF";

// Series colors, named by hue. In the figures: gray de-emphasizes background
// series, sky highlights the "World" series, coral marks extremes.
export const colors = {
  sage: "#97AF98",
  coral: "#D86858",
  lavender: "#736B82",
  sky: "#61C1EB",
  gray: "#CBC1C1",
};
