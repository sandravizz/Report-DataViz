<script>
  import { toParagraphs } from "$lib/utils/paragraphs.js";

  let { items, activeIndex } = $props();
</script>

<div
  class="absolute top-10 right-16 left-[calc(40%+464px)] hidden flex-col px-6 lg:top-36 lg:flex"
>
  <!-- Grid stack rather than absolute children: every step occupies the same
       cell, so they cross-fade in place while the block still grows to fit the
       longest description. -->
  <div class="relative grid">
    {#each items as item, i (i)}
      <div
        class="col-start-1 row-start-1 space-y-4 font-sans text-base leading-relaxed text-base-content transition-opacity duration-500 ease-[ease]"
        style:opacity={i === activeIndex ? 1 : 0}
        style:pointer-events={i === activeIndex ? "auto" : "none"}
      >
        {#each toParagraphs(item) as paragraph, j (j)}
          <p>{paragraph}</p>
        {/each}
      </div>
    {/each}
  </div>
</div>
