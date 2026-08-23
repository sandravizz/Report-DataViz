<script>
  import DescriptionColumn from "./DescriptionColumn.svelte";
  import ChartDisplay from "./ChartDisplay.svelte";

  // sectionId is the owning chapter's id, namespacing the per-chart scroll
  // anchors below so ChapterRail can link to an individual figure.
  let { pairs, sectionId = "" } = $props();

  // Pinned-scroll budget, in vh. The figure sticks for (height - 100vh), and
  // one step goes active every STEP_VH of that.
  //
  // HOLD_VH is extra scroll spent on the LAST step after it has gone active.
  // activeIndex rounds, so a step's boundary sits midway between anchors: an
  // interior step gets a full STEP_VH of dwell, but the first and last get
  // half of one. Half a step is not enough for the last step's draw-in — the
  // line, its end label, then a callout ~2.8s in — so the reader scrolls a
  // little to start it and is already leaving the figure. The hold gives the
  // final step slightly more dwell than an interior one. The first step needs
  // no such padding: it animates on entry, while the section is still
  // arriving. Single-figure sections have no mid-pin step at all and keep
  // their original height.
  const STEP_VH = 80;
  const BASE_VH = 140;
  const HOLD_VH = 60;
  let holdVh = $derived(pairs.length > 1 ? HOLD_VH : 0);
  let heightVh = $derived((pairs.length - 1) * STEP_VH + BASE_VH + holdVh);

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

  // Steps are spread over the pinned range MINUS the hold, so the hold is
  // scrolled through at a clamped progress of 1 — the last step holding, not
  // a slower run through all of them.
  let stepRange = $derived(containerHeight - vh - (holdVh / 100) * vh);
  let progress = $derived(
    stepRange > 0 ? Math.min(1, Math.max(0, (scrollY - containerTop) / stepRange)) : 0
  );

  let activeIndex = $derived(Math.round(progress * (pairs.length - 1)));
  // activeIndex is 0 even while the section is below the fold, so draw-in
  // animations gate on this instead (docs/scrolly-line-draw-in.md).
  let inView = $derived(
    scrollY + vh * 0.7 > containerTop && scrollY < containerTop + containerHeight
  );
</script>

<div
  bind:this={containerEl}
  class="relative"
  style:height="{heightVh}vh"
>
  <!-- One invisible scroll target per chart step, parked at the exact offset
       where that step goes active (progress × (containerHeight − vh) past the
       container top). A plain scrollIntoView({ block: "start" }) therefore
       lands the right chart, with no scroll maths duplicated in the caller.
       ChapterRail both links to these and reads their positions to tell which
       figure is on screen. -->
  {#each pairs as pair, i (pair.number ?? i)}
    <div
      id="{sectionId}-chart-{i}"
      data-chart-anchor
      data-chapter={sectionId}
      data-step={i}
      class="pointer-events-none absolute left-0 h-px w-px"
      style:top={pairs.length > 1
        ? `calc(${i / (pairs.length - 1)} * (100% - ${100 + holdVh}vh))`
        : "0px"}
    ></div>
  {/each}
  <!-- data-scrolly marks the white figure surface, which ChapterRail reads to
       tint its hover panel to whatever sits behind the rail. -->
  <div data-scrolly class="sticky top-0 h-screen overflow-hidden bg-white">
    <ChartDisplay {pairs} {activeIndex} {inView} />
    <DescriptionColumn items={pairs.map((p) => p.description)} {activeIndex} />
  </div>
</div>
