# Report Viz house style

The rules every report branch shares. Individual mechanisms have their own
explainer in `docs/`; this is the layer above them — the decisions that are
already settled, so a new report starts from them instead of re-deriving them.

## The branch model

`main` is the living template: it keeps evolving and every improvement lands
here first. A delivered report is frozen on its own branch (`iw`,
`kiel-institute`, `findevlab`, `iea`, …), each with its own Vercel project and
link. Branches are copies, not imports — the components are duplicated per
branch, so a shared improvement is applied branch by branch. `template` is the
SandraViz portfolio version.

Consequence: anything reusable is written as a **portable doc** in `docs/`, and
that doc travels with the change to each branch it is applied to.

## Layout

**Text is as tall as its text; figures are exactly one screen.** This is the
core rhythm and it is not negotiable. A chapter block is never `min-h-screen` —
a three-paragraph chapter is taller than a screen, a one-paragraph chapter is
much shorter, and nothing is padded out to fill space it does not need. Only the
figure surface pins: `sticky top-0 h-screen` in `ScrollySection.svelte`.

**One breakpoint for the scrolly system: `lg` (1024px).** Below it the reader
gets the stacked mobile layout, above it the pinned figure with its description
column. Every part of the system keys to the same line — chart, rail,
description column, chart chrome — so nothing changes shape at a width where
something else has not. The only exception is the Landing and Footer hero
blocks, which use `md` (768px) so an iPad gets the row layout.

**The chart sits at 40%, not centred.** `left-[40%]` with the description
column starting at `calc(40% + 464px)` (`ChartDisplay.svelte`,
`DescriptionColumn.svelte`). The asymmetry is what gives the annotation column
room without squeezing the plot.

## Surfaces and the fade

Two surfaces alternate down the page: the **chapter ground** (`base-100`) and
the **white figure surface**. The fade between them is painted as a gradient in
the chapter block's own background, never as a spacer div — see the comment
above `textSurface()` in `+page.svelte`. A band element can only lengthen the
fade by lengthening the *gap*; as a background the ramp costs no height at all,
so it can be as long as it likes with the text still sitting directly above its
figure. The stops are percentages, so the ramp scales with the chapter.

**Section backgrounds are never `lg:`-scoped.** A chapter's ground colour must
be the same on a phone as on a desktop, and must match the Footer's tint.
Scoping it to `lg` leaves mobile readers on a different-coloured page.

## Chrome

**The header is `absolute`, never `fixed` or `sticky`** — on every branch, no
exceptions. It belongs to the cover and scrolls away with it, leaving the
figures a clean full viewport. It is `z-20`, under the rail's `z-40`.

**The chapter rail is desktop-only** (`hidden lg:block`), lives in the *left*
gutter — the right belongs to the description column — and is hidden over the
Landing and the Footer. Charts get no dot of their own; they appear only nested
inside the hover panel, under their chapter. State model and dot styling:
[chapter-nav-states.md](chapter-nav-states.md).

**The accent dot cursor belongs to the cover, and nowhere else.**
`CursorDot.svelte`, mounted once at the top of `+page.svelte`, replaces the
system pointer over the Landing only — a 9px accent dot inside a 28px
`accent/35` halo, no lag and no animation. The scoping is the decision: the
cover is uniformly dark, so the accent reads at full strength with no rescuing
hairline, and it has no charts for a filled disc to cover and no running text to
lose an I-beam over. The report proper keeps the pointer the reader came with.
The zone is an attribute on Landing's root section, not an id in the component.
Inside it, links and buttons keep the system hand — the dot owns empty space
only, never an affordance.
The *paint* is decided per branch, because it is a contrast decision against
that branch's cover — the dot is whatever reads there, the halo is always the
accent at 35%. Table of what each branch uses, and why:
[cursor-dot.md](cursor-dot.md).

**The Table of Contents is a `<details>`, never a focus-driven dropdown.**
daisyUI's focus version holds its panel open with `:focus-within`, so on a phone
the first tap anywhere else is spent blurring the trigger and never reaches what
is under it — which is what made the cover's credit links need two taps and read
as blocked by the menu. `<details>` has no focus to spend, and daisyUI excludes
it from the closed-state rule because the element hides its own content. Restore
outside-tap closing with a `pointerdown` listener in the **capture** phase,
which closes the panel without consuming the tap.

**The landing fits one screen.** Cover type is sized against `vh` as well as
`vw` so it never pushes past the fold, and it does not repeat a logo the header
is already showing.

**The footer stays minimal**: the pitch block only. No client nav links, no
source or credit line, no decorative mark. These are demos, and the footer's job
is the pitch.

## Colour

**Colour means something.** Anything the reader is not meant to look at is a
grey, and all the greys come from one ramp carrying a trace of the ink's own hue
at 7–8% saturation — that is what keeps them reading as part of the palette
rather than as generic grey.

Role mapping when a new brand palette arrives: lightest → ground, darkest → ink,
axis grey derived from the ground's own hue, and **one colour reserved as the
accent**. The accent is spent only on things that *point* — underlines in
running text, hovered navigation, credit links — and is kept **out of
`colors.js`** so no chart series can ever pick it up.

**Never pure `#000000` for body text on a warm or tinted ground.** Tint the ink
toward the accent's hue family instead — on this branch `#1b4160`, IW's own
body text, a blue in the same family as the `#0069b4` accent — so the accent
never reads as a foreign object on the page.

**Two filled controls, one device.** The PNG button and the Interpretation
button both wear the accent as a *fill* — `bg-accent/25` at rest, full accent on
hover, the glyph one step stronger than the label — so the report has exactly
one way of saying "this is a control". Links take the accent as a *rule*
instead: 2px, at caption size as well as in running text. 1px was tried at
caption size — 11px text sits close to its baseline, so a thinner rule seemed
right — and abandoned: a hairline under small grey text reads as a smudge
rather than a link, and on a low-contrast accent it disappears outright. Whether the
hover keeps `text-base-content` or flips to `text-accent-content` is measured
per branch, never inferred from the hue — `kiel-institute`'s saturated orange
keeps the ink at 6.1:1 while white reaches only 2.9:1, and `iw`'s blue is the
other way round: [figure-footer-controls.md](figure-footer-controls.md).

## Type

**Grayscale antialiasing is on, in the base layer, on every branch.**
`-webkit-font-smoothing: antialiased` + `-moz-osx-font-smoothing: grayscale` on
`html` in `tailwind.css`. Browsers default to subpixel antialiasing, which
fringes every glyph edge with colour and reads as a smear at caption sizes.
Next.js scaffolds this for free by writing Tailwind's `antialiased` onto
`<body>`; SvelteKit scaffolds nothing, so it is written once by hand. On `html`
in `@layer base`, never as a utility on one element — a class can be missed by
whatever is added next, an inherited base rule cannot.

**Quiet text clears 4.5:1, and the alpha is computed per branch — never
copied.** Grayscale antialiasing draws glyphs a hair lighter, so faint text has
to carry enough contrast to still have an edge. `text-base-content/50` was the
old default and it fails everywhere: 2.70:1 on `iw`, 3.98:1 even on a
pure-black branch. But the replacement is not one number — `/50` is an alpha on
each branch's own ink, so `/70` rescues `iw`'s light navy and overshoots pure
black to 8.5:1, turning a quiet caption into near-body-weight grey. Compute the
smallest alpha clearing 4.5:1 against the surface the text sits on, round up to
the nearest 5. Controls stay one step above the captions beside them.

**Running text is the strongest ink on the page.** The chapter paragraphs, the
Interlude and the Footer pitch carry no alpha where the alpha was costing them:
`/80` beside a full-strength `DescriptionColumn` had the short annotation
reading stronger than the passage. The tell is selection — if a passage reads
better highlighted, it is under-inked. Measured per branch, not copied: below
~8:1 the alpha comes off, above it `/80` already reads, and on a pure-black
branch removing it would put `#000000` under long-form reading, which the
Colour rule above forbids.

Locked spec, the per-branch table, and the list of files it touches
(`downloadFigure.js`'s `MUTED` is the easy one to miss):
[type-rendering.md](type-rendering.md).

## Charts

**Trace the element to its LayerChart `props.<key>` hook before writing custom
styling or markup.** Hand-rolled markup next to a prop that already exists is
the main way these charts drift apart from each other.

**Digitized values draw, they do not claim.** A series pixel-traced off a source
PDF is good enough to render the shape of the chart. Every *number* that appears
in the copy comes from the source text, never off the trace.

**Numbers follow the source's own locale, and one file owns the rule.** Axis
labels, value labels and tooltips get it from `formatNumber` in
`src/lib/format.js`, which every chart panel routes its value formatter
through; hand-written copy (descriptions, annotation labels, chapter text) is
written to match by hand. Years are the exception everywhere and stay bare.

The locale is a per-branch decision, because it follows the source document,
not the reader. `main` is English and groups thousands with a comma (4,590).
**This branch is German**: a dot groups thousands and a comma marks the decimal
(4.590 and 0,8), which is the reverse of what a bare JS number renders — an
index value of 102.5 was reaching the axis as "102.5" on a page whose running
text writes "102,5".

## How work lands

Verification is visual and it is Sandra's. Agents do not start a dev server,
open a browser, or run a build to "check" a change — the change is finished in
the code, and Sandra eye-checks it on her own localhost.

Design options are **shown, not described**: for a font, colour, or image
choice, build a live rendered comparison rather than writing a paragraph about
the candidates.

Branch READMEs stay thin. Reusable mechanisms get a portable `docs/*.md`;
template-level documents live on `main`.
