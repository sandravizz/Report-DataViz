// Single source for every color used inside the charts, independent of the
// daisyUI UI theme in src/styles/tailwind.css.

// The one "dark ink" for chart reference text: axis numbers, annotation and
// callout labels.
export const ink = "#2A2659";

// De-emphasized reference *text* (e.g. the "Projection →" band label). Not
// `colors.gray` below — that one has a warm cast tuned for data series.
export const mutedTextGray = "#9CA3AF";

// Series colors, named by hue. sky highlights the "World" series, coral marks
// extremes, gray de-emphasizes background bars, regionGray de-emphasizes
// background lines. regionGray matches the projection-band hatch (black at
// 20% over white ≈ #CCCCCC) so both "background" treatments read as one tone.
export const colors = {
  sage: "#97AF98",
  coral: "#D86858",
  lavender: "#736B82",
  sky: "#61C1EB",
  gray: "#CBC1C1",
  regionGray: "#CCCCCC",
};
