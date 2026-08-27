// Single source for every color used inside the charts, independent of the
// daisyUI UI theme in src/styles/tailwind.css.
//
// The rule this palette runs on: COLOR MEANS SOMETHING. A colour is spent only
// on a series the reader is meant to look at. Everything else — quiet bars,
// background region lines, the projection band, gridlines, axis labels — is a
// grey, and they are all the SAME grey family, so "not important" reads as one
// visual class rather than as several different muted colours.
//
// The greys are not neutral: they carry a trace of hue 103, the ink's own hue
// family, at 7–12% saturation. That is what keeps them reading as part of this
// palette instead of a generic grey dropped in from outside. (The ink itself is
// now #1F281D at hue 109 and only 16% saturation — so the greys and the ink sit
// closer together than they used to, which is the point: nothing in the quiet
// half of this palette should announce a colour.)
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
// the data, while a quiet bar or region line IS data, just unemphasized. Kept
// at the very bottom of the visible range: charts that also carry a hatched
// projection band already have enough background texture, and a stronger grid
// competes with it.
export const gridLine = "#ECEFEC";

// Series colors, named by the JOB a series does, never by hue. There are only
// three, and a figure picks one by asking what the series means: the outcome
// the report is arguing against (`negative`), the aggregate or middle case
// (`middle`), or the outcome it is arguing for (`positive`). Naming them this
// way is what keeps the reading consistent across chapters — the top 10%'s
// share and the world's poorest region are the same red because they are the
// same kind of fact, not because someone reached for red twice.
//
// The three replace the old hue-named set (vermilion / purple / lilac / wine /
// aqua), which was assembled one figure at a time. The hues largely survive —
// the red is still the red and the violet still the violet — but they were
// re-stepped onto one lightness band so no series outweighs another: the old
// wine sat at OKLCH L 0.34 and read as black, the old purple at 2.7:1 on white
// and barely read at all, while vermilion sat between them at full chroma and
// won every figure it appeared in. All three now sit L 0.55–0.62 at 3.7:1 or
// better, and hold ΔE 11.2 apart under simulated red-green colour blindness.
//
// `positive` is the old `aqua` deepened until it carries a line (the old value
// was 1.4:1 on white, fills-only). It is the one series that shares a hue
// family with #0FFF95, which is what ties the figures to the accent — the
// closest a series can legally sit to the ink's own green, since a true green
// at hue 139 lands ΔE 4.3 from `negative` for a protanope and the two become
// one colour.
//
// De-emphasis is two tones, not one, because a de-emphasized BAR and a
// de-emphasized LINE are not the same problem. A bar is a solid block: at
// `quiet` it still reads at a glance. A 1px line has almost no ink in it,
// and eight of them crossing each other at that value dissolve into the
// gridlines. `quietLine` is the same hue family two steps darker (3.5:1 on
// white) — visibly a real series, still obviously subordinate to the colored
// line it sits behind, and pointedly not black.
//
// `quiet` therefore covers unimportant bars only; the projection band's hatch
// is mixed to land just BELOW it (see annotation-presets.js), since the band
// is backdrop rather than data.
export const colors = {
  negative: "#D9553F",
  middle: "#705DC8",
  positive: "#009580",
  quiet: "#C5CCC2",
  quietLine: "#7E8E77",
};

// The report's own body ink (#1F281D, same as --color-base-content). Reserved
// for chart text that NAMES the data rather than referencing it — the category
// labels down the side of a horizontal bar chart, which the reader has to read
// as carefully as a sentence. Everything else in a chart stays on `ink`, so
// this darker tone marks a real distinction instead of just being "darker".
export const nameInk = "#1F281D";
