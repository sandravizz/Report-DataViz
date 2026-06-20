<script>
  import AreaChartPanel from "./AreaChartPanel.svelte";
  import BarChartPanel from "./BarChartPanel.svelte";
  import BarChartPanelHorizontal from "./BarChartPanelHorizontal.svelte";

  let { pairs, activeIndex } = $props();
</script>

<div class="w-200 absolute top-20 left-1/2 -translate-x-1/2">
  {#each pairs as pair, i (pair.product)}
    <div
      class="absolute inset-0 transition-opacity duration-500 ease-[ease]"
      style:opacity={i === activeIndex ? 1 : 0}
    >
      <div class="mb-2 font-sans text-sm text-[#2A2659]">
        {pair.product}
      </div>

      <div class="h-140 flex gap-6">
        {#if pair.kind === "area"}
          <AreaChartPanel {pair} />
        {:else if pair.kind === "bar"}
          <BarChartPanelHorizontal {pair} />
        {/if}
      </div>
    </div>
  {/each}
</div>
