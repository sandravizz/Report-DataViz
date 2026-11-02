// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order.
// File names carry the figure number shown on the page (1-down-rounds.js is
// Figure 1). A figure in a locked chapter has no number, so its file has no
// prefix; give it one when its chapter opens.
import downRounds from "./figures/1-down-rounds.js";
import postMoneyByStage from "./figures/post-money-by-stage.js";
import preMoneyAiVsNonAi from "./figures/2-pre-money-ai-vs-non-ai.js";
import capitalByRegion from "./figures/3-capital-by-region.js";

export const figures = {
  downRounds,
  postMoneyByStage,
  preMoneyAiVsNonAi,
  capitalByRegion,
};
