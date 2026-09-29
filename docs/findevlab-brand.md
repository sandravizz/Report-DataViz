# FDL — Finance for Development Lab · brand setup

Source: official brand guidelines PDF (Avril 2022) + findevlab.org theme assets.
FDL is a non-profit research org (Paris School of Economics) working on sovereign
debt and international finance architecture.

## Colors

Primary palette (guidelines p. 8):

| Color | Hex | Role in this report |
|---|---|---|
| Dark slate | `#395966` | text/ink, axes, `primary` |
| Teal | `#709899` | brand hue, highlight series, `secondary` |
| Camel | `#c99561` | warm neutral series (direct labels required, 2.6:1) |

Secondary palette (guidelines p. 9):

| Color | Hex | Role |
|---|---|---|
| Rust | `#c24c2c` | strongest accent, extremes, `accent`/`error` |
| Terracotta | `#d3714e` | softer warm accent |
| Green | `#618e78` | `success`; avoid next to teal (CVD ΔE ~12, tritan 5) |
| Sand | `#e9be72` | area fills/bands only (1.7:1 on white), `warning` |
| Pale sage | `#abc6b1` | de-emphasized background series |
| Grey-green | `#5e6d68` | muted labels, `neutral` |

75% and 50% white tints of any color are sanctioned (guidelines pp. 8–9).
Note the guidelines' dark slate is
`#395966`; the website CSS uses `#385866` — the guidelines value wins here.

**Chart rule (revised 2026-09-23 — the table above is the brand record, not the
chart palette).** The figures no longer draw series colours from these nine hues.

The palette is muted by design and fails the usual chroma/contrast floors for
chart marks: six of the nine sit below the C 0.10 chroma floor, and four of
those also fall under 3:1 on the chapter ground. The old mitigation — direct
labels on every series, sand/pale sage never on thin lines, teal and green
never adjacent — kept each figure *legible*, but it could not fix how the
report read as a whole: several marks in several almost-identical non-colours,
none of which looks chosen.

The current rule is that **hue does not carry identity**. One saturated ink —
FDL's own rust `#c24c2c`, the brand's designated "strongest accent", and at
C 0.159 the most saturated thing in the palette — marks the series its figure
is about. Everything else sits on a neutral ramp separated by lightness, and
the direct labels that were already house style carry identity on their own.

Turning the brand hues up was tested and rejected: at teal's hue (H 198) sRGB
runs out of gamut before C 0.10 unless the colour also lightens, at which point
it is a bright cyan `#009296` and no longer FDL teal. The only hues in this
palette that *can* be clear are the warm ones that already are.

See the header of `src/lib/colors.js` for the measurements and the ramp.

## Fonts

- **Kapra Neue Expanded** — display face (logo basis). Self-hosted woff2 in
  `static/fonts/` (taken from findevlab.org), weights 100–700 + regular italic,
  declared in `src/styles/fonts.css`. Tailwind utility: `font-display`.
- **Barlow** — print & web text face, Google Fonts import in `fonts.css`.
  Default `font-sans`.
- (Print pairing per guidelines: Roboto Serif — not set up for the web report.)

## Logo

- `static/fdl-logo-black.svg`: the FDL logo recoloured all-black, used in the
  Header and Footer. The color and white originals from findevlab.org were
  removed as unused; retrieve them from git history if a design needs them.
- Rules (guidelines pp. 5–7): min width 10 mm with the "Finance for Development
  Lab" wordmark, 6 mm without; generous exclusion zone; never distort, rotate, or
  crop a white box around it on colored backgrounds — use the white version instead.

## Where the theme lives

- `src/styles/tailwind.css` — daisyUI theme `findevlab` (semantic UI tokens)
- `src/styles/fonts.css` — font-face declarations + Barlow import
- `src/lib/colors.js` — the brand record (`fdl.*`), the neutral ramp (`neutral.*`)
  and the job-keyed series roles the figures actually use (`colors.*`)
