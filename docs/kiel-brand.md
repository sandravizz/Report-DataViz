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

Chart colors live in `src/lib/colors.js` and are all site hues: brand orange is the
highlight (the series a figure is *about*), their blue carries the main contrast series,
and teal/green/amber/red round out the categorical set. The two background greys are
warm (`#c9c3b6`, `#d3cec4`) so they don't go green against the cream.

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

- `static/kiel-logo.svg` and `static/kiel-logo-inverted.svg` are the institute's own
  files (`/_assets/.../Images/logo.svg`), the bar mark plus "Kiel Institut" wordmark. The
  standard one is solid `#ff6a00`; the "inverted" one is solid black, for light-on-dark
  use — despite the name, neither is white.
- Header logo links to `kielinstitut.de`; header socials are their five channels in the
  order their own footer lists them (LinkedIn, X, Bluesky, Facebook, YouTube).
- The footer carries their institutional links: About, Publications, Data Hub, Legal
  Notice, Privacy, eAccessibility, plus the contact address and phone number from their
  footer.

## Still to swap

- `static/share-image.jpg` is still the previous report's Open Graph image.
- The figures in `src/lib/data/figures/` carry placeholder data; only their colors have
  been remapped to the Kiel palette.
