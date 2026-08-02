<script>
  // Chapter-nav pattern C (dot rail): a dot per chapter, current one filled;
  // hovering the rail reveals the full chapter list with the current one
  // bolded. Standardized across all three report branches (main, findevlab,
  // template) on this pattern — replaces the block-spine rail (option B)
  // this branch briefly had.
  // Desktop only (lg+) — hidden on tablets and phones.
  let { sections = [] } = $props();

  let activeIndex = $state(0);
  let expanded = $state(false);
  let showRail = $state(false);

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
</script>

<nav
  class="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 rounded-box transition-[background-color,padding,box-shadow,opacity] duration-200 lg:flex {expanded
    ? 'bg-base-200/95 px-5 py-4 shadow-lg'
    : ''} {showRail ? 'opacity-100' : 'pointer-events-none opacity-0'}"
  onmouseenter={() => (expanded = true)}
  onmouseleave={() => (expanded = false)}
  aria-label="Chapter navigation"
  aria-hidden={!showRail}
>
  {#each sections as section, i (section.id)}
    <button
      type="button"
      onclick={() => jumpTo(i)}
      aria-current={activeIndex === i ? "true" : undefined}
      class="flex items-center gap-3 p-1.5 -m-1.5"
    >
      <span
        class="overflow-hidden text-sm whitespace-nowrap transition-all duration-200 {expanded
          ? 'max-w-56 opacity-100'
          : 'max-w-0 opacity-0'} {activeIndex === i
          ? 'font-semibold text-primary'
          : 'text-base-content/55'}"
      >
        {section.title}
      </span>
      <span
        class="block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
          ? 'h-3 w-3 bg-primary ring-4 ring-primary/15'
          : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent'}"
      ></span>
    </button>
  {/each}
</nav>
