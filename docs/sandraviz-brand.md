# SandraViz — portfolio brand setup

Source: [sandraviz.com](https://www.sandraviz.com) (Wix site theme CSS,
extracted July 2026). This is the template branch — no client identity, just
Sandra's own portfolio look, meant as the starting point for the next report.

## Colors

First pass used the exact colors sampled from sandraviz.com's own theme CSS
(magenta `#f20666` primary, neon green `#4cfc0f` accent). Sandra then asked
to re-derive "the colors of the whole report" from the landing photo itself
instead — the palette below is pixel-sampled from `static/cover.jpg`
(2026-07-25), not the Wix site:

| Color | Hex | Role in this template | Sampled from |
|---|---|---|---|
| Warm near-black | `#221d18` | text/ink, axes, `base-content` — not pure black, Sandra's call | — |
| Burnt orange | `#8f4d28` | signature accent, featured series, `primary` | sunset glow band |
| Khaki | `#8a6f4f` | secondary accent, `secondary` | lit wet sand, mid-tone |
| Slate grey | `#7d8597` | `accent` — UI only, never a chart line | the figures' palette (`iea.heatPumps`), not the photo |
| Warm gray-brown | `#6b5a4a` | secondary text, muted annotation ink, `neutral`/`grayText` | tidal-flat shadow |
| Pale slate | `#dee0e5` | borders/grid, `base-300` | — (25% slate accent in white) |
| Palest slate | `#f1f2f4` | section backgrounds, `base-200` | — (11% slate accent in white) |

The accent is the one colour here that is **not** from the photo, and it has
been re-picked three times. It started as a light khaki `#b79a6e` sampled off
the wet sand, which put the report's one reserved "this points at something"
colour a shade away from `secondary` and from the tan surfaces it had to sit on
— an accent nobody could find. It then became the green out of Cristina
Claverol's turbine illustration on the cover (the `.st4`/`.st6` fill in
`WindTurbinesWide.svelte` / `WindTurbinesTall.svelte`): findable, but a cool
green that never agreed with the burnt orange and khaki around it. A deep navy
`#1b4a6b` followed, which read as blue but as a heavy, corporate blue.

It is now **slate grey `#7d8597`** — `iea.heatPumps`, the light step of the
efficiency series (Sandra's call, 2026-08-24, from a live comparison of five
candidates out of the `iea` palette rendered into every place the accent
actually appears: credit underlines, TOC rule, marked phrases, both filled
controls, the cursor halo). Slate is a deliberately quiet accent: it does not
compete with the orange, and it is cool where everything else warm on the page
is warm, which is what makes it findable without raising its voice.

**The surfaces then followed the accent, and that is the substantive part of
the change.** `base-200` and `base-300` had been warm cream and tan (`#f6f2ee`
/ `#e7dfd4`), lightened out of the photo's browns. Against a slate accent that
beige read as dirty, so both are now the accent's own hue diluted into white:
`base-200` is ~11% slate (`#f1f2f4`), `base-300` ~25% (`#dee0e5`). They are
kept **deliberately pale**, because accent and ground now share a hue — every
step the ground takes toward the accent is a step the accent loses. Don't
deepen `base-200` much past this without checking the cover's underlines.

Slate at full strength is a mid-tone, so unlike the navy a filled control takes
dark ink better than white (4.5:1 against `#221d18`, vs 3.7:1 against white):
`accent-content` is the warm near-black. The two filled controls (the PNG
button in `FigureFooter.svelte`, the Interpretation button in
`ChartDisplay.svelte`) name `accent-content` for both label and glyph on hover
rather than `base-content`, so the theme token — not the markup — decides that
if the accent ever goes dark again.

Still warm, and deliberately left that way: `primary` `#8f4d28`, `secondary`
`#8a6f4f`, `base-content` `#221d18`, and the muted `#6b5a4a` annotation ink in
`colors.js`. The report is warm type and warm signature colour on a cool
ground; only the surfaces and the accent went slate.

`src/lib/colors.js`'s `brand.*` originally carried a full categorical set
(blue/royal/teal/purple/etc., key names kept from the previous
sandraviz.com edition) validated as **orange `#8f4d28` / blue `#1a6aff` /
green `#1f7a3d` / purple `#7a3d99`** (`scripts/validate_palette.js`,
all-pairs; orange↔green CVD landed at a WARN, covered by the house rule that
every series is direct-labeled). This report's actual figures use the
separate `iea` palette instead, so the unused categorical set was later
removed — `brand` now only exports `gray`/`grayText`, the two colors used
directly for chart ink. Orange was chosen as the signature hue over several
other sampled tones because it's the only one that both reads as "the
photo's orange" and clears 4.5:1 text contrast on white *and* passes CVD
against green — most vivid sunset pixels are too light for text, and most
muted tidal-flat browns collide with green under protan/deutan simulation.

## Fonts

- **IBM Plex Sans** — used for both headings and body. First tried Montserrat
  Alternates (the site's actual heading face) for both roles, since the
  site's body face, Madefor Display/Text, is a paid Wix-marketplace font that
  can't be freely self-hosted off-domain — but Sandra compared candidates
  side by side against real report copy (headline/body/chart-legend samples)
  and picked IBM Plex Sans instead (2026-07-25). Self-hosted woff2 in
  `static/fonts/` (Google Fonts, latin subset): Regular 400 (+ italic),
  Medium 500, Semibold 600. Both `font-sans` and `font-display` point at it.

## Landing cover photo

- `static/cover.jpg` — two silhouetted people on a tidal flat with wind
  turbines at sunset. Photo by ZHENYU LUO on Unsplash, free Unsplash License
  (no attribution required), chosen 2026-07-25 over two alternatives (a
  graphic turbines-against-the-sun shot and a foggy single-turbine shot) for
  being the only one of the three with visible people — the workforce angle.
  Source photo is portrait (2400×3600); `Landing.svelte` sets
  `object-position: 50% 28%` to keep the turbines/figures band in frame
  across wide desktop crops instead of the default center crop.

## Logo

None — Sandra's call. The header carries no brand mark on the left; nav/TOC
and social icons sit flush right instead. (Her own site uses a plain text
wordmark, "SANDRAVIZ", if a mark is wanted later.)

## Header socials

GitHub and LinkedIn only (trimmed from an initial GitHub/LinkedIn/
YouTube/Observable/Figma set, 2026-07-25) — same icon treatment and profiles
as `Footer.svelte`.

## Header behavior over the hero

The landing hero is now plain white (no photo behind the header), so the
scroll-aware transparent-over-photo header described in earlier drafts of
this doc no longer applies. `Header.svelte` is a permanent solid
`bg-base-200/80` + blur bar in its one contrast state, with no scroll
listener.

## Where the theme lives

- `src/styles/tailwind.css` — daisyUI theme `sandraviz` (semantic UI tokens)
- `src/styles/fonts.css` — IBM Plex Sans font-face declarations
- `src/lib/colors.js` — chart palette (`brand.*`) + legacy role keys for existing figures
