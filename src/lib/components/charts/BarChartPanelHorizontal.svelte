<script>
  import { BarChart, defaultChartPadding } from "layerchart";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import { tickLabelProps, yAxisProps, desktopTooltips } from "$lib/chart-theme";
  import { colors, nameInk } from "$lib/colors";

  let { pair } = $props();

  let innerWidth = $state(1024);

  // Category labels are long; give them a generous left gutter and let them
  // word-wrap to fit it (bars can spare the width). Wrapping is width-based,
  // so labels reflow per breakpoint instead of relying on hard \n breaks.
  const labelGutter = $derived(innerWidth < 1024 ? 150 : 200);
</script>

<svelte:window bind:innerWidth />

<BarChart
  data={pair.data}
  x={pair.yKey}
  y={pair.xKey}
  yScale={scaleBand().paddingInner(0.2).paddingOuter(0)}
  xScale={scaleLinear().domain([0, max(pair.data, (d) => d[pair.yKey])])}
  xRange={({ width }) => [0, width]}
  orientation="horizontal"
  axis="y"
  tooltipContext={desktopTooltips(innerWidth)}
  grid={false}
  labels
  padding={defaultChartPadding({ left: labelGutter, right: 40 })}
  c={pair.xKey}
  cRange={pair.data.map((d) => d.color)}
  series={[
    {
      key: pair.subtitle,
      value: pair.yKey,
      props: { insets: { y: 0 }, strokeWidth: 0 },
    },
  ]}
  props={{
    // The baseline the bars grow from. It comes from BarChart's own `rule`
    // prop (true by default — this chart was switching it off), NOT from the
    // axis: `yAxisProps.rule` is the Axis component's domain line, which on a
    // band scale runs along the labels instead. `valueAxis` is x here, so
    // LayerChart renders exactly one Rule, vertical, at x = 0.
    //
    // Explicit stroke for the same reason as `grid` on the line charts: the
    // PNG export re-serializes the SVG away from the stylesheet, where
    // LayerChart's currentColor default resolves to black.
    rule: { stroke: colors.quiet, strokeWidth: 1 },
    yAxis: {
      ...yAxisProps,
      tickLabelProps: {
        ...tickLabelProps,
        // These aren't reference text like a year axis — they name the bars,
        // so they take the report's body ink and its normal weight. `ink`
        // read too light against the bars beside them.
        fill: nameInk,
        class: "text-xs font-normal",
        textAnchor: "start",
        dx: -labelGutter,
        width: labelGutter,
        truncate: false,
        // Axis defaults tick labels to an 11px line height, which is tighter
        // than the 12px text-xs font and makes wrapped lines overlap.
        lineHeight: "12px",
      },
    },
    labels: {
      // Value labels stay on the lighter `ink`: two runs of body-ink text on
      // one chart would flatten the hierarchy. They gain their readability
      // from weight instead of colour.
      ...tickLabelProps,
      class: "text-xs font-normal",
      format: (d) => `${pair.valuePrefix ?? ""}${d}`,
    },
    tooltip: {
      item: {
        label: "",
        color: null,
        format: (d) => `${pair.valuePrefix ?? ""}${d}`,
      },
    },
  }}
/>
