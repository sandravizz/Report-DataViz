// One figure per file, numbered to match the report's figure order. To add a
// figure: copy an existing file in ./figures, register it here, and add it to
// a section's `charts` in +page.svelte — the sections there define the story
// order.
import nationalIndex from "./figures/01-national-index.js";

export const figures = {
  nationalIndex,
};
