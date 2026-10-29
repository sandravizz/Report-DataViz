// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order.
import capitalByYear from "./figures/01-capital-by-year.js";
import roundsByQuarter from "./figures/02-rounds-by-quarter.js";
import downRounds from "./figures/03-down-rounds.js";
import postMoneyByStage from "./figures/04-post-money-by-stage.js";
import aiShareOfCapital from "./figures/05-ai-share-of-capital.js";
import aiShareByMetro from "./figures/06-ai-share-by-metro.js";
import preMoneyAiVsNonAi from "./figures/07-pre-money-ai-vs-non-ai.js";
import capitalByRegion from "./figures/08-capital-by-region.js";

export const figures = {
  capitalByYear,
  roundsByQuarter,
  downRounds,
  postMoneyByStage,
  aiShareOfCapital,
  aiShareByMetro,
  preMoneyAiVsNonAi,
  capitalByRegion,
};
