// Single source for every color used inside the charts, independent of the
// daisyUI UI theme in src/styles/tailwind.css.
//
// The rule this palette runs on: COLOR MEANS SOMETHING. A colour is spent only
// on a series the reader is meant to look at. Everything else — quiet bars,
// background region lines, the projection band, gridlines, axis labels — is a
// grey, and they are all the SAME grey family, so "not important" reads as one
// visual class rather than as several different muted colours.
//
// The greys are not neutral: they carry a trace of hue 103, the ink #103900's
// own hue, at 7–12% saturation. That is what keeps them reading as part of
// this palette instead of a generic grey dropped in from outside.
//
// Spring green #0FFF95 is deliberately absent from this file. It is reserved
// for accent duty (the logo over the cover, the underline in running text) and
// must never turn up as a data series.

// The one "dark ink" for chart reference text: axis numbers, annotation and
// callout labels. Mid-dark, so it stays comfortably readable — 5.6:1 on white
// — and pointedly not black.
export const ink = "#5C6C56";

// De-emphasized reference *text* (e.g. the "Projection →" band label). The
// same grey lightened, never a different hue. 2.8:1 on white.
export const mutedTextGray = "#8F9F89";

// Gridlines. Lighter than `colors.quiet` on purpose: a gridline sits BEHIND
// the data, while a quiet bar or region line IS data, just unemphasized.
export const gridLine = "#DFE3DE";

// Series colors, named by hue. One rule decides the assignments: anything
// drawn as a LINE needs weight (~2:1 on white or better), so the palette's
// palest member is fills-only and lives in its own token — `aqua` carries the
// 2100 convergence target, which is always a bar, and was split off from the
// emphasis colour precisely so a line series could never pick it up.
//
// `quiet` is the single de-emphasis tone, shared by unimportant bars, the
// background region lines, and the projection band's hatch (which is mixed to
// land on exactly this value — see annotation-presets.js).
export const colors = {
  vermilion: "#F42C04",
  purple: "#A390E4",
  lilac: "#C69DD2",
  wine: "#611C35",
  aqua: "#1AFFD5",
  quiet: "#C5CCC2",
};
