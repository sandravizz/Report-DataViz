<script>
  // LETTER ROLL (bleibtgleich.dev's link hover, rebuilt in CSS — no GSAP).
  // Each letter sits in its own clip; on hover it slides up out of it while a
  // copy (the ::after) rises from below into its place. The letters go one
  // after another, but fast: 0.4s each, the whole stagger spread over 75ms,
  // on his in-out ease (0.76, 0, 0.24, 1). Leaving plays it backwards, last
  // letter first.
  //
  // The hover belongs to the CONTROL, not the text: put `group` on the
  // button or link that holds this. Pointer devices only — on touch a tap
  // would leave the letters stuck mid-roll. Keyboard focus rolls it too.
  //
  // Screen readers get the plain word once; the split letters are hidden.
  let { text } = $props();
  const chars = $derived(Array.from(text));
</script>

<span class="roll" aria-hidden="true"
  >{#each chars as c, i}<span class="ch"
      ><span data-ch={c} style="--i: {i}; --n: {chars.length}">{c}</span></span
    >{/each}</span
><span class="sr-only">{text}</span>

<style>
  .roll {
    display: inline-flex;
    white-space: pre;
  }

  /* The clip. The .05em padding (cancelled by the negative margin) keeps
     accents and the tops of caps inside it without moving the baseline. */
  .ch {
    display: inline-block;
    overflow: hidden;
    line-height: 1.15;
    padding-block: 0.05em;
    margin-block: -0.05em;
  }

  .ch > span {
    display: inline-block;
    position: relative;
    transition: transform 400ms cubic-bezier(0.76, 0, 0.24, 1);
    /* Out: last letter first. */
    transition-delay: calc((var(--n) - 1 - var(--i)) * 75ms / max(var(--n) - 1, 1));
  }

  /* The copy waiting below, .1em clear so none of it shows at rest. */
  .ch > span::after {
    content: attr(data-ch);
    position: absolute;
    left: 0;
    top: calc(100% + 0.1em);
  }

  @media (hover: hover) {
    :global(.group:hover) .ch > span {
      transform: translateY(calc(-100% - 0.1em));
      transition-delay: calc(var(--i) * 75ms / max(var(--n) - 1, 1));
    }
  }

  :global(.group:focus-visible) .ch > span {
    transform: translateY(calc(-100% - 0.1em));
    transition-delay: calc(var(--i) * 75ms / max(var(--n) - 1, 1));
  }

  @media (prefers-reduced-motion: reduce) {
    .ch > span {
      transition: none;
    }
  }
</style>
