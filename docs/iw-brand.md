# IW — Institut der deutschen Wirtschaft · brand setup

Two sources, combined: the report itself (IW-Report 34/2026, "IW-Wohnindex Q2
2026", 20.07.2026) for the chart colors, and iwkoeln.de's own site (logo, real
brand palette, fonts, footer social links) — no official brand guidelines PDF
supplied by either. iwkoeln.de sits behind a JS proof-of-work bot-check that
blocks a plain `curl`, so the live site was read three ways: the `WebFetch`
tool (for footer content/social URLs — it gets past the check), a Wayback
Machine snapshot (`web.archive.org`, to find the real asset paths referenced
in `<link>`/`@font-face` tags without fighting the bot-check), and then direct
`curl` requests for the actual asset files themselves (images/fonts/CSS
aren't behind the same gate once you have their exact path).

## Colors

| Token         | Hex       | Where it came from                                                |
| ------------- | --------- | ------------------------------------------------------------------ |
| `iw.navy`     | `#2e4964` | iwkoeln.de's own `a{color:...}` and `.btn--primary` — also happens to be the exact pixel color of the PDF's Figure 2-1 ETW line and legend text |
| `iw.blue`     | `#0069b4` | iwkoeln.de logo SVG `fill` attribute — also the exact pixel color sampled from the PDF cover logo, and site's `.btn--secondary` |
| `iw.teal`     | `#106b71` | site's `.btn--tertiary`                                             |
| `iw.amber`    | `#f59d0f` | site's `--accent-color`                                             |
| `iw.bodyText` | `#1b4160` | site's `body{color:...}`                                            |
| `iw.steel`    | `#93a7bb` | PDF Figure 2-1 legend swatch — Miete line (also appears in the site's own `--bg-full-width-color` swatch list) |
| `iw.gold`     | `#e0c599` | PDF Figure 2-1 legend swatch — EZFH line                            |

The PDF-sampled chart colors and the site's own CSS colors matched
independently (`#0069b4` and `#2e4964` each came out identical both ways),
which is a good cross-check that neither reading was a fluke.
`iw.navy` is the daisyUI theme's `--color-primary`, `iw.blue` is `--color-secondary`
(see `src/styles/tailwind.css`) — matching the site's own primary/secondary
button hierarchy, not an arbitrary pick.

## Logo

`static/iw-logo.svg` — the icon-only "iW" mark
(`iwkoeln.de/dist/Images/Default/logo.svg`), downloaded directly — not a
redrawn or cropped-screenshot approximation. Used in the header, small,
top-left corner only — no wordmark text next to it, and not used anywhere
else on the page (Sandra's call, 2026-07-24: tried the full lockup — icon +
"Institut der deutschen Wirtschaft" wordmark, extracted as inline SVG from the
site's own `<header>` markup — both in the header and in the landing hero;
reverted both back to icon-only-in-the-header-only).

## Font

`iwkoeln.de/dist/Stylesheets/Default/default.css` declares the real stack:
**Source Sans Pro** (body — open-source, SIL OFL) and **Acherus Grotesque**
(headings only, bold/black weights). Both self-hosted from
`iwkoeln.de/dist/Fonts/Default/`, woff2 files in `static/fonts/`. This replaces
an earlier system-font placeholder from before the real site stylesheet was
found.

## Social links

From iwkoeln.de's own footer: LinkedIn
(`https://de.linkedin.com/company/institut-der-deutschen-wirtschaft`) and
Instagram (`https://www.instagram.com/iw_koeln/`), used in `Header.svelte`.

## Data digitization

Figure 2-1's quarterly index values (2018 Q1–2026 Q2, three series) aren't
given as a data table anywhere in the report — only as a rendered chart plus a
handful of exact QoQ/YoY percentages in the surrounding text. They were
digitized programmatically: each series' line color was sampled from its own
legend swatch, matched against the plot image at each quarter's x-position
(gridlines and axis-label text excluded via color-distance-to-background
checks), and converted back to a value using the y-axis gridline pixel
calibration — anchored against the chart's own `2022 Q1 = 100` index
definition, then cross-checked against the report's stated percentage changes
(matched to within ~0.1–0.4 points). See `src/lib/data/figures/01-national-index.js`
for the resulting series and a fuller note. Treat these as good approximations,
not the underlying source data — replace them if IW supplies the real table.
