<script>
  import DescriptionColumn from "./DescriptionColumn.svelte";
  import ChartDisplay from "./ChartDisplay.svelte";

  // sectionId is the owning chapter's id: it namespaces the per-chart scroll
  // anchors below so ChapterRail can link to an individual figure.
  let { pairs, sectionId = "" } = $props();

  let containerEl;

  let scrollY = $state(0);
  let vh = $state(800);
  let containerTop = $state(0);
  let containerHeight = $state(0);

  function measure() {
    if (!containerEl) return;
    containerTop = containerEl.getBoundingClientRect().top + window.scrollY;
    containerHeight = containerEl.offsetHeight;
  }

  $effect(() => {
    vh = window.innerHeight;
    measure();
    scrollY = window.scrollY;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        scrollY = window.scrollY;
        ticking = false;
      });
    };
    const onResize = () => {
      vh = window.innerHeight;
      measure();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  });

  let progress = $derived(
    containerHeight > vh
      ? Math.min(1, Math.max(0, (scrollY - containerTop) / (containerHeight - vh)))
      : 0
  );

  let activeIndex = $derived(Math.round(progress * (pairs.length - 1)));
  // The first pair is "active" (activeIndex 0) even while the section is still
  // below the fold — gate draw-in animations on the section actually being on
  // screen so they don't play unseen before the user arrives.
  let inView = $derived(
    scrollY + vh * 0.7 > containerTop && scrollY < containerTop + containerHeight
  );
</script>

<div
  bind:this={containerEl}
  class="relative"
  style:height="{(pairs.length - 1) * 80 + 140}vh"
>
  <!-- One invisible scroll target per chart step. A step is active when the
       page has scrolled (progress × (containerHeight − vh)) past the container
       top, so an anchor parked at exactly that offset lands the right chart on
       screen with a plain scrollIntoView({ block: "start" }) — no scroll maths
       duplicated in the caller. ChapterRail links its hover panel to these and
       reads their positions to tell which figure is showing. -->
  {#each pairs as pair, i (pair.number ?? i)}
    <div
      id="{sectionId}-chart-{i}"
      data-chart-anchor
      data-chapter={sectionId}
      data-step={i}
      class="pointer-events-none absolute left-0 h-px w-px"
      style:top={pairs.length > 1
        ? `calc(${i / (pairs.length - 1)} * (100% - 100vh))`
        : "0px"}
    ></div>
  {/each}
  <!-- data-scrolly marks the figure surface: ChapterRail reads it to tint its
       hover panel to whatever is behind the rail (docs in ChapterRail.svelte). -->
  <div data-scrolly class="sticky top-0 h-screen overflow-hidden bg-base-100">
    <ChartDisplay {pairs} {activeIndex} {inView} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
  </div>
</div>
