<script>
  // Chapter-nav pattern B from the rail comparison (block rail): a colored
  // spine down the left edge, one segment per chapter, collapsed to a slim
  // strip by default and expandable into full titles via the toggle. Chosen
  // for this branch over the dot rail (main) and minimal-tick rail (findevlab).
  let { sections = [] } = $props();

  let activeIndex = $state(0);
  let expanded = $state(false);
  let sectionTops = $state([]);

  const bgClasses = ["bg-primary", "bg-secondary", "bg-neutral"];
  const contentClasses = ["text-primary-content", "text-secondary-content", "text-neutral-content"];

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
  class="fixed top-0 bottom-0 left-0 z-40 hidden flex-col transition-[width] duration-300 lg:flex {expanded
    ? 'w-64'
    : 'w-3.5'}"
  aria-label="Chapter navigation"
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
    class="absolute top-4 -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content shadow-sm"
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
