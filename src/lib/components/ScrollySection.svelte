<script>
  import DescriptionColumn from "./DescriptionColumn.svelte";
  import ChartDisplay from "./ChartDisplay.svelte";

  let { pairs } = $props();

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
  // activeIndex is 0 even while the section is still below the fold, so gate
  // draw-in animations on it actually being on screen (docs/scrolly-line-draw-in.md).
  let inView = $derived(
    scrollY + vh * 0.7 > containerTop && scrollY < containerTop + containerHeight
  );
  // Lets the mobile figure-tab strip jump directly to a figure by scrolling
  // the window to the scroll position that would naturally produce that
  // activeIndex — scroll position stays the single source of truth.
  function jumpTo(index) {
    const denom = pairs.length - 1;
    if (denom <= 0) return;
    const targetProgress = index / denom;
    const targetScrollY = containerTop + targetProgress * (containerHeight - vh);
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  }
</script>

<div bind:this={containerEl} style:height="{(pairs.length - 1) * 80 + 140}vh">
  <div class="sticky top-0 h-screen overflow-hidden bg-white">
    <ChartDisplay {pairs} {activeIndex} {inView} {jumpTo} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
  </div>
</div>
