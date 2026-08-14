// One figure per file, numbered to match the report. To add one: copy a file in
// ./figures, register it here, and add it to a section's `charts` in
// +page.svelte, where the story order lives.
import regionalWorkforceChange from "./figures/01-regional-workforce-change.js";
import { workforceGrowthIndexSteps } from "./figures/02-workforce-growth-index.js";
import southeastAsiaSteps from "./figures/03-southeast-asia-steps.js";
import {
  workforceByRegionA,
  workforceByRegionB,
} from "./figures/04-workforce-by-region.js";
import workforceBySectorSteps from "./figures/05-workforce-by-sector-steps.js";

export const figures = {
  regionalWorkforceChange,
  workforceGrowthIndexSteps,
  southeastAsiaSteps,
  workforceByRegionA,
  workforceByRegionB,
  workforceBySectorSteps,
};
