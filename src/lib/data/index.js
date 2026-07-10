// One figure per file. To add a figure: copy an existing file in ./figures,
// adjust it, and add it here — the order of this array is the story order.
import incomeGap from "./figures/01-income-gap.js";
import workHours from "./figures/02-work-hours.js";
import incomeShares from "./figures/13-income-shares.js";

// Figures are picked by name in +page.svelte.
export const figures = {
  incomeGap,
  workHours,
  incomeShares,
};

export const data = Object.values(figures);
