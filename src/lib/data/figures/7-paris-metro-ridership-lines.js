// STUDY (Sandra, 2026-11-10, "just to see it"): Figure 6's map-to-chart
// morph over a base map, alone in its chapter so the two can be compared.
// Same data, lines and panels as Figure 6; this file only changes how it
// starts and its timings:
//   start     the lines with their stations and badges, over the
//             arrondissements as a very light grey base map with white
//             borders (Figure 5's `base`);
//   scroll 1  the base map, stations and badges go together, one quick
//             timed fade — bare lines;
//   scroll 2  the lines morph into the small multiples, with the scroll.
// Since all lines morph (2026-11-11), the base map (`baseMap`) is the only
// difference in look from Figure 6.
import parisMetroRidership from "./6-paris-metro-ridership.js";

export default {
  ...parisMetroRidership,
  baseMap: true,
  // Alone in its section, so the hold is the whole run (ScrollySection):
  // 164vh = 2.05 steps of 80vh. The stages below are fractions of it —
  // change the two together. Each stage is its own scroll (Sandra,
  // 2026-11-10): the map pins and STAYS for a scroll, then the marks go,
  // the bare lines stay for a scroll, then the morph.
  holdVh: 164,
  stages: {
    marksOutAt: 0.244, // 0.5 step: the lines on the base map, pinned
    morphStart: 0.44, //  0.4 step: the bare lines
    morphEnd: 0.95, //    ~1 step:  the lines move; the last one lands here
  },
  title: "Placeholder: Passengers by Métro Line (base-map study)",
};
