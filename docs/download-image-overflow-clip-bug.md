# Bug: `getChartImageBlob`/`downloadImage` clip labels that overflow the chart's SVG bounds

**Package:** `layerchart`
**Version:** `2.0.0-next.65`
**Affected file:** `dist/utils/download.js` (`getChartImageBlob`, `downloadImage`)
**Related file:** `dist/components/layers/Svg.svelte`

## Summary

Any chart whose marks render outside the `<Chart>`'s own nominal width/height — end-point labels on a line chart, a right-placed axis's tick text, anything relying on the "labels can leak past the edge" convention — gets that overflow hard-clipped when exported via `getChartImageBlob()` or `downloadImage()`. On the live page it's invisible because there's ambient page margin for it to spill into; in the standalone raster there isn't, so the last character or two of an edge-hugging label is simply cut off.

Reproduced across a whole report: bar charts (whose direct/total labels are positioned with deliberately reserved padding, safely inside the SVG's own box) exported clean, while every line chart (whose end-point value labels and right-side axis ticks routinely sit right at or past the SVG's declared width) exported with clipped text on that edge.

## Root cause

`dist/components/layers/Svg.svelte` (lines ~116–127, style block ~153–169) renders each chart's SVG layer like this:

```svelte
<svg
  bind:this={ref}
  {viewBox}
  width={ctx.containerWidth}
  height={ctx.containerHeight}
  class={['lc-layout-svg', className]}
  ...
>
```

```css
:where(.lc-layout-svg) {
  position: absolute;
  inset: 0;
  overflow: visible; /* match html and allow viewing outside of bounds (useful for axis that leak and general debugging)*/
  &.clip { overflow: hidden; }
}
```

`viewBox` is `undefined` unless a caller explicitly passes one, and `clip` defaults to `false`. So by default the SVG has no `viewBox` and `overflow: visible` — content positioned at coordinates outside `[0, containerWidth] × [0, containerHeight]` renders fine in the live DOM (the comment even says this is intentional: "useful for axis that leak").

`getChartImageBlob()` (`dist/utils/download.js`, ~line 104) sizes its capture from that same tight box:

```js
const layerRect = layers[0]?.getBoundingClientRect();
const cssWidth = layerRect?.width || container.clientWidth;
const cssHeight = layerRect?.height || container.clientHeight;
```

`getBoundingClientRect()` on an element with `overflow: visible` returns the element's own layout box, not the painted extent of its overflowing children — so `cssWidth`/`cssHeight` already excludes anything leaking past the edge. `drawSvgToCanvas()` then stamps `width`/`height` attributes onto the cloned SVG matching that same undersized box and rasterizes it as a standalone `<img>`. A standalone image has no surrounding page to leak into: `overflow: visible` has nowhere to paint outside the image's own intrinsic size, so the leaking content is simply absent from the decoded raster. The clipping happens at rasterization, not in the final `drawImage()` composite step.

## Suggested fix

Give `getChartImageBlob`/`downloadImage` an optional bleed/margin parameter that pads the capture beyond the tight layer rect, e.g.:

```js
export async function getChartImageBlob(container, options = {}) {
  const { background, format = 'png', quality = 0.92, bleed = 0 } = options;
  ...
  const cssWidth = (layerRect?.width || container.clientWidth) + bleed * 2;
  const cssHeight = (layerRect?.height || container.clientHeight) + bleed * 2;
  ...
  // when drawing each SVG layer, also expand its viewBox by `bleed` on every
  // side (shift origin by -bleed, add bleed*2 to width/height) so the extra
  // canvas actually reveals the overflowing content instead of just adding
  // blank padding.
}
```

Without a viewBox change to match, padding the canvas alone wouldn't help — the fix needs to expand the *coordinate space* being rasterized, not just the destination canvas size.

## Workaround (implemented here)

Since the public API doesn't expose this, this report's own export ([src/lib/utils/downloadFigure.js](../src/lib/utils/downloadFigure.js)) reimplements capture on top of the exported `getChartSvgString()` instead of `getChartImageBlob()`: it parses the returned SVG string, expands its `viewBox` by a 20px bleed on every side (shifting the origin by `-bleed` and growing width/height by `bleed * 2`), then rasterizes that widened SVG itself. The extra canvas is discarded by drawing the resulting bitmap offset by `-bleed` back into the final composite, so it only reveals genuine overflow rather than shifting anything's visible position.

## Repro steps

1. Build any `LineChart` (or a chart with a right-placed axis, e.g. `LineChartPanelMultiples`-style small multiples) where an end-point label or the last axis tick sits at/near the chart's right edge.
2. Call `downloadImage(chartRef, { filename: 'chart' })` (or `getChartImageBlob(chartRef)` directly).
3. Compare the exported PNG to the live chart: the rightmost character(s) of the edge-hugging label are missing in the export, present on screen.
