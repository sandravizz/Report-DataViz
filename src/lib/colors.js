// Single source for every color used inside the charts. The daisyUI theme in
// src/styles/tailwind.css repeats some of these as semantic UI tokens.
//
// ---------------------------------------------------------------------------
// THE RULE (carried over from the findevlab branch): hue does not carry
// identity. One saturated ink marks the series a figure is about; context
// series are slate greys separated by lightness, and the direct labels every
// figure carries say which is which. Carta's own deck already works this way
// on most slides — a coral line over grey bars — so the brand and the house
// rule agree.
//
// Every value below is one of Carta's own tokens (carta.com production CSS,
// 2026-10-15); docs/carta-brand.md lists them with their names.
// ---------------------------------------------------------------------------

// WHAT THE VALIDATOR SAYS (.claude/skills/dataviz/scripts/validate_palette.js,
// surface #fcf8f3):
//
//   accent + strong   "#d26442,#394040"
//     [FAIL] Lightness / chroma on #394040   — the grey is MEANT to be grey;
//            same documented exception as the findevlab branch
//     [PASS] CVD separation   worst ΔE 39.6 (protan)
//     [PASS] Contrast         both >= 3:1
//
//   accent + accentSoft   "#d26442,#ff997a"   (the two AI series)
//     [PASS] Chroma floor, CVD separation (worst ΔE 18.7, deutan)
//     [WARN] Contrast: #ff997a 1.97:1 — legal only as a FILL with a direct
//            label or legend swatch, which is how every figure uses it.
//
// Carta's brand coral #ff7d55 is NOT a chart ink: 2.39:1 on the cream. It is
// the cover's colour (6.9:1 on the near-black) and the UI `primary`.

// Carta's palette as a record (their token names in comments), kept even
// where the figures don't draw from it.
export const carta = {
  black: "#1a1a1a", //       --color-black: ink, and the cover ground
  cream: "#fcf8f3", //       --clr-light-cream: the report's ground
  coral: "#ff7d55", //       --color-orange-60 (= --color-coral): the brand
  orange50: "#ff997a", //    --color-orange-50
  orange80: "#d26442", //    --color-orange-80
  midtone: "#ed914a", //     --clr-midtone-orange
  yellow60: "#f8d648", //    --color-yellow-60
  red90: "#c62128", //       --color-red-90
  // Not a CSS token: the dark red of the deck's industry-distribution
  // charts (Austin metro slide, Hardware segment), pixel-sampled.
  deckRed: "#b61d3f",
};

// The neutral ramp: Carta's own grey scale (--color-gray-*). It sits at
// OKLCH H ~195, a cool slate, so it recedes behind the warm accent — "warm
// asserts, slate recedes" without retinting anything.
export const neutral = {
  strong: "#394040", // gray-90 — the deck's dark "total rounds" bars
  label: "#656b6b", //  gray-80 — annotation labels, connector rules
  mid: "#9c9f9f", //    gray-70 — ordinary context series
  soft: "#a7aaaa", //   gray-60 — washes, a labeled thin line
  faint: "#dedfdf", //  gray-40 — background fill only, never a line
};

// Axis ticks and annotation labels: Carta's near-black, the page's ink.
export const ink = "#1a1a1a";

// The accent: Carta's brand coral, as their own chart slides fill their bars
// (Sandra, 2026-10-27 — it was orange-80 #d26442, which read browner than
// Carta's charts). 2.39:1 on the cream: below 3:1, so it is a FILL ink for
// bars and areas, and every coral mark carries a direct label, legend or
// axis that names it. `accentDeep` is orange-80, the deeper step for a
// second series of the same group.
export const accent = carta.coral;
export const accentDeep = carta.orange80;

// Series colors, keyed by the JOB the series does in its figure. A figure
// picks `accent` for the series its title is about and walks down the ramp
// for the rest, in the series array's own fixed order — never by rank.
// `accentSoft` is the accent's lighter partner for a second series of the
// SAME group (AI applied beside AI foundational): one hue at two lightness
// steps encodes the grouping. Fill only, always labeled.
export const colors = {
  accent,
  accentDeep,
  accentSoft: carta.orange50,
  // Context bars in Carta's black, as on their slides (Sandra, 2026-10-27;
  // was gray-90 #394040).
  strong: carta.black,
  mid: neutral.mid,
  soft: neutral.soft,
  faint: neutral.faint,
};
