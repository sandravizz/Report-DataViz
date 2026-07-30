<script>
  // pair.panels stacked vertically in one figure block: ChartDisplay's
  // header carries the title and first panel's subtitle; later panels bring
  // only their own subtitle as a mid-block heading. No figure uses this yet
  // (main only has single-panel bar/line figures) — it's here so a future
  // two-chart figure doesn't need new plumbing.
  import ChartPanel from "./ChartPanel.svelte";

  let { pair } = $props();
</script>

<div class="flex min-h-0 min-w-0 flex-1 flex-col">
  {#each pair.panels as panel, i (i)}
    {#if i > 0}
      <div class="mt-2 mb-4 font-sans text-xs text-base-content lg:mt-8 lg:mb-12 lg:text-sm">
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
