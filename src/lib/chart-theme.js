import { defaultChartPadding } from "layerchart";

export const tickLabelProps = { fill: "#2A2659", class: "text-xs font-light" };

export const legendProps = {
  class: "text-xs font-light inset-x-0 transform-none",
  classes: { items: "flex-wrap justify-center" },
};

// Bottom padding must fit the wrapped legend: on mobile items stack ~2 per
// row, on desktop a single row (44px) is enough unless there are few series.
export function legendPadding(seriesCount, innerWidth, extra = {}) {
  if (innerWidth < 1024) {
    const rows = Math.ceil(seriesCount / 2);
    return defaultChartPadding({ ...extra, legend: true, bottom: 24 + rows * 22 });
  }
  return seriesCount > 4
    ? defaultChartPadding({ ...extra, legend: true, bottom: 44 })
    : undefined;
}
