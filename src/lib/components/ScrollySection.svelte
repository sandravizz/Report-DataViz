<script>
  import DescriptionColumn from "./DescriptionColumn.svelte";
  import ChartDisplay from "./ChartDisplay.svelte";

  // sectionId namespaces the scroll anchors below so ChapterRail can link to
  // one figure. indexOffset is how many of the chapter's figures ran before
  // this instance: an Interlude splits a chapter into two ScrollySections but
  // ChapterRail still sees ONE list, so anchors must keep counting.
  let { pairs, sectionId = "", indexOffset = 0 } = $props();

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
  // activeIndex is 0 even while the section is below the fold, so draw-in
  // animations are gated on the section actually being on screen.
  let inView = $derived(
    scrollY + vh * 0.7 > containerTop && scrollY < containerTop + containerHeight
  );
</script>

<div bind:this={containerEl} class="relative" style:height="{(pairs.length - 1) * 80 + 140}vh">
  <!-- One invisible scroll target per step, parked at the exact offset where
       that step becomes active — so a plain scrollIntoView({ block: "start" })
       lands the right chart and no caller repeats the scroll maths. ChapterRail
       both links to these and reads them to tell which figure is showing.
       Keyed by index, not number: the animated steps share a figure number. -->
  {#each pairs as _, i (i)}
    <div
      id="{sectionId}-chart-{i + indexOffset}"
      data-chart-anchor
      data-chapter={sectionId}
      data-step={i + indexOffset}
      class="pointer-events-none absolute left-0 h-px w-px"
      style:top={pairs.length > 1
        ? `calc(${i / (pairs.length - 1)} * (100% - 100vh))`
        : "0px"}
    ></div>
  {/each}
  <!-- data-scrolly marks the figure surface, so ChapterRail knows what sits
       behind it. -->
  <div data-scrolly class="sticky top-0 h-screen overflow-hidden bg-white">
    <ChartDisplay {pairs} {activeIndex} {inView} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
  </div>
</div>
