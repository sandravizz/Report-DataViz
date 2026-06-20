<script>
  import { BarChart } from "layerchart";
  import { scaleBand } from "d3-scale";

  let { pair } = $props();

  const colors = [
  "#EED8DE", // Pale blush background
  "#E0F3F6", // Light blue navigation
  "#97AF98", // Sage green
  "#D86858", // Coral accent
  "#736B82", // Lavender gray
  "#61C1EB", // Sky blue
  "#CBC1C1", // Light gray
  "#000101", // Near black
  "#FEFCFD", // Off white
  "#3A2526"  // Deep navy/brown
];

  function wrapLabel(label) {
    const words = String(label).split(" ");
    if (words.length < 2) return label;
    const mid = Math.ceil(words.length / 2);
    return `${words.slice(0, mid).join(" ")}\n${words.slice(mid).join(" ")}`;
  }
</script>

<BarChart
  data={pair.data}
  x={pair.xKey}
  xScale={scaleBand()}
  series={[
    {
      key: pair.product,
      value: pair.yKey,
      color: "#6E63A8",
      props: { insets: { x: 8 }, strokeWidth: 0 },
    },
  ]}
  axis="x"
  props={{
    xAxis: {
      tickLength: 0,
      format: wrapLabel,
      tickLabelProps: { class: "text-xs font-light" },
    },
  }}
/>

