// One figure per file, numbered to match the report's figure order. To add a
// figure: copy an existing file in ./figures, register it here, and add it to
// a section's `charts` in +page.svelte — the sections there define the story
// order.
import regionalWorkforceChange from "./figures/01-regional-workforce-change.js";
import workforceGrowthIndex, {
  workforceGrowthIndexSteps,
} from "./figures/02-workforce-growth-index.js";
import southeastAsiaSteps from "./figures/03-southeast-asia-steps.js";
import workforceByRegion from "./figures/04-workforce-by-region.js";
import workforceBySectorSteps from "./figures/05-workforce-by-sector-steps.js";

export const figures = {
  regionalWorkforceChange,
  workforceGrowthIndex,
  workforceGrowthIndexSteps,
  southeastAsiaSteps,
  workforceByRegion,
  workforceBySectorSteps,
};
