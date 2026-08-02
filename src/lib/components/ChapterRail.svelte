<script>
  // Chapter-nav pattern B (block rail): a colored spine down the left edge,
  // one segment per chapter, collapsed to a slim strip by default,
  // expandable into full titles via the toggle button. Standardized across
  // all three report branches (main, findevlab, template) on this pattern.
  // Desktop only (lg+) — hidden on tablets and phones.
  let { sections = [] } = $props();

  let activeIndex = $state(0);
  let expanded = $state(false);
  let showRail = $state(false);

  const bgClasses = ["bg-primary", "bg-secondary", "bg-neutral"];
  const contentClasses = ["text-primary-content", "text-secondary-content", "text-neutral-content"];

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
  class="fixed top-0 bottom-0 left-0 z-40 hidden flex-col transition-[width,opacity] duration-300 lg:flex {expanded
    ? 'w-64'
    : 'w-5'} {showRail ? 'opacity-100' : 'pointer-events-none opacity-0'}"
  aria-label="Chapter navigation"
  aria-hidden={!showRail}
>
  {#each sections as section, i (section.id)}
    <button
      type="button"
      onclick={() => jumpTo(i)}
      aria-current={activeIndex === i ? "true" : undefined}
      class="group relative flex flex-1 items-center overflow-hidden border-b border-base-100/20 pl-4 text-left transition-[filter] duration-150 hover:brightness-110 {bgClasses[
        i % bgClasses.length
      ]} {contentClasses[i % contentClasses.length]}"
    >
      {#if activeIndex === i}
        <span class="absolute inset-y-0 left-0 w-1 bg-base-100"></span>
      {/if}
      <span class="shrink-0 text-[0.65rem] font-bold tracking-wider uppercase">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span
        class="ml-3 max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap opacity-0 transition-all duration-300 {expanded
          ? 'max-w-48 opacity-100'
          : ''}"
      >
        {section.shortTitle}
      </span>
    </button>
  {/each}

  <button
    type="button"
    onclick={() => (expanded = !expanded)}
    aria-label={expanded ? "Collapse chapter rail" : "Expand chapter rail"}
    aria-expanded={expanded}
    class="absolute top-4 -right-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content shadow-sm"
  >
    <svg
      class="h-3 w-3 transition-transform duration-300 {expanded ? 'rotate-180' : ''}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  </button>
</nav>
