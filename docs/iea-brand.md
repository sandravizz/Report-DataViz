# IEA — International Energy Agency · brand setup

Source: iea.org website CSS (no official guidelines PDF supplied yet — if the
client provides one, its values win over the website CSS, as with the previous
edition). The IEA is the Paris-based intergovernmental agency for energy
policy, data and analysis; the report for this edition is
[Ensuring a Skilled Renewable Energy and Energy Efficiency Workforce](https://www.iea.org/reports/ensuring-a-skilled-renewable-energy-and-energy-efficiency-workforce)
(June 2026, CC BY 4.0).

## Colors

Core UI colors (site CSS):

| Color | Hex | Role in this report |
|---|---|---|
| Black | `#000000` | text/ink, axes, `base-content` |
| Electric blue | `#0044ff` | signature brand hue, featured series, `primary` |
| Navy | `#002999` | pressed/hover shade of the blue |
| Grey text | `#6f6f6f` | secondary text, muted annotation ink, `neutral` |
| Grey light | `#e6e6e6` | borders/grid, "other" slices, `base-300` |
| Grey surface | `#f3f3f3` | section backgrounds, `base-200` |

Chart palette — the IEA ships its own Highcharts colorsets in the site CSS;
`colorset-default` in order: cyan `#49d3ff`, royal `#3e7ad3`, mint `#68f394`,
teal `#00ada1`, yellow `#fff45a`, amber `#ffb743`, coral `#ff754b`, lavender
`#b187ef`, purple `#af6ab1`, grey `#e6e6e6`. The `-highlight` variant puts the
electric blue `#0044ff` first as the featured series. Status colors from the
site's label/alert components: success `#68f394`, warning `#fff45a`, error
`#e34946` (forms/alerts) and `#ff754b` (labels).

**Chart rule:** the palette is bright by design — yellow, mint, cyan and amber
sit above the lightness band and under 3:1 contrast on white, so they are
**area fills/bands only, never thin lines**. Validated line-mark set (all six
checks pass, `scripts/validate_palette.js`): **blue `#0044ff` / teal `#00ada1`
/ coral `#ff754b` / purple `#af6ab1`** — teal and coral carry a contrast WARN
that is covered by the house rule that every series is direct-labeled. White
tints via `tint(hex, pct)` in `src/lib/colors.js` mirror the site's own
"light"/"tints" colorsets.

## Fonts

- **Graphik** — the IEA's single corporate face for headlines and body alike
  (site stack: `Graphik, Arial, sans-serif`). Self-hosted woff2 in
  `static/fonts/` (taken from iea.org): Regular 400 (+ italic), Medium 500,
  Semibold 600. Both `font-sans` and `font-display` point at it; lighter
  weights fall back to Regular.

## Logo

- `static/iea-logo.svg` (black, for white/light backgrounds) and
  `static/iea-logo-white.svg` (for the blue/dark backgrounds), extracted from
  the inline SVG sprite on iea.org (`#icon--logo`, viewBox 0 0 80 36).

## Header socials

The report header carries the IEA's six social profiles with their own icon
glyphs, both taken from the iea.org footer (SVG sprite), in the footer's
order: YouTube, LinkedIn, Bluesky, Facebook, Instagram, X. The site sizes
them unevenly on purpose (20px vs 18px) and inks them in the grey `#6f6f6f`
(= `neutral`); both carried over in `src/lib/components/Header.svelte`.

## Where the theme lives

- `src/styles/tailwind.css` — daisyUI theme `iea` (semantic UI tokens)
- `src/styles/fonts.css` — Graphik font-face declarations
- `src/lib/colors.js` — chart palette (`iea.*`) + legacy role keys for existing figures
