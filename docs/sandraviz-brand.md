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
| Light khaki | `#b79a6e` | `accent` — UI only, never a chart line | lit wet sand, highlight |
| Warm gray-brown | `#6b5a4a` | secondary text, muted annotation ink, `neutral`/`grayText` | tidal-flat shadow |
| Warm tan-gray | `#e7dfd4` | borders/grid, `base-300`/`grayLight` | — (lightened neutral) |
| Warm cream | `#f6f2ee` | section backgrounds, `base-200` | — (lightened neutral) |

Chart palette (`src/lib/colors.js`, `brand.*`) — key names are kept from the
previous (sandraviz.com) edition so figures re-skin without edits, which
means `blue` now holds the photo's burnt orange (the featured-series role),
not a literal blue; the real blue lives under `royal`. Validated line-mark
set: **orange `#8f4d28` / blue `#1a6aff` / green `#1f7a3d` / purple
`#7a3d99`** — all four checks pass (`scripts/validate_palette.js`,
all-pairs), orange↔green CVD separation lands at a WARN (10.8Δ, floor is 8)
covered by the house rule that every series is direct-labeled. Orange was
chosen over several other sampled tones specifically because it's the only
one that both reads as "the photo's orange" and clears 4.5:1 text contrast
on white *and* passes CVD against the existing green — most of the vivid
sunset pixels are too light/low-contrast for text, and most of the muted
tidal-flat browns collide with green under protan/deutan simulation.

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

The header is fully transparent while over the landing photo — no
background bar — so the image reads edge to edge with just white nav text
and icons floating on top (a soft `black/50→transparent` scrim in the header
itself keeps them legible over bright sky). Past the hero it switches to the
normal solid `bg-base-100/80` + blur bar so it stays legible over the white
report body. Icons default to white (over hero) / neutral (scrolled) and go
`primary` (orange) on hover either way. Implemented with a scroll listener in
`Header.svelte` (`overHero = scrollY < innerHeight * 1.1`, bumped up from an
initial 0.8 which switched while still over the hero — 2026-07-25), the same pattern
`Footer.svelte` already uses for its own show/hide-at-bottom behavior. No
divider line under the solid state either — Sandra didn't like the hairline
border there, so it's just the bg blur separating header from content
(2026-07-25).

## Where the theme lives

- `src/styles/tailwind.css` — daisyUI theme `sandraviz` (semantic UI tokens)
- `src/styles/fonts.css` — IBM Plex Sans font-face declarations
- `src/lib/colors.js` — chart palette (`brand.*`) + legacy role keys for existing figures
