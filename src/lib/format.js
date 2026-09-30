/**
 * Number formatting for the report — one place, so axis labels, value labels
 * and tooltips group thousands and round the same way, and hand-written copy
 * has a rule to match. Ported from main.
 *
 * A comma separates thousands (4,590) and values carry at most two decimals
 * (38.565 → 38.57, 42.1 stays 42.1 — no padded zeros). The CSVs keep their
 * full source precision; only the display rounds. Years are exempt and stay
 * bare (2100, never 2,100): they reach the plot as Dates and are formatted by
 * chart-theme's year formatters, so nothing here touches them.
 *
 * en-US is used as the locale rather than the browser's, so the report reads
 * the same for every reader.
 */
const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return value ?? "";
  return grouped.format(value);
}
