<script>
  import { fade } from "svelte/transition";

  // Dot rail, shared by all report branches: one dot per chapter, hover reveals
  // the titles. Desktop only (lg+), and in the LEFT gutter — the right side
  // belongs to the description column, where the dots overlapped its text.
  // Charts get NO dot of their own; a dot per figure would read as a chapter
  // and flatten the hierarchy. They appear only inside the hover panel, one
  // indent under their chapter (as +page.svelte nests them in `section.charts`).
  let { sections = [] } = $props();

  const FADE_MS = 120;
  // The width has to be released only once the fading labels are really gone,
  // and a fade that is scheduled for 120ms ends a frame or two later. Anything
  // shorter than the outro plus that slack drops the box to max-content while
  // wide labels are still in it: they stop wrapping, every two-line row becomes
  // one, and the dots hop for those frames before settling.
  const WIDTH_HOLD_MS = FADE_MS + 80;

  let activeIndex = $state(0);
  let expanded = $state(false);
  // Open geometry, held across the close so only ONE layout change happens —
  // the labels leaving. Paint (bg + shadow) still follows `expanded`, fading
  // out on the box's own transition.
  let boxOpen = $state(false);
  let closeTimer;
  let showRail = $state(false);
  // The panel overlaps the chart's y-axis labels, so it can't be transparent;
  // instead it matches whichever surface is behind it — base-100 pink over a
  // chapter, flat white over a pinned figure.
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

  // Everything the rail shows is derived from one scroll tick of live
  // getBoundingClientRect() reads — nothing is cached up front, so no position
  // can go stale. Visibility: the rail shows once chapter 1 reaches the top and
  // stays up until the footer reaches the rail itself.
  $effect(() => {
    const chapterEls = sections.map((s) => document.getElementById(s.id));
    const firstEl = chapterEls[0];
    const footerEl = document.querySelector("footer");
    if (!firstEl || !footerEl) return;

    function update() {
      const mid = window.innerHeight / 2;

      // The footer test is against the rail's own line, not the viewport
      // bottom: the last figure is pinned right up against the footer, so
      // "footer not on screen at all" blanked the rail — including the dots —
      // for the whole of that figure. It hides once the footer reaches it.
      const pastLanding = firstEl.getBoundingClientRect().top <= 0;
      const beforeFooter = footerEl.getBoundingClientRect().top > mid;
      showRail = pastLanding && beforeFooter;
      if (!showRail && expanded) closePanel();

      // Active chapter = the last one whose top has crossed the midline. A
      // chapter's figures are siblings that FOLLOW it in the document, so this
      // keeps the chapter lit for the whole run of its figures — in both
      // directions. (Asking "which chapter is on screen?" instead can't answer
      // while a figure is pinned, and holding the previous answer only reads
      // correctly scrolling down: coming back up it names the chapter below.)
      let current = 0;
      chapterEls.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      activeIndex = current;

      // Which surface sits behind the rail's vertical midpoint.
      overChart = Array.from(document.querySelectorAll("[data-scrolly]")).some(
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= mid && rect.bottom >= mid;
        }
      );

      // The anchor NEAREST the viewport top is the figure on screen. Each
      // anchor sits at the scroll offset where its step is exactly centred,
      // and ScrollySection switches charts by rounding progress — so nearest
      // anchor is the same rule, and the rail lights the new figure at the
      // start of its scroll. ("Last anchor scrolled past" instead waited for
      // the step's midpoint, half a screen after the chart had changed.)
      if (overChart) {
        let anchor = null;
        let nearest = Infinity;
        for (const el of document.querySelectorAll("[data-chart-anchor]")) {
          const distance = Math.abs(el.getBoundingClientRect().top);
          if (distance < nearest) {
            nearest = distance;
            anchor = el;
          }
        }
        activeChart = anchor
          ? `${anchor.dataset.chapter}:${anchor.dataset.step}`
          : null;
      } else {
        activeChart = null;
      }
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
     from under a cursor near its edge, you get a 200ms shiver loop: mouseleave
     → collapse → geometry slides back → mouseenter. So the <nav> carrying the
     mouse handlers is a fixed-size invisible block (h-32 w-14 ≈ the closed rail
     plus slack), and everything that moves — chart lists can push the rows
     hundreds of pixels apart — is absolutely positioned inside it, out of flow.
     Since mouseenter/mouseleave count overflowing descendants as "inside", the
     hover region is (block ∪ panel): it only ever grows on open, making the
     cycle geometrically impossible whatever the panel later contains. -->
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
       containing block, here the 56px hover target, which squeezed labels to a
       sliver. Labels wrap inside it and only render while open, so nothing is
       collapsed to zero. Padding stays permanent — toggling it shifted the rows
       20px right on open, the horizontal half of the shiver above. left-9 +
       px-5 puts the dots on the same 56px line as a bare left-14. -->
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
          <!-- Hovering a non-current chapter previews the selected state (dot
               tints and darkens, label goes to full contrast) so the row reads
               as clickable without a link underline. mt-0.5 optically centres
               the dot on the label's first line, since titles can wrap. -->
          <span
            class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
              ? 'h-3 w-3 bg-primary ring-4 ring-primary/15'
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
                  class="cursor-pointer text-left text-xs leading-snug transition-colors duration-200 {activeChart ===
                  `${section.id}:${j}`
                    ? 'font-medium text-primary'
                    : 'text-base-content/45 hover:text-base-content'}"
                >
                  <span class="opacity-70">{chart.number}</span>
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
