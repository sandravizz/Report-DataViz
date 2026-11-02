// TAP TOOLTIP: a chart's tooltip pins on click/tap instead of living only
// while the pointer is over the chart. Click a bar (or a point in time) and
// its tooltip stays; click another and it switches there; click anywhere
// else (empty plot space beside or above a bar included) and it goes. On a phone, where a tap is all there is, this
// is what makes the tooltip readable at all: LayerChart's default hides it
// again the moment the finger lifts.
//
// Built only from LayerChart's own TooltipContext options: `locked` (keep
// the tooltip, ignore pointer moves and leaves) and `onclick`, plus the
// chart's tooltip state `show` / `hide`. Nothing custom is drawn.
//
// Usage (the chart's context must be bound):
//   let context = $state();
//   const tip = new TapTooltip(() => context);
//   <BarChart bind:context tooltipContext={tip.props} ... />
export class TapTooltip {
  pinned = $state(false);
  // The plot's hit area; a click outside it unpins.
  #area = null;

  constructor(getContext) {
    this.getContext = getContext;

    // Listen for the outside click only while something is pinned. Capture
    // phase, so it runs before the chart's own click handler and the click
    // that pins never reaches it.
    $effect(() => {
      if (!this.pinned) return;
      const dismiss = (e) => {
        if (!this.#area?.contains(e.target)) this.unpin();
      };
      document.addEventListener("click", dismiss, true);
      return () => document.removeEventListener("click", dismiss, true);
    });

    // In a bar chart LayerChart shows the tooltip as soon as the pointer
    // enters a column's band rect, empty space above the bar included. A tap
    // there flashed it up before the click took it away again. Catch those
    // pointer events on the way down (capture) and stop them unless they are
    // on a bar; an unpinned tooltip goes when the pointer leaves the bar.
    $effect(() => {
      const root = this.getContext()?.containerRef;
      if (!root) return;
      const guard = (e) => {
        const tooltip = this.getContext()?.tooltipState;
        if (tooltip?.mode !== "band" && tooltip?.mode !== "bounds") return;
        if (!e.target.closest?.(".lc-tooltip-rect") || onBar(root, e)) return;
        e.stopPropagation();
        if (!this.pinned && tooltip.data != null) tooltip.hide();
      };
      const events = ["pointerenter", "pointermove"];
      for (const t of events) root.addEventListener(t, guard, true);
      return () => events.forEach((t) => root.removeEventListener(t, guard, true));
    });
  }

  get props() {
    return { locked: this.pinned, onclick: this.pin };
  }

  // A pinned tooltip ignores the pointer, so a click on another bar would
  // keep the old one. Unlock for a moment, show at the click, lock again.
  // Band modes (bar charts) hand over the clicked bar's row; the bisect /
  // quadtree modes hand over the stale pinned row, so those look it up from
  // the click position instead.
  pin = (e, { data }) => {
    const tooltip = this.getContext()?.tooltipState;
    if (!tooltip) return;
    this.#area = e.target.closest(".lc-tooltip-context");
    const byRow = tooltip.mode === "band" || tooltip.mode === "bounds";
    // In a bar chart the click lands on LayerChart's band rect, which spans
    // the whole column, empty space above the bar included. Only a click on
    // a bar itself pins; anywhere else in the plot unpins.
    if (byRow && !onBar(this.#area, e)) return this.unpin();
    this.pinned = false;
    tooltip.show(e, byRow ? data : undefined);
    this.pinned = tooltip.data != null;
  };

  unpin = () => {
    this.pinned = false;
    this.getContext()?.tooltipState?.hide();
  };
}

// Is the click inside one of the plot's bars (LayerChart's `lc-bar`)? The
// band rects sit on top of the bars, so this goes by position, not target.
// A plot without bars counts as a hit, so nothing changes there.
function onBar(area, e) {
  const bars = area?.querySelectorAll(".lc-bar");
  if (!bars?.length) return true;
  const { clientX: x, clientY: y } = e;
  return [...bars].some((bar) => {
    const r = bar.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  });
}
