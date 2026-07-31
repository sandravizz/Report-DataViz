<script>
  // Chapter-nav pattern A from the rail comparison (minimal rail): ticks sit
  // quietly against the margin until hovered, then unfold into the full
  // chapter list with the current one highlighted. Chosen for this report
  // over the dot rail (main) and block-spine rail (template).
  let { sections = [] } = $props();

  let activeIndex = $state(0);
  let sectionTops = $state([]);

  function measure() {
    sectionTops = sections.map((s) => {
      const el = document.getElementById(s.id);
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });
  }

  $effect(() => {
    measure();

    function update() {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < sectionTops.length; i++) {
        if (probe >= sectionTops[i]) idx = i;
      }
      activeIndex = idx;
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
    function onResize() {
      measure();
      update();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  });

  function jumpTo(index) {
    document
      .getElementById(sections[index].id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
</script>

<nav
  class="group fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 rounded-box px-2.5 py-3.5 transition-colors duration-200 hover:bg-base-200 focus-within:bg-base-200 lg:flex"
  aria-label="Chapter navigation"
>
  {#each sections as section, i (section.id)}
    <button
      type="button"
      onclick={() => jumpTo(i)}
      aria-current={activeIndex === i ? "true" : undefined}
      class="flex items-center gap-2.5 py-0.5"
    >
      <span
        class="block h-0.5 shrink-0 rounded-full transition-all duration-200 {activeIndex === i
          ? 'w-8 bg-secondary'
          : 'w-5 bg-base-content/30 group-hover:bg-base-content/45'}"
      ></span>
      <span
        class="max-w-0 overflow-hidden text-sm whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-56 group-hover:opacity-100 group-focus-within:max-w-56 group-focus-within:opacity-100 {activeIndex ===
        i
          ? 'font-semibold text-secondary'
          : 'text-base-content/60'}"
      >
        {section.title}
      </span>
    </button>
  {/each}
</nav>
