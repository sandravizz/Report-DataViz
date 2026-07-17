// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order.
//
// The 00-05 files are the previous edition's IDA figures, kept as the
// template library; the IEA report (Chapter 1) figures live in 10-14.
import balanceSheetTotal from "./figures/00-balance-sheet-total.js";
import balanceSheetTotalArea from "./figures/00-balance-sheet-total-area.js";
import equityShare from "./figures/01-equity-share.js";
import equityShareArea from "./figures/01-equity-share-area.js";
import idaLoans from "./figures/03-ida-loans.js";
import balanceEquityDouble from "./figures/04-balance-equity-double.js";
import idaLoansArea from "./figures/05-ida-loans-area.js";
import regionalWorkforceChange from "./figures/10-regional-workforce-change.js";
import workforceGrowthIndex from "./figures/11-workforce-growth-index.js";
import southeastAsiaSteps from "./figures/12-southeast-asia-steps.js";
import workforceByRegion from "./figures/13-workforce-by-region.js";
import workforceBySectorSteps from "./figures/14-workforce-by-sector-steps.js";

export const figures = {
  balanceSheetTotal,
  balanceSheetTotalArea,
  equityShare,
  equityShareArea,
  idaLoans,
  idaLoansArea,
  balanceEquityDouble,
  regionalWorkforceChange,
  workforceGrowthIndex,
  southeastAsiaSteps,
  workforceByRegion,
  workforceBySectorSteps,
};
