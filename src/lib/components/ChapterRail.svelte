<script>
  import { fade } from "svelte/transition";

  // Chapter-nav pattern C (dot rail): a dot per chapter, current one filled;
  // hovering the rail reveals the full chapter list with the current one
  // bolded. Standardized across all three report branches (main, findevlab,
  // template) on this pattern — replaces the block-spine rail (option B)
  // this branch briefly had.
  // Charts deliberately get NO dot of their own: a dot per figure would read
  // as a chapter and flatten the hierarchy. They exist only inside the hover
  // panel, listed one indent under the chapter they belong to (a chart belongs
  // to whichever chapter's text last preceded it — which is exactly how
  // +page.svelte nests them, in `section.charts`).
  // Desktop only (lg+) — hidden on tablets and phones.
  // Lives in the LEFT gutter (the empty column left of the figure card),
  // McKinsey-style, not on the right: the right side is the description
  // column's, and the dots were sitting on top of its text edge.
  let { sections = [] } = $props();

  let activeIndex = $state(0);
  let expanded = $state(false);
  let showRail = $state(false);
  // The rail floats over two different surfaces as you scroll: chapter
  // sections are the theme's base-100 pink, the pinned figure sections a flat
  // white. The hover panel can't just be transparent (it overlaps the chart's
  // y-axis labels), so it takes the colour of whatever is behind it and lets
  // the shadow alone lift it off the page.
  let overChart = $state(false);
  // "<chapter id>:<step>" of the figure currently pinned, or null between
  // figures. Read off the anchors ScrollySection lays down rather than
  // recomputing its progress maths here.
  let activeChart = $state(null);

  // Hides the rail while Landing (above the first chapter) or Footer (below
  // the last) occupies any part of the viewport — it should only appear
  // once the reader is actually inside a chapter. Reads live
  // getBoundingClientRect() on every scroll tick rather than caching a
  // position up front, so it can't go stale like the old activeIndex bug.
  $effect(() => {
    const firstEl = document.getElementById(sections[0]?.id);
    const footerEl = document.querySelector("footer");
    if (!firstEl || !footerEl) return;

    function update() {
      const pastLanding = firstEl.getBoundingClientRect().top <= 0;
      const beforeFooter = footerEl.getBoundingClientRect().top >= window.innerHeight;
      showRail = pastLanding && beforeFooter;
      if (!showRail) expanded = false;

      // Which surface sits behind the rail's vertical midpoint.
      const mid = window.innerHeight / 2;
      overChart = Array.from(document.querySelectorAll("[data-scrolly]")).some(
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= mid && rect.bottom >= mid;
        }
      );

      // The last anchor scrolled past is the figure on screen. Only meaningful
      // while a figure surface is actually pinned — in a chapter's text the
      // last anchor passed belongs to the chapter before it.
      if (overChart) {
        let current = null;
        for (const el of document.querySelectorAll("[data-chart-anchor]")) {
          if (el.getBoundingClientRect().top <= 1) current = el;
        }
        activeChart = current
          ? `${current.dataset.chapter}:${current.dataset.step}`
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
    };
  });

  // Uses IntersectionObserver directly on each chapter's section element
  // (rather than caching scroll positions up front, like ScrollySection
  // does for its continuous chart-step progress) so "current chapter" is
  // always read from actual viewport intersection, never a stale snapshot.
  $effect(() => {
    const watched = sections
      .map((s, i) => ({ el: document.getElementById(s.id), i }))
      .filter((entry) => entry.el);

    if (watched.length === 0) return;

    const visible = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const match = watched.find((w) => w.el === entry.target);
          if (!match) continue;
          if (entry.isIntersecting) {
            visible.add(match.i);
          } else {
            visible.delete(match.i);
          }
        }
        if (visible.size > 0) {
          activeIndex = Math.max(...visible);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    watched.forEach((entry) => observer.observe(entry.el));

    return () => observer.disconnect();
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


<!-- THE HOVER TARGET MUST NEVER MOVE. Every shiver this rail has had was the
     same loop: opening the panel shifted geometry out from under a cursor
     sitting near its edge → mouseleave → collapse → geometry slid back under
     the cursor → mouseenter, at 200ms a cycle. Horizontally it was padding
     added on hover; vertically it's the chart lists, which push the chapter
     rows hundreds of pixels apart as they open (and, the rail being centred,
     drag the top row up as the bottom row goes down).
     So the <nav> — the element the mouse handlers are on — is a fixed-size
     invisible block that never changes, and the panel that does all the moving
     is absolutely positioned inside it, out of flow. mouseenter/mouseleave
     count descendants as "inside" even when they overflow, so the live hover
     region is (fixed block ∪ panel): it can only grow when the panel opens,
     and it only shrinks again after the cursor has already left it. A cycle is
     no longer geometrically possible, whatever we later put in the panel.
     h-32 w-14 is the closed rail (~52×100) plus a little slack, so the dots
     stay comfortable to hit. -->
<nav
  class="fixed top-1/2 left-9 z-40 hidden -translate-y-1/2 transition-opacity duration-200 lg:block {showRail
    ? 'opacity-100'
    : 'pointer-events-none opacity-0'}"
  onmouseenter={() => (expanded = true)}
  onmouseleave={() => (expanded = false)}
  aria-label="Chapter navigation"
  aria-hidden={!showRail}
>
  <div class="pointer-events-none h-32 w-14" aria-hidden="true"></div>

  <!-- The open panel needs a definite width (w-72), because an absolutely
       positioned box shrink-wraps against its containing block — and this one's
       containing block is that 56px hover target, which squeezed every label to
       a sliver. A definite width also retires the old 0fr → 1fr column trick:
       that sized itself off the labels' intrinsic width, which an absolute box
       can't offer, and it clipped the longer chapter titles mid-word anyway.
       Labels wrap inside the fixed width instead, and are only rendered while
       open, so nothing has to be collapsed to zero.
       Padding is permanent: when it toggled, the rows shifted 20px right on
       open — the horizontal half of the same shiver. left-9 + px-5 keeps the
       dots on the same 56px line as the old left-14. -->
  <div
    class="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col gap-4 rounded-2xl px-5 py-4 transition-[background-color,box-shadow] duration-200 {expanded
      ? `w-72 shadow-lg ${overChart ? 'bg-white' : 'bg-base-100'}`
      : 'w-max'}"
  >
    {#each sections as section, i (section.id)}
      <!-- One flex item per chapter — dot row plus its chart list — so the
           panel's gap-4 stays a chapter-to-chapter rhythm. -->
      <div class="flex flex-col">
        <button
          type="button"
          onclick={() => jumpTo(i)}
          aria-current={activeIndex === i ? "true" : undefined}
          class="group flex cursor-pointer items-start gap-3 p-1.5 -m-1.5 text-left"
        >
          <!-- Hovering a non-current chapter previews the selected state: the
               hollow dot picks up a tint and a darker rim, the muted label goes
               to full contrast. Two coordinated cues in the rail's own visual
               language, so the row reads as clickable without adding a link
               underline. The current chapter stays put — it's already there.
               mt-0.5 optically centres the dot on the label's first line now
               that a long title can wrap to two. -->
          <span
            class="mt-0.5 block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
              ? 'h-3 w-3 bg-primary ring-4 ring-primary/15'
              : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover:border-base-content/70 group-hover:bg-base-content/15'}"
          ></span>
          {#if expanded}
            <span
              transition:fade={{ duration: 120 }}
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
            transition:fade={{ duration: 120 }}
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
