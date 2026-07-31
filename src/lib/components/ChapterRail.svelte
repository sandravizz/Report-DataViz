<script>
  // Chapter-nav pattern C from the rail comparison (dot rail): a compact
  // scroll-synced dot per chapter, current one filled, others outline.
  // Chosen for this report over the minimal-tick (A) and block-spine (B)
  // variants used on findevlab/template respectively.
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
  class="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
  aria-label="Chapter navigation"
>
  {#each sections as section, i (section.id)}
    <div class="tooltip tooltip-left" data-tip={section.title}>
      <button
        type="button"
        onclick={() => jumpTo(i)}
        aria-current={activeIndex === i ? "true" : undefined}
        aria-label={section.title}
        class="block rounded-full transition-all duration-200 {activeIndex === i
          ? 'h-3 w-3 bg-primary ring-4 ring-primary/15'
          : 'h-2.5 w-2.5 border-[1.5px] border-base-content/35 bg-transparent hover:border-base-content/60'}"
      ></button>
    </div>
  {/each}
</nav>
