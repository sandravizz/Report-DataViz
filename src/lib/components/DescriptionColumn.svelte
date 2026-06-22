<script>
  let { items, activeIndex } = $props();
</script>

<div class="absolute inset-y-0 right-0 hidden w-[26%] flex-col justify-center px-6 lg:flex">
  <div class="relative h-56">
    {#each items as item, i (i)}
      <p
        class="absolute inset-0 flex items-center font-sans text-base leading-relaxed text-[#2A2659] transition-opacity duration-500 ease-[ease]"
        style:opacity={i === activeIndex ? 1 : 0}
        style:pointer-events={i === activeIndex ? "auto" : "none"}
      >
        {item}
      </p>
    {/each}
  </div>
</div>
