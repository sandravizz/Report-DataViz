// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order. Files not registered here
// (01-equity-share-area, 05-ida-loans-area) are building blocks of the
// composite figures 04 and 07.
import balanceSheetTotalArea from "./figures/00-balance-sheet-total-area.js";
import equityShare from "./figures/01-equity-share.js";
import idaObjective from "./figures/02-ida-objective.js";
import balanceEquityDouble from "./figures/04-balance-equity-double.js";
import { idaLoansAreaSteps } from "./figures/07-ida-loans-area-steps.js";

export const figures = {
  balanceSheetTotalArea,
  equityShare,
  idaObjective,
  idaLoansAreaSteps,
  balanceEquityDouble,
};
