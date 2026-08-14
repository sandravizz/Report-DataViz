<script>
  import DescriptionColumn from "./DescriptionColumn.svelte";
  import ChartDisplay from "./ChartDisplay.svelte";

  // sectionId namespaces the scroll anchors below, so ChapterRail can link to
  // one figure.
  let { pairs, sectionId = "" } = $props();

  let containerEl;

  let scrollY = $state(0);
  let vh = $state(800);
  let containerTop = $state(0);
  let containerHeight = $state(0);

  function measure() {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    containerTop = rect.top + window.scrollY;
    containerHeight = rect.height;
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
        // Re-measure per frame rather than trusting mount-time values: a late
        // font or image above moves containerTop without firing resize, and the
        // CSS-positioned anchors below would move with it while a cache did not.
        measure();
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
  // activeIndex is already 0 below the fold, so draw-in animations need their
  // own "on screen" gate: the pinned panel is ≥30% visible at either bound
  // (docs/scrolly-line-draw-in.md).
  let inView = $derived(
    scrollY + vh * 0.7 > containerTop &&
      scrollY < containerTop + containerHeight - vh * 0.7
  );
</script>

<div
  bind:this={containerEl}
  class="relative"
  style:height="{(pairs.length - 1) * 80 + 140}vh"
>
  <!-- One invisible scroll target per step, parked where that step is centred:
       scrollIntoView({ block: "start" }) lands the right chart, and ChapterRail
       reads which figure is showing off these positions rather than duplicating
       the scroll maths. -->
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
  <!-- data-scrolly marks the figure surface, so ChapterRail can tint its hover
       panel to match whatever is behind it. -->
  <div data-scrolly class="sticky top-0 h-screen overflow-hidden bg-base-100">
    <ChartDisplay {pairs} {activeIndex} {inView} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
  </div>
</div>
