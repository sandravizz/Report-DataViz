// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order.
import balanceSheetTotal from "./figures/00-balance-sheet-total.js";
import balanceSheetTotalArea from "./figures/00-balance-sheet-total-area.js";
import equityShare from "./figures/01-equity-share.js";
import equityShareArea from "./figures/01-equity-share-area.js";
import idaObjective from "./figures/02-ida-objective.js";
import idaLoans from "./figures/03-ida-loans.js";
import balanceEquityDouble from "./figures/04-balance-equity-double.js";
import idaLoansArea from "./figures/05-ida-loans-area.js";
import idaLoansAreaLegend from "./figures/06-ida-loans-area-legend.js";

export const figures = {
  balanceSheetTotal,
  balanceSheetTotalArea,
  equityShare,
  equityShareArea,
  idaObjective,
  idaLoans,
  idaLoansArea,
  idaLoansAreaLegend,
  balanceEquityDouble,
};
