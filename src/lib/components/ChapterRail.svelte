<script>
  // Chapter-nav pattern A from the rail comparison (minimal rail): ticks sit
  // quietly against the margin until revealed, then unfold into the full
  // chapter list with the current one highlighted. Chosen for this report
  // over the dot rail (main) and block-spine rail (template).
  // Visible at every size (phones included); reveal is driven by an
  // explicit `expanded` state rather than CSS :hover — desktop expands on
  // mouseenter, touch expands on first tap (second tap on a row jumps and
  // collapses; tapping outside collapses without jumping).
  //
  // Uses IntersectionObserver directly on each chapter's section element
  // (rather than caching scroll positions up front, like ScrollySection
  // does for its continuous chart-step progress) so "current chapter" is
  // always read from actual viewport intersection, never a stale snapshot.
  let { sections = [] } = $props();

  let activeIndex = $state(0);
  let expanded = $state(false);
  let railEl;

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

  // Closes the rail on a tap/click anywhere outside it, without navigating.
  $effect(() => {
    function handleDocClick(event) {
      if (expanded && railEl && !railEl.contains(event.target)) {
        expanded = false;
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  });

  function jumpTo(index) {
    document
      .getElementById(sections[index].id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // First tap reveals the full list (no jump yet, matching how hover reveals
  // it on desktop); a tap while already expanded jumps and collapses. On
  // desktop, mouseenter has already expanded it, so a click always jumps.
  function handleRowClick(index) {
    if (expanded) {
      jumpTo(index);
      expanded = false;
    } else {
      expanded = true;
    }
  }
</script>

<nav
  bind:this={railEl}
  class="fixed top-1/2 right-6 z-40 flex -translate-y-1/2 flex-col items-end gap-2.5 rounded-box px-2.5 py-3.5 transition-colors duration-200 {expanded
    ? 'bg-base-200'
    : ''}"
  onmouseenter={() => (expanded = true)}
  onmouseleave={() => (expanded = false)}
  aria-label="Chapter navigation"
>
  {#each sections as section, i (section.id)}
    <button
      type="button"
      onclick={() => handleRowClick(i)}
      aria-current={activeIndex === i ? "true" : undefined}
      aria-expanded={expanded}
      class="flex items-center gap-2.5 p-1.5 -m-1.5"
    >
      <span
        class="block h-0.5 shrink-0 rounded-full transition-all duration-200 {activeIndex === i
          ? 'w-8 bg-secondary'
          : 'w-5 bg-base-content/30'}"
      ></span>
      <span
        class="overflow-hidden text-sm whitespace-nowrap transition-all duration-200 {expanded
          ? 'max-w-56 opacity-100'
          : 'max-w-0 opacity-0'} {activeIndex === i
          ? 'font-semibold text-secondary'
          : 'text-base-content/60'}"
      >
        {section.title}
      </span>
    </button>
  {/each}
</nav>
