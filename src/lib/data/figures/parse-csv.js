/**
 * Parse a figure CSV (imported via Vite's `?raw`) into chart-ready rows.
 * Expects a comma-separated file with a header row; a `year` column becomes
 * a Date (Jan 1 of that year), every other column becomes a Number.
 */
export function parseFigureCsv(raw) {
  const [header, ...lines] = raw.trim().split("\n");
  const keys = header.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const row = {};
    keys.forEach((key, i) => {
      row[key] = key === "year" ? new Date(+values[i], 0, 1) : +values[i];
    });
    return row;
  });
}
