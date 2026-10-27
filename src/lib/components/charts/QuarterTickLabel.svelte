<script>
  // One label of the two-line quarter axis (`pair.quarterAxis`, see
  // chart-theme.js), as on the iw branch: the first line (Q2/Q3/Q4) drawn as
  // the axis would, the second (the year, under each Q1) in the ink and
  // dropped yearLineOffset lower. A Q1 tick has no first line; instead a
  // connector runs from the axis down to just above its year, so the line is
  // what names the quarter. The axis's own tick marks are off
  // (quarterXAxisProps), so this draws every tick: a short one under each
  // quarter, the long Q1 line under each year, both in the gridline ink.
  // Rendered from a panel's `tickLabel` snippet, which hands over `props`.
  import { Text } from "layerchart";
  import { xAxisProps, gridStroke, quarterYearGap, yearLineOffset } from "$lib/chart-theme";
  import { ink } from "$lib/colors";

  let { props } = $props();
  // Phones pull the year up under the axis (chart-theme.js yearLineOffset).
  let innerWidth = $state(1024);
  const offset = $derived(yearLineOffset(innerWidth));
  const lines = $derived(String(props.value ?? "").split("\n"));
</script>

<svelte:window bind:innerWidth />

{#if lines[0]}
  <Text {...props} value={lines[0]} />
{/if}
{#if !lines[1]}
  <line x1={props.x} y1={props.y} x2={props.x} y2={props.y + xAxisProps.tickLength} style:stroke={gridStroke} stroke-width="1" />
{/if}
{#if lines[1]}
  <line
    x1={props.x}
    y1={props.y}
    x2={props.x}
    y2={props.y + (props.dy ?? 0) + offset - quarterYearGap(innerWidth)}
    style:stroke={gridStroke}
    stroke-width="1"
  />
  <Text {...props} value={lines[1]} fill={ink} dy={(props.dy ?? 0) + offset} />
{/if}
