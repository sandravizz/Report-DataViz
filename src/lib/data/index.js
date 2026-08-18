// One figure per file, numbered to match the report. To add one: copy a file
// in ./figures, register it here, then list it in a section's `charts` in
// +page.svelte, which defines the story order.
import nationalIndex, { nationalIndexAnimatedSteps } from "./figures/01-national-index.js";

export const figures = {
  nationalIndex,
  nationalIndexAnimatedSteps,
};
