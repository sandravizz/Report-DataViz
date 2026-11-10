// STUDY (Sandra, 2026-11-10, "just to see it"): Figure 6's map-to-chart
// morph in TWO scrolls instead of three, alone in Chapter 3 so the two can be
// compared. Same data, lines and panels as Figure 6 (this file only changes
// how it starts):
//   start     only the six lines that become the small multiples, with
//             their stations and badges, over the arrondissements as a very
//             light grey base map with white borders (Figure 5's `base`);
//   scroll 1  the base map, stations and badges go together, one quick
//             timed fade — bare lines;
//   scroll 2  the lines morph into the small multiples, with the scroll, as
//             in Figure 6.
// MetroMorphPanel reads `linesOnly` (no other lines, base map on) and
// `stages` (this figure's own timings).
import parisMetroRidership from "./6-paris-metro-ridership.js";

export default {
  ...parisMetroRidership,
  linesOnly: true,
  // Alone in its section, so the hold is the whole run (ScrollySection):
  // 164vh = 2.05 steps of 80vh. The stages below are fractions of it —
  // change the two together. Each stage is its own scroll (Sandra,
  // 2026-11-10): the map pins and STAYS for a scroll, then the marks go,
  // the bare lines stay for a scroll, then the morph.
  holdVh: 164,
  stages: {
    marksOutAt: 0.244, //  0.5 step:  the six lines on the base map, pinned
    morphStart: 0.44, //   0.4 step:  the bare lines
    lineStagger: 0.0256, // the morph, ~0.8 step a line, as in Figure 6;
    lineDuration: 0.385, // the last lands at ~0.95
    frameStart: 0.93,
  },
  title: "Placeholder: Passengers by Métro Line (two-scroll study)",
};
