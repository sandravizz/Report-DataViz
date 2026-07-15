<script>
  // Vertical rule at a data-x value. The chart svg doesn't clip its contents,
  // so extendTop/extendBottom (px) push the line past the plot edge into the
  // surrounding page. Composite figures use this to run one rule through two
  // stacked charts: each chart draws its own segment plus an overshoot toward
  // the other, and as long as the two overshoots together cover the gap the
  // segments meet — the overlap is invisible because both charts share the
  // same width, padding, and x domain, so the rule lands on the same pixel
  // column in each.
  import { getChartContext } from "layerchart";
  import { colors } from "$lib/colors";

  let { x, extendTop = 0, extendBottom = 0, stroke = colors.lavender, strokeWidth = 0.5 } = $props();

  const ctx = getChartContext();
</script>

<line
  x1={ctx.xScale(x)}
  x2={ctx.xScale(x)}
  y1={Math.min(...ctx.yRange) - extendTop}
  y2={Math.max(...ctx.yRange) + extendBottom}
  {stroke}
  stroke-width={strokeWidth}
  pointer-events="none"
/>
