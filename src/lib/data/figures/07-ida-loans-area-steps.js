// Scrolly-steps variant of the overlapping-area figure (same recipe as the
// IEA report's figure 2 experiment): the two IDA shares enter the story one
// per step. Each step is a full figure object (own number/title/description);
// ScrollySection crossfades between them like any other chart sequence, and
// the `drawIn` flag makes AreaChartPanelOverlap wipe the new line and its
// area wash in left-to-right when the step becomes active. No difference
// band — the reveal itself is the emphasis. Derived from 05/06 so data,
// callouts and styling stay in sync.
import idaLoansArea, {
  disbursementsCallout,
  grantsCallout,
} from "./05-ida-loans-area.js";

// Same series specs as the legend variant: end labels stripped in favor of
// the swatch legend below the plot, which grows with the steps.
const allSeries = idaLoansArea.series.map(({ endLabel, endLabelColor, ...s }) => s);
const legendItem = (s) => ({ label: s.key, color: s.color });

// Shared scaffold: only the visible series, callouts and the step's own
// title/description change while scrolling.
const base = {
  ...idaLoansArea,
  // Without end labels no right margin is reserved; keep enough room that the
  // disbursements callout ring (r=12, anchored on the last observation at the
  // plot's right edge) doesn't clip.
  padding: { right: 16 },
};

// Each step keeps every series introduced so far and flags only the newest
// one `drawIn`. Background context (the muted teal disbursements band) comes
// first, the camel grants story lands on top of it.
export const idaLoansAreaSteps = [
  {
    ...base,
    number: "Figure 4a",
    title: "IDA Loans Back at 40% of All Disbursements",
    description:
      "IDA loans returned to 40% of all disbursements received by eligible countries in 2024 — confirming IDA as their single largest source of concessional finance.",
    series: allSeries
      .filter((s) => s.value === "disbursements")
      .map((s) => ({ ...s, drawIn: true })),
    annotations: [disbursementsCallout],
    legendItems: allSeries.filter((s) => s.value === "disbursements").map(legendItem),
  },
  {
    ...base,
    number: "Figure 4b",
    title: "IDA Grants Reach a Fifth of All Grants Received",
    description:
      "IDA grants more than doubled their share of all grants received by eligible countries — from ~10% in 2018 to ~22% in 2022 — catching up with the loans' share of disbursements.",
    series: allSeries.map((s) => ({ ...s, drawIn: s.value === "grants" })),
    annotations: [grantsCallout, disbursementsCallout],
    legendItems: allSeries.map(legendItem),
  },
];

export default idaLoansAreaSteps[idaLoansAreaSteps.length - 1];
