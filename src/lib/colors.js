// Single source for every color used inside the charts, independent of the
// daisyUI UI theme in src/styles/tailwind.css (which follows the Global
// Justice Project site's palette).

// Annotation labels, callout ink, and axis numbers — the report's one "dark
// ink" for anything read as reference text on a chart.
export const ink = "#2A2659";

// De-emphasized reference text (e.g. the "Projection →" band label) — a
// plain neutral gray, distinct from `colors.gray` below (which has a warm
// cast tuned for de-emphasized data series, not text) and from `ink`.
export const mutedTextGray = "#9CA3AF";

// Series colors, named by hue. In the figures: gray de-emphasizes background
// bar/dot series, regionGray de-emphasizes background *line* series (figure
// 2's eight region lines) — matched to the same visual gray as the
// projection-band hatch (black at 20% opacity over white ≈ #CCCCCC), so both
// "background" treatments on a chart read as the same tone. sky highlights
// the "World" series, coral marks extremes.
export const colors = {
  sage: "#97AF98",
  coral: "#D86858",
  lavender: "#736B82",
  sky: "#61C1EB",
  gray: "#CBC1C1",
  regionGray: "#CCCCCC",
};
