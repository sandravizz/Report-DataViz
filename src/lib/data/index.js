// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order.
import incomeGap from "./figures/01-income-gap.js";
import workHours from "./figures/02-work-hours.js";
import incomeShares from "./figures/13-income-shares.js";

export const figures = {
  incomeGap,
  workHours,
  incomeShares,
};
