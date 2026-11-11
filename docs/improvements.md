# Improvements register

Every improvement to the report that could apply beyond the report it was
built for. One row each: when and where it was first built, whether it is
**general** (belongs in every report), and which branches have it today.

Started 2026-11-11 from the git history and the dated notes in the code.

## How to use it

- **General?** is Sandra's decision: `yes` (every report, old and new),
  `no` (this client only), `?` (not decided yet).
- When something new is built that might be reusable, add a row the same day.
- When a `yes` row is ported to another branch, tick that branch.
- A new report starts from the branch with the most ticks (today:
  `paris-demo`), not from `main`, which has not changed since 2026-08-27.

Branch columns: **main**, **tmpl** (`template`), **iw**, **kiel**
(`kiel-institute`), **fdl** (`findevlab`), **carta** (`carta-demo`),
**paris** (`paris-demo`). `iea` is retired and left out. ✓ = has it.

## Figure controls

| # | Improvement | First built | General? | main | tmpl | iw | kiel | fdl | carta | paris |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | CSV download beside PNG, as one split button | 2026-11-10, paris | yes | | | | | | | ✓ |
| 2 | Hairline outline buttons (outline = download, soft fill = opens something) | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 3 | Button labels roll letter by letter on hover (`RollText`) | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 4 | Interpretation button as an icon on phones | 2026-08-23, iw | ? | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 5 | Hover glide on controls (`hoverGlide`) | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |

## Charts

| # | Improvement | First built | General? | main | tmpl | iw | kiel | fdl | carta | paris |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 6 | Bloomberg-style axes: axis line with ticks, full years at the ends, ’yy between | 2026-09-30, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 7 | One tooltip card style for every figure (`tooltipCard`) | 2026-11-02, carta | ? | | | | | | ✓ | ✓ |
| 8 | Tooltip pins on tap or click (`tapTooltip`) | 2026-11-02, carta | ? | | | | | | ✓ | ✓ |
| 9 | "Same scale / Own scale" switch that eases the y axis | 2026-10-29, carta | ? | | | | | | ✓ | ✓ |
| 10 | Figures numbered in reading order, each showing its own number | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 11 | Figure data read from a CSV per figure (`parse-csv`) | 2026-07-09, main | ? | ✓ | | | | ✓ | ✓ | ✓ |
| 12 | Scroll-driven morph figure (map lines into charts) | 2026-11-10, paris | ? | | | | | | | ✓ |

## Page structure

| # | Improvement | First built | General? | main | tmpl | iw | kiel | fdl | carta | paris |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 13 | Three layers: chapter, sub-chapter, figure, with heading-less passages | 2026-09-28, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 14 | Highlights section between cover and first chapter | 2026-10-19, carta | ? | | | | | | ✓ | ✓ |
| 15 | Chapter divider band, under half a screen | 2026-10-27, carta | ? | | | | | | ✓ | ✓ |
| 16 | Ending screen: title, publisher line, two buttons | 2026-09-30, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 17 | Locked chapters: in the Index, greyed, not on the page | 2026-10-27, carta | ? | | | | | | ✓ | ✓ |
| 18 | Symmetric desktop layout: rail, centred figure, description column | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 19 | Skip link and `main` landmark (keyboard and screen readers) | 2026-09-16, fdl | ? | | | | | ✓ | ✓ | ✓ |

## Header, rail, footer

| # | Improvement | First built | General? | main | tmpl | iw | kiel | fdl | carta | paris |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 20 | Index sheet in the header (chapters and sub-chapters) | 2026-09-28, fdl | yes | | | | | ✓ | ✓ | ✓ |
| 21 | Header fixed at every size | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 22 | Chapter rail shows the current sub-chapter and its figures | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 23 | Footer as a slim bottom bar | 2026-09-29, fdl | ? | | | | | ✓ | ✓ | ✓ |

## Type

| # | Improvement | First built | General? | main | tmpl | iw | kiel | fdl | carta | paris |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 24 | Phone body 17px with 1.6 leading; 18px with 1.85 from tablet | 2026-09-30, fdl | ? | | | | | ✓ | ✓ | ✓ |
| 25 | Lede set exactly like the body on phones | 2026-10-27, carta | ? | | | | | | ✓ | ✓ |
| 26 | Tablet type tier between phone and desktop | 2026-09-16, fdl | ? | | | | | ✓ | ✓ | ✓ |

## Working knowledge (docs and skills)

| # | Improvement | First built | General? | main | tmpl | iw | kiel | fdl | carta | paris |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 27 | `report-copy` skill: how figure text is written | 2026-10-29, carta | ? | | | | | | ✓ | ✓ |
| 28 | `dataviz` skill: chart form, colour, marks | 2026-07-13, tmpl | ? | | ✓ | ✓ | | ✓ | ✓ | ✓ |
| 29 | `docs/house-style.md`: the written rulebook | 2026-08-23, main | ? | ✓ | | ✓ | | | | |

## How the ticks were found

Each tick is a text search for one tell-tale name or phrase in that branch's
code (for example `csv` in `FigureFooter.svelte`), and each date is the first
commit in which it appears. That finds whether a feature is present, not
whether it is the latest version of it; a ✓ on an older branch may be an
earlier form.
