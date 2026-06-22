<script>
  import { BarChart, Text } from "layerchart";
  import { scaleBand } from "d3-scale";

  let { pair } = $props();

  // Largest value first so it lands at the bottom of the stack (smallest on top).
  const orderedData = $derived([...pair.data].reverse());

  const series = $derived(
    orderedData.map((d) => ({
      key: d[pair.xKey],
      color: d.color,
    }))
  );

  const stackedRow = $derived(
    pair.data.reduce((row, d) => {
      row[d[pair.xKey]] = d[pair.yKey];
      return row;
    }, { category: "" })
  );
</script>

<div class="w-24">
  <BarChart
    data={[stackedRow]}
    x="category"
    xScale={scaleBand()}
    series={series}
    seriesLayout="stack"
    bandPadding={0}
    tooltipContext={false}
    axis={false}
    grid={false}
    rule={false}
    padding={{ top: 0, left: 0, right: 0, bottom: 20 }}
    props={{ bars: { strokeWidth: 0 } }}
  >
    {#snippet aboveMarks({ context })}
      {#each orderedData as d (d[pair.xKey])}
        {@const [y0] = context.series.getStackValue(d[pair.xKey], stackedRow) ?? [0, 0]}
        <Text
          x={context.xScale("")}
          y={context.yScale(y0)}
          dx={3}
          value={`${d[pair.yKey]}${pair.valueSuffix ?? ""}`}
          class="text-xs font-light fill-[#FEFCFD]"
        />
      {/each}
    {/snippet}
  </BarChart>
</div>
