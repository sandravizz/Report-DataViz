<script>
  import { fade } from "svelte/transition";

  // CHAPTER RAIL (2026-09-29). The Index sheet in the header is the report's
  // outline (chapters and sub-chapters). This rail is its complement: it is
  // ALWAYS open on the CURRENT chapter — its title, every sub-chapter in it,
  // and every figure with its full title — so wherever the reader is, the
  // figures around them are one click away. Scroll into another chapter
  // (either direction) and the rail swaps to that chapter.
  //
  // Nothing is revealed on hover any more, so there is no expand/collapse
  // and none of the hover-shiver machinery the old dot rail needed.
  //
  // Desktop only (lg+): the LEFT side column of the symmetric layout —
  // same width (--side-w) and same gap from the centred figure as the
  // description column on the right. Geometry lives in styles/tailwind.css.
  // The rail is 2.5rem narrower than the description (--rail-w). It is
  // pinned to the WINDOW EDGE at left-6 — the header's px-6, so it lines up
  // under the FDL logo — not to the figure: it is surrounding information,
  // and should read as page furniture rather than sit beside the chart. On
  // wide screens that opens more white space between rail and figure than
  // --side-gap; at 1400 the figure still starts ~130px clear of it.
  //
  // NO RED: dots and labels are ink. The CURRENT place is marked DISCREETLY
  // — /85 ink against the rest at /55, and a figure's dot filled in a light
  // grey (/38) at the same size as the others. No bold, no black, no size
  // jump: a heavy marker pulled the eye off the figure and the description
  // (2026-09-29). /55 is the lowest step that clears 4.5:1 on white.
  // Hover ("Hairline", option B): text to /90, a 1px /45 underline on
  // chapter and sub-chapter titles only (a figure's dot already shows the
  // hover), and the figure dot shrinks to a /55 point in a faint /7 halo.
  //
  // `sections` is the chapter list from +page.svelte:
  // `{ id, title, subchapters: [{ id, title, charts }] }`.
  let { sections = [] } = $props();

  // Every sub-chapter, flattened, with the index of its chapter.
  const subs = $derived(
    sections.flatMap((section, i) => section.subchapters.map((sub) => ({ id: sub.id, chapter: i })))
  );

  let activeSubId = $state(null);
  const chapterIndex = $derived(subs.find((s) => s.id === activeSubId)?.chapter ?? 0);
  const chapter = $derived(sections[chapterIndex]);

  let showRail = $state(false);
  // Id of the pinned figure's anchor (`<sub-chapter id>-chart-<step>`), or
  // null between figures. Read off ScrollySection's anchors rather than
  // redoing its progress maths.
  let activeChart = $state(null);

  // Everything the rail shows is derived from one scroll tick of live
  // getBoundingClientRect() reads — nothing cached, so nothing goes stale.
  $effect(() => {
    const firstEl = document.getElementById(sections[0]?.id);
    const footerEl = document.querySelector("footer");
    // Each sub-chapter's whole text block (the heading's data-surface
    // ancestor), not the heading: the block's top is where the reader
    // leaves the previous figure run and enters this sub-chapter.
    const subBlocks = subs.map((s) => {
      const heading = document.getElementById(s.id);
      return { id: s.id, el: heading?.closest("[data-surface]") ?? heading };
    });
    if (!firstEl || !footerEl) return;

    function update() {
      const mid = window.innerHeight / 2;

      // Shown only while the reader is IN the report, and both edges are
      // live, so scrolling back brings it back.
      // In: once chapter 1's top has climbed to 40% of the screen height.
      // (Mid-screen read as too soon, a quarter as a little too late.)
      // Out: as soon as the footer's top edge enters the window, which is
      // the moment the last figure unpins and starts scrolling away. (It used
      // to wait for the footer to reach mid-screen, so the rail hung on over
      // the footer's white space.)
      const pastLanding = firstEl.getBoundingClientRect().top <= window.innerHeight * 0.4;
      const beforeFooter = footerEl.getBoundingClientRect().top >= window.innerHeight;
      showRail = pastLanding && beforeFooter;

      const overChart = Array.from(document.querySelectorAll("[data-scrolly]")).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= mid && rect.bottom >= mid;
      });

      // The anchor NEAREST the viewport top is the figure on screen: each
      // anchor sits where its step is exactly centred, and ScrollySection
      // switches charts by rounding progress — the same rule.
      let anchor = null;
      if (overChart) {
        let nearest = Infinity;
        for (const el of document.querySelectorAll("[data-chart-anchor]")) {
          const distance = Math.abs(el.getBoundingClientRect().top);
          if (distance < nearest) {
            nearest = distance;
            anchor = el;
          }
        }
      }
      activeChart = anchor ? anchor.id : null;

      // Current sub-chapter. While a figure is pinned it is the figure's
      // owner (its anchor id minus the step), whichever direction the reader
      // came from. Between figures, the last sub-chapter whose text block
      // has crossed the midline.
      if (anchor) {
        activeSubId = anchor.id.replace(/-chart-\d+$/, "");
      } else {
        let id = subBlocks[0]?.id ?? null;
        for (const b of subBlocks) {
          if (b.el && b.el.getBoundingClientRect().top <= mid) id = b.id;
        }
        activeSubId = id;
      }
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  });

  // Chapters, sub-chapter headings and figure anchors alike.
  function jumpToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Option B "Hairline" (picked 2026-09-29 from a four-way comparison): a
  // 1px mid-grey rule, not the 2px black one, which out-shouted the figure.
  const underline =
    "decoration-base-content/45 decoration-1 underline-offset-4 group-hover:underline";
</script>

<!-- `inert` takes the rail out of the tab order and the accessibility tree
     while it is hidden; opacity alone does neither. aria-hidden is kept
     alongside for engines that ignore inert. max-h + overflow: a long
     chapter scrolls inside the rail rather than running under the header. -->
<nav
  class="fixed top-1/2 left-6 z-40 hidden max-h-[calc(100vh-8rem)] w-(--rail-w) -translate-y-1/2 overflow-y-auto transition-opacity duration-200 lg:block {showRail
    ? 'opacity-100'
    : 'pointer-events-none opacity-0'}"
  aria-label="In this chapter"
  aria-hidden={!showRail}
  inert={!showRail}
>
  {#if chapter}
    <!-- Keyed on the chapter, so moving to another one fades the new
         contents in rather than swapping rows in place. -->
    {#key chapter.id}
      <div in:fade={{ duration: 200 }} class="py-2 font-sans text-base-content">
        <!-- Chapter: its Index number as a quiet eyebrow, then the title. -->
        <button
          type="button"
          onclick={() => jumpToId(chapter.id)}
          class="group block cursor-pointer text-left"
        >
          <span class="block text-xs text-base-content/55 tabular-nums">{chapterIndex + 1}.0</span>
          <span class="mt-1 block text-sm leading-snug font-medium text-base-content/85 {underline}">
            {chapter.title}
          </span>
        </button>

        <!-- Sub-chapters hang from a hairline, each with its figures under it. -->
        <ol class="mt-4 flex list-none flex-col gap-4 border-l border-base-content/15 pl-4">
          {#each chapter.subchapters as sub, k (sub.id)}
            {@const subOn = activeSubId === sub.id}
            <li>
              <button
                type="button"
                onclick={() => jumpToId(sub.id)}
                aria-current={subOn && !activeChart ? "true" : undefined}
                class="group flex cursor-pointer items-baseline gap-2 text-left text-sm leading-snug transition-colors duration-200 {subOn
                  ? 'text-base-content/85'
                  : 'text-base-content/55 hover:text-base-content/90'}"
              >
                <span class="shrink-0 tabular-nums">{chapterIndex + 1}.{k + 1}</span>
                <span class={underline}>{sub.title}</span>
              </button>

              {#if sub.charts.length}
                <!-- One dot per figure. Hovering a non-current figure marks
                     it without imitating the current state: the dot shrinks
                     to a pinpoint inside a widening halo. The shrink is a
                     scale transform, never smaller h/w, so the text beside it
                     does not slide; ring-[9px] at scale-60 paints ~5px. -->
                <ul class="mt-2.5 flex list-none flex-col gap-2.5">
                  {#each sub.charts as chart, j (chart.number ?? j)}
                    {@const chartId = `${sub.id}-chart-${j}`}
                    {@const on = activeChart === chartId}
                    <li>
                      <button
                        type="button"
                        onclick={() => jumpToId(chartId)}
                        aria-current={on ? "true" : undefined}
                        class="group flex cursor-pointer items-start gap-2.5 text-left"
                      >
                        <span class="flex h-5 w-3 shrink-0 items-center justify-center">
                          <span
                            class="block h-2 w-2 rounded-full border-[1.5px] transition-all duration-200 {on
                              ? 'border-base-content/38 bg-base-content/38'
                              : 'border-base-content/28 bg-transparent group-hover:scale-[0.6] group-hover:border-base-content/55 group-hover:bg-base-content/55 group-hover:ring-8 group-hover:ring-base-content/7'}"
                          ></span>
                        </span>
                        <span
                          class="text-sm leading-snug transition-colors duration-200 {on
                            ? 'text-base-content/85'
                            : 'text-base-content/55 group-hover:text-base-content/90'}"
                        >
                          <span class="mr-1 whitespace-nowrap">{chart.number}</span>
                          <!-- No underline: the dot's hover state already
                               says which figure is pointed at. -->
                          <span>{chart.title}</span>
                        </span>
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ol>
      </div>
    {/key}
  {/if}
</nav>
