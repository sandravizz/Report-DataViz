// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order.
import equityShare from "./figures/01-equity-share.js";
import idaObjective from "./figures/02-ida-objective.js";
import idaLoans from "./figures/03-ida-loans.js";

export const figures = {
  equityShare,
  idaObjective,
  idaLoans,
};
