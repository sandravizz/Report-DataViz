/**
 * Parse a figure CSV (imported via Vite's `?raw`) into chart-ready rows.
 * Expects a comma-separated file with a header row; a `year` column becomes
 * a Date (Jan 1 of that year), every other numeric column becomes a Number
 * and non-numeric cells (e.g. period codes like "IDA17-1") stay strings.
 * Empty cells become null (not 0/NaN) so layerchart's default `defined`
 * check breaks the line where a series has no observation.
 */
export function parseFigureCsv(raw) {
  const [header, ...lines] = raw.trim().split("\n");
  const keys = header.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const row = {};
    keys.forEach((key, i) => {
      const value = values[i]?.trim();
      row[key] =
        key === "year"
          ? new Date(+value, 0, 1)
          : value === "" || value === undefined
            ? null
            : Number.isNaN(+value)
              ? value
              : +value;
    });
    return row;
  });
}
