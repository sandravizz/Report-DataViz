<script>
  // Chapter-nav pattern C from the rail comparison (dot rail): a compact
  // scroll-synced dot per chapter, current one filled, others outline.
  // Hovering (or focusing) the rail reveals the full chapter list with the
  // current one highlighted, rather than a per-dot tooltip.
  // Chosen for this report over the minimal-tick (A) and block-spine (B)
  // variants used on findevlab/template respectively.
  //
  // Uses IntersectionObserver directly on each chapter's section element
  // (rather than caching scroll positions up front, like ScrollySection
  // does for its continuous chart-step progress) so "current chapter" is
  // always read from actual viewport intersection, never a stale snapshot.
  let { sections = [] } = $props();

  let activeIndex = $state(0);

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
  class="group fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 rounded-box transition-[background-color,padding,box-shadow] duration-200 hover:bg-base-200/95 hover:px-5 hover:py-4 hover:shadow-lg focus-within:bg-base-200/95 focus-within:px-5 focus-within:py-4 focus-within:shadow-lg lg:flex"
  aria-label="Chapter navigation"
>
  {#each sections as section, i (section.id)}
    <button
      type="button"
      onclick={() => jumpTo(i)}
      aria-current={activeIndex === i ? "true" : undefined}
      class="flex items-center gap-3"
    >
      <span
        class="max-w-0 overflow-hidden text-sm whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-56 group-hover:opacity-100 group-focus-within:max-w-56 group-focus-within:opacity-100 {activeIndex ===
        i
          ? 'font-semibold text-primary'
          : 'text-base-content/55'}"
      >
        {section.title}
      </span>
      <span
        class="block shrink-0 rounded-full transition-all duration-200 {activeIndex === i
          ? 'h-3 w-3 bg-primary ring-4 ring-primary/15'
          : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent group-hover:border-base-content/60'}"
      ></span>
    </button>
  {/each}
</nav>
