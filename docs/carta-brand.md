# Carta — brand setup and figure data

*2026-10-15. Branch `carta-demo`, built from `findevlab`: the report's
structure, axes and chart mechanics are unchanged; brand, content and data
are Carta's.*

Source document: **Carta, State of Private Markets: Q1 2026** (54-slide deck,
June 1, 2026; data as of May 22, 2026). Brand values come from carta.com's
own production CSS, not from sampling the PDF: the live site returns 403 to
`curl`, so the page was read from a Wayback snapshot
(`web.archive.org/web/2026/https://carta.com/`) and its stylesheets, fonts and
logo were then fetched directly from carta.com, where static assets are not
gated.

## Colours

Carta's tokens (names as in their CSS):

| Token | Hex | Role in this report |
|---|---|---|
| `--color-black` | `#1a1a1a` | ink (`base-content`), and the cover's ground (`bg-night`) |
| `--clr-light-cream` | `#fcf8f3` | the report's ground (`base-200`), the PNG export's background |
| `--color-orange-60` (= `--color-coral`) | `#ff7d55` | the brand coral: cover dot grid, date tag, UI `primary` |
| `--color-orange-80` | `#d26442` | the chart and UI **accent** — story series, focus ring, underlines |
| `--color-orange-50` | `#ff997a` | `accentSoft`: second series of the accent's group, fills only |
| `--color-gray-90` | `#394040` | `neutral.strong`, context series (the deck's dark "rounds" bars) |
| `--color-gray-80` / `-70` / `-60` / `-40` | `#656b6b` `#9c9f9f` `#a7aaaa` `#dedfdf` | the rest of the neutral ramp |

**Why the accent is not the brand coral.** Validated with
`.claude/skills/dataviz/scripts/validate_palette.js` against `#fcf8f3`:
`#ff7d55` is 2.39:1 on the cream, under the 3:1 a line or bar needs.
`#d26442` is 3.5:1 and is still recognisably Carta's coral. The brand coral
keeps everything on the near-black cover, where it is 6.9:1.

Carta's greys sit at OKLCH H ~195, a cool slate, so the house rule "warm
asserts, slate recedes" holds with their own values, untinted.

Quiet text is `/65` (`#1a1a1a` at 60% is 4.48:1 on the cream, just under 4.5).

## Fonts

- **Plus Jakarta Sans** — all text, UI and chart type. Open source, Google
  Fonts, linked in `src/app.html`.
- **SangBleu Versailles** (400 roman + italic) — the serif of the deck's
  cover, dividers and headlines; here the cover title, chapter titles, the
  Index heading and the closing title. Commercial (Swiss Typefaces), vendored
  from carta.com's build into `static/fonts/` **for this client-only demo —
  licensed to Carta, never reuse on another branch.** Carta ships no bold.

## Logo

`static/carta-logo-black.svg` is carta.com/logo.svg unchanged (the boxed
wordmark). `carta-logo-white.svg` is the same file with the fill swapped,
for any dark ground; unused for now.

## Cover and ending

The cover is the deck's title/divider language: near-black ground, the coral
square-dot grid (`DotGrid.svelte`) framing a window cut around the title as it
actually wraps, the title in SangBleu with "Q1 2026" in grey, and the coral
date tag with its white square. The deck's isometric pie illustration is not
reproduced. The ending band reuses the dot grid on the cream.

## Figures

Six figures, one or two per chapter. **Every number in the copy is printed
in the deck** — a slide label, a headline or the Highlights page.

| # | Figure | Deck slide | Data |
|---|---|---|---|
| 1 | Capital invested by year | 6 | exact (bar labels) |
| 2 | Rounds by quarter | 7 | exact (bar labels) |
| 3 | Down-round rate by quarter | 19 | exact (bar labels) |
| 4 | Post-money by stage, median + 25th–75th | 27 | exact (labels) |
| 5 | AI share of capital by year | 35 | totals and 2023–26 foundational exact; 2018–22 foundational slivers **read off the chart** (≤1%), noted in the source line |
| 6 | AI share by metro | 43 | exact; Austin foundational = 60.0 − 57.4 |

Changes from the deck's own charts, all from the house rules:

- **Slides 6 and 7 drew capital and rounds on two y axes.** Split into
  Figures 1 and 2, one measure each.
- **Slide 19's 29 bars became one line** (Figure 3), with the deck's
  "Valuation reset" era (slide 20) as a plain slate band. No hatch: the hatch
  means "projection" in this report.
- **Slide 27's stage colours** (yellow → orange) became one pale coral: the
  stage is already named on every row.

## Template additions on this branch

- `kind: "range"` — `RangeChartPanel.svelte`: horizontal range bars with a
  median dot, on LayerChart's own BarChart (`orientation: "horizontal"` plus
  an array x accessor is its range-bar mode).
- Quarterly x axes — `quarterDate`, `parseQuarter`, `quarterTicks`,
  `tooltipHeaderQuarter` in `chart-theme.js`; `pair.quarterly` on bar
  figures. One labelled tick per year under its Q1, in the shared year format.
- Categorical bar axes — `pair.xTickFormat` on `BarChartPanelStacked`, and no
  every-other-band thinning on phones when x is not a date.
- `pair.directLabelOffset` for bar figures with wider bands.
- `DotGrid.svelte`.

## Still open

- `static/report.pdf` — the closing "Full report" button links there; drop
  Carta's PDF in under that name.
- No Open Graph share image yet (`twitter:card` is `summary` until there is).
