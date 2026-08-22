<script>
  import { fade } from "svelte/transition";

  // Dot rail, shared by all report branches: one dot per chapter, hover
  // reveals the titles. Desktop only (lg+), and in the LEFT gutter — the right
  // side belongs to the description column, where the dots overlapped text.
  // Charts get NO dot of their own; that would read as a chapter and flatten
  // the hierarchy. They show only inside the hover panel, indented under their
  // chapter (as +page.svelte nests them in `section.charts`).
  let { sections = [] } = $props();

  const FADE_MS = 120;
  // Release the width only once the fading labels are really gone — a 120ms
  // fade ends a frame or two later. Any less slack and the box drops to
  // max-content with wide labels still in it: they stop wrapping, two-line
  // rows collapse to one, and the dots hop before settling.
  const WIDTH_HOLD_MS = FADE_MS + 80;
  // How far down the cover the reader has to be before the rail fades in, as a
  // fraction of the viewport. A fixed 80px lit the rail while the whole cover
  // was still on screen, so the dots read as part of the title page. Just over
  // half a screen holds them back until the cover is genuinely on its way out
  // and the first chapter is rising into view. A fraction, not pixels, so it
  // lands at the same point on a laptop and a tall monitor.
  const LANDING_LEAD_VH = 0.55;

  let activeIndex = $state(0);
  let expanded = $state(false);
  // Open geometry, held across the close so only ONE layout change happens:
  // the labels leaving. Paint (bg + shadow) still follows `expanded`.
  let boxOpen = $state(false);
  let closeTimer;
  let showRail = $state(false);
  // The panel overlaps the chart's y-axis labels, so it can't be transparent —
  // it matches whatever is behind it: base-100 grey over a chapter, flat white
  // over a pinned figure.
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

  // Everything the rail shows comes from live getBoundingClientRect() reads on
  // each scroll tick — nothing is cached up front, so no position goes stale.
  $effect(() => {
    const chapterEls = sections.map((s) => document.getElementById(s.id));
    const firstEl = chapterEls[0];
    const footerEl = document.querySelector("footer");
    if (!firstEl || !footerEl) return;

    function update() {
      const mid = window.innerHeight / 2;

      // Visible from the moment the reader leaves the cover until the footer
      // reaches the rail's own line — testing against the viewport bottom
      // instead blanks the rail for the whole last figure, which is pinned
      // against the footer.
      // The cover is one screen tall and chapter 1 follows it directly, so
      // chapter 1's top starts at innerHeight and counts down as you scroll:
      // subtracting the lead lights the rail after that much scrolling, not
      // after a whole screen of it (waiting for top <= 0 kept the dots hidden
      // through the entire cover).
      const pastLanding =
        firstEl.getBoundingClientRect().top <=
        window.innerHeight * (1 - LANDING_LEAD_VH);
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

      // The anchor NEAREST the viewport top is the figure on screen: each sits
      // at the offset where its step is exactly centred, and ScrollySection
      // switches charts by rounding progress, so this is the same rule. ("Last
      // anchor scrolled past" lit up half a screen late.)
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

      // Active chapter. While a figure is under the rail, it is that figure's
      // data-chapter — a figure always belongs to its owning chapter, whatever
      // direction the reader came from. Position decides only between figures.
      // Position ALONE was the bug: a chapter's section scrolls past long
      // before its figures end, so "last one above the midline" was
      // scroll-direction dependent.
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


<!-- THE HOVER TARGET MUST NEVER MOVE. Geometry shifting out from under a
     cursor near its edge gives a 200ms shiver loop: mouseleave → collapse →
     geometry slides back → mouseenter. So the <nav> holding the handlers is a
     fixed-size invisible block (h-32 w-14 ≈ closed rail plus slack) and
     everything that moves is absolutely positioned inside it, out of flow.
     Since mouseenter/leave count overflowing descendants as "inside", the
     hover region is (block ∪ panel) — it only ever grows on open, so the
     cycle is impossible whatever the panel later contains. -->
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

  <!-- w-72 must be a definite width: an absolute box shrink-wraps against its
       containing block — the 56px hover target — which squeezed labels to a
       sliver. Padding stays permanent; toggling it shifted rows 20px right on
       open, the horizontal half of the shiver above. left-9 + px-5 puts the
       dots on the same 56px line as a bare left-14. -->
  <div
    class="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col gap-4 rounded-2xl px-5 py-4 transition-[background-color,box-shadow] duration-200 {boxOpen
      ? 'w-72'
      : 'w-max'} {expanded ? `shadow-lg ${overChart ? 'bg-white' : 'bg-base-100'}` : ''}"
  >
    {#each sections as section, i (section.id)}
      <!-- Dot row + chart list as one flex item, so the panel's gap-4 stays a
           chapter-to-chapter rhythm. -->
      <div class="flex flex-col">
        <button
          type="button"
          onclick={() => jumpTo(i)}
          aria-current={activeIndex === i ? "true" : undefined}
          class="group flex cursor-pointer items-start gap-3 p-1.5 -m-1.5 text-left"
        >
          <!-- Hovering a non-current chapter previews its selected state, so
               the row reads as clickable without a link underline. mt-0.5
               optically centres the dot on the label's first line (titles
               wrap, so the row is not always one line tall).

               The active dot is a bare accent fill: no halo, no stroke. Both
               were tried and both made it a sticker — the halo put a 4px ring
               around it and doubled the active row's visual size, and even a
               1px stroke read as an outline drawn on top rather than one dot
               that had simply filled in. What separates it from its neighbours
               is fill and size (12px solid vs 10px hairline ring), not an
               added edge. -->
          <span
            class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
              ? 'h-3 w-3 bg-accent'
              : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover:border-base-content/70 group-hover:bg-base-content/15'}"
          ></span>
          {#if expanded}
            <span
              transition:fade={{ duration: FADE_MS }}
              class="text-sm leading-snug transition-colors duration-200 {activeIndex ===
              i
                ? 'font-semibold text-primary'
                : 'text-base-content/55 group-hover:text-base-content'}"
            >
              {section.title}
            </span>
          {/if}
        </button>

        {#if expanded && section.charts?.length}
          <ul
            transition:fade={{ duration: FADE_MS }}
            class="mt-2 ml-1.5 flex flex-col gap-1.5 border-l-2 border-accent py-0.5 pl-4"
          >
            {#each section.charts as chart, j (chart.number ?? j)}
              <li>
                <button
                  type="button"
                  onclick={() => jumpToChart(section.id, j)}
                  aria-current={activeChart === `${section.id}:${j}`
                    ? "true"
                    : undefined}
                  class="cursor-pointer text-left text-xs leading-snug transition-colors duration-200 {activeChart ===
                  `${section.id}:${j}`
                    ? 'font-medium text-primary'
                    : 'text-base-content/70 hover:text-base-content'}"
                >
                  <!-- The figure number is set apart by WEIGHT, not colour: at
                       this size a second, lighter tint on top of an already
                       de-emphasized row stopped being readable. -->
                  <span class="font-medium">{chart.number}</span>
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
