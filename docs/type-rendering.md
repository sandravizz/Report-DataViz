# Type rendering — LOCKED

Status: **settled**. This is not a preference to be re-derived per report. Both
rules below apply to every branch, and a new branch starts from them.

Two separate causes made small text read as "not crisp". One is a one-time
global fix that is identical everywhere. The other is a floor that faint text
is not allowed to fall below, whose *value* is computed per branch.

---

## Rule 1 — Grayscale antialiasing, in the base layer, on every branch

In `src/styles/tailwind.css`, at the end of the file:

```css
@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

Browsers on macOS default to **subpixel** antialiasing: each glyph edge is
drawn using the red/green/blue stripes of the physical pixel, so the letter
picks up a faint colour fringe and a little extra weight. At 20px body copy
that is invisible. At 11px — the source line under a figure, the uppercase
eyebrow over a chart — the fringe is a meaningful share of the stroke, and the
text reads as smeared rather than sharply edged.

Grayscale antialiasing draws the same glyph a hair *lighter* but with a clean
edge. That is the whole trade: crisper, thinner. Which is why Rule 2 exists —
applying Rule 1 alone makes already-faint text slightly worse.

**On `html`, in `@layer base`** — not as a utility class on one element. A
class can be missed by whatever is added next; an inherited base rule cannot.

**Why a React prototype looked crisper.** React does not do this, and neither
does Next.js at runtime. `create-next-app` writes Tailwind's `antialiased`
class onto `<body>` in the layout file it scaffolds, and `antialiased` compiles
to exactly the two declarations above. A prototype started that way is
antialiased from its first commit and nobody ever notices the line exists.
SvelteKit's template scaffolds no such class, so on a Svelte production build
it has to be written once, by hand. There is no behavioural difference between
the frameworks — only between their starter templates.

**`text-rendering: optimizeLegibility` is deliberately NOT set.** It is a
documented source of layout jank, and it controls kerning and ligatures rather
than edge quality. It is not what "crisp" means here.

---

## Rule 2 — Quiet text clears 4.5:1. The alpha is computed, not copied.

Antialiasing sharpens an edge; it cannot rescue text too faint to have much of
one. The captions were set at `text-base-content/50`, which on `iw` measures
**2.70:1** — below WCAG's 3:1 minimum for *large* text, at 11px, and made
about 5% lighter again by Rule 1. That, not the antialiasing, was most of what
read as blurry on the source line.

**The floor is the contrast, not the number.** `/50` is a different colour on
every branch because it is an alpha on that branch's own ink, so a flat
replacement value is wrong: on `iw`'s light navy `/70` is a rescue, on a
pure-black branch the same `/70` overshoots to 8.5:1 and turns a quiet caption
into near-body-weight grey. Compute the smallest alpha that clears 4.5:1
against the surface the text actually sits on, round up to the nearest 5, and
use that.

| branch | ink | `/50` was | locked | now |
|---|---|---|---|---|
| `iw` | `#1b4160` | 2.70:1 | **`/70`** | 4.49:1 |
| `main` | `#103900` | 2.89:1 | **`/70`** | 5.00:1 |
| `kiel-institute` | `#1d1815` | 3.27:1 | **`/65`** | 5.20:1 |
| `template` | `#221d18` | 3.26:1 | **`/65`** | 5.21:1 |
| `findevlab` | `#000000` | 3.98:1 | **`/55`** | 4.76:1 |
| `iea` | `#000000` | 3.98:1 | **`/55`** | 4.76:1 |

`iw` lands at 4.49 rather than over 4.5 because the next step up starts to
compete with the body copy; at 11px on white it is the accepted edge of the
rule, not a miss to be fixed later.

The surface matters: on `kiel-institute` and `main` the chapter ground is
tinted, not white, so the figure-surface and chapter-ground readings differ
slightly. Both are computed; the table quotes the tighter of the two.

**Where it lands, per branch** (not every branch has every file):

- `FigureFooter.svelte` — the source line and the `sandraviz.com` wordmark
- `ChartDisplay.svelte` — the figure eyebrow, in the desktop header and in the
  mobile Interpretation sheet
- `Interlude.svelte` — the section eyebrow (`iw` only)
- `+page.svelte` — the eyebrow in the chapter column (`template` only)
- `downloadFigure.js` — `MUTED`, the source line drawn into the exported PNG.
  **Easy to miss**, and if it is missed the PNG keeps the value the page just
  left behind.

**Controls stay one step above the captions around them.** The PNG button's
label sits above the source line beside it; that relationship is preserved
rather than flattened to a single value.

---

## Rule 3 — The PNG exporter copies the page's type metrics, it does not approximate them

`downloadFigure.js` redraws the figure header onto a canvas, so every type
value there is a hand-written copy of a Tailwind class — and copies drift. The
figure eyebrow had drifted on every branch at once: **500 weight** (600 on
`iw`) against the page's 400, **11px** against `text-xs`'s 12, and **no
letter-spacing** against `tracking-wide`.

None of that changes the ink, but all three make the strokes of an uppercase
line at caption size close up, and closed-up strokes in a muted colour read as
*darker and more saturated* rather than merely heavier. Reported, correctly, as
"not such a nice colour, and not crisp" — the colour was identical; the
weight, size and tracking were not.

The tell was one line away: `legendSize = 12` right underneath, already
matching `text-xs` because someone had checked it once. The eyebrow was the
metric nobody brought back.

**When touching either side, check the pair.** The page value wins.

| element | page | canvas |
|---|---|---|
| eyebrow | `text-xs tracking-wide` uppercase, weight 400 | `numberSize` 12, `numberTracking`, weight 400 |
| legend | `text-xs` | `legendSize` 12 |
| source line | `text-[11px] tracking-wide`, `leading-snug` | `footerSize` 11, tracked, line-height 1.375 |
| wordmark | `text-[11px] tracking-wide` | `wordmarkSize` 11, tracked |

Canvas2D `letterSpacing` is recent (Chrome 99+, Safari 17.4+), so it is set
behind an `"letterSpacing" in ctx` guard and reset to `0px` straight after —
where it is missing the export is simply what shipped before, never broken.

`iea`'s exporter draws no eyebrow at all, so it has nothing to bring back.

Tracking is set through `withTracking(ctx, on)`, which is a no-op where the
browser lacks it. It has to be on for the **measuring** pass as well as the
drawing one — `wrapLines` calls `measureText`, so a source line left untracked
while measuring wraps at a width it will not occupy — and it stays on through
the `measureText` that sizes the wordmark's accent rule, or the rule stops
short of the word it underlines.

The eyebrow was the reported one; the source line and wordmark were the same
drift found by comparing the two columns rather than by eye, and were brought
across in the same pass. A visual check finds the worst offender, not all of
them. When one of these is wrong, read the whole table.

## Adding a new branch

1. Paste the Rule 1 block into `src/styles/tailwind.css`. It is identical
   everywhere — no brand decision in it.
2. Read the branch's `--color-base-content` and `--color-base-100`, compute the
   smallest alpha clearing 4.5:1, round up to the nearest 5, add a row to the
   table above.
3. Apply that alpha to the files listed, `downloadFigure.js` included.

Never copy another branch's alpha. Copy the 4.5:1 target.
