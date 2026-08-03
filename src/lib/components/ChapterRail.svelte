<script>
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

<!-- The padding is permanent and only the background/shadow toggle, because the
     hover target must not move when the panel opens. It used to gain px-5 on
     hover, which shifted every row 20px right; combined with the rows' -m-1.5
     (their hit box overflows the nav's left edge, so approaching from the left
     triggers mouseenter early) that shift pulled the row out from under the
     cursor, fired mouseleave, collapsed, slid it back — a 200ms open/close
     shiver. Constant padding also widens the closed rail's grab zone to 20px
     either side of the dots. left-9 + px-5 puts the dots at the same 56px as
     the old left-14. -->
<nav
  class="fixed top-1/2 left-9 z-40 hidden -translate-y-1/2 flex-col items-start gap-4 rounded-2xl px-5 py-4 transition-[background-color,box-shadow,opacity] duration-200 lg:flex {expanded
    ? `shadow-lg ${overChart ? 'bg-white' : 'bg-base-100'}`
    : ''} {showRail ? 'opacity-100' : 'pointer-events-none opacity-0'}"
  onmouseenter={() => (expanded = true)}
  onmouseleave={() => (expanded = false)}
  aria-label="Chapter navigation"
  aria-hidden={!showRail}
>
  {#each sections as section, i (section.id)}
    <!-- One flex item per chapter — dot row plus its (collapsed) chart list —
         so the nav's gap-4 stays a chapter-to-chapter rhythm and doesn't also
         space out the zero-height chart lists. -->
    <div class="flex flex-col">
      <button
        type="button"
        onclick={() => jumpTo(i)}
        aria-current={activeIndex === i ? "true" : undefined}
        class="group flex cursor-pointer items-center gap-3 p-1.5 -m-1.5"
      >
        <!-- Hovering a non-current chapter previews the selected state: the
             hollow dot picks up a tint and a darker rim, the muted label goes
             to full contrast. Two coordinated cues in the rail's own visual
             language, so the row reads as clickable without adding a link
             underline. The current chapter stays put — it's already there. -->
        <span
          class="block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
            ? 'h-3 w-3 bg-primary ring-4 ring-primary/15'
            : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover:border-base-content/70 group-hover:bg-base-content/15'}"
        ></span>
        <!-- Width animates via a 0fr → 1fr grid column rather than a max-width:
             a max-width has to be a fixed number, which clipped the longer
             chapter titles. 1fr resolves to the label's own intrinsic width, so
             the panel sizes itself to the longest title, whatever it is. -->
        <span
          class="grid transition-[grid-template-columns,opacity] duration-200 {expanded
            ? 'grid-cols-[1fr] opacity-100'
            : 'grid-cols-[0fr] opacity-0'}"
        >
          <span
            class="overflow-hidden text-sm whitespace-nowrap transition-colors duration-200 {activeIndex ===
            i
              ? 'font-semibold text-primary'
              : 'text-base-content/55 group-hover:text-base-content'}"
          >
            {section.title}
          </span>
        </span>
      </button>

      {#if section.charts?.length}
        <!-- Collapses on BOTH axes: rows 0fr keeps the closed rail a bare
             column of dots; cols 0fr keeps it from claiming width the reader
             can't see — an invisible wide nav would open the panel on a stray
             hover far to its right. Same 0fr → 1fr trick as the chapter labels.
             Chart titles wrap inside a max-w instead of running nowrap like the
             chapter titles do, so a long figure name can't push the panel out
             over the chart it's pointing at. -->
        <div
          class="grid transition-[grid-template-columns,grid-template-rows,opacity] duration-200 {expanded
            ? 'grid-cols-[1fr] grid-rows-[1fr] opacity-100'
            : 'pointer-events-none grid-cols-[0fr] grid-rows-[0fr] opacity-0'}"
        >
          <div class="overflow-hidden">
            <ul
              class="mt-2 ml-1.5 flex flex-col gap-1.5 border-l border-base-content/15 py-0.5 pl-4"
            >
              {#each section.charts as chart, j (chart.number ?? j)}
                <li>
                  <button
                    type="button"
                    tabindex={expanded ? 0 : -1}
                    onclick={() => jumpToChart(section.id, j)}
                    aria-current={activeChart === `${section.id}:${j}`
                      ? "true"
                      : undefined}
                    class="max-w-64 cursor-pointer text-left text-xs leading-snug transition-colors duration-200 {activeChart ===
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
          </div>
        </div>
      {/if}
    </div>
  {/each}
</nav>
