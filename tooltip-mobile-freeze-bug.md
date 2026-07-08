# Bug: Tooltip freezes on screen when scrolling on mobile

**Package:** `layerchart`
**Version:** `2.0.0-next.65`
**Affected file:** `dist/components/tooltip/TooltipContext.svelte`

## Summary

On touch devices, if you tap/drag on a chart to trigger the tooltip and then continue the drag into a page scroll, the tooltip freezes in place at its last position instead of disappearing. It stays stuck on screen while the page scrolls underneath it. This reproduces on every chart using `TooltipContext`, since the show/hide logic is shared.

## Root cause

`TooltipContext.svelte` only wires up three pointer handlers to control tooltip visibility (lines 697–699):

```svelte
onpointerenter={onPointerEnter}
onpointermove={onPointerMove}
onpointerleave={onPointerLeave}
```

`hideTooltip()` (lines 418–434) is only ever called from `onPointerLeave` (or when `showTooltip` fails to locate data). On mobile, a touch starts by firing `pointerenter`/`pointermove`, which populates `tooltipState.x/y/data` (lines 407–411). When the user then drags far enough for the browser to hand the gesture off to native scrolling, the browser fires `pointercancel` on the element — **not** `pointerleave`. Since there is no `onpointercancel` (or `ontouchcancel`) handler anywhere in the component, `hideTooltip()` never runs, `tooltipState.isHoveringTooltipArea` stays `true`, and `tooltipState.data`/`x`/`y` are never cleared. The tooltip renders frozen at its last known position for the rest of the scroll gesture.

Confirmed via grep that `pointercancel` / `touchcancel` / `touchend` / `touchmove` do not appear anywhere in `TooltipContext.svelte` or the `Highlight.*` / `DefaultTooltip` components.

## Suggested fix

Add a `pointercancel` handler alongside the existing pointer handlers that immediately hides the tooltip (bypassing the normal hide delay, since the pointer is gone for good):

```svelte
function onPointerCancel(e: PointerEvent) {
  tooltipState.isHoveringTooltipArea = false;
  tooltipState.data = null;
}
```

```svelte
onpointerenter={onPointerEnter}
onpointermove={onPointerMove}
onpointerleave={onPointerLeave}
onpointercancel={onPointerCancel}
```

## Repro steps

1. Open any chart built with `layerchart`'s tooltip on a touch device (or Chrome DevTools mobile emulation with touch enabled).
2. Touch and hold on a data point so the tooltip appears.
3. Drag your finger to scroll the page.
4. Observe: the tooltip stays frozen on screen at its last position instead of dismissing, even as the page scrolls.
