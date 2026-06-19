<script>
  import { LineChart, AreaChart } from "layerchart";
  import { curveLinearClosed } from "d3-shape";
  import { scaleBand } from "d3-scale";

  let { pairs, activeIndex } = $props();

  const tickFill = "rgba(255,255,255,0.35)";
  const radarTickFill = "rgba(255,255,255,0.4)";
  const gridStroke = "rgba(255,255,255,0.15)";

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
    root: { class: "bg-[#111] text-white text-sm border-0 rounded-sm px-2 py-1" },
  };
</script>

<div class="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  {#each pairs as pair, i (pair.product)}
    <div class="absolute inset-0 transition-opacity duration-500 ease-[ease]" style:opacity={i === activeIndex ? 1 : 0}>
      <div class="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        {pair.product}
      </div>

      <div class="h-[252px] w-full">
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
              spline: { stroke: "#fff", strokeWidth: 1.5 },
              points: { r: 2, fill: "#fff" },
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
              area: { fill: "rgba(255,255,255,0.7)", line: { stroke: "#fff", strokeWidth: 1.5 } },
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
              spline: { curve: curveLinearClosed, stroke: "#fff", strokeWidth: 1.5, class: "fill-white/12" },
              points: { r: 2, fill: "#fff" },
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
