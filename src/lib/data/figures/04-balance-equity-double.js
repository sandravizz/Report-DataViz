import { projectionRange } from "../annotation-presets.js";
import { ink } from "$lib/colors.js";
import balanceSheetTotalArea from "./00-balance-sheet-total-area.js";
import equityShareArea from "./01-equity-share-area.js";

// Shared 2024→2025 highlight across both plots: the vertical rule each chart
// draws at 2024 marks the step, and the band carries the finding as its top
// label. No hatch and no fill (Sandra, 2026-09-30: the diagonal lines didn't
// work) — the band is only the label's anchor. The label hangs off the
// band's LEFT edge and reads leftwards from the rule (right-aligned, dx -6),
// so it stays clear of the y labels at the right end of the gridlines, and
// dy -6 lifts it off the plot's top line. The point callouts of the
// standalone figures are dropped — the band label does the explaining.
const highlightX = [new Date(2024, 0, 1), new Date(2025, 0, 1)];
const connectorRule = { x: highlightX[0] };

const highlightLabel = {
  label: {
    fill: ink,
    class: "text-xs font-light",
    textAnchor: "end",
    verticalAnchor: "end",
    dx: -6,
    dy: -6,
  },
};

// projectionRange's hatch off. With no pattern and no fill, AnnotationRange
// draws no rect at all — only its label.
const noHatch = { pattern: undefined };

// Both band labels are short forms computed from the data (the standalones'
// full sentences are too long for a band label). Both fit on one line now
// that they run leftwards into the plot.
const balanceRows = balanceSheetTotalArea.data;
const balancePrev = balanceRows[balanceRows.length - 2];
const balanceLast = balanceRows[balanceRows.length - 1];
const growthPct = Math.round(
  ((balanceLast.total - balancePrev.total) / balancePrev.total) * 100
);

const shareRows = equityShareArea.data;
const sharePrev = shareRows[shareRows.length - 2];
const shareLast = shareRows[shareRows.length - 1];
const lastYearDeclinePp = Math.round(
  (sharePrev.equityShare - shareLast.equityShare) * 100
);

const balanceBand = projectionRange({
  x: highlightX,
  ...noHatch,
  label: `Biggest yearly growth by ${growthPct}pp`,
  labelPlacement: "top-left",
  props: highlightLabel,
});

const equityBand = projectionRange({
  x: highlightX,
  ...noHatch,
  label: `Declined by ${lastYearDeclinePp}pp`,
  labelPlacement: "top-left",
  props: highlightLabel,
});

const balancePanel = {
  ...balanceSheetTotalArea,
  // Half-height plots want a sparser axis; no point callouts here.
  yTicks: [100, 200, 300],
  // Figure 1's opaque wash stays out of the double figure: it would hide the
  // highlight band drawn beneath the area.
  solidWash: false,
  annotations: [],
  rangeAnnotations: [balanceBand],
  lineAnnotations: [connectorRule],
};

const equityPanel = {
  ...equityShareArea,
  // Direct series labels reserve right padding chart 1 doesn't have, which
  // would break the shared year axis — use the color legend instead, so both
  // plots span exactly the same width. The in-band value numbers are dropped:
  // too busy at half height.
  directLabels: false,
  barLabels: undefined,
  yTicks: [0.25, 0.5, 0.75, 1],
  annotations: [],
  rangeAnnotations: [equityBand],
  lineAnnotations: [connectorRule],
};

export default {
  // One title carrying both panels' messages, in figure 2's ellipsis style.
  title: "IDA's Balance Sheet Keeps Growing… but Equity's Share Is Declining",
  subtitle: balanceSheetTotalArea.subtitle,
  description: `${balanceSheetTotalArea.description} ${equityShareArea.description}`,
  source: balanceSheetTotalArea.source,
  number: "Figures 1 & 2",
  kind: "double",
  panels: [balancePanel, equityPanel],
};
