<script>
  import { pairs } from "./data/pairs";
  import { ITEM_H } from "./lib/scroll-animation";
  import ScrollColumn from "./components/ScrollColumn.svelte";
  import ChartDisplay from "./components/ChartDisplay.svelte";

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

<div bind:this={containerEl} class="bg-[#080808]" style:height="{pairs.length * 120 + 200}vh">
  <div class="fixed top-6 left-6 z-50 flex gap-4 font-mono text-[11px] tracking-[0.12em] text-white/30">
    <span>RCHARTS</span>
    <span>CHARTTYPES</span>
    <span>UI</span>
  </div>

  <div class="sticky top-0 h-screen overflow-hidden bg-[#080808]">
    <ScrollColumn items={pairs.map((p) => p.product)} {activeIndex} y={listY} align="left" />
    <ChartDisplay {pairs} {activeIndex} />
    <ScrollColumn items={pairs.map((p) => p.chartType)} {activeIndex} y={listY} align="right" />
    <div class="absolute inset-x-0 top-0 h-40 pointer-events-none z-10 bg-gradient-to-b from-[#080808] to-transparent"></div>
    <div class="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-10 bg-gradient-to-t from-[#080808] to-transparent"></div>
  </div>
</div>
