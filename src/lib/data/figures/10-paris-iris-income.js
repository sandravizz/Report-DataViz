// Paris by IRIS: median income — the population maps' most detailed level
// (Figure 3's 992 units), on a second measure and in the GREEN ramp, so the
// change of colour says the measure changed.
//
// DATA (2026-11-15): median disposable income per consumption unit ("niveau
// de vie médian", DISP_MED21), INSEE Filosofi 2021, "Revenus, pauvreté et
// niveau de vie en 2021 (Iris)" (insee.fr/fr/statistiques/8229323). 2021 is
// the last Filosofi year: INSEE did not produce 2022. Disposable income is
// after taxes and benefits; "per consumption unit" divides a household's
// income by its size (1 for the first adult, 0.5 per further person of 14+,
// 0.3 per child), so households of different sizes compare.
// 128 of the 992 units have no published figure (too few households, or
// statistical secrecy: parks, the Seine, office districts); their CSV cell
// is empty and the map draws them grey.
//
// The file is numbered 10 (the next free number); on the page it is
// Figure 4, numbered by reading order in +page.svelte.
//
// Boundaries: as Figure 3 (IGN/INSEE IRIS 2024).
import csv from "./csv/10-paris-iris-income.csv?raw";
import geojson from "../geo/paris-iris.json";
import { choropleth } from "./choropleth.js";
import { sequentialGreen } from "$lib/colors";

export default {
  ...choropleth(geojson, csv, "iris", { valueKey: "median_income", domain: [10000, 60000], label: "Median income" }),
  palette: sequentialGreen,
  legendTitle: "Median income, € per year",
  legendFormat: (v) => `${v / 1000}k`,
  valuePrefix: "€",
  title: "Median Income by IRIS",
  subtitle: "Median Disposable Income per Consumption Unit, 2021, in €",
  description:
    "Income splits Paris west from east: the greens deepen towards the 7th, 8th and 16th arrondissements and pale towards the north and east. The gap is wide, the richest units’ median income is more than four times the poorest’s. Grey units have no published figure.",
  source: "Source: INSEE, Filosofi 2021; map © IGN/INSEE",
  strokeWidth: 0.4,
};
