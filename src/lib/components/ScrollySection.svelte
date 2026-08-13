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
        // Re-measure per frame instead of trusting the mount-time values: a
        // late font or image above this section moves containerTop without
        // firing resize, and the anchors below (positioned in CSS) would move
        // with it while a cached containerTop did not.
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
  // activeIndex is already 0 below the fold, so draw-in animations need a
  // separate "actually on screen" gate (docs/scrolly-line-draw-in.md).
  // Both bounds are the same test: the pinned panel is at least 30% on screen.
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
  <!-- One invisible scroll target per step, parked at the exact offset where
       that step is centred. So scrollIntoView({ block: "start" }) lands the
       right chart, and ChapterRail can read which figure is showing off these
       positions — no scroll maths duplicated in the caller. -->
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
  <!-- data-scrolly marks the figure surface; ChapterRail tints its hover panel
       to match whatever is behind it. -->
  <div data-scrolly class="sticky top-0 h-screen overflow-hidden bg-base-100">
    <ChartDisplay {pairs} {activeIndex} {inView} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
  </div>
</div>
