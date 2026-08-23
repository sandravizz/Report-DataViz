<script>
  import { onMount } from "svelte";

  // Custom pointer for the COVER ONLY: a solid dot inside a bigger translucent
  // accent halo, both locked to the same point. No lag, no trail, no easing —
  // the two circles sit exactly under the pointer and go where it goes.
  //
  // The scoping is the design. The report proper is charts and long-form copy,
  // where a cursor costs real things: a filled disc travels over the data, and
  // hiding the system cursor takes away the I-beam over running text and
  // overrides a reader's enlarged-pointer setting. The cover has neither — a
  // title, two credit links, an illustration and a scroll arrow — so the dot
  // is a flourish where it is free, and the report pays none of it.
  //
  // PAINT ON THIS BRANCH. The reference version on `main` is an accent dot in
  // an accent halo, which works there because its cover is a photograph under
  // a black/50-65 scrim: uniformly dark, so a bright accent reads at full
  // strength with nothing propping it up. This cover is the opposite — the
  // turbine illustration on `base-200`, light everywhere — and the accent is a
  // light green, so an accent dot would disappear into it. The dot therefore
  // takes the cover's own type colour (`base-content`, the ink the headline and
  // credits are already set in) and the halo keeps the accent. Same rule, read
  // off a different ground: the dot is whatever reads on this cover, the halo
  // is always the accent.
  //
  // The halo is `accent/35`, the same fill as the PNG button in
  // FigureFooter.svelte and the Interpretation button in ChartDisplay.svelte —
  // the report's translucent-accent value, now in three places.

  // The zone. Landing.svelte's root section carries this attribute and nothing
  // else does; an attribute rather than a hard-coded id so a branch can move
  // the zone without touching this component.
  const ZONE = "[data-accent-cursor]";

  let enabled = $state(false);
  // False until the pointer is inside the zone. Ordinary state — it changes on
  // human timescales. Position is NOT: it is written straight to
  // `style.transform`, since routing pointer coordinates through the
  // reactivity graph is the one thing that would make this expensive.
  let visible = $state(false);

  let dotEl;
  let haloEl;

  onMount(() => {
    // A follower is only ever right for a real mouse. `any-hover` as well as
    // `pointer` is the stricter of the two common gates and the one to use:
    // `pointer: fine` alone still passes for a stylus, which has no hover
    // state, so the dot would sit stranded wherever the last tap landed. This
    // is decoration, so it fails off.
    if (!window.matchMedia("(any-hover: hover) and (pointer: fine)").matches) {
      return;
    }

    enabled = true;
    document.documentElement.classList.add("has-dot-cursor");

    let x = 0;
    let y = 0;
    // Nothing is drawn until the pointer has been somewhere.
    let known = false;
    let frame = 0;
    // Set when the zone answer may have changed without the pointer moving.
    let recheck = false;

    function update() {
      frame = 0;
      if (recheck) {
        recheck = false;
        // Ask the document what is under the pointer now. The layer itself is
        // `pointer-events: none`, so it never answers its own question.
        const under = document.elementFromPoint(x, y);
        visible = under instanceof Element && under.closest(ZONE) !== null;
      }
      if (!dotEl || !haloEl) return;
      // translate3d is written first, so it applies LAST: each circle centres
      // itself on the origin with its own -50% and is then moved to the point.
      const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      dotEl.style.transform = transform;
      haloEl.style.transform = transform;
    }

    // One write per frame rather than one per event: pointermove and scroll
    // both fire several times between paints, and each of those writes would
    // cost a style recalculation for a position about to be overwritten.
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function onMove(event) {
      x = event.clientX;
      y = event.clientY;
      known = true;
      // The event already knows what it hit, so no elementFromPoint here.
      visible =
        event.target instanceof Element && event.target.closest(ZONE) !== null;
      schedule();
    }

    // The cover is full-bleed and it is the block the reader scrolls away
    // from, so the zone can be entered and left with the pointer completely
    // still — at which point no pointer event fires at all. Without this the
    // dot hangs over the first chapter after a wheel scroll, and never
    // reappears when the reader scrolls back up to the cover.
    function onScroll() {
      if (!known) return;
      recheck = true;
      schedule();
    }

    // `relatedTarget === null` on pointerout means the pointer left the window
    // itself rather than moving between two elements inside it.
    function onOut(event) {
      if (event.relatedTarget === null) hide();
    }
    function hide() {
      visible = false;
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("has-dot-cursor");
    };
  });
</script>

<!-- Mounted once and then shown or hidden with a class, rather than added and
     removed from the DOM. Keeping the two refs stable is what lets the rAF
     callback write a transform without ever racing a mount. -->
{#if enabled}
  <div class="cursor-layer" class:is-on={visible} aria-hidden="true">
    <span class="cursor-halo" bind:this={haloEl}></span>
    <span class="cursor-dot" bind:this={dotEl}></span>
  </div>
{/if}

<style>
  /* Scoped to the cover, and only once the component has decided it is taking
     over — the class goes on <html> in onMount, so a coarse pointer or a page
     that never hydrates keeps its arrow everywhere.

     `*` and `!important` are both load-bearing: the cover's credit links are
     anchors, and the UA stylesheet's `cursor: pointer` on those beats a plain
     descendant rule. */
  :global(html.has-dot-cursor [data-accent-cursor]),
  :global(html.has-dot-cursor [data-accent-cursor] *) {
    cursor: none !important;
  }

  .cursor-layer {
    position: fixed;
    inset: 0;
    z-index: 100;
    pointer-events: none;
    display: none;
  }

  .cursor-layer.is-on {
    display: block;
  }

  /* No transition on either circle, by design. The cursor is not a thing that
     animates — it is a thing that is where the pointer is. */
  .cursor-dot,
  .cursor-halo {
    position: fixed;
    top: 0;
    left: 0;
    border-radius: 9999px;
    will-change: transform;
  }

  /* Ink dot, accent halo — see PAINT ON THIS BRANCH in the script block. The
     dot is the cover's own type colour because this cover is light; on a dark
     cover it would be the accent itself. */
  .cursor-dot {
    width: 9px;
    height: 9px;
    background: var(--color-base-content);
  }

  .cursor-halo {
    width: 28px;
    height: 28px;
    /* accent/35 — see the note in the script block before changing it. No
       hairline on the halo: the dot inside it already carries the edge, and a
       stroke around a 28px translucent ring reads as a bordered bead. */
    background: color-mix(in oklab, var(--color-accent) 35%, transparent);
  }
</style>
