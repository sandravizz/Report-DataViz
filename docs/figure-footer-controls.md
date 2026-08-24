# Figure Controls: Making the Report's Buttons and Links Read as Clickable

Portable across report branches. The mechanism is written entirely in theme
tokens (`accent`, `base-content`), so a branch with a different palette gets
the same behaviour in its own colours — see [Porting to another
branch](#porting-to-another-branch) for the one contrast check that is not
automatic.

**This branch's accent is slate grey `#7d8597`** — a mid-tone (3.7:1 on
white), which still fits the shape of accent this mechanism was designed
around: a good translucent fill under dark ink, a quiet rule as an underline.
The classes below name `accent-content` for the hover label and glyph rather
than `base-content`; on this branch the theme defines `accent-content` AS the
warm near-black, so the rendered result is the same, but a branch whose accent
is dark gets white there without touching the markup.

## The problem

The bottom of every figure carries four small pieces of furniture:

| | |
|---|---|
| `FIGURE 2` | eyebrow above the title, in `ChartDisplay.svelte` |
| `Sources & series: …` | source line, in `FigureFooter.svelte` |
| `PNG` | download button, same file |
| `sandraviz.com` | wordmark, same file |
| `Interpretation` | modal trigger below `lg`, in `ChartDisplay.svelte` |

Three of those five do something when you click them and two do not, but all
five were the same small grey caption text. The two buttons in particular
looked exactly like labels — readers were not finding them. The Interpretation
button is the worst case, because below `lg` it is the *only* route to the
figure's explanatory text; a reader who does not notice it never sees that copy
at all.

## What the reader sees

**One grey for all four.** Every piece of figure furniture sits at
`text-base-content/50`. Nothing in this row is meant to be read before the
chart, so nothing in it gets a weight of its own. The wordmark used to be
`/30`; it was pulled up so the row reads as one class of thing.

**Clickability is carried by two different devices, matched to two different
kinds of thing:**

- The **buttons** — PNG and Interpretation — are *controls*; they perform an
  action, so they take the accent as a **fill**. At rest, `bg-accent/25`: a
  wash strong enough to read as a raised surface, faint enough that it does not
  pull the eye off the chart. On hover it goes to the full accent plus the shadow lift.
  No border — the fill alone carries the shape, and the download
  glyph at full ink supplies the focal point.
- The **wordmark** is a *link* — it navigates — so it takes the accent as a
  **rule**: a 1px underline at a 3px offset, the same device as
  `mark.accent-mark` in the running text. Hover is the lift alone.

The source line beside them gets neither, which is what makes the distinction
legible: in a row of identical grey, the two things wearing accent are the two
things you can press.

## Why the glyph is full ink, and why it cannot be the accent

The label sits at `text-base-content/75` but the download glyph is set to full
`text-base-content`. That small step is what gives the pill a focal point: at
11px a flat wash with everything inside it at one weight reads as a highlighted
word rather than as a button, and the glyph is the part that says *action*.

The obvious next idea — paint the glyph in the accent so it pops — is
geometrically impossible, not merely a taste call. The resting fill *is* the
accent at low alpha, so the glyph and its own background are the same hue by
construction, and no tint of a colour can contrast with that colour. Measured on this branch:
`#7d8597` on its own resting tint over white (`#dee0e5`) is **1.8:1**.
Deepening the tint makes it worse, not better, because the ground climbs toward
the glyph. Every combination is invisible.

The accent here is a mid-tone slate — 3.7:1 on white — which is what
makes it a good *fill* under dark ink and a weak *foreground* on anything
pale. If a branch genuinely wants a bright accent glyph, the ground under it
has to be dark: invert the pill to an ink fill with the glyph knocked out in
accent. That is a much louder object in the footer, which is why it is not the
default here.

The rest state is deliberately faint. On a scrolly report this control repeats
on *every* figure, so a full-strength fill would spend the reserved accent on
furniture. Full strength is held back for hover, the moment it is actually
pointing at something.

## Why the underline is 1px here and 2px in the body

`mark.accent-mark` in `src/styles/tailwind.css` sets a 2px rule at a 4px
offset, cut for 20px body copy — the same geometry as the cover credits'
`decoration-2 underline-offset-4`. Both numbers are absolute rather than em-based
on purpose (see that file's comment), so at 11px the same rule is
proportionally almost twice as heavy and reads as a bar under the word. The
footer uses `decoration-1 underline-offset-[3px]` — same device, caption scale.

## The code

`src/lib/components/FigureFooter.svelte` and `src/lib/components/ChartDisplay.svelte`.
Both buttons carry the same class string:

```html
class="btn btn-ghost btn-xs … rounded-full
       bg-accent/25! text-base-content/75
       hover:border-transparent! hover:bg-accent! hover:text-accent-content hover:shadow-lg!"
```

with the glyph one step stronger than the label it sits beside:

```html
<svg … fill="currentColor" class="size-3.5 text-base-content">
```

The wordmark:

```html
class="… text-base-content/50
       underline decoration-accent decoration-1 underline-offset-[3px]
       transition-[background-color,box-shadow] duration-200
       hover:bg-base-100 hover:shadow-lg"
```

(`base-100` is white on this branch and is what the figure surface is painted
in, so the lift takes the surface's own colour.)

### The `!` are not cargo cult

Three separate daisyUI mechanisms fight these utilities, and each one needs the
override for a different reason:

- **Hover background / border.** daisyUI's own rule is `.btn:hover` — two
  classes. A plain `hover:bg-accent` utility is one class plus a pseudo-class
  and loses the specificity contest outright; layer order cannot save it.
- **Resting background.** `.btn-ghost` sets its own transparent fill.
  Utilities land in a later cascade layer than daisyUI's components layer and
  would normally win, but the `!` makes this robust against daisyUI raising
  that selector's specificity in a future version.
- **Hover shadow.** `.btn` composes `box-shadow` from `--btn-inset` and
  `--btn-shadow`, and `.btn-ghost` zeroes both. A plain `shadow-lg` utility is
  overwritten by the composed value, so `shadow-lg!` is the only thing that
  survives. This is the same trick ChapterRail's panel uses.

`text-base-content/75` needs no `!` — nothing in daisyUI sets button text
colour at a specificity above a utility in the resting state.

### The hover lift

Both hovers lift rather than darken: instead of deepening in place, the control
takes the flat white of the surface behind it (ScrollySection's `data-scrolly`
block) and rises on a `shadow-lg`. The explicit `bg-white` is what keeps the
pill opaque as it rises, so the shadow reads as cast *by* it rather than
showing through it. Borrowed from ChapterRail's panel, so that "this is
interactive" is one gesture across the whole report.

## The exported PNG mirrors the page

`src/lib/utils/downloadFigure.js` redraws the source line and wordmark onto the
canvas rather than screenshotting them, so it carries its own colours. Both now
use the single `MUTED` constant (`rgba(34, 29, 24, 0.5)` = `base-content/50`),
matching the page. There is no underline and no button in the export — nothing
in a PNG is clickable, and the accent would be decoration there.

If you change the footer grey on the page, change `MUTED` too or the export
silently drifts.

## Porting to another branch

Copy `FigureFooter.svelte`'s two class strings across. The tokens resolve to
that branch's palette automatically, with one thing to check by hand:

**Does the branch's `accent` work as a *background* for ink text?** This
branch's accent (`#7d8597`) is 3.7:1 on white — light enough that a full-strength
fill still takes the near-black ink (4.5:1), which is why `accent-content` here
is that near-black. A branch whose accent is dark or heavily saturated (an
orange, a deep blue) inverts it: dark ink on the fill will fail contrast, and
`accent-content` must be white. Because the markup already says
`hover:text-accent-content`, that is a theme change, not a markup change — set
`--color-accent-content` correctly and both controls follow.

Also check the branch's own `mark.accent-mark` geometry before copying the
underline numbers — if its body copy is set smaller than 20px, the 1px/3px
caption values may already be close to the body rule and lose their distinction.

## The Interpretation button's glyph and label

Two things were changed after the fill landed, because a washed pill that is
easy to *see* still has to be easy to *understand*:

**The glyph moved from the 20px solid Heroicons set to the 24px stroke set.**
A filled disc with the shape knocked out of it reads as a stamp — it belongs to
an older generation of UI, and next to 12px text it shouts. At `stroke-width:
1.5` the glyph sits at the same visual weight as the label beside it. This is
the single biggest improvement of the two; if a branch keeps everything else,
keep this.

**The label went away entirely.** "Interpretation" took roughly a third of a
330px line on a phone, and even a two-word replacement crowded the `FIGURE 13`
eyebrow it shares that line with. The washed pill now carries the "this is
pressable" signal by itself, so the words were doing less work than the room
they cost. The button is a 24px circle with the glyph alone and an `aria-label`
for screen readers.

24px is the floor rather than a target — it already sits under the 44px touch
guidance, so do not shrink it further to buy more room.

The glyph is `bars-3-bottom-left` — three stacked rules. It was picked over the
obvious alternatives because it is the only one that says *there is writing
behind this*, which is what the button actually opens. An info circle says
"meta-information about the page"; a lightbulb says "tip"; sparkles now read as
"AI wrote this" more than "this is notable". If a branch does want a visible label —
a wider figure column, or an audience that will not try an unlabelled control —
a lightbulb with **"Takeaway"** is the translation-safe pairing.

## The two buttons stay in step

The device is deliberately identical in both places so the report has exactly
one way of saying "this is a control": same fill, same hover, same ink glyph.
The only difference is shape — PNG is a labelled pill, Interpretation a 24px
circle with no label, because it has to share a line with the `FIGURE 13`
eyebrow on a 330px phone.

The resting `bg-accent/25!` is therefore written in two files. There is no
shared class for it — a `@utility` in `tailwind.css` would be the tidier home
if a third control ever appears, but at two it is not worth the indirection.
Change one, change the other.

## Rejected alternatives

Five treatments were rendered live at ship size before this one was picked:

- **Solid accent at rest.** Unmistakably a button, but the loudest object in the
  figure's footer, on every figure.
- **Fill on hover only.** Quietest, but nothing signals clickability until the
  cursor is already on the control — it fails the actual brief.
- **Tint plus a 1px `base-content/15` hairline.** Shipped briefly. The edge does
  give the pill a crisper silhouette, but it also makes it the only outlined
  object on the page and reads as heavier than a figure caption should be.
  Strengthening the glyph turned out to buy the same legibility for less.
- **Underline on the button, like the wordmark.** Correct as a system, but a
  button that looks like a link still does not look like a button; the whole
  point was that this control *acts* rather than navigates.
- **A bright accent glyph on the tint.** Invisible at 1.24:1 — see above.
