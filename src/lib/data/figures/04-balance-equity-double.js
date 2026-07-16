import { projectionRange } from "../annotation-presets.js";
import { ink } from "$lib/colors.js";
import balanceSheetTotalArea from "./00-balance-sheet-total-area.js";
import equityShareArea from "./01-equity-share-area.js";

// Shared 2024→2025 highlight across both plots: the same hatched band as the
// projection ranges, but instead of the muted "Projection →" tag each band
// carries the finding itself as its top label (dark ink, right-aligned at the
// band's right edge so it grows into the plot). The point callouts of the
// standalone figures are dropped — the band label does the explaining. Each
// chart also draws its own vertical rule at 2024, confined to its own plot.
const highlightX = [new Date(2024, 0, 1), new Date(2025, 0, 1)];
const connectorRule = { x: highlightX[0] };

const highlightLabel = {
  label: {
    fill: ink,
    class: "text-xs font-light",
    textAnchor: "end",
    verticalAnchor: "end",
    dx: 0,
  },
};

// Both band labels are short forms computed from the data (the standalones'
// full sentences are too long for a band label). The top one is compact —
// "bn" not "billion", since the subtitle right below already spells out the
// unit — adds the relative growth, and wraps to two lines: `width` forces
// the break after "growth", so the amount gets its own line.
const balanceRows = balanceSheetTotalArea.data;
const balancePrev = balanceRows[balanceRows.length - 2];
const balanceLast = balanceRows[balanceRows.length - 1];
const growthBn = Math.round(balanceLast.total - balancePrev.total);
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
  label: `Biggest yearly growth +USD ${growthBn} bn (+${growthPct}%)`,
  labelPlacement: "top-right",
  props: {
    label: {
      ...highlightLabel.label,
      width: 140,
      truncate: false,
      lineHeight: "13px",
    },
  },
});

const equityBand = projectionRange({
  x: highlightX,
  label: `Declined by ${lastYearDeclinePp}pp`,
  labelPlacement: "top-right",
  props: highlightLabel,
});

const balancePanel = {
  ...balanceSheetTotalArea,
  // Half-height plots want a sparser axis; no point callouts here.
  yTicks: [100, 200, 300],
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
