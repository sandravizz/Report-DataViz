<script>
  import { ITEM_H } from "$lib/scroll-animation";
  import ScrollColumn from "./ScrollColumn.svelte";
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
  let centerOffset = $derived(vh / 2 - ITEM_H / 2);
  let listY = $derived(centerOffset - progress * (pairs.length - 1) * ITEM_H);
</script>

<div bind:this={containerEl} style:height="{(pairs.length - 1) * 120 + 200}vh">
  <div class="sticky top-0 h-screen overflow-hidden bg-base-100">
    <ScrollColumn items={pairs.map((p) => p.number)} {activeIndex} y={listY} align="left" />
    <ChartDisplay {pairs} {activeIndex} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
  </div>
</div>
