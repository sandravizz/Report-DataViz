// One figure per file. To add a figure: create a file in ./figures (its data
// as a CSV in ./figures/csv, read through parse-csv.js), register it here,
// and add it to a sub-chapter's `charts` in +page.svelte — the sections there
// define the story order. File names carry the figure number shown on the
// page (1-<name>.js is Figure 1).
//
import parisArrondissements from "./figures/1-paris-arrondissements.js";
import parisQuartiers from "./figures/2-paris-quartiers.js";
import parisIris from "./figures/3-paris-iris.js";
import petiteCouronne from "./figures/4-petite-couronne.js";

export const figures = {
  parisArrondissements,
  parisQuartiers,
  parisIris,
  petiteCouronne,
};
