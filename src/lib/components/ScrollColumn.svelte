<script>
  import { getOpacity, getScale } from "../scroll-animation";

  let { items, activeIndex, y, align } = $props();
  let isLeft = $derived(align === "left");
</script>

<div
  class="absolute inset-y-0 hidden overflow-hidden lg:block {isLeft
    ? 'left-8 right-[calc(57%+430px)]'
    : 'left-[calc(43%+464px)] right-8'}"
>
  <div
    style:transform="translateY({y}px)"
    class="absolute inset-x-0 top-0 px-6 {isLeft ? '' : 'text-right'}"
  >
    {#each items as item, i (i)}
      {@const dist = Math.abs(i - activeIndex)}
      <div
        class="h-20 flex items-center font-sans text-sm font-normal text-base-content transition-[opacity,transform] duration-400 ease-[ease] {isLeft ? 'origin-left' : 'origin-right justify-end'}"
        style:opacity={getOpacity(dist)}
        style:transform="scale({getScale(dist)})"
      >
        {item}
      </div>
    {/each}
  </div>
</div>
