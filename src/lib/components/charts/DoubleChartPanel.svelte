<script>
  // FT-style composite figure: pair.panels stacked in one block. ChartDisplay's
  // header carries the title and the first panel's subtitle; later panels bring
  // only a subtitle as a mid-block heading.
  import ChartPanel from "./ChartPanel.svelte";

  let { pair } = $props();
</script>

<div class="flex min-h-0 min-w-0 flex-1 flex-col">
  {#each pair.panels as panel, i (i)}
    {#if i > 0}
      <div class="mt-6 mb-10 font-sans text-xs text-base-content lg:mt-8 lg:mb-12 lg:text-sm">
        <span class:hidden={panel.hideOnMobile} class:lg:inline={panel.hideOnMobile}>
          {panel.subtitle}
        </span>
      </div>
    {/if}
    <div class="flex min-h-0 flex-1" class:mt-6={i === 0} class:lg:mt-0={i === 0}>
      <ChartPanel pair={panel} />
    </div>
  {/each}
</div>
