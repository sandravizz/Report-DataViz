// THE MÉTRO STORY (Sandra, 2026-11-14): one pinned figure that opens the
// métro chapter and plays Figure 6's map-to-chart morph BACKWARDS, with two
// stages in front of it (`kind: "metro-story"`, MetroStoryPanel.svelte):
//   start     the whole métro as ONE black line, 2000–2025, with its events;
//   scroll    the x axis stretches to 2007–2025, where the lines' data starts;
//   scroll 1  that line splits: a copy per métro line moves to the line's own
//             values and takes its colour — every line in one chart;
//   scroll 2  the lines part into the small multiples;
//   scroll 3  each line leaves its panel and rolls back onto the map;
//   scroll 4  the stations and the badges come in (no grey city shapes);
//   scroll 5  the street map (the landing page's OpenStreetMap streets)
//             comes in behind the lines;
//   scroll 6  only line 1 stays, with its stations as equal dots, named;
//   scroll 7  each dot grows to the station's entries in 2025, with a
//             size legend;
//   scroll 8  line 4 joins, its stations sized the same way;
//   then      the map travels, the text beside the figure changing at
//             every stop (`notes`): it zooms in on Cité, moves on to
//             Montparnasse, zooms out as line 14 arrives, zooms in on
//             Saint-Lazare and out again;
//   last      every line and every station, for the reader to explore
//             (`explore`): circles by entries, a switch for them, click a
//             station to zoom in.
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
// EVERY métro station inside Paris (244), for the last state (`explore`):
// the same source and the same sums as above, for all lines (made
// 2026-11-14 from data-rf-2025.zip; stations matched to the source's stops
// through the stop areas of IDFM's "Emplacement des gares", `source_name`
// again the stop's LIBELLE_ARRET).
// - `lines`: every line at the station, space-separated.
// - `line`: THE DOMINANT LINE, whose colour the circle takes. The source
//   counts entries per STATION, not per line, so "the line that takes most
//   of the passengers" cannot be read from it. Stand-in: of the lines that
//   stop there, the one with the most trips in 2025 (metro-trips.js; 3bis
//   and 7bis, which the source folds into 3 and 7, rank last).
// - Cluny-La Sorbonne has no count of its own in the source's métro stops
//   (blank): it is drawn as a plain dot and says so in its tooltip.
import allStationsCsv from "./csv/8-paris-metro-all-stations.csv?raw";

// The CSV's line numbers parse as numbers; the map's are strings.
const stations = parseFigureCsv(stationsCsv).map((d) => ({ ...d, line: String(d.line) }));
const rows = parseFigureCsv(csv).map((d) => ({ ...d, line: String(d.line) }));

// The figure's length in scrolls of 80vh, and a stage's place in it: the
// figure progress (0 → 1) after `steps` scrolls.
const STEPS = 16;
const at = (steps) => steps / STEPS;

export default {
  kind: "metro-story",
  // The map the figure ends on (Figure 5), the lines prepared for the morph
  // and the panel order and colours: all as in Figure 6.
  // Its base map and framing leave out the two woods (paris-city.js),
  // so the métro fills more of the figure.
  map: { ...parisMetroRidership.map, base: parisCity, fit: parisCity },
  // NO GREY CITY SHAPES behind the lines (Sandra, 2026-11-14): once the
  // lines are back on the map their stations and badges arrive on the plain
  // ground, and the next scroll brings the street map. (Leave this out to
  // get the arrondissements back as a step between the two.)
  baseMap: false,
  tracks: parisMetroRidership.tracks,
  groups: parisMetroRidership.groups,
  colors: parisMetroRidership.colors,
  groupLabel: parisMetroRidership.groupLabel,
  // Alone in its section, so the hold is the whole run (ScrollySection):
  // STEPS scrolls of 80vh. Every stage is written as `at(steps scrolled
  // before it)`, so adding a scroll means adding to STEPS and to the list.
  // Each move is about one scroll, with a rest between.
  holdVh: STEPS * 80,
  stages: {
    stretchStart: at(0.4), // the total 2000–2025, pinned
    stretchEnd: at(1), //     the x axis stretches to start in 2007
    linesStart: at(1.45), //  the total, 2007–2025
    linesEnd: at(2.05), //    one line becomes all the lines
    panelsStart: at(2.5), //  all lines in one chart
    panelsEnd: at(3.15), //   they part into the small multiples
    mapStart: at(3.65), //    the small multiples
    mapEnd: at(4.85), //      the lines roll back onto the map
    marksInAt: at(5.25), //   the bare lines; then their stations and badges
    streetsInAt: at(6.15), // the métro alone; then the street map comes in under it
    focusAt: at(7.1), //      the street map; then only `focus.lines` stay
    sizeAt: at(8.07), //      the line and its stations; then the dots take
    //                        their size
    //                        (then `focus.more` join one by one, and the
    //                        map's stops follow: `focus.zoom`)
  },
  // The last three states: only `lines` stay, their stations named; then
  // each station's dot is sized by `valueKey` (area, not radius); then the
  // `more` lines come back with their stations, sized at once. ONE size
  // scale for all of them (its top is the biggest station of all, Saint-
  // Lazare), so line 1's circles do not change when the others arrive.
  focus: {
    lines: ["1"],
    // The lines that come back after line 1, one scroll each (Sandra,
    // 2026-11-14: first one line, then the other).
    more: [
      { line: "4", at: at(9.06) },
      { line: "14", at: at(12.06) },
    ],
    stations,
    lineKey: "line",
    nameKey: "station",
    valueKey: "validations",
    legendTitle: "Entries in 2025, in Millions",
    tooltipLabel: "Entries in 2025",
    // Two steps keep the legend small (a third, 40 million, doubled its height).
    legendValues: [5e6, 20e6],
    // On the whole map only stations with at least this many entries are
    // named (13 of the 53); zoomed in, every station on screen is.
    labelMin: 9e6,
    // THE MAP TRAVELS (Sandra, 2026-11-14, after subwaystories.nyc): one
    // scroll per stop. The map zooms in on a station (its name as in the
    // stations CSV), `scale` times closer (up to 8), and stays; the next
    // stop takes it on to the next station; a stop without a station shows
    // the whole map again. Each stop has its text in `notes` below.
    zoom: [
      // Line 4's two stops, then out again as line 14 arrives, then line 14's.
      { at: at(10.06), station: "Cité", scale: 4 },
      { at: at(11.06), station: "Montparnasse-Bienvenüe", scale: 4 },
      { at: at(12.06) },
      { at: at(13.06), station: "Saint-Lazare", scale: 4 },
      { at: at(14.06) },
    ],
  },
  // THE LAST STATE, after the story (MetroStoryPanel's `exploring`): all
  // lines, every station a circle, a switch for the circles, click to zoom.
  explore: {
    at: at(15.06),
    stations: parseFigureCsv(allStationsCsv),
    lineKey: "line",
    nameKey: "station",
    valueKey: "validations",
    scale: 4,
  },
  title: "The Métro, Line by Line",
  subtitle: "Trips per Year From 2000 to 2025, in Millions",
  // THE STORY'S TEXT, one note per state (lib/figure-progress.js): the text
  // beside the figure changes as the scroll passes each `at`. A DRAFT
  // (2026-11-14) for Sandra to rewrite. `description` below stays as the
  // one-text version.
  // WHERE EACH CLAIM COMES FROM:
  // - the trips: metro-trips.js;
  // - the stations: the 2025 entries in the stations CSV (Saint-Lazare
  //   41.0m, Montparnasse 31.3m — line 4's largest —, Châtelet 13.1m,
  //   Bastille 11.5m, Hôtel de Ville 10.9m, Cité 2.1m, third lowest on
  //   line 4);
  // - THE HISTORY (Sandra, 2026-11-14: say what each line is for), checked
  //   2026-11-14 against RATP's heritage pages and Wikipedia:
  //   line 1 opened 19 July 1900 between Porte de Vincennes and Porte
  //   Maillot, for the Universal Exhibition; the city wanted a network
  //   serving only the inner city
  //   (ratp.fr/en/discover/heritage/history-metro-line-1,
  //   en.wikipedia.org/wiki/Paris_Métro);
  //   line 4 was the first to cross the Seine underground, its two halves
  //   joined on 9 January 1910, it serves Gare du Nord, Gare de l'Est and
  //   Montparnasse, and Cité is the only station on an island
  //   (ratp.fr/en/discover/heritage/history-metro-line-4, …/history-cite-station);
  //   line 14 opened on 15 October 1998, the first new line since the
  //   1930s, automatic from the start, to relieve the saturated east–west
  //   axis (line 1 and RER A)
  //   (ratp.fr/en/discover/heritage/history-metro-line-14).
  notes: [
    {
      at: 0,
      text: "Métro traffic grew through the 2000s, held level for a decade at around 1.5 billion trips a year, was halved by the pandemic and is back at that level today.",
    },
    {
      at: at(1.45),
      text: "Line by line the recovery is uneven: line 14, extended twice, carries far more than before, while most of the older lines sit a little below where they were.",
    },
    {
      at: at(4.85),
      text: "The same lines, back where they run. The trips are counted per line; the map can show where people enter the network.",
    },
    {
      at: at(7.1),
      text: "Line 1 was the first. It opened in July 1900 for the World's Fair and ran, as it does on this map, from Porte Maillot to Porte de Vincennes: the city wanted a métro that served Paris itself and stopped at its edge.",
    },
    {
      at: at(8.07),
      text: "Sized by the entries counted at their gates in 2025, the stations in the centre stand out: Châtelet, Bastille and Hôtel de Ville lead the line.",
    },
    {
      at: at(9.06),
      text: "Line 4 followed, and in 1910 became the first to pass under the Seine. It runs from north to south and links three railway stations: Gare du Nord, Gare de l'Est and Montparnasse.",
    },
    {
      at: at(10.06),
      text: "Under the river it stops once, at Cité: the only métro station on an island, and one of the quietest on the line.",
    },
    {
      at: at(11.06),
      text: "Montparnasse-Bienvenüe is the opposite: the busiest station on line 4, far ahead of every stop around it.",
    },
    {
      at: at(12.06),
      text: "Line 14 opened in 1998, the first new line since the 1930s and driverless from its first day. It was built to relieve the crowded east–west axis that line 1 serves.",
    },
    {
      at: at(13.06),
      text: "Its station at Saint-Lazare is the busiest on the map, with about 41 million entries in a year, roughly three times as many as Châtelet.",
    },
    {
      at: at(14.06),
      text: "Three lines, built almost a century apart, show the same thing: the métro fills up where the trains arrive, and the stops between two big stations stay small.",
    },
    {
      at: at(15.06),
      text: "Now the whole network: every station sized by its entries in 2025, in the colour of the busiest line that stops there. Point at a station for its name and number, click it to zoom in, and click anywhere else to zoom out.",
    },
  ],
  description:
    "Métro traffic grew through the 2000s, held level for a decade at around 1.5 billion trips a year, was halved by the pandemic and is back at that level today. Line by line the recovery is uneven: line 14, extended twice, carries far more than before, while most of the older lines sit a little below where they were.",
  source,
  sourceUrl,
  // Short on the page (Sandra, 2026-11-14). The trips, the métro lines and
  // the station entries are all Île-de-France Mobilités (the link); the note
  // keeps the two credits the ODbL asks for: the boundaries (Paris Open
  // Data) and the streets, water and parks (OpenStreetMap). The datasets
  // and licences in full: the comments above and metro-trips.js.
  sourceNote: "; map © Paris Open Data, © OpenStreetMap contributors",
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
  // (No "Strikes" at 2007, Sandra 2026-11-14.)
  events: [
    { year: 2020, label: "Covid-19" },
    { year: 2024, label: "Olympics", drop: 44 },
  ],
};
