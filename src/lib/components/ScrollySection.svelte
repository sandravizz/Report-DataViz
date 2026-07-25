<script>
  import ChartDisplay from "./ChartDisplay.svelte";

  // `title`/`paragraphs` are the chapter's own text, repeated here as a
  // static caption beside the chart — the chapter's text block above has
  // already scrolled out of view by the time this section's sticky region
  // takes over, so without this the chart would sit with nothing to read
  // next to it while it steps through. Unlike the old per-step description
  // it doesn't change with activeIndex; the chart itself carries the
  // step-to-step reveal.
  let { pairs, title, paragraphs = [] } = $props();

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

<div bind:this={containerEl} style:height="{(pairs.length - 1) * 80 + 140}vh">
  <div class="sticky top-0 h-screen overflow-hidden bg-base-100">
    <ChartDisplay {pairs} {activeIndex} {inView} />
    <div
      class="absolute top-24 left-[calc(43%+464px)] right-8 hidden flex-col gap-3 px-6 lg:flex"
    >
      <h3 class="font-sans text-lg font-medium text-base-content">{title}</h3>
      {#each paragraphs as paragraph (paragraph)}
        <p class="font-sans text-sm leading-relaxed text-base-content/80">
          {paragraph}
        </p>
      {/each}
    </div>
  </div>
</div>
