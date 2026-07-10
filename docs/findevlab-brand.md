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

75% and 50% white tints of any color are sanctioned (guidelines pp. 8–9) —
`tint(hex, pct)` in `src/lib/colors.js`. Note the guidelines' dark slate is
`#395966`; the website CSS uses `#385866` — the guidelines value wins here.

**Chart rule:** the palette is muted by design and fails the usual chroma/contrast
floors for chart marks. Validated mitigation: every series carries a direct label
(house style already), sand/pale sage never used for thin lines, teal and green
never adjacent in the same chart. Best-separated line trio: teal / camel / rust.

## Fonts

- **Kapra Neue Expanded** — display face (logo basis). Self-hosted woff2 in
  `static/fonts/` (taken from findevlab.org), weights 100–700 + regular italic,
  declared in `src/styles/fonts.css`. Tailwind utility: `font-display`.
- **Barlow** — print & web text face, Google Fonts import in `fonts.css`.
  Default `font-sans`.
- (Print pairing per guidelines: Roboto Serif — not set up for the web report.)

## Logo

- `static/fdl-logo.svg` (color, for white/light backgrounds) and
  `static/fdl-logo-white.svg` (for dark/colored backgrounds), from findevlab.org.
- Rules (guidelines pp. 5–7): min width 10 mm with the "Finance for Development
  Lab" wordmark, 6 mm without; generous exclusion zone; never distort, rotate, or
  crop a white box around it on colored backgrounds — use the white version instead.

## Where the theme lives

- `src/styles/tailwind.css` — daisyUI theme `findevlab` (semantic UI tokens)
- `src/styles/fonts.css` — font-face declarations + Barlow import
- `src/lib/colors.js` — chart palette (`fdl.*`) + legacy role keys for v1 figures
