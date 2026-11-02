// TAP TOOLTIP: a chart's tooltip pins on click/tap instead of living only
// while the pointer is over the chart. Click a bar (or a point in time) and
// its tooltip stays; click another and it switches there; click anywhere
// outside the plot and it goes. On a phone, where a tap is all there is, this
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
    this.pinned = false;
    tooltip.show(e, byRow ? data : undefined);
    this.pinned = tooltip.data != null;
  };

  unpin = () => {
    this.pinned = false;
    this.getContext()?.tooltipState?.hide();
  };
}
