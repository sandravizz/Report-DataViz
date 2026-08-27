<script>
  import { fade } from "svelte/transition";

  // Dot rail, shared by all report branches: one dot per chapter, hover reveals
  // the titles. Desktop only (lg+) and in the LEFT gutter — the right side
  // belongs to the description column. Figures get no dot of their own (that
  // would flatten the hierarchy); they appear indented inside the hover panel.
  let { sections = [] } = $props();

  const FADE_MS = 120;
  // The width is released only once the fading labels are really gone (a 120ms
  // fade ends a frame or two later). Releasing it early drops the box to
  // max-content while wide labels are still in it, so they stop wrapping and
  // the dots hop for a few frames.
  const WIDTH_HOLD_MS = FADE_MS + 80;
  // How far down the cover the reader has to be before the rail fades in.
  // Small enough to read as "the moment you scroll", big enough that a stray
  // trackpad nudge at rest doesn't flash it.
  const LANDING_LEAD_PX = 80;

  let activeIndex = $state(0);
  let expanded = $state(false);
  // Open geometry, held across the close so only ONE layout change happens:
  // the labels leaving. Paint still follows `expanded`.
  let boxOpen = $state(false);
  let closeTimer;
  let showRail = $state(false);
  // Whether a pinned figure sits behind the rail. Decides the panel's fill —
  // it takes whichever surface is behind it (base-100 figures, base-200 text)
  // so the opaque box never reads as a card floating on the tint. Also gates
  // the anchor read below.
  let overChart = $state(false);
  // "<chapter id>:<step>" of the pinned figure, or null between figures — read
  // off ScrollySection's anchors rather than redoing its progress maths.
  let activeChart = $state(null);

  function openPanel() {
    clearTimeout(closeTimer);
    expanded = true;
    boxOpen = true;
  }

  function closePanel() {
    clearTimeout(closeTimer);
    expanded = false;
    closeTimer = setTimeout(() => (boxOpen = false), WIDTH_HOLD_MS);
  }

  // Everything the rail shows comes from live getBoundingClientRect() reads on
  // each scroll tick, so no cached position can go stale.
  $effect(() => {
    const chapterEls = sections.map((s) => document.getElementById(s.id));
    const firstEl = chapterEls[0];
    const footerEl = document.querySelector("footer");
    if (!firstEl || !footerEl) return;

    function update() {
      const mid = window.innerHeight / 2;

      // Visible from the moment the reader leaves the cover until the footer
      // reaches the rail's own line. The footer test is against that line and
      // not the viewport bottom: the last figure is pinned against the footer,
      // so "footer off screen" blanked the rail for that whole figure.
      // The cover is one screen tall and chapter 1 follows it directly, so
      // chapter 1's top starts at innerHeight and counts down as you scroll:
      // subtracting LANDING_LEAD_PX lights the rail after that many pixels of
      // scroll, not after a whole screen of it (waiting for top <= 0 kept the
      // dots hidden through the entire cover).
      const pastLanding =
        firstEl.getBoundingClientRect().top <=
        window.innerHeight - LANDING_LEAD_PX;
      const beforeFooter = footerEl.getBoundingClientRect().top > mid;
      showRail = pastLanding && beforeFooter;
      if (!showRail && expanded) closePanel();

      // Whether a figure surface sits behind the rail's vertical midpoint.
      overChart = Array.from(document.querySelectorAll("[data-scrolly]")).some(
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= mid && rect.bottom >= mid;
        }
      );

      // The anchor NEAREST the viewport top is the figure on screen — the same
      // rule ScrollySection uses when it rounds progress, so the rail lights up
      // in step with it. ("Last anchor scrolled past" lagged half a screen.)
      let anchor = null;
      if (overChart) {
        let nearest = Infinity;
        for (const el of document.querySelectorAll("[data-chart-anchor]")) {
          const distance = Math.abs(el.getBoundingClientRect().top);
          if (distance < nearest) {
            nearest = distance;
            anchor = el;
          }
        }
      }
      activeChart = anchor
        ? `${anchor.dataset.chapter}:${anchor.dataset.step}`
        : null;

      // Active chapter: while a figure is under the rail it is simply that
      // figure's data-chapter, whichever direction the reader came from. Only
      // between figures does position decide. Position alone was the bug — a
      // chapter's section scrolls past long before its figures are done, so the
      // answer depended on scroll direction.
      let current = 0;
      chapterEls.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      if (anchor) {
        const owner = sections.findIndex((s) => s.id === anchor.dataset.chapter);
        if (owner !== -1) current = owner;
      }
      activeIndex = current;
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      clearTimeout(closeTimer);
    };
  });

  function jumpTo(index) {
    document
      .getElementById(sections[index].id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function jumpToChart(sectionId, step) {
    document
      .getElementById(`${sectionId}-chart-${step}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
</script>

<!-- THE HOVER TARGET MUST NEVER MOVE, or a cursor near its edge gets a shiver
     loop: mouseleave → collapse → geometry slides back → mouseenter. So the
     <nav> holding the handlers is a fixed-size invisible block and everything
     that moves is absolutely positioned inside it, out of flow. Overflowing
     descendants count as "inside", so the hover region only ever grows on
     open — the cycle is geometrically impossible. -->
<nav
  class="fixed top-1/2 left-9 z-40 hidden -translate-y-1/2 transition-opacity duration-200 lg:block {showRail
    ? 'opacity-100'
    : 'pointer-events-none opacity-0'}"
  onmouseenter={openPanel}
  onmouseleave={closePanel}
  aria-label="Kapitelnavigation"
  aria-hidden={!showRail}
>
  <div class="pointer-events-none h-32 w-14" aria-hidden="true"></div>

  <!-- w-96 must be a definite width: an absolute box otherwise shrink-wraps
       against its containing block (the 56px hover target) and squeezes the
       labels to a sliver. Padding stays permanent — toggling it shifted the
       rows 20px on open. left-9 + px-5 puts the dots on the same line as a bare
       left-14. The panel overlaps the chart's y-axis labels, so it is opaque and
       matches whichever surface is behind it (`overChart`).

       WIDTH: w-72 gave the title 224px — about 32 characters at text-sm — and
       a German chapter title runs past 55, so every row wrapped to two lines
       and the panel read as a wall. w-96 gives it 320px, and at text-base that
       is ~40 characters: the short and mid-length titles now sit on one line
       and only the longest still turns. It has room to grow — the rail starts
       at left-9 and the chart at 40%, so on the 1400px breakpoint this panel
       ends 140px clear of the plot. -->
  <div
    class="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col gap-4 rounded-2xl px-5 py-4 transition-[background-color,box-shadow] duration-200 {boxOpen
      ? 'w-96'
      : 'w-max'} {expanded
      ? `shadow-lg ${overChart ? 'bg-base-100' : 'bg-base-200'}`
      : ''}"
  >
    {#each sections as section, i (section.id)}
      <!-- Dot row + chart list as one flex item, so gap-4 stays a
           chapter-to-chapter rhythm. -->
      <div class="group/chapter flex flex-col">
        <button
          type="button"
          onclick={() => jumpTo(i)}
          aria-current={activeIndex === i ? "true" : undefined}
          class="group flex cursor-pointer items-start gap-3 p-1.5 -m-1.5 text-left"
        >
          <!-- Hovering a non-current chapter marks it without imitating the
               selected state (the dot shrinks into a halo, the label goes to
               full contrast), so the row reads as clickable without a link
               underline. mt-0.5 centres the dot on the label's first line.

               The active dot is an amber fill behind a 1px navy stroke, and NO
               halo. The halo was the thing that made this read as a sticker — it
               put a 4px ring around the dot and made the active row twice the
               visual size of its neighbours. Without it the same fill sits
               quietly. The hairline stroke is what makes it legible at all: the
               accent is light against both surfaces the rail passes over, so
               amber alone has no edge to read against.

               Hover no longer approaches that state, it inverts it: the core
               shrinks to a pinpoint while the translucent halo widens around it,
               so the current chapter is mostly ink and a hovered one is mostly
               air. At equal size, fill-plus-halo beside fill-alone read as two
               versions of one state. The shrink is a scale transform, never
               smaller h/w — the dot is a flex item beside the title, which would
               slide left on every hover. The ring scales with the dot, so its px
               value is pre-multiplied: ring-[9px] at scale-60 paints a ~5px
               band. The navy stroke scales too, so on hover it paints at
               ~0.9px — still an edge for the light amber, just a finer one.

               The dot keys off `group/chapter` — the wrapper around the chapter
               button AND its figure list — so hovering any figure lights its
               chapter's dot. The title keeps the button's own `group`, so a
               figure hover does not darken the heading. -->
          <span
            class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
              ? 'h-3 w-3 border border-primary bg-accent'
              : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover/chapter:scale-[0.6] group-hover/chapter:border-primary group-hover/chapter:bg-accent group-hover/chapter:ring-[9px] group-hover/chapter:ring-accent/25'}"
          ></span>
          {#if expanded}
            <span
              transition:fade={{ duration: FADE_MS }}
              class="text-base leading-snug transition-colors duration-200 {activeIndex ===
              i
                ? 'font-semibold text-primary'
                : 'text-base-content/70 group-hover:text-base-content'}"
            >
              {section.title}
            </span>
          {/if}
        </button>

        {#if expanded && section.charts?.length}
          <!-- Keyed by index: the animated steps share a figure number (and
               title, hence `stepLabel`). -->
          <ul
            transition:fade={{ duration: FADE_MS }}
            class="mt-2 ml-1.5 flex flex-col gap-1.5 border-l-2 border-accent py-0.5 pl-4"
          >
            {#each section.charts as chart, j (j)}
              <li>
                <button
                  type="button"
                  onclick={() => jumpToChart(section.id, j)}
                  aria-current={activeChart === `${section.id}:${j}`
                    ? "true"
                    : undefined}
                  class="cursor-pointer text-left text-sm leading-snug transition-colors duration-200 {activeChart ===
                  `${section.id}:${j}`
                    ? 'font-medium text-primary'
                    : 'text-base-content/70 hover:text-base-content'}"
                >
                  <!-- One uniform row: the figure number gets no weight or
                       colour of its own. Bolder or lighter text inside an
                       already de-emphasized row reads as a second COLOUR, so
                       the panel had two resting tones at once. Selection is
                       the only thing that changes a row's tone.

                       That rule now holds across the whole panel, not just
                       within a row: chapters and their figures share ONE
                       resting alpha. They had drifted apart — chapters at /55
                       and figures at /70 — which put the nested rows a step
                       DARKER than the headings they sit under, sub-items
                       reading stronger than their own chapter. The shared
                       value is this branch's quiet-text alpha from
                       docs/type-rendering.md. -->
                  {chart.number}
                  {chart.stepLabel ?? chart.title}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </div>
</nav>
