<script>
  let { items, activeIndex } = $props();
</script>

<div
  class="absolute top-10 left-[calc(43%+464px)] right-8 hidden flex-col px-6 lg:top-36 lg:flex"
>
  <div class="relative h-56">
    {#each items as item, i (i)}
      <p
        class="absolute inset-0 font-sans text-base leading-relaxed text-base-content transition-opacity duration-500 ease-[ease]"
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
