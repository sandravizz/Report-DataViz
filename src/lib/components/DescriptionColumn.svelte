<script>
  let { items, activeIndex } = $props();
</script>

<!-- Right-hand side column of the symmetric desktop layout: same width and
     same gap from the figure as the chapter rail on the left (variables in
     styles/tailwind.css). No padding of its own — --side-gap is the gap. -->
<div
  class="absolute top-10 left-(--desc-left) hidden w-(--side-w) flex-col lg:top-44 lg:flex"
>
  <!-- Set EXACTLY as the chapter body copy in +page.svelte (text-lg,
       leading-[1.85], /80 ink): the description is reading the figure asks
       for, so it must out-rank the chapter rail opposite (text-sm, quiet
       greys). At equal size the two side columns had the same pull. -->
  <div class="relative h-80">
    {#each items as item, i (i)}
      <p
        class="absolute inset-0 font-sans text-lg leading-[1.85] text-base-content/80 transition-opacity duration-500 ease-[ease]"
        style:opacity={i === activeIndex ? 1 : 0}
        style:pointer-events={i === activeIndex ? "auto" : "none"}
      >
        <!-- Rendered as HTML so a description can carry a `mark.accent-mark`
             — the same accent underline the chapter copy uses. Every string
             here comes from `$lib/data/figures/*`, editorial copy authored in
             this repo; nothing fetched, routed or user-supplied.

             The <p> is a plain block, NOT `flex items-start`. A flex container
             promotes the `mark` to a flex item, which tears the marked phrase
             out of the sentence and stacks it in its own column beside the
             rest of the copy. `absolute inset-0` already pins the text to the
             top of the box, so the flex bought nothing here. -->
        {@html item}
      </p>
    {/each}
  </div>
</div>
