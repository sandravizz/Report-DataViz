/**
 * Number formatting for the report — one place, so axis labels, value labels
 * and tooltips group thousands the same way, and hand-written copy has a rule
 * to match.
 *
 * A comma separates thousands (4,590), matching the source PDF and the report
 * copy. Years are exempt and stay bare (2100, never 2,100): on the line charts
 * they reach the plot as Dates and are formatted by d3-time-format, so nothing
 * here touches them.
 *
 * en-US is used as the locale rather than the browser's, so the report reads
 * the same for every reader.
 */
const grouped = new Intl.NumberFormat("en-US");

export function formatNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return value ?? "";
  return grouped.format(value);
}
