<script>
  let { items, activeIndex } = $props();
</script>

<div
  class="absolute top-10 left-[calc(43%+464px)] right-8 hidden flex-col px-6 lg:top-36 lg:flex"
>
  <div class="relative h-56">
    {#each items as item, i (i)}
      <p
        class="absolute inset-0 flex items-start font-sans text-base leading-relaxed text-base-content transition-opacity duration-500 ease-[ease]"
        style:opacity={i === activeIndex ? 1 : 0}
        style:pointer-events={i === activeIndex ? "auto" : "none"}
      >
        {item}
      </p>
    {/each}
  </div>
</div>
