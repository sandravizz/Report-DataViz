// One figure per file. To add a figure: copy an existing file in ./figures,
// register it here, and add it to a section's `charts` in +page.svelte —
// the sections there define the story order.
//
// Numbering follows the source report (Economic Outlook Nr. 133, 2026 | Q2),
// not the order figures appear here, so `figure3`/`figure4`/`figure5` still
// point at the reader's Figure 3, 4 and 5.
import worldTrade from "./figures/03-world-trade.js";
import industrialProduction from "./figures/04-industrial-production.js";
import rawMaterialPrices from "./figures/05-raw-material-prices.js";

export const figures = {
  worldTrade,
  industrialProduction,
  rawMaterialPrices,
};
