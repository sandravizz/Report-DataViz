// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens.
//
// ---------------------------------------------------------------------------
// THE RULE ON THIS BRANCH: hue does not carry identity.
//
// One saturated ink says "this is what the chapter is about"; everything else
// is a neutral grey separated by LIGHTNESS, and the direct labels every figure
// already carries say which series is which.
//
// That is a reversal, and the reason is measurable. The FDL brand palette is
// nine hues, and run through the project's own validator
// (.claude/skills/dataviz/scripts/validate_palette.js) most of them are not
// colors at all:
//
//   teal      C 0.044   2.8:1    camel   C 0.093   2.3:1
//   paleSage  C 0.041   1.6:1    sand    C 0.107   1.5:1
//   slate     C 0.043   6.6:1    green   C 0.060   3.3:1
//   greyGreen C 0.020   4.8:1    rust    C 0.159   4.2:1
//
// The validator's chroma floor is C 0.10: below it a mark reads as a grey that
// happens to have a tint. Six of the nine sit below it, and four of those also
// fall under 3:1 on the chapter ground. A reader does not experience that as
// "a muted palette", they experience it as muddiness — several things that are
// almost the same non-color, none of which looks chosen.
//
// The fix is NOT to turn the brand hues up. At teal's hue (H 198) sRGB runs
// out of gamut before C 0.10 unless the color also gets lighter, at which
// point it is a bright cyan (#009296) and no longer FDL teal. So the hues that
// could be saturated are exactly the ones that are already saturated: the warm
// end. FDL's own rust is C 0.159 — MORE saturated than the coral on the
// reference page this direction came from — and it is the brand's designated
// "strongest accent, extremes, calls to attention" (guidelines pp. 8-9).
//
// Hence: rust for the series that carries the story, greys for the rest. Less
// color, and the color that is left is a real one.
// ---------------------------------------------------------------------------

// WHAT THE VALIDATOR SAYS ABOUT THIS, AND WHY IT IS NOT A BUG.
//
// Run the new scheme through the same script and it still reports FAILED:
//
//   [PASS] Lightness band      all 4 inside L 0.43-0.77
//   [FAIL] Chroma floor        reads gray: #505757, #757c7d, #9fa6a7
//   [PASS] CVD separation      worst adjacent dE 15.1 (target >= 12)
//   [WARN] Contrast vs surface below 3:1: #9fa6a7 (2.41)
//
// The chroma check is scoped to CATEGORICAL palettes — ones where hue is what
// tells two series apart. That is exactly the premise this branch dropped, so
// the greys "reading as gray" is the intended result, not a defect: they are
// meant to be grey, and lightness plus the direct labels do the separating.
// Read the other three lines instead. CVD separation clears the target with
// hue removed entirely, which is the check that actually matters here. The
// contrast WARN on `soft` is NOT dismissable — the skill requires visible
// labels or a table view as relief — and it is satisfied because every series
// that wears `soft` carries an end label or a legend swatch. Keep that true.
//
// Do not "fix" the FAIL by tinting the greys. A grey with just enough chroma
// to clear the floor is precisely the muddiness this whole change removed.

// The FDL corporate palette, kept in full as the brand record (guidelines
// pp. 8-9) even though the figures now draw from `colors` below. Referenced by
// the UI tokens in tailwind.css, and the place to look when a future figure
// needs a brand hue for a non-series job.
export const fdl = {
  slate: "#395966", // primary dark
  teal: "#709899", //  primary brand hue
  camel: "#c99561", // primary warm neutral
  rust: "#c24c2c", //  strongest accent — extremes, calls to attention
  terracotta: "#d3714e", // softer warm accent
  green: "#618e78", // secondary green
  sand: "#e9be72", //  area fills / bands only
  paleSage: "#abc6b1", // de-emphasized background series
  greyGreen: "#5e6d68", // muted secondary, muted label text
};

// The neutral ramp the non-story series live on. Not a generic grey: these are
// OKLCH H 206 at C 0.008 — the hue of the chapter ground (#edf1f1) at barely
// any chroma — so they read as the report's own greys rather than as a
// different system's. Four steps, spaced by lightness so adjacent series stay
// apart when hue is doing no work at all.
//
// Contrast on the white figure surface, which is what governs the marks:
export const neutral = {
  strong: "#505757", // L 0.45 — 7.4:1  · a series that must also read as type
  label: "#646a6b", //  L 0.52 — 5.5:1  · annotation labels, connector rules
  mid: "#757c7d", //    L 0.58 — 4.3:1  · ordinary context series
  soft: "#9fa6a7", //   L 0.72 — 2.5:1  · washes, bands, a labeled thin line
  faint: "#c5cccd", //  L 0.84 — 1.6:1  · background fill only, never a line
};

// `label` is not a round number on the ramp, and that is the point: it is
// matched to the ink it replaces. The annotation labels and connector rules
// used to wear fdl.greyGreen (#5e6d68, 5.44:1 on the figure surface); this
// step measures 5.50:1, so the chrome around the charts keeps exactly the
// weight it had and only changes hue family. Anything quieter would drop
// 12px annotation text under the 4.5:1 line.

// Axis ticks and annotation labels. Black, not brand slate: FDL's own site
// (findevlab.org article pages) sets running text in #000, so all general
// text — in and around the charts — follows it.
export const ink = "#000000";

// Series colors, keyed by the JOB the series does in its figure, which is the
// only thing left to key them by now that hue is not carrying identity.
//
// The old keys (sky/sage/coral/lavender/gray) were carried over from report
// v1 and are deliberately gone: they named hues, and every one of them now
// names the wrong hue. A figure picks `accent` for the series its title is
// about and walks down the ramp for the rest, in the series array's own fixed
// order — never by rank, so a CSV update cannot repaint the survivors.
//
// `soft` and `faint` fall under 3:1 and are legal only where a direct label,
// an end label or a legend swatch carries the identity — which is the house
// rule on every figure in this report anyway. `faint` is for fills, never a
// line.
export const colors = {
  accent: fdl.rust, //     the series the chapter is about
  strong: neutral.strong,
  mid: neutral.mid,
  soft: neutral.soft,
  faint: neutral.faint,
};
