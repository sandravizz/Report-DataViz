# Kiel Institute brand — where every value came from

*Written 2026-08-10, when the `kiel` branch was set up.*

No brand guidelines PDF was supplied for this edition, so everything below is read
directly out of what kielinstitut.de actually serves. If official guidelines turn up
later, their values win over anything here.

## How the values were read

`www.kielinstitut.de` serves plain `curl` without a bot check, so no Wayback detour was
needed (unlike iwkoeln.de — see the `iw` branch):

1. `curl` the homepage, list `<link href="*.css">` and `<img src="*.svg">`.
2. `curl` the production stylesheet `/_assets/vite/assets/Main-*.css` — it carries the
   institute's own `:root` custom properties, so the colors and type tokens below are
   their declared values, not colors sampled off a screenshot.
3. `curl` the logo and the `.woff2` files the stylesheet's `@font-face` rules point at.

The reference page for text and visualization style is the
[Global Transformation research center](https://www.kielinstitut.de/institute/research-centers/global-transformation/).

## Colors

From the site's `:root` and Bootstrap theme in `Main-*.css`:

| Role on their site | Value | Where it lands here (`src/styles/tailwind.css`, theme `kiel`) |
| --- | --- | --- |
| `--color-primary`, and the logo's own fill | `#ff6a00` | `--color-primary` |
| `--color-secondary` | `#194abb` | `--color-secondary` |
| `--color-tertiary` | `#dfe0e3` | `--color-accent` |
| `--bs-body-bg` (light) | `#f5f1e7` | `--color-base-100` |
| button active / subtle cream | `#ede6d8` | `--color-base-200` |
| `--color-minorinfo` | `#6f6d68` | `mutedTextGray` in `src/lib/colors.js` |
| `--bs-body-bg` (dark theme) | `#212121` | `--color-neutral` |
| contextual teal / green / amber / red | `#287f9a` `#3a833a` `#a4660e` `#d4403a` | `info` / `success` / `warning` / `error`, and the chart palette |

Two deliberate departures, both noted in the theme block:

- **`--color-base-300: #e4dbc9`** is mixed here. The site has no third surface tone, and
  its cool grey tertiary reads dirty next to the warm cream.
- **`--color-base-content: #1d1815`** instead of their flat `#000000` — a near-black
  warmed toward the orange, because pure black punches a hole in a cream page.

Chart colors live in `src/lib/colors.js`. The institute's *publications* turn out to use a
narrower palette than its website: every figure in the Economic Outlook is drawn in the
brand orange `#ff6a00`, the brand blue `#194abb`, or a pale tint of that blue `#9badd5` —
pixel-sampled from the report's own legends, and nothing else appears. Those three are
`highlight` / `blue` / `lightBlue` and carry the reproduced figures. teal/green/amber/red
(the site's contextual colors) stay available for figures that need more categories, and
the two background greys are warm (`#c9c3b6`, `#d3cec4`) so they don't go green against
the cream. `forecastBand` `#f7cfad` is the tint they wash over the forecast part of a
chart — the orange at low opacity over the cream page.

Their figures print straight onto the cream page rather than onto white cards, so the
chart stage here is `base-100` too (`ScrollySection`, `chartSurface` in `chart-theme.js`
and `BACKGROUND` in `downloadFigure.js` all track that one color — line casings are drawn
in it, so they have to stay in step).

## Type

The site declares `--font-stack-base: Suisse Works, serif` for body copy and
`--font-stack-headline: Suisse Intl, sans-serif` for headings — a serif/sans split, which
is the most distinctive thing about how their pages read. It is reproduced here:
`font-serif` on running prose (chapter intros, figure subtitles, the description column,
the mobile interpretation modal), `font-sans` on headings, navigation, and chart chrome.

Their heading tokens, applied to the cover, chapter headings, and figure titles:

| Token | Value |
| --- | --- |
| `--typo-header-1-*` | Suisse Intl, 500, `--font-size-huge` (2.1875rem → 3.4375rem ≥1200px), line-height 1, letter-spacing −1px |
| `--typo-header-2-*` | Suisse Intl, 500, `--font-size-large` (1.5rem → 1.875rem), line-height 1.166, letter-spacing −1px |
| body | Suisse Works, `--font-size-regular` (1rem → 1.125rem ≥1200px) |

**Font files are vendored** into `static/fonts/` from the institute's own build. The
institute ships Suisse Intl in Medium only and Suisse Works in Book + Bold, so
`src/styles/fonts.css` declares each static file across a *weight range* — that makes the
browser match `font-medium`/`font-semibold` to the real file instead of synthesizing a
faux-bold.

**Licensing caveat:** Suisse Works and Suisse Intl are commercial faces from Swiss
Typefaces, licensed by the Kiel Institute for their own domain. Fine for a proposal built
for them; they must not travel to another client's branch. If a licence-clean stand-in is
ever needed, the closest free pairing is Source Serif 4 (body) with Inter (headings) —
Inter is in fact already loaded on their site as the Bootstrap package's fallback face.

## Logo and links

- `static/kiel-logo.svg` is the institute's own file (`/_assets/.../Images/logo.svg`), the
  bar mark plus "Kiel Institut" wordmark, solid `#ff6a00`. They also publish an
  "inverted" variant (solid black, for light-on-dark use — despite the name, neither is
  white); this report never sits type on a dark ground, so that file isn't carried here.
- Header logo links to `kielinstitut.de`; header socials are their five channels in the
  order their own footer lists them (LinkedIn, X, Bluesky, Facebook, YouTube).
- The page footer is the pitch block, not the institute's own: these are client-facing
  demos, so it carries the portrait, their logo and a contact line rather than a copy of
  their institutional nav.

## The cover

`Landing.svelte` carries the Economic Outlook's cover, re-set for the screen as two
columns: the whole text block ranged flush left in one column (issue number, two-line
headline, report title, close date, authors, research group, in that order), the artwork
as a rectangle on the right, and the scroll chevron the other report branches use — in the
cover's blue here — centred beneath. Everything is the cover's blue `#194abb` on the cream
page, headline and title in Suisse Intl, the small print in Suisse Intl Mono. Measured off
the PDF at 200 dpi, the printed headline sets its two lines solid (leading ≈ 0.94) with
about −0.02em of tracking, which is what the screen version keeps.

`static/kiel-cover-wave.png` is the institute's own cover artwork, extracted with
`pdfimages -png -f 1 -l 1` from page 1. Its background is the same `#f5f1e7`, so the strip
sits on `base-100` with no visible edge. Two changes from the printed original:

- The blue "KIEL Institut" wordmark baked into the image's bottom-left corner is **painted
  out** (that box held no orange, so the wave is untouched). On paper it is the cover's
  signature; on screen the header already carries the logo, and a second one low on the
  page just reads as clutter.
- A landscape browser window cannot hold a portrait A4's proportions, so the artwork is
  not the full-bleed bottom half it is on paper: it sits as a rectangle in the cover's
  right-hand column, `object-cover` so the wave keeps its own scale and crops rather than
  stretching, and drops to a short band under the text on phones.

Everything on the cover is sized against viewport *height* as well as width
(`min(Nvw, Nvh)` inside each clamp): a cover is one screenful by definition, so on a short
laptop the headline has to give way rather than push the author line off the bottom.

The source PDF is public:
`kielinstitut.de/fileadmin/Dateiverwaltung/IfW-Publications/fis-import/c803572d-aaf5-4658-a326-32b5c3956a11-_KKB_133_2026-Q2_Welt_EN.pdf`
(found through their Solr search, `/search/?tx_solr[q]=…`).

## Still to swap

- `static/share-image.jpg` is still the previous report's Open Graph image.
