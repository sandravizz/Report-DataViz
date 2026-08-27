/**
 * Number formatting for the report — one place, so axis labels, value labels
 * and tooltips write a number the same way, and hand-written copy has a rule
 * to match.
 *
 * German convention, because the source is German (IW-Report 34/2026) and the
 * report copy is written in it: a dot separates thousands and a comma marks
 * the decimal (4.590 and 0,8), which is the opposite of what a bare JS number
 * renders. That is the actual bug this fixes — an index value of 102.5 was
 * reaching the axis as "102.5" on a page whose running text writes "102,5".
 *
 * Years are exempt and stay bare (2026, never 2.026): on the line charts they
 * reach the plot as Dates and are formatted by d3-time-format, so nothing here
 * touches them.
 *
 * de-DE is pinned as the locale rather than the browser's, so the report reads
 * the same for every reader.
 */
const grouped = new Intl.NumberFormat("de-DE");

// Pinned decimals, for readouts that want a column of numbers to line up
// rather than each one dropping the digits it happens not to need: an index
// tooltip reads 121,0 / 93,4 / 92,6, where the axis is happier with a bare
// 120. One formatter per digit count, built on first use.
const fixed = new Map();
function fixedFormat(decimals) {
  let formatter = fixed.get(decimals);
  if (!formatter) {
    formatter = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    fixed.set(decimals, formatter);
  }
  return formatter;
}

export function formatNumber(value, decimals) {
  if (typeof value !== "number" || !Number.isFinite(value)) return value ?? "";
  return (decimals == null ? grouped : fixedFormat(decimals)).format(value);
}
