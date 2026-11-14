// THE MÉTRO STORY (Sandra, 2026-11-14): one pinned figure that opens the
// métro chapter and plays Figure 6's map-to-chart morph BACKWARDS, with two
// stages in front of it (`kind: "metro-story"`, MetroStoryPanel.svelte):
//   start     the whole métro as ONE black line, 2000–2025, with its events;
//   scroll 1  that line splits: a copy per métro line moves to the line's own
//             values and takes its colour — every line in one chart;
//   scroll 2  the lines part into the small multiples;
//   scroll 3  each line leaves its panel and rolls back onto the map;
//   scroll 4  the base map, the stations and the badges come in;
//   scroll 5  the street map (the landing page's OpenStreetMap streets)
//             takes the base map's place behind the lines;
//   scroll 6  only line 1 stays, with its stations as equal dots, named;
//   scroll 7  each dot grows to the station's entries in 2025, with a
//             size legend;
//   scroll 8  lines 4 and 14 join, their stations sized the same way.
// The lines, their colours, the panels and the map are Figure 6's and
// Figure 5's own. Data and caveats: metro-trips.js.
import csv from "./csv/8-paris-metro-story.csv?raw";
import { parseFigureCsv } from "./parse-csv.js";
import parisMetroRidership from "./6-paris-metro-ridership.js";
import { source, sourceUrl } from "./metro-trips.js";
import { parisCity } from "./paris-city.js";
// The stations of lines 1, 4 and 14 inside Paris, in line order, with the
// validations counted at each in 2025 (a station on two of them is listed
// under each, with the same number). FROM: Île-de-France Mobilités, "Historique des données de
// validation sur le réseau ferré", data-rf-2025.zip, the four
// 2025_Tn_NB_FER.xlsx (validations per day, stop and ticket type), summed
// over the year for the métro network's stops (CODE_STIF_TRNS 100,
// CODE_STIF_RES 110); `source_name` is the stop's LIBELLE_ARRET. Licence ODbL.
// WHAT IT COUNTS — read before writing copy:
// - ENTRIES only: a ticket or pass validated at the station's métro gates.
//   Nobody validates on the way out, so exits are not in it, nor are
//   changes between lines.
// - The WHOLE station, all its métro lines together, not line 1's share.
// - The métro gates only: the RER's validations at Châtelet-Les Halles,
//   Gare de Lyon, Nation and Étoile are separate stops and left out, as is
//   "Les Halles" (line 4) and "Châtelet" are two stops in the source and
//   stay two here.
// - Bastille is two rows in the source (its ID_ZDC changed during the year);
//   they are added.
import stationsCsv from "./csv/8-paris-metro-stations.csv?raw";

// The CSV's line numbers parse as numbers; the map's are strings.
const stations = parseFigureCsv(stationsCsv).map((d) => ({ ...d, line: String(d.line) }));
const rows = parseFigureCsv(csv).map((d) => ({ ...d, line: String(d.line) }));

export default {
  kind: "metro-story",
  // The map the figure ends on (Figure 5), the lines prepared for the morph
  // and the panel order and colours: all as in Figure 6.
  // Its base map and framing leave out the two woods (paris-city.js),
  // so the métro fills more of the figure.
  map: { ...parisMetroRidership.map, base: parisCity, fit: parisCity },
  tracks: parisMetroRidership.tracks,
  groups: parisMetroRidership.groups,
  colors: parisMetroRidership.colors,
  groupLabel: parisMetroRidership.groupLabel,
  // Alone in its section, so the hold is the whole run (ScrollySection):
  // 720vh = 9 steps of 80vh. The stages below are fractions of it — change
  // the two together. Each move is about one scroll, with a rest between.
  holdVh: 720,
  stages: {
    linesStart: 0.044, // 0.4 step: the total, pinned
    linesEnd: 0.111, //   0.6 step: one line becomes all the lines
    panelsStart: 0.161, // 0.45 step: all lines in one chart
    panelsEnd: 0.234, //  0.65 step: they part into the small multiples
    mapStart: 0.289, //   0.5 step: the small multiples
    mapEnd: 0.422, //     1.2 steps: the lines roll back onto the map
    marksInAt: 0.467, //  0.4 step: the bare lines; then base map, stations, badges
    streetsInAt: 0.567, // 0.9 step: that map; then the streets replace the base
    focusAt: 0.672, //    0.95 step: the street map; then only `focus.lines` stay
    sizeAt: 0.78, //      0.97 step: the line and its stations; then the dots
    //                    take their size
    moreAt: 0.89, //      1 step: line 1 sized; then `focus.more` join
    //                    (1 step more on that, to the end)
  },
  // The last three states: only `lines` stay, their stations named; then
  // each station's dot is sized by `valueKey` (area, not radius); then the
  // `more` lines come back with their stations, sized at once. ONE size
  // scale for all of them (its top is the biggest station of all, Saint-
  // Lazare), so line 1's circles do not change when the others arrive.
  focus: {
    lines: ["1"],
    more: ["4", "14"],
    stations,
    lineKey: "line",
    nameKey: "station",
    valueKey: "validations",
    legendTitle: "Entries in 2025, in Millions",
    tooltipLabel: "Entries in 2025",
    legendValues: [5e6, 20e6, 40e6],
  },
  title: "The Métro, Line by Line",
  subtitle: "Trips per Year From 2000 to 2025, in Millions",
  description:
    "Métro traffic grew through the 2000s, held level for a decade at around 1.5 billion trips a year, was halved by the pandemic and is back at that level today. Line by line the recovery is uneven: line 14, extended twice, carries far more than before, while most of the older lines sit a little below where they were.",
  source,
  sourceUrl,
  sourceNote: "; map: Île-de-France Mobilités (Licence Ouverte), boundaries © Paris Open Data (ODbL), streets, water and parks © OpenStreetMap contributors (ODbL); station entries: Île-de-France Mobilités, validations sur le réseau ferré 2025 (ODbL)",
  // The whole network (2000–2025) and the lines (2007–2025), in one CSV.
  total: rows.filter((d) => d.line === "Total"),
  data: rows.filter((d) => d.line !== "Total"),
  csv,
  xKey: "year",
  yKey: "passengers",
  groupKey: "line",
  // Named on the total line, each under its point. Covid and the Olympics
  // are in the source's own "faits marquants"; the autumn 2007 pension
  // strikes are not (RATP's 2007 results: growth would have been about 3%
  // without them). `drop` is how far under the point the label sits: the
  // Olympics' goes further, clear of the climb out of 2020.
  events: [
    { year: 2007, label: "Strikes" },
    { year: 2020, label: "Covid-19" },
    { year: 2024, label: "Olympics", drop: 44 },
  ],
};
