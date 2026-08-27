<script>
  import { fade } from "svelte/transition";

  // Dot rail, shared by all report branches: one dot per chapter, hover reveals
  // the titles. Desktop only (lg+) and in the LEFT gutter — the right belongs
  // to the description column, where the dots overlapped its text. Charts get
  // no dot of their own (it would read as a chapter and flatten the hierarchy);
  // they appear only in the hover panel, indented under their chapter.
  let { sections = [] } = $props();

  const FADE_MS = 120;
  // Release the width only once the fading labels are really gone (a 120ms fade
  // ends a frame or two later). Anything shorter drops the box to max-content
  // while wide labels are still in it: they unwrap, two-line rows become one,
  // and the dots hop before settling.
  const WIDTH_HOLD_MS = FADE_MS + 80;

  let activeIndex = $state(0);
  let expanded = $state(false);
  // Open geometry, held across the close so only ONE layout change happens: the
  // labels leaving. Paint (bg + shadow) still follows `expanded`.
  let boxOpen = $state(false);
  let closeTimer;
  let showRail = $state(false);
  // The panel overlaps the chart's y-axis labels, so it can't be transparent;
  // instead it matches whichever surface is behind it — base-200 over a
  // chapter, base-100 over a pinned figure.
  let overChart = $state(false);
  // "<chapter id>:<step>" of the pinned figure, or null between figures. Read
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

  // Everything the rail shows comes from live getBoundingClientRect() reads per
  // scroll tick — nothing cached, so no position can go stale.
  $effect(() => {
    const chapterEls = sections.map((s) => document.getElementById(s.id));
    const firstEl = chapterEls[0];
    const footerEl = document.querySelector("footer");
    if (!firstEl || !footerEl) return;

    function update() {
      const mid = window.innerHeight / 2;

      // Visible from chapter 1 until the footer reaches the rail's own line —
      // not the viewport bottom: the last figure is pinned against the footer,
      // so testing "footer on screen at all" blanked the rail for that figure.
      const pastLanding = firstEl.getBoundingClientRect().top <= 0;
      const beforeFooter = footerEl.getBoundingClientRect().top > mid;
      showRail = pastLanding && beforeFooter;
      if (!showRail && expanded) closePanel();

      // Which surface sits behind the rail's vertical midpoint.
      overChart = Array.from(document.querySelectorAll("[data-scrolly]")).some(
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= mid && rect.bottom >= mid;
        }
      );

      // The anchor NEAREST the viewport top is the figure on screen: anchors
      // sit where their step is exactly centred and ScrollySection switches by
      // rounding progress, so this is the same rule and lights up in sync.
      // ("Last anchor scrolled past" lagged half a screen behind the chart.)
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

      // Active chapter: a figure ALWAYS belongs to the chapter that owns it, so
      // while one is under the rail the answer is its data-chapter. Only
      // between figures does position decide (last chapter past the midline).
      // Position alone was the bug — a chapter's section scrolls past long
      // before its figures do, making the answer scroll-direction dependent.
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

<!-- THE HOVER TARGET MUST NEVER MOVE. If opening the panel shifts geometry out
     from under a cursor near its edge you get a 200ms shiver loop: mouseleave →
     collapse → geometry slides back → mouseenter. So the <nav> holding the
     handlers is a fixed-size invisible block (h-32 w-14) and everything that
     moves is absolutely positioned inside it, out of flow. Overflowing
     descendants still count as "inside", so the hover region only ever grows on
     open — the cycle is impossible whatever the panel contains. -->
<nav
  class="fixed top-1/2 left-9 z-40 hidden -translate-y-1/2 transition-opacity duration-200 lg:block {showRail
    ? 'opacity-100'
    : 'pointer-events-none opacity-0'}"
  onmouseenter={openPanel}
  onmouseleave={closePanel}
  aria-label="Chapter navigation"
  aria-hidden={!showRail}
>
  <div class="pointer-events-none h-32 w-14" aria-hidden="true"></div>

  <!-- WIDTH: w-72 gave the title ~32 characters and a chapter title runs
       well past that, so nearly every row wrapped to two lines and the panel
       read as a wall. w-96 gives it 320px, ~40 characters at text-base. The
       rail starts at left-9 and the chart at 40%, so this still ends well
       clear of the plot. See docs/chapter-nav-states.md.

       w-96 must be a definite width: an absolute box shrink-wraps against its
       containing block (the 56px hover target), which squeezed labels to a
       sliver. Padding stays permanent — toggling it shifted rows 20px right on
       open, the horizontal half of the shiver above. left-9 + px-5 puts the
       dots on the same 56px line as a bare left-14. -->
  <div
    class="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col gap-4 rounded-2xl px-5 py-4 transition-[background-color,box-shadow] duration-200 {boxOpen
      ? 'w-96'
      : 'w-max'} {expanded ? `shadow-lg ${overChart ? 'bg-base-100' : 'bg-base-200'}` : ''}"
  >
    {#each sections as section, i (section.id)}
      <!-- Dot row + chart list as one flex item, so the panel's gap-4 stays a
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
               underline. mt-0.5 optically centres the dot on the first line of a
               wrapping title. Current is base-content, NOT primary — the rail is
               deliberately colourless, greys and the near-black only.

               Hover no longer approaches that state, it inverts it: the core
               shrinks to a pinpoint while the translucent halo widens around it,
               so the current chapter is mostly ink and a hovered one is mostly
               air. At equal size, fill-plus-halo beside fill-alone read as two
               versions of one state. The shrink is a scale transform, never
               smaller h/w — the dot is a flex item beside the title, which would
               slide left on every hover. The ring scales with the dot, so its px
               value is pre-multiplied: ring-[9px] at scale-60 paints a ~5px
               band.

               The dot keys off `group/chapter` — the wrapper around the chapter
               button AND its figure list — so hovering any figure lights its
               chapter's dot. The title keeps the button's own `group`, so a
               figure hover does not darken the heading. -->
          <span
            class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
              ? 'h-3 w-3 bg-base-content'
              : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover/chapter:scale-[0.6] group-hover/chapter:border-base-content group-hover/chapter:bg-base-content group-hover/chapter:ring-[9px] group-hover/chapter:ring-base-content/10'}"
          ></span>
          {#if expanded}
            <span
              transition:fade={{ duration: FADE_MS }}
              class="text-base leading-snug transition-colors duration-200 {activeIndex ===
              i
                ? 'font-semibold text-base-content'
                : 'text-base-content/65 group-hover:text-base-content'}"
            >
              {section.shortTitle}
            </span>
          {/if}
        </button>

        {#if expanded && section.charts?.length}
          <ul
            transition:fade={{ duration: FADE_MS }}
            class="mt-2 ml-1.5 flex flex-col gap-1.5 border-l border-base-content/15 py-0.5 pl-4"
          >
            {#each section.charts as chart, j (chart.number ?? j)}
              <li>
                <button
                  type="button"
                  onclick={() => jumpToChart(section.id, j)}
                  aria-current={activeChart === `${section.id}:${j}`
                    ? "true"
                    : undefined}
                  class="cursor-pointer text-left text-sm leading-snug transition-colors duration-200 {activeChart ===
                  `${section.id}:${j}`
                    ? 'font-medium text-base-content'
                    : 'text-base-content/65 hover:text-base-content'}"
                >
                  {chart.number}
                  {chart.title}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </div>
</nav>
