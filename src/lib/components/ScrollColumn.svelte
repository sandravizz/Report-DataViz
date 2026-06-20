<script>
  import { getOpacity, getScale } from "../scroll-animation";

  let { items, activeIndex, y, align } = $props();

  let isLeft = $derived(align === "left");
</script>

<div class="absolute inset-y-0 {isLeft ? 'left-0' : 'right-0'} w-[44%] overflow-hidden">
  <div style:transform="translateY({y}px)" class="absolute top-0 {isLeft ? 'left-8' : 'right-8 text-right'}">
    {#each items as item, i (i)}
      {@const dist = Math.abs(i - activeIndex)}
      <div
        class="h-20 flex items-center font-sans text-[1.45rem] font-normal tracking-[0.06em] whitespace-nowrap text-[#2A2659] transition-[opacity,transform] duration-[400ms] ease-[ease] {isLeft ? 'origin-left' : 'origin-right justify-end'}"
        style:opacity={getOpacity(dist)}
        style:transform="scale({getScale(dist)})"
      >
        {item}
      </div>
    {/each}
  </div>
</div>
