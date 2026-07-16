<script>
  // FT-style composite figure: pair.panels stacked vertically in one figure
  // block. The outer ChartDisplay header carries the figure's single big
  // title and the first panel's subtitle; every following panel brings only
  // a subtitle as a mid-block heading (styled and spaced exactly like the
  // header subtitle), and the figure's single source line closes the block.
  import ChartPanel from "./ChartPanel.svelte";

  let { pair } = $props();
</script>

<div class="flex min-h-0 min-w-0 flex-1 flex-col">
  {#each pair.panels as panel, i (i)}
    {#if i > 0}
      <div class="mt-6 mb-6 font-sans text-xs text-base-content lg:mt-8 lg:mb-7 lg:text-sm">
        {panel.subtitle}
      </div>
    {/if}
    <div class="flex min-h-0 flex-1">
      <ChartPanel pair={panel} />
    </div>
  {/each}
</div>
