import { defaultChartPadding } from "layerchart";

export const tickLabelProps = { fill: "#2A2659", class: "text-xs font-light" };

// No tick marks and no axis rule line, on any axis of any chart.
export const xAxisProps = {  tickLength: 4, tickMarks: false, rule: false, tickLabelProps };
export const yAxisProps = { tickLength: 4, tickMarks: false, rule: false, tickLabelProps };

export const legendProps = {
  class: "text-xs font-light",
  classes: { items: "flex-wrap" },
};

// Numeric y tick labels are wider than the default 20px left gutter; give
// those charts enough room that the labels stay inside the chart container,
// so the legend and plot stay flush with the title/subtitle/source.
export const yLabelPadding = { left: 36 };

// Bottom padding must fit the wrapped legend: on mobile items stack ~2 per
// row, on desktop a single row (44px) is enough unless there are few series.
export function legendPadding(seriesCount, innerWidth, extra = {}) {
  if (innerWidth < 1024) {
    const rows = Math.ceil(seriesCount / 2);
    return defaultChartPadding({ ...extra, legend: true, bottom: 24 + rows * 22 });
  }
  if (seriesCount > 4) {
    return defaultChartPadding({ ...extra, legend: true, bottom: 44 });
  }
  return defaultChartPadding({ ...extra, legend: true });
}
