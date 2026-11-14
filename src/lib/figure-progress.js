// A pinned figure's own scroll progress, and the text that goes with it.
// Shared by ChartDisplay (the figure, the phone's Interpretation sheet) and
// DescriptionColumn (the text beside the figure), so both read the scroll
// the same way.

// A figure's scroll progress, 0 → 1, for scroll-driven panels (the métro
// morph and story). It starts when the figure goes active (half a step
// before its anchor) and reaches 1 at the anchor — or, for a section's LAST
// figure, half a step before the end of the hold, so the figure plays
// through the hold and its last state still gets half a step of dwell.
// `position` is ScrollySection's stepPosition, `count` the figures in the run.
export function figureProgress(i, count, position, holdSteps = 0) {
  const start = i - 0.5;
  const end = i === count - 1 ? i + Math.max(0, holdSteps - 0.5) : i;
  return end > start ? Math.min(1, Math.max(0, (position - start) / (end - start))) : 1;
}

// A STORY FIGURE'S TEXT (Sandra, 2026-11-14, after subwaystories.nyc): a
// figure may carry `notes`, [{ at, text }] in scroll order, instead of one
// description — the text beside it changes as the figure moves from state
// to state. `at` is the figure progress from which a note shows; the note
// in force is the last one whose `at` has been passed. −1 without notes.
export function noteIndex(pair, progress) {
  if (!pair.notes?.length) return -1;
  let current = 0;
  pair.notes.forEach((note, k) => {
    if (progress >= note.at) current = k;
  });
  return current;
}

// The text to show for a figure right now: its current note, else its
// description.
export function figureText(pair, progress) {
  const k = noteIndex(pair, progress);
  return k < 0 ? pair.description : pair.notes[k].text;
}
