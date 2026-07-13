# Stacked column & bar charts — decision rules

Distilled from Datawrapper Academy's "What to consider when creating stacked
column charts", rewritten as what-to-do-when rules. Apply these whenever a
figure stacks segments on a shared bar.

## First: should this be a stacked chart at all?

Ask what the reader must compare. Stacking gives only **one** clean baseline
(the bottom of the bar), so:

- **Total + ONE part matter** → stack. Put that one part at the bottom.
- **Reader must compare SEVERAL parts across bars** → don't stack. Middle
  segments float on ragged baselines and can't be compared. Use grouped/split
  bars, small multiples (one small chart per category), or lines.
- **The story is one series overtaking another** → use a line chart; crossing
  lines show a takeover far more intuitively than shifting stack heights.
- **The total isn't actually interesting** → skip the stack entirely; lines
  per category are faster to read.
- **Time series with UNEQUAL intervals** (e.g. 2010, 2012, 2013, 2019) →
  columns misrepresent the spacing; use an area or line chart on a time axis.

## How many bars, which orientation

- Keep it to **~10 columns or fewer**. More than that → rotate to horizontal
  stacked bars, or use a dot plot or table.
- **Long category labels** → horizontal bars (labels sit on the left, room to
  breathe). Short labels like years → vertical columns are fine.

## Segment order and emphasis

- **The most important series goes at the bottom**, sitting on the shared
  baseline — that is the only segment readers can judge accurately. Give it
  the standout color; de-emphasize the rest (grays/muted steps).
- Order is a storytelling decision, not alphabetical. If the figure's title
  claims something about series X, X must be the bottom segment.
- **100% stacking creates a second baseline at the top.** With two series (or
  a most-important + second-most-important pair), put #1 on the bottom
  baseline and #2 against the top edge — both become readable. Prefer this
  whenever shares matter more than absolute levels.
- If absolute totals ALSO carry a story that 100% stacking hides, don't cram
  both into one figure — pair the share chart with a companion total/absolute
  chart (this report does exactly that: Figure 1 totals, Figure 2 shares).

## What goes into the stack

- **Every part of the whole is included** — segments must genuinely sum to
  the total, or the bar height lies.
- **Never include the total itself as a segment.**
- **Many tiny slivers** → merge them into a single "Other" segment (muted
  color, top of the stack). Slivers add clutter, not information.

## Labeling

- **Prefer direct labels over a legend** when segment count allows it: name
  each series right next to its segment on the first or last bar. A legend
  forces eye travel and a mental color-matching step.
- If direct labels are used, place them in stack order (top segment's label
  highest) so label order and visual order agree.
- Fall back to a legend only when segments are too many/thin to label, or the
  layout is too narrow (mobile) — and then order the legend to match the
  stack, not alphabetically.
- Keep annotation callouts on the segment boundary that carries the story
  (peak, trough, crossing) — they do the explaining a legend can't.
