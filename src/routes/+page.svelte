<script>
  import { pairs } from "$lib/data/pairs";
  import { ITEM_H } from "$lib/scroll-animation";
  import ScrollColumn from "$lib/components/ScrollColumn.svelte";
  import DescriptionColumn from "$lib/components/DescriptionColumn.svelte";
  import ChartDisplay from "$lib/components/ChartDisplay.svelte";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";

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

<Header />

<div id="top" bind:this={containerEl}  style:height="{pairs.length * 120 + 200}vh">
  <div class="sticky top-0 h-screen overflow-hidden bg-[#F4DDD6]">
    <ScrollColumn items={pairs.map((p) => p.chartType)} {activeIndex} y={listY} align="left" />
    <ChartDisplay {pairs} {activeIndex} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
    <div class="absolute inset-x-0 top-0 h-40 pointer-events-none z-10 bg-linear-to-b from-[#F4DDD6] to-transparent"></div>
    <div class="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-10 bg-linear-to-t from-[#F4DDD6] to-transparent"></div>
  </div>
</div>

<Footer />
