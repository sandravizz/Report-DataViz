<script>
  import { figureProgress, noteIndex } from "$lib/figure-progress.js";

  let { pairs, activeIndex, stepPosition, holdSteps = 0 } = $props();

  // One text per figure, or — a story figure with `notes` — one per note:
  // the one in force follows the figure's scroll progress, so the text
  // changes as the figure moves from state to state. All of them are
  // stacked in the same box and cross-fade, like the figures.
  const items = $derived(
    pairs.flatMap((pair, i) => {
      if (!pair.notes?.length) return [{ text: pair.description, active: i === activeIndex }];
      const current = noteIndex(pair, figureProgress(i, pairs.length, stepPosition ?? activeIndex, holdSteps));
      return pair.notes.map((note, k) => ({ text: note.text, active: i === activeIndex && k === current }));
    }),
  );
</script>

<!-- Right-hand side column of the symmetric desktop layout: same width and
     same gap from the figure as the chapter rail on the left (variables in
     styles/tailwind.css). No padding of its own — --side-gap is the gap. -->
<div
  class="absolute top-10 left-(--desc-left) hidden w-(--desc-w) flex-col lg:top-[9.75rem] lg:flex"
>
  <!-- One step below the chapter body copy in +page.svelte (16px against
       18px, same /80 ink). At an identical 18px/1.85 the narrow side column
       read LARGER than the body (2026-10-27): short lines and tall leading
       inflate it. It still out-ranks the chapter rail opposite (text-sm,
       quiet greys). -->
  <div class="relative h-80">
    {#each items as item, i (i)}
      <p
        class="absolute inset-0 font-sans text-base leading-[1.75] text-base-content/80 transition-opacity duration-500 ease-[ease]"
        style:opacity={item.active ? 1 : 0}
        style:pointer-events={item.active ? "auto" : "none"}
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
        {@html item.text}
      </p>
    {/each}
  </div>
</div>
