// FT-style double figure (experiment): the two area figures stacked in one
// figure block — the balance-sheet total on top, the equity/liabilities share
// below it, each keeping its own headline and subtitle, with one shared
// source line. The source configs are reused with overrides scoped to the
// double context: the standalone versions are untouched.
import { projectionRange } from "../annotation-presets.js";
import balanceSheetTotalArea from "./00-balance-sheet-total-area.js";
import equityShareArea from "./01-equity-share-area.js";

// Shared 2024→2025 highlight across both plots: the same hatched band as the
// projection ranges (unlabeled — the callouts do the explaining), plus one
// vertical rule at 2024 that runs through both charts so the region reads as
// a single event spanning the whole figure. Each chart draws its own rule
// segment with a 100px overshoot toward the other; together the overshoots
// cover the axis-labels + subtitle gap between the plots (~104–124px), and
// the overlap is invisible because both charts share the same x geometry.
const highlightX = [new Date(2024, 0, 1), new Date(2025, 0, 1)];
const highlightBand = projectionRange({ x: highlightX, label: null });
const connectorRule = { x: highlightX[0] };

// At half height the original callout offsets collide with the marks and the
// 2024 rule, so both callouts are repositioned: labels right-aligned ending
// well left of the rule (one year step is ~110–130px on desktop), so neither
// text crosses the highlight band. The top chart keeps the full standalone
// label; the bottom swaps in a short last-year decline computed from the data
// (the standalone's "since its 2018 peak" line is too long at half height).
const balanceCallout = {
  ...balanceSheetTotalArea.annotations[0],
  labelXOffset: 150,
  labelYOffset: 0,
  props: {
    ...balanceSheetTotalArea.annotations[0].props,
    label: {
      ...balanceSheetTotalArea.annotations[0].props.label,
      width: 260,
    },
  },
  mobile: {
    labelXOffset: 48,
    labelYOffset: 8,
    props: { label: { width: 100, lineHeight: "13px" } },
  },
};

const shareRows = equityShareArea.data;
const sharePrev = shareRows[shareRows.length - 2];
const shareLast = shareRows[shareRows.length - 1];
const lastYearDeclinePp = Math.round(
  (sharePrev.equityShare - shareLast.equityShare) * 100
);

const equityCallout = {
  ...equityShareArea.annotations[0],
  label: `Declined by ${lastYearDeclinePp}pp`,
  labelXOffset: 150,
  labelYOffset: -35,
  props: {
    ...equityShareArea.annotations[0].props,
    label: {
      ...equityShareArea.annotations[0].props.label,
      textAnchor: "end",
      verticalAnchor: "middle",
      width: 160,
    },
  },
  mobile: {
    labelXOffset: 48,
    labelYOffset: -24,
    props: { label: { width: 110, lineHeight: "13px" } },
  },
};

const balancePanel = {
  ...balanceSheetTotalArea,
  // Half-height plots want a sparser axis and the repositioned callout.
  yTicks: [100, 200, 300],
  annotations: [balanceCallout],
  rangeAnnotations: [highlightBand],
  lineAnnotations: [{ ...connectorRule, extendBottom: 100 }],
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
  annotations: [equityCallout],
  rangeAnnotations: [highlightBand],
  lineAnnotations: [{ ...connectorRule, extendTop: 100 }],
};

export default {
  title: balanceSheetTotalArea.title,
  subtitle: balanceSheetTotalArea.subtitle,
  description: `${balanceSheetTotalArea.description} ${equityShareArea.description}`,
  source: balanceSheetTotalArea.source,
  number: "Figures 1 & 2",
  kind: "double",
  panels: [balancePanel, equityPanel],
};
