<script>
  import { LineChart, AreaChart } from "layerchart";
  import { curveLinearClosed } from "d3-shape";
  import { scaleBand } from "d3-scale";

  let { pairs, activeIndex } = $props();

  const tickFill = "rgba(42,38,89,0.35)";
  const radarTickFill = "rgba(42,38,89,0.4)";
  const gridStroke = "rgba(42,38,89,0.15)";

  const chartColors = ["#6E63A8", "#A89677", "#E27259", "#D8B7C2", "#8FBA86"];
  const radarFillClasses = [
    "fill-[#6E63A8]/15",
    "fill-[#A89677]/15",
    "fill-[#E27259]/15",
    "fill-[#D8B7C2]/15",
    "fill-[#8FBA86]/15",
  ];

  function tickLabelProps(small) {
    return { fill: tickFill, class: small ? "text-[9px] font-light" : "text-[10px] font-light" };
  }

  function categoryIndex(pair) {
    return (d) => pair.data.indexOf(d);
  }

  function categoryFormat(pair) {
    return (i) => String(pair.data[i]?.[pair.xKey] ?? "");
  }

  const tooltipProps = {
    root: { class: "bg-[#2A2659] text-[#F4DDD6] text-sm border-0 rounded-sm px-2 py-1" },
  };
</script>

<div class="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  {#each pairs as pair, i (pair.product)}
    {@const color = chartColors[i % chartColors.length]}
    <div class="absolute inset-0 transition-opacity duration-500 ease-[ease]" style:opacity={i === activeIndex ? 1 : 0}>
      <div class="mb-2 font-sans text-[9px] uppercase tracking-[0.18em] text-[#2A2659]/40">
        {pair.product}
      </div>

      <div class="h-63 w-full">
        {#if pair.kind === "line"}
          <LineChart
            data={pair.data}
            x={categoryIndex(pair)}
            y={pair.yKey}
            xScale={scaleBand()}
            axis="x"
            grid={false}
            rule={false}
            points={pair.points ?? false}
            props={{
              spline: { stroke: color, strokeWidth: 1.5 },
              points: { r: 2, fill: color },
              xAxis: { tickLength: 0, format: categoryFormat(pair), tickLabelProps: tickLabelProps(pair.smallLabels) },
              tooltip: tooltipProps,
            }}
          />

        {:else if pair.kind === "area"}
          <AreaChart
            data={pair.data}
            x={categoryIndex(pair)}
            y={pair.yKey}
            xScale={scaleBand()}
            axis="x"
            grid={false}
            rule={false}
            props={{
              area: { fill: color, fillOpacity: 0.45, line: { stroke: color, strokeWidth: 1.5 } },
              xAxis: { tickLength: 0, format: categoryFormat(pair), tickLabelProps: tickLabelProps(pair.smallLabels) },
              tooltip: tooltipProps,
            }}
          />
        {:else if pair.kind === "radar"}
          <LineChart
            data={pair.data}
            x={categoryIndex(pair)}
            y={pair.yKey}
            xScale={scaleBand()}
            radial
            points
            axis="x"
            yPadding={[0, 8]}
            padding={{ top: 16 }}
            grid={{ radialY: "linear", x: { style: `stroke: ${gridStroke}` }, y: { style: `stroke: ${gridStroke}` } }}
            rule={false}
            props={{
              spline: { curve: curveLinearClosed, stroke: color, strokeWidth: 1.5, class: radarFillClasses[i % radarFillClasses.length] },
              points: { r: 2, fill: color },
              xAxis: { tickLength: 0, format: categoryFormat(pair), tickLabelProps: { fill: radarTickFill, class: "text-[9px] font-light" } },
              tooltip: tooltipProps,
            }}
          />
        {/if}
      </div>
    </div>
  {/each}

  <div class="absolute inset-0"></div>
</div>
