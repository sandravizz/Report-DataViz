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

  <!-- w-72 must be a definite width: an absolute box otherwise shrink-wraps
       against its containing block (the 56px hover target) and squeezes the
       labels to a sliver. Padding stays permanent — toggling it shifted the
       rows 20px on open. left-9 + px-5 puts the dots on the same line as a bare
       left-14. The panel overlaps the chart's y-axis labels, so it is opaque and
       matches whichever surface is behind it (`overChart`). -->
  <div
    class="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col gap-4 rounded-2xl px-5 py-4 transition-[background-color,box-shadow] duration-200 {boxOpen
      ? 'w-72'
      : 'w-max'} {expanded
      ? `shadow-lg ${overChart ? 'bg-base-100' : 'bg-base-200'}`
      : ''}"
  >
    {#each sections as section, i (section.id)}
      <!-- Dot row + chart list as one flex item, so gap-4 stays a
           chapter-to-chapter rhythm. -->
      <div class="flex flex-col">
        <button
          type="button"
          onclick={() => jumpTo(i)}
          aria-current={activeIndex === i ? "true" : undefined}
          class="group flex cursor-pointer items-start gap-3 p-1.5 -m-1.5 text-left"
        >
          <!-- Hovering a non-current chapter previews the selected state, so
               the row reads as clickable without a link underline. mt-0.5
               centres the dot on the label's first line.

               The active dot is an amber fill behind a 1px navy stroke, and
               NO halo. The halo was the thing that made this read as a sticker
               — it put a 4px ring around the dot and made the active row twice
               the visual size of its neighbours. Without it the same fill sits
               quietly. The hairline stroke is what makes it legible at all:
               the accent is light against both surfaces the rail passes over,
               so amber alone has no edge to read against. -->
          <span
            class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
              ? 'h-3 w-3 border border-primary bg-accent'
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
                  class="cursor-pointer text-left text-xs leading-snug transition-colors duration-200 {activeChart ===
                  `${section.id}:${j}`
                    ? 'font-medium text-primary'
                    : 'text-base-content/70 hover:text-base-content'}"
                >
                  <!-- The figure number is set apart by WEIGHT, not colour: at
                       this size a second, lighter tint on top of an already
                       de-emphasized row stopped being readable. -->
                  <span class="font-medium">{chart.number}</span>
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
