// Legend variant of 05-ida-loans-area.js: the identical overlapping-area
// figure with the end-of-line labels swapped for a two-swatch legend below
// the plot, so the two labeling styles can be compared back to back. Derived
// from the original so data, annotations, and styling stay in sync.
import idaLoansArea from "./05-ida-loans-area.js";

export default {
  ...idaLoansArea,
  series: idaLoansArea.series.map(({ endLabel, endLabelColor, ...s }) => s),
  legendItems: idaLoansArea.series.map((s) => ({ label: s.key, color: s.color })),
  // Without end labels no right margin is reserved; keep enough room that the
  // disbursements callout ring (r=12, anchored on the last observation at the
  // plot's right edge) doesn't clip.
  padding: { right: 16 },
};
